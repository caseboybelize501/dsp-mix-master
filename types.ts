export interface EnvironmentPreset {
  id: string;
  name: string;
  icon: string;
  roomSize: number;
  damping: number;
  wetLevel: number;
  hpFreq: number;
  lpFreq: number;
  description: string;
}

export interface VocalAlignSettings {
  alignIntensity: number;
  rhythmTightness: number;
  swingAmount: number;
  isProcessing: boolean;
}

export interface AutoTuneSettings {
  retuneSpeed: number;
  humanize: number;
  rootKey: string;
  scale: string;
  vibratoAmount: number;
  formantShift: number;
}

export interface MixingSettings {
  eqBands: number[];
  compThreshold: number;
  compRatio: number;
  compAttack: number;
  compRelease: number;
  compKnee: number;
  compMakeUp: number;
  delayTime: number;
  delayFeedback: number;
  delayMix: number;
  reverbSize: number;
  reverbDecay: number;
  reverbMix: number;
  phaserRate: number;
  phaserDepth: number;
  chorusMix: number;
  bitcrush: number;
  drive: number;
  enhanceLow: number;
  enhanceMid: number;
  enhanceHigh: number;
  punch: number;
  sustain: number;
  resonanceDuck: number; 
  duckFrequency: number;
  duckQ: number;
}

export interface MasteringSettings {
  inputGain: number;
  eqLow: number;
  eqMid: number;
  eqHigh: number;
  excitation: number;
  softClip: number;
  tubeWarmth: number;
  airGlow: number;
  peakTamer: number;
  spectralClarity: number;
  stereoHighWidth: number;
  maximizerDrive: number;
  glueThreshold: number;
  glueRatio: number;
  glueAttack: number;
  glueRelease: number;
  tapeDrive: number;
  tapeFlux: number;
  tapeHiss: number;
  mbPriorityLow: number;
  mbPriorityMid: number;
  mbPriorityHigh: number;
  stereoRotation: number;
  stereoAsymmetry: number;
  mbLowThresh: number;
  mbMidThresh: number;
  mbHighThresh: number;
  mbRatio: number;
  sideDrive: number;
  transientImpact: number;
  clarityTame: number;
  stereoWidth: number;
  stereoPan: number;
  bassFocus: number;
  limiterCeiling: number;
  limiterLookahead: number;
}

export interface AudioState {
  isPlaying: boolean;
  buffer: AudioBuffer | null;
  currentTime: number;
  duration: number;
  fileName: string | null;
  videoUrl: string | null;
  mixing: MixingSettings;
  mastering: MasteringSettings;
  vocalAlign: VocalAlignSettings;
  autoTune: AutoTuneSettings;
  isBypassed: boolean;
  currentPresetId: string;
  masterGain: number;
  activeTab: 'mix' | 'fx' | 'master' | 'env' | 'vocal' | 'tune';
  isExporting: boolean;
}