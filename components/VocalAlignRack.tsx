import React, { useState } from 'react';
import { VocalAlignSettings } from '../types';
import { Knob } from './MixingRack';

interface Props {
  settings: VocalAlignSettings;
  onChange: (settings: VocalAlignSettings) => void;
}

const VocalAlignRack: React.FC<Props> = ({ settings, onChange }) => {
  const [isAligning, setIsAligning] = useState(false);
  const update = (key: keyof VocalAlignSettings, val: any) => onChange({ ...settings, [key]: val });

  const handleAlign = () => {
    setIsAligning(true);
    // Simulate AI Processing
    setTimeout(() => {
      setIsAligning(false);
      alert("AI Alignment Complete: Vocals snapped to grid.");
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-visible relative">
      <div className="bg-slate-900/40 p-8 rounded-[40px] border border-indigo-500/20 space-y-8 relative overflow-visible z-10 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h3 className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">AI Vocal Aligner Core</h3>
            <p className="text-[7px] text-slate-600 uppercase font-bold tracking-tight">Reposition out-of-tempo rap & vocal deliveries</p>
          </div>
          <div className="flex gap-4">
             <button className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 hover:bg-indigo-500/20 transition-all border border-indigo-500/20">
               <i className="fas fa-microphone"></i>
             </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-6">
            <Knob label="Alignment Intensity" val={settings.alignIntensity} min={0} max={1} step={0.01} color="accent-indigo-500" tip="Strength of the temporal correction. 100% is hard-quantized." onChange={(v:any) => update('alignIntensity', v)} />
            <Knob label="Rhythm Tightness" val={settings.rhythmTightness} min={0} max={1} step={0.01} color="accent-indigo-400" tip="Sharpness of the transient snapping." onChange={(v:any) => update('rhythmTightness', v)} />
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-[35px] border border-white/5 relative overflow-hidden group">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${isAligning ? 'bg-indigo-500 scale-110 shadow-[0_0_50px_rgba(99,102,241,0.5)]' : 'bg-white/5 group-hover:bg-indigo-500/20'}`}>
              <i className={`fas ${isAligning ? 'fa-dna fa-spin' : 'fa-bolt'} text-2xl ${isAligning ? 'text-white' : 'text-indigo-500'}`}></i>
            </div>
            <button 
              disabled={isAligning}
              onClick={handleAlign}
              className="mt-6 px-10 py-3 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isAligning ? 'ANALYZING...' : 'APPLY AI ALIGN'}
            </button>
            <div className="mt-4 text-[7px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
              GEMINI-CORE TEMPORAL ANALYSIS ACTIVE
            </div>
          </div>

          <div className="space-y-6">
            <Knob label="Swing Amount" val={settings.swingAmount} min={0} max={1} step={0.01} color="accent-indigo-300" tip="Add a natural groove back to perfectly aligned vocals." onChange={(v:any) => update('swingAmount', v)} />
            <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
               <p className="text-[7px] text-indigo-400 font-black uppercase tracking-widest mb-2">DSP Status</p>
               <div className="flex gap-1">
                 {[1,2,3,4,5,6].map(i => <div key={i} className={`h-4 w-1 rounded-full ${isAligning ? 'bg-indigo-500 animate-bounce' : 'bg-indigo-900'}`} style={{animationDelay: `${i*100}ms`}}></div>)}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocalAlignRack;