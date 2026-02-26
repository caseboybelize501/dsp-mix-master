import React from 'react';
import { AutoTuneSettings } from '../types';
import { Knob } from './MixingRack';

interface Props {
  settings: AutoTuneSettings;
  onChange: (settings: AutoTuneSettings) => void;
}

const AutoTuneRack: React.FC<Props> = ({ settings, onChange }) => {
  const update = (key: keyof AutoTuneSettings, val: any) => onChange({ ...settings, [key]: val });

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const scales = ['Major', 'Minor', 'Chromatic', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian'];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-visible relative">
      <div className="bg-slate-900/40 p-8 rounded-[40px] border border-green-500/20 space-y-8 relative overflow-visible z-10 shadow-2xl">
        
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h3 className="text-[10px] font-black tracking-[0.2em] text-green-400 uppercase">Antares-Style Tuning Core</h3>
            <p className="text-[7px] text-slate-600 uppercase font-bold tracking-tight">Professional real-time pitch correction engine</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-black/40 rounded-xl border border-white/5 p-1">
                <select 
                  value={settings.rootKey} 
                  onChange={(e) => update('rootKey', e.target.value)}
                  className="bg-transparent text-[9px] font-black text-white px-3 py-1 outline-none appearance-none cursor-pointer"
                >
                  {keys.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="w-px bg-white/5 mx-1"></div>
                <select 
                  value={settings.scale} 
                  onChange={(e) => update('scale', e.target.value)}
                  className="bg-transparent text-[9px] font-black text-white px-3 py-1 outline-none appearance-none cursor-pointer"
                >
                  {scales.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-black/20 p-6 rounded-[35px] border border-white/5 space-y-6">
             <Knob label="Retune Speed" val={settings.retuneSpeed} min={0} max={200} unit="ms" tip="How fast the engine snaps to target pitch. 0ms = Robot Effect." onChange={(v:any) => update('retuneSpeed', v)} />
             <div className="text-[6px] text-slate-500 uppercase font-black text-center tracking-widest">Correction Attack</div>
          </div>

          <div className="bg-black/20 p-6 rounded-[35px] border border-white/5 space-y-6">
             <Knob label="Humanize" val={settings.humanize} min={0} max={1} step={0.01} color="accent-green-400" tip="Allows natural vibrato and small pitch variances to remain." onChange={(v:any) => update('humanize', v)} />
             <div className="text-[6px] text-slate-500 uppercase font-black text-center tracking-widest">Natural Decay</div>
          </div>

          <div className="bg-black/20 p-6 rounded-[35px] border border-white/5 space-y-6">
             <Knob label="Formant Shift" val={settings.formantShift} min={-12} max={12} unit="st" color="accent-blue-500" tip="Adjusts the throat geometry perception without affecting pitch." onChange={(v:any) => update('formantShift', v)} />
             <div className="text-[6px] text-slate-500 uppercase font-black text-center tracking-widest">Gender / Character</div>
          </div>

          <div className="bg-black/20 p-6 rounded-[35px] border border-white/5 space-y-6">
             <Knob label="Vibrato" val={settings.vibratoAmount} min={0} max={1} step={0.01} color="accent-pink-500" tip="Adds an LFO-based pitch modulation for expressive delivery." onChange={(v:any) => update('vibratoAmount', v)} />
             <div className="text-[6px] text-slate-500 uppercase font-black text-center tracking-widest">Synthetic Modulation</div>
          </div>
        </div>

        <div className="flex gap-2 justify-center h-12">
          {keys.map((k, i) => (
            <div key={k} className={`flex-1 rounded-lg border transition-all ${settings.rootKey === k ? 'bg-green-500 border-green-400' : 'bg-black/40 border-white/5'} flex items-end justify-center pb-2`}>
               <span className={`text-[8px] font-black ${settings.rootKey === k ? 'text-black' : 'text-slate-700'}`}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoTuneRack;