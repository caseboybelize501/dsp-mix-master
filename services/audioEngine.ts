import { EnvironmentPreset, MixingSettings, MasteringSettings } from '../types';
import { EQ_FREQS } from '../constants';

export class AudioEngine {
  private ctx: AudioContext;
  private source: AudioBufferSourceNode | null = null;
  private startTime: number = 0;
  private startOffset: number = 0;

  // Mixing Chain
  private eq: BiquadFilterNode[] = [];
  private comp: DynamicsCompressorNode;
  private compMakeUp: GainNode;
  private delay: DelayNode;
  private delayFeedback: GainNode;
  private delayMix: GainNode;
  private phaser: BiquadFilterNode;
  private driveNode: WaveShaperNode;
  private bitcrushNode: WaveShaperNode;
  private enhancerLow: GainNode;
  private enhancerMid: GainNode;
  private enhancerHigh: GainNode;
  private mixGain: GainNode;

  // Mastering Chain
  private glueComp: DynamicsCompressorNode;
  private tapeSaturator: WaveShaperNode;
  private airGlowNode: BiquadFilterNode;
  private clarityFilter: BiquadFilterNode;
  private stereoPanner: StereoPannerNode;
  private peakTamerComp: DynamicsCompressorNode;
  private masterLimiter: DynamicsCompressorNode;
  
  // Analysers
  private inputAnalyser: AnalyserNode;
  private outputAnalyser: AnalyserNode;
  private dryAnalyser: AnalyserNode;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Mixing Setup
    this.eq = EQ_FREQS.map(f => {
      const node = this.ctx.createBiquadFilter();
      node.frequency.value = f;
      node.type = 'peaking';
      return node;
    });
    this.comp = this.ctx.createDynamicsCompressor();
    this.compMakeUp = this.ctx.createGain();
    this.delay = this.ctx.createDelay(2.0);
    this.delayFeedback = this.ctx.createGain();
    this.delayMix = this.ctx.createGain();
    this.phaser = this.ctx.createBiquadFilter();
    this.phaser.type = 'allpass';
    this.driveNode = this.ctx.createWaveShaper();
    this.bitcrushNode = this.ctx.createWaveShaper();
    this.enhancerLow = this.ctx.createGain();
    this.enhancerMid = this.ctx.createGain();
    this.enhancerHigh = this.ctx.createGain();
    this.mixGain = this.ctx.createGain();

    // Mastering Setup
    this.glueComp = this.ctx.createDynamicsCompressor();
    this.tapeSaturator = this.ctx.createWaveShaper();
    this.airGlowNode = this.ctx.createBiquadFilter();
    this.airGlowNode.type = 'highshelf';
    this.airGlowNode.frequency.value = 16000;
    this.clarityFilter = this.ctx.createBiquadFilter();
    this.clarityFilter.type = 'peaking';
    this.clarityFilter.frequency.value = 3500;
    this.clarityFilter.Q.value = 0.5;
    this.stereoPanner = this.ctx.createStereoPanner();

    this.peakTamerComp = this.ctx.createDynamicsCompressor();
    this.peakTamerComp.ratio.value = 2.0;
    this.peakTamerComp.attack.value = 0.001;
    this.masterLimiter = this.ctx.createDynamicsCompressor();
    this.masterLimiter.ratio.value = 20;

    // Analysers
    this.inputAnalyser = this.ctx.createAnalyser();
    this.outputAnalyser = this.ctx.createAnalyser();
    this.dryAnalyser = this.ctx.createAnalyser();
    [this.inputAnalyser, this.outputAnalyser, this.dryAnalyser].forEach(a => a.fftSize = 1024);

    // Routing
    let node: AudioNode = this.inputAnalyser;
    this.eq.forEach(e => { node.connect(e); node = e; });
    node.connect(this.bitcrushNode); node = this.bitcrushNode;
    node.connect(this.driveNode); node = this.driveNode;
    node.connect(this.comp); node = this.comp;
    node.connect(this.compMakeUp); node = this.compMakeUp;

    const fxBus = this.ctx.createGain();
    node.connect(fxBus);
    
    const enhBus = this.ctx.createGain();
    node.connect(enhBus);
    enhBus.connect(this.enhancerLow);
    enhBus.connect(this.enhancerMid);
    enhBus.connect(this.enhancerHigh);
    this.enhancerLow.connect(fxBus);
    this.enhancerMid.connect(fxBus);
    this.enhancerHigh.connect(fxBus);

    node.connect(this.delay);
    this.delay.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delay);
    this.delay.connect(this.delayMix);
    this.delayMix.connect(fxBus);

    node = fxBus;
    node.connect(this.phaser); node = this.phaser;
    node.connect(this.mixGain); node = this.mixGain;
    
    node.connect(this.dryAnalyser);
    
    // Mastering Chain Routing
    node.connect(this.glueComp);
    this.glueComp.connect(this.tapeSaturator);
    this.tapeSaturator.connect(this.airGlowNode);
    this.airGlowNode.connect(this.clarityFilter);
    this.clarityFilter.connect(this.stereoPanner);
    this.stereoPanner.connect(this.peakTamerComp);
    this.peakTamerComp.connect(this.masterLimiter);
    this.masterLimiter.connect(this.outputAnalyser);
    this.outputAnalyser.connect(this.ctx.destination);
  }

  public async decodeAudio(data: ArrayBuffer): Promise<AudioBuffer> {
    return await this.ctx.decodeAudioData(data);
  }

  public update(mix: MixingSettings, master: MasteringSettings) {
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Mixing Update
    mix.eqBands.forEach((v, i) => {
      this.eq[i].gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
    });
    this.comp.threshold.setTargetAtTime(mix.compThreshold, this.ctx.currentTime, 0.05);
    this.comp.ratio.setTargetAtTime(mix.compRatio, this.ctx.currentTime, 0.05);
    this.compMakeUp.gain.setTargetAtTime(Math.pow(10, mix.compMakeUp / 20), this.ctx.currentTime, 0.05);
    this.delay.delayTime.setTargetAtTime(mix.delayTime, this.ctx.currentTime, 0.05);
    this.delayFeedback.gain.setTargetAtTime(mix.delayFeedback, this.ctx.currentTime, 0.05);
    this.delayMix.gain.setTargetAtTime(mix.delayMix, this.ctx.currentTime, 0.05);
    this.phaser.frequency.setTargetAtTime(400 + mix.phaserRate * 4000, this.ctx.currentTime, 0.05);

    this.enhancerLow.gain.setTargetAtTime(mix.enhanceLow, this.ctx.currentTime, 0.05);
    this.enhancerMid.gain.setTargetAtTime(mix.enhanceMid, this.ctx.currentTime, 0.05);
    this.enhancerHigh.gain.setTargetAtTime(mix.enhanceHigh, this.ctx.currentTime, 0.05);

    // Distortion Update
    const d = mix.drive * 10;
    const driveCurve = new Float32Array(44100);
    for (let i = 0; i < 44100; i++) {
        const x = (i * 2) / 44100 - 1;
        driveCurve[i] = Math.tanh(x * (1 + d));
    }
    this.driveNode.curve = driveCurve;

    // Mastering Updates
    this.glueComp.threshold.setTargetAtTime(master.glueThreshold, this.ctx.currentTime, 0.05);
    this.glueComp.ratio.setTargetAtTime(master.glueRatio, this.ctx.currentTime, 0.05);
    this.glueComp.attack.setTargetAtTime(master.glueAttack, this.ctx.currentTime, 0.05);
    this.glueComp.release.setTargetAtTime(master.glueRelease, this.ctx.currentTime, 0.05);

    // Tape Curve
    const tapeK = master.tapeDrive * 8;
    const tapeCurve = new Float32Array(44100);
    for (let i = 0; i < 44100; i++) {
      const x = (i * 2) / 44100 - 1;
      tapeCurve[i] = Math.sin(x * tapeK) / (tapeK || 1);
    }
    this.tapeSaturator.curve = tapeCurve;

    this.airGlowNode.gain.setTargetAtTime(master.airGlow * 12, this.ctx.currentTime, 0.05);
    this.clarityFilter.gain.setTargetAtTime(-master.spectralClarity * 6, this.ctx.currentTime, 0.05);
    this.stereoPanner.pan.setTargetAtTime(master.stereoRotation, this.ctx.currentTime, 0.05);
    this.peakTamerComp.threshold.setTargetAtTime(-master.peakTamer * 30, this.ctx.currentTime, 0.05);
    this.masterLimiter.threshold.setTargetAtTime(master.limiterCeiling, this.ctx.currentTime, 0.05);
  }

  public play(buffer: AudioBuffer, offset: number) {
    this.stop();
    this.source = this.ctx.createBufferSource();
    this.source.buffer = buffer;
    this.source.connect(this.inputAnalyser);
    this.source.start(0, offset);
    this.startTime = this.ctx.currentTime;
    this.startOffset = offset;
  }

  public stop() {
    if (this.source) {
      try { this.source.stop(); } catch(e) {}
      this.source = null;
    }
  }

  public getTime() {
    if (!this.source) return this.startOffset;
    return (this.ctx.currentTime - this.startTime + this.startOffset);
  }

  public getAnalysers() {
    return { 
      wet: this.outputAnalyser,
      dry: this.dryAnalyser
    };
  }

  public async exportWav(): Promise<Blob> {
    // Mock export functionality
    return new Promise(resolve => setTimeout(() => resolve(new Blob()), 1500));
  }
}

export const audioEngine = new AudioEngine();