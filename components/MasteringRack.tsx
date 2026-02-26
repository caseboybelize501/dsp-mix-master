import React from 'react';
import { MasteringSettings } from '../types';
import { INITIAL_MASTERING } from '../constants';
import { Knob } from './MixingRack';

interface Props {
  settings: MasteringSettings;
  onChange: (settings: MasteringSettings) => void;
  onExport: () => void;
  isExporting: boolean;
  hasAudio: boolean;
}

const MasteringRack: React.FC<Props> = ({ settings, onChange, onExport, isExporting, hasAudio }) => {
  const handleUpdate = (key: keyof MasteringSettings, value: number) => onChange({ ...settings, [key]: value });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-visible relative pb-10">
      
      {/* Top Row: Elite Tone & Clarity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Magic 3: Elite Post-Processor */}
        <div className="bg-slate-900/60 p-6 rounded-[35px] border border-green-500/20 shadow-2xl shadow-green-500/5 space-y-6 relative overflow-visible">
          <SectionHeader icon="fa-wand-magic-sparkles" title="The Magic 3" color="text-green-400" />
          <div className="space-y-5">
            <Knob label="Tube Warmth" val={settings.tubeWarmth} min={0} max={1} step={0.01} color="accent-orange-500" tip="Analog tube saturation model." onChange={(v:any) => handleUpdate('tubeWarmth', v)} onReset={() => handleUpdate('tubeWarmth', 0)} />
            <Knob label="Air Glow" val={settings.airGlow} min={0} max={1} step={0.01} color="accent-blue-400" tip="Elite 16kHz+ Excitation." onChange={(v:any) => handleUpdate('airGlow', v)} onReset={() => handleUpdate('airGlow', 0)} />
            <Knob label="Peak Tamer" val={settings.peakTamer} min={0} max={1} step={0.01} color="accent-red-500" tip="Transient-aware limiting." onChange={(v:any) => handleUpdate('peakTamer', v)} onReset={() => handleUpdate('peakTamer', 0)} />
          </div>
        </div>

        {/* Surgical Elite */}
        <div className="bg-slate-950/60 p-6 rounded-[35px] border border-sky-500/20 shadow-xl space-y-6 relative overflow-visible">
          <SectionHeader icon="fa-crown" title="Surgical Elite" color="text-sky-400" />
          <div className="space-y-5">
            <Knob label="Spectral Clty" val={settings.spectralClarity} min={0} max={1} step={0.01} color="accent-sky-400" tip="Gullfoss-style resonance tamer." onChange={(v:any) => handleUpdate('spectralClarity', v)} onReset={() => handleUpdate('spectralClarity', 0)} />
            <Knob label="High Width" val={settings.stereoHighWidth} min={0.5} max={2.0} step={0.01} color="accent-indigo-400" tip="Multiband imaging width." onChange={(v:any) => handleUpdate('stereoHighWidth', v)} onReset={() => handleUpdate('stereoHighWidth', 1)} />
            <Knob label="Push" val={settings.maximizerDrive} min={0} max={12} unit="dB" color="accent-pink-500" tip="Push into the final limiter." onChange={(v:any) => handleUpdate('maximizerDrive', v)} onReset={() => handleUpdate('maximizerDrive', 0)} />
          </div>
        </div>

        {/* NEW: SSL-Style Glue Bus */}
        <div className="bg-slate-900/40 p-6 rounded-[35px] border border-white/5 space-y-6 overflow-visible shadow-lg">
          <SectionHeader icon="fa-layer-group" title="Analog Glue Bus" />
          <div className="space-y-4">
            <Knob label="Threshold" val={settings.glueThreshold} min={-40} max={0} unit="dB" tip="Classic SSL master bus compression activation." onChange={(v:any) => handleUpdate('glueThreshold', v)} onReset={() => handleUpdate('glueThreshold', 0)} />
            <Knob label="Ratio" val={settings.glueRatio} min={1.5} max={10} unit=":1" tip="Glue density ratio." onChange={(v:any) => handleUpdate('glueRatio', v)} onReset={() => handleUpdate('glueRatio', 2)} />
            <Knob label="Auto Release" val={settings.glueRelease} min={0.1} max={1.2} step={0.1} tip="Program-dependent recovery." onChange={(v:any) => handleUpdate('glueRelease', v)} />
          </div>
        </div>

        {/* NEW: Tape Machine Engine */}
        <div className="bg-slate-900/40 p-6 rounded-[35px] border border-amber-500/10 space-y-6 overflow-visible shadow-lg">
          <SectionHeader icon="fa-compact-disc" title="Tape Saturator" color="text-amber-400" />
          <div className="space-y-4">
            <Knob label="Tape Drive" val={settings.tapeDrive} min={0} max={1} step={0.01} color="accent-amber-600" tip="Kramer-style tape saturation drive." onChange={(v:any) => handleUpdate('tapeDrive', v)} onReset={() => handleUpdate('tapeDrive', 0)} />
            <Knob label="Flux Density" val={settings.tapeFlux} min={0} max={1} step={0.01} color="accent-amber-400" tip="Harmonic spectrum bias." onChange={(v:any) => handleUpdate('tapeFlux', v)} onReset={() => handleUpdate('tapeFlux', 0.5)} />
            <Knob label="Tape Hiss" val={settings.tapeHiss} min={0} max={1} step={0.01} color="accent-amber-200" tip="Vintage noise floor emulation." onChange={(v:any) => handleUpdate('tapeHiss', v)} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Multiband & Final Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        
        {/* NEW: L3-Style Multiband Priority */}
        <div className="bg-slate-900/40 p-6 rounded-[35px] border border-white/5 space-y-6 overflow-visible">
          <SectionHeader icon="fa-sliders" title="Multiband Priority" />
          <div className="grid grid-cols-3 gap-4">
            <Knob label="Low" val={settings.mbPriorityLow} min={0} max={2} step={0.1} tip="L3-style low priority limiting." onChange={(v:any) => handleUpdate('mbPriorityLow', v)} />
            <Knob label="Mid" val={settings.mbPriorityMid} min={0} max={2} step={0.1} tip="L3-style mid priority limiting." onChange={(v:any) => handleUpdate('mbPriorityMid', v)} />
            <Knob label="High" val={settings.mbPriorityHigh} min={0} max={2} step={0.1} tip="L3-style high priority limiting." onChange={(v:any) => handleUpdate('mbPriorityHigh', v)} />
          </div>
        </div>

        {/* NEW: Precision Imaging */}
        <div className="bg-slate-900/40 p-6 rounded-[35px] border border-purple-500/10 space-y-6 overflow-visible">
          <SectionHeader icon="fa-arrows-left-right" title="Precision Imager" color="text-purple-400" />
          <div className="grid grid-cols-2 gap-6">
            <Knob label="Rotation" val={settings.stereoRotation} min={-1} max={1} step={0.01} tip="S1-style stereo rotation." onChange={(v:any) => handleUpdate('stereoRotation', v)} onReset={() => handleUpdate('stereoRotation', 0)} />
            <Knob label="Asymmetry" val={settings.stereoAsymmetry} min={-1} max={1} step={0.01} tip="S1-style stereo asymmetry." onChange={(v:any) => handleUpdate('stereoAsymmetry', v)} onReset={() => handleUpdate('stereoAsymmetry', 0)} />
          </div>
        </div>

        {/* Final Stage & Export */}
        <div className="bg-slate-900/40 p-6 rounded-[35px] border border-white/5 space-y-6 overflow-visible">
          <SectionHeader icon="fa-check-double" title="Final Limiter Stage" />
          <div className="grid grid-cols-2 gap-6">
            <Knob label="Ceiling" val={settings.limiterCeiling} min={-6} max={0} unit="dB" tip="Final true-peak output limit." onChange={(v:any) => handleUpdate('limiterCeiling', v)} />
            <div className="flex flex-col justify-end">
              <button 
                disabled={!hasAudio || isExporting}
                onClick={onExport}
                className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-500 transition-all shadow-xl active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
              >
                {isExporting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-export"></i>}
                {isExporting ? 'PROCESSING...' : 'EXPORT HQ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title, color = "text-slate-400" }: any) => (
  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
    <i className={`fas ${icon} ${color} text-[9px]`}></i>
    <h4 className={`text-[9px] font-black ${color} uppercase tracking-widest leading-none`}>{title}</h4>
  </div>
);

export default MasteringRack;