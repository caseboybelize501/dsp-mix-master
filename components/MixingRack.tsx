import React from 'react';
import { MixingSettings } from '../types';
import { EQ_FREQS, EQ_LABELS } from '../constants';

interface Props {
  settings: MixingSettings;
  onChange: (settings: MixingSettings) => void;
  deckLabel?: string;
}

const MixingRack: React.FC<Props> = ({ settings, onChange }) => {
  const update = (key: keyof MixingSettings, val: any) => onChange({ ...settings, [key]: val });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-visible relative">
      <div className="bg-slate-900/40 p-8 rounded-[40px] border border-white/5 space-y-6 relative overflow-visible z-10 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Step 1: Surgical EQ Core</h3>
            <p className="text-[7px] text-slate-600 uppercase font-bold tracking-tight">Clean up harsh resonances before processing</p>
          </div>
          <button 
            onClick={() => update('eqBands', new Array(18).fill(0))} 
            className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase transition-all border border-white/10 active:scale-95"
          >
            Flatten All Bands
          </button>
        </div>
        
        <div className="flex flex-nowrap justify-center gap-2 h-[400px] overflow-x-auto no-scrollbar pt-20 pb-6 relative overflow-y-visible w-full items-end">
          {EQ_FREQS.map((f, i) => (
            <EqFader 
              key={`${f}-${i}`} label={EQ_LABELS[i]} 
              freq={f >= 1000 ? `${(f/1000).toFixed(1)}k` : `${f}`} 
              val={settings.eqBands[i]} 
              onChange={v => { const b = [...settings.eqBands]; b[i] = v; update('eqBands', b); }}
              onReset={() => { const b = [...settings.eqBands]; b[i] = 0; update('eqBands', b); }}
              tip={`Surgical gain adjustment for ${EQ_LABELS[i]} (${f}Hz).`}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Knob = ({ label, val, min, max, unit = '', color = "accent-green-500", step = 0.1, onChange, tip, onReset }: any) => (
  <div className="space-y-1 relative group isolate">
    <div className="absolute bottom-[140%] left-1/2 -translate-x-1/2 w-48 bg-slate-950 text-white p-4 rounded-2xl text-[8px] opacity-0 group-hover:opacity-100 transition-all z-[9999] pointer-events-none shadow-[0_30px_70px_rgba(0,0,0,1)] border border-white/10 backdrop-blur-3xl scale-90 group-hover:scale-100 origin-bottom">
      <div className="text-green-400 font-black mb-1.5 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-1">
         <i className="fas fa-microchip text-[9px]"></i> DSP GUIDE
      </div>
      <p className="font-bold text-slate-200 leading-relaxed">{tip}</p>
      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-white/10 rotate-45"></div>
    </div>

    <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest">
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {onReset && (
          <button onClick={(e) => { e.stopPropagation(); onReset(); }} className="opacity-0 group-hover:opacity-100 text-green-500/50 hover:text-green-500 transition-all">
            <i className="fas fa-undo-alt text-[6px]"></i>
          </button>
        )}
      </div>
      <span className="text-white font-mono">{val.toFixed(val < 10 && val > -10 ? (step < 1 ? 1 : 0) : 0)}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={val} 
      onChange={e => onChange(parseFloat(e.target.value))}
      className={`w-full h-1 bg-black/60 rounded-full appearance-none cursor-pointer ${color} active:scale-95 transition-all relative z-20`}
    />
  </div>
);

const EqFader = ({ label, freq, val, onChange, onReset, tip, index }: any) => (
  <div className="flex flex-col items-center gap-4 group min-w-[45px] h-[240px] relative z-20 overflow-visible isolate">
    <div className={`absolute bottom-[110%] ${index < 4 ? 'left-0' : (index > 13 ? 'right-0' : 'left-1/2 -translate-x-1/2')} w-60 bg-[#080808] text-white p-4 rounded-[20px] text-[9px] opacity-0 group-hover:opacity-100 transition-all z-[9999] pointer-events-none shadow-[0_30px_80px_rgba(0,0,0,1)] border-2 border-green-500/40 backdrop-blur-3xl scale-90 group-hover:scale-100 transform origin-bottom`}>
      <div className="text-green-400 font-black mb-2 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-1.5">
         <i className="fas fa-microchip text-[10px]"></i> PRO DSP TIP
      </div>
      <p className="text-slate-100 font-bold leading-relaxed">{tip}</p>
    </div>

    <div className="flex-1 w-10 bg-black/95 rounded-xl relative overflow-visible flex flex-col items-center py-2 border border-white/5 group-hover:border-green-400/40 transition-all shadow-inner">
      <button 
        onClick={(e) => { e.stopPropagation(); onReset(); }} 
        className="absolute -top-7 text-[7px] opacity-0 group-hover:opacity-50 hover:opacity-100 transition-all text-slate-400 uppercase font-black"
      >
        Reset
      </button>
      <input 
        type="range" min="-12" max="12" step="0.1" value={val} 
        onChange={e => onChange(parseFloat(e.target.value))} 
        className="absolute inset-0 opacity-0 cursor-ns-resize w-full h-full z-30" 
        style={{ appearance: 'slider-vertical' as any, WebkitAppearance: 'slider-vertical' as any }} 
      />
      <div className="absolute w-8 h-3 bg-white rounded-full z-20 shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-black/20" style={{ bottom: `${(val + 12) / 24 * 100}%`, transform: 'translateY(50%)' }}></div>
      <div className="h-full w-px bg-white/5 absolute left-1/2 -translate-x-1/2"></div>
    </div>
    <div className="text-center">
      <p className="text-[9px] text-white font-black">{val > 0 ? '+' : ''}{val.toFixed(1)}</p>
      <p className="text-[6px] text-slate-500 uppercase font-black tracking-tighter whitespace-nowrap">{freq}Hz</p>
    </div>
  </div>
);

export default MixingRack;