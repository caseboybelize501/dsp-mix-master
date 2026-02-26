import React from 'react';
import { MixingSettings } from '../types';
import { Knob } from './MixingRack';
import { INITIAL_MIXING } from '../constants';

interface Props {
  settings: MixingSettings;
  onChange: (settings: MixingSettings) => void;
  deckLabel?: string;
}

const FXRack: React.FC<Props> = ({ settings, onChange }) => {
  const update = (key: keyof MixingSettings, val: any) => onChange({ ...settings, [key]: val });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-visible relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Advanced Dynamics Module */}
        <div className="bg-slate-900/40 p-8 rounded-[40px] border border-white/5 space-y-6">
          <SectionLabel title="Dynamics Processing" icon="fa-compress" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Knob label="Threshold" val={settings.compThreshold} min={-60} max={0} unit="dB" tip="Activation level for compression." onChange={v => update('compThreshold', v)} onReset={() => update('compThreshold', INITIAL_MIXING.compThreshold)} />
            <Knob label="Ratio" val={settings.compRatio} min={1} max={10} unit=":1" tip="Intensity of the compression slope." onChange={v => update('compRatio', v)} onReset={() => update('compRatio', INITIAL_MIXING.compRatio)} />
            <Knob label="Attack" val={settings.compAttack * 1000} min={1} max={100} unit="ms" tip="Response time to transients." onChange={v => update('compAttack', v/1000)} onReset={() => update('compAttack', INITIAL_MIXING.compAttack)} />
            <Knob label="MakeUp" val={settings.compMakeUp} min={0} max={20} unit="dB" tip="Gain compensation post-compression." onChange={v => update('compMakeUp', v)} onReset={() => update('compMakeUp', INITIAL_MIXING.compMakeUp)} />
          </div>
        </div>

        {/* Multiband Enhancer (Vitamin Style) */}
        <div className="bg-slate-900/40 p-8 rounded-[40px] border border-yellow-500/10 space-y-6 relative overflow-visible shadow-xl shadow-yellow-500/5">
          <SectionLabel title="Harmonic Enhancer" icon="fa-wand-sparkles" color="text-yellow-400" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Knob label="Low Vibe" val={settings.enhanceLow} min={0} max={1} step={0.01} color="accent-yellow-600" tip="Parallel enhancement for sub/bass. Adds weight and richness." onChange={v => update('enhanceLow', v)} />
            <Knob label="Mid Vibe" val={settings.enhanceMid} min={0} max={1} step={0.01} color="accent-yellow-400" tip="Presence and bite enhancement. Makes vocals and guitars pop." onChange={v => update('enhanceMid', v)} />
            <Knob label="High Vibe" val={settings.enhanceHigh} min={0} max={1} step={0.01} color="accent-yellow-200" tip="Air and shimmer enhancement for a professional top-end." onChange={v => update('enhanceHigh', v)} />
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <i className="fas fa-bolt text-yellow-500/50 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Spatial Depth Engine */}
        <div className="bg-slate-900/40 p-8 rounded-[40px] border border-white/5 space-y-6">
          <SectionLabel title="Spatial FX Engine" icon="fa-mountain" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Knob label="Delay Time" val={settings.delayTime} min={0.01} max={2.0} step={0.01} unit="s" tip="Timing for echoes." onChange={v => update('delayTime', v)} onReset={() => update('delayTime', INITIAL_MIXING.delayTime)} />
            <Knob label="Delay Mix" val={settings.delayMix} min={0} max={1} step={0.01} color="accent-blue-400" tip="Parallel delay blend." onChange={v => update('delayMix', v)} onReset={() => update('delayMix', INITIAL_MIXING.delayMix)} />
            <Knob label="Feedback" val={settings.delayFeedback} min={0} max={0.9} step={0.01} tip="Number of echo repetitions." onChange={v => update('delayFeedback', v)} />
            <Knob label="Width" val={1.0} min={0} max={2} step={0.1} color="accent-teal-400" tip="Stereo image width of the processing." onChange={() => {}} />
          </div>
        </div>

        {/* Transient Core (TransX Style) */}
        <div className="bg-slate-900/40 p-8 rounded-[40px] border border-orange-500/10 space-y-6 shadow-xl shadow-orange-500/5">
          <SectionLabel title="Transient Shaper" icon="fa-drum" color="text-orange-500" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Knob label="Punch" val={settings.punch} min={0} max={1} step={0.01} color="accent-orange-500" tip="Boosts attack transients. Essential for making drums cut through." onChange={v => update('punch', v)} />
            <Knob label="Sustain" val={settings.sustain} min={0} max={1} step={0.01} color="accent-orange-300" tip="Increases tail sustain. Adds body and room sound." onChange={v => update('sustain', v)} />
          </div>
        </div>

        {/* Modulation Module */}
        <div className="bg-slate-900/40 p-8 rounded-[40px] border border-white/5 space-y-6">
          <SectionLabel title="Modulation Engine" icon="fa-wave-square" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Knob label="Phaser Rate" val={settings.phaserRate} min={0} max={1} step={0.01} tip="Speed of the phase sweep." onChange={v => update('phaserRate', v)} onReset={() => update('phaserRate', INITIAL_MIXING.phaserRate)} />
            <Knob label="Phaser Depth" val={settings.phaserDepth} min={0} max={1} step={0.01} color="accent-teal-400" tip="Intensity of the phase effect." onChange={v => update('phaserDepth', v)} onReset={() => update('phaserDepth', INITIAL_MIXING.phaserDepth)} />
          </div>
        </div>

        {/* Harmonic Distortion Module */}
        <div className="bg-slate-900/40 p-8 rounded-[40px] border border-white/5 space-y-6">
          <SectionLabel title="Harmonic Destruction" icon="fa-fire" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Knob label="Bitcrush" val={settings.bitcrush} min={0} max={1} step={0.01} color="accent-orange-500" tip="Reduces sample bit depth for digital grit." onChange={v => update('bitcrush', v)} onReset={() => update('bitcrush', INITIAL_MIXING.bitcrush)} />
            <Knob label="Drive" val={settings.drive} min={0} max={1} step={0.01} color="accent-red-500" tip="Tube-style harmonic saturation." onChange={v => update('drive', v)} onReset={() => update('drive', INITIAL_MIXING.drive)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ title, icon, color = "text-slate-400" }: any) => (
  <div className="flex items-center gap-2 border-b border-white/5 pb-4">
    <i className={`fas ${icon} ${color} text-[10px]`}></i>
    <h3 className={`text-[10px] font-black tracking-[0.2em] ${color} uppercase`}>{title}</h3>
  </div>
);

export default FXRack;