import React from 'react';
import { PRESETS } from '../constants';
import { EnvironmentPreset } from '../types';

interface Props {
  currentPresetId: string;
  onSelect: (preset: EnvironmentPreset) => void;
}

const EnvironmentRack: React.FC<Props> = ({ currentPresetId, onSelect }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-visible">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`group relative p-8 rounded-[40px] border transition-all duration-500 text-left overflow-hidden ${
              currentPresetId === preset.id
                ? 'bg-green-500 border-green-400 shadow-[0_20px_50px_rgba(34,197,94,0.3)] scale-[1.02]'
                : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60'
            }`}
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 ${
                  currentPresetId === preset.id ? 'bg-black text-green-500' : 'bg-white/5 text-slate-400 group-hover:scale-110'
                }`}>
                  <i className={`fas ${preset.icon}`}></i>
                </div>
                {currentPresetId === preset.id && (
                  <div className="px-3 py-1 bg-black rounded-full text-[7px] font-black text-green-500 uppercase tracking-widest animate-pulse">
                    Active Environment
                  </div>
                )}
              </div>
              
              <div>
                <h3 className={`text-sm font-black uppercase tracking-tighter mb-1 transition-colors ${
                  currentPresetId === preset.id ? 'text-black' : 'text-white'
                }`}>
                  {preset.name}
                </h3>
                <p className={`text-[9px] font-bold leading-relaxed transition-colors ${
                  currentPresetId === preset.id ? 'text-black/70' : 'text-slate-500'
                }`}>
                  {preset.description}
                </p>
              </div>

              <div className={`mt-6 pt-4 border-t transition-colors ${
                currentPresetId === preset.id ? 'border-black/10' : 'border-white/5'
              }`}>
                <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest">
                  <span className={currentPresetId === preset.id ? 'text-black/50' : 'text-slate-600'}>Complexity</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-3 rounded-full ${
                          i <= (preset.roomSize * 5 + 1) 
                            ? (currentPresetId === preset.id ? 'bg-black' : 'bg-green-500') 
                            : (currentPresetId === preset.id ? 'bg-black/10' : 'bg-white/5')
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorative Element */}
            <div className={`absolute -right-4 -bottom-4 text-6xl opacity-10 transition-transform duration-700 pointer-events-none group-hover:scale-125 group-hover:rotate-12 ${
              currentPresetId === preset.id ? 'text-black' : 'text-white'
            }`}>
              <i className={`fas ${preset.icon}`}></i>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900/20 p-8 rounded-[40px] border border-white/5 mt-4">
        <div className="flex items-center gap-4 text-slate-500">
           <i className="fas fa-info-circle text-xs"></i>
           <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
             Environment simulation uses a custom algorithmic spatial engine. Select a preset to test frequency translation and transient response across different physical acoustic boundaries.
           </p>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentRack;