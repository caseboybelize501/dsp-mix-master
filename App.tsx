import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_STATE, PRESETS } from './constants';
import { AudioState, EnvironmentPreset } from './types';
import { audioEngine } from './services/audioEngine';
import Waveform from './components/Waveform';
import MixingRack from './components/MixingRack';
import FXRack from './components/FXRack';
import MasteringRack from './components/MasteringRack';
import EnvironmentRack from './components/EnvironmentRack';
import VocalAlignRack from './components/VocalAlignRack';
import AutoTuneRack from './components/AutoTuneRack';

const App: React.FC = () => {
  const [state, setState] = useState<AudioState>(INITIAL_STATE);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    audioEngine.update(state.mixing, state.mastering);
  }, [state.mixing, state.mastering]);

  useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = window.setInterval(() => {
        const time = audioEngine.getTime();
        setState(prev => {
          if (time >= prev.duration && prev.isPlaying) {
            audioEngine.stop();
            return { ...prev, isPlaying: false, currentTime: prev.duration };
          }
          return { ...prev, currentTime: time };
        });
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.isPlaying]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = await audioEngine.decodeAudio(arrayBuffer);
    const url = URL.createObjectURL(file);
    
    setState(prev => ({
      ...prev,
      buffer,
      duration: buffer.duration,
      fileName: file.name,
      videoUrl: file.type.includes('video') ? url : null,
      currentTime: 0,
      isPlaying: false
    }));
  };

  const togglePlay = () => {
    if (!state.buffer) return;
    const isPlaying = !state.isPlaying;
    if (!isPlaying) {
      audioEngine.stop();
      videoRef.current?.pause();
    } else {
      audioEngine.play(state.buffer, state.currentTime);
      videoRef.current?.play();
    }
    setState(prev => ({ ...prev, isPlaying }));
  };

  const handleSeek = (time: number) => {
    if (!state.buffer) return;
    if (state.isPlaying) {
      audioEngine.play(state.buffer, time);
    }
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const handleExport = async () => {
    setState(prev => ({ ...prev, isExporting: true }));
    try {
      await audioEngine.exportWav();
      alert("Professional Master Export Complete! (Simulated)");
    } finally {
      setState(prev => ({ ...prev, isExporting: false }));
    }
  };

  const handlePresetSelect = (preset: EnvironmentPreset) => {
    const newMixing = {
      ...state.mixing,
      reverbSize: preset.roomSize,
      reverbMix: preset.wetLevel,
    };
    setState(prev => ({
      ...prev,
      currentPresetId: preset.id,
      mixing: newMixing
    }));
  };

  // Workflow steps
  const steps = [
    { id: 'vocal', label: '1. AI Align', icon: 'fa-robot' },
    { id: 'tune', label: '2. Auto-Tune', icon: 'fa-microphone-lines' },
    { id: 'mix', label: '3. Surgical EQ', icon: 'fa-wave-square' },
    { id: 'fx', label: '4. FX / Texture', icon: 'fa-wand-magic-sparkles' },
    { id: 'master', label: '5. Elite Mastering', icon: 'fa-crown' },
    { id: 'env', label: '6. Environment', icon: 'fa-mountain' }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-slate-100 font-sans selection:bg-green-500/30 overflow-hidden">
      <header className="px-6 py-3 border-b border-white/5 bg-black/60 backdrop-blur-2xl flex justify-between items-center z-[100]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <i className="fas fa-bolt text-xs"></i>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase leading-none">EnvCore Pro</h1>
            <p className="text-[7px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-0.5">Vocal AI & Mastering System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className={`px-5 py-1.5 bg-green-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 ${state.isExporting ? 'animate-pulse opacity-50' : ''}`}
          >
            {state.isExporting ? 'PROCESSING...' : 'RENDER MASTER'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Step-by-Step Navigation Bar */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center overflow-x-auto no-scrollbar justify-between">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <button 
                  onClick={() => setState(prev => ({...prev, activeTab: step.id as any}))}
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl transition-all border whitespace-nowrap ${
                    state.activeTab === step.id 
                    ? 'bg-white text-black border-white shadow-xl scale-105' 
                    : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
                  }`}
                >
                  <i className={`fas ${step.icon} text-[10px]`}></i>
                  <span className="text-[9px] font-black uppercase tracking-widest">{step.label}</span>
                </button>
                {idx < steps.length - 1 && <i className="fas fa-chevron-right text-[8px] text-slate-800 mx-2"></i>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-4 bg-black/40 px-6 py-2 rounded-2xl border border-white/5 ml-4">
            <button onClick={togglePlay} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${state.isPlaying ? 'bg-white text-black' : 'bg-green-500 text-black'}`}>
              <i className={`fas ${state.isPlaying ? 'fa-pause' : 'fa-play'} ${state.isPlaying ? '' : 'ml-0.5'}`}></i>
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Master Time</p>
              <p className="text-[10px] font-mono font-black text-green-500">{formatTime(state.currentTime)} / {formatTime(state.duration)}</p>
            </div>
            <label className="cursor-pointer px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase transition-all border border-white/5">
              LOAD
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Dynamic Viewport Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <section className="px-6 py-4 flex gap-4 h-52">
            <div className="flex-1 bg-slate-950 rounded-[40px] border border-white/5 overflow-hidden relative group shadow-2xl">
              {state.videoUrl ? (
                <video ref={videoRef} src={state.videoUrl} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                  <i className="fas fa-waveform text-slate-800 text-5xl animate-pulse"></i>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-8 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${state.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
                <span className="text-[9px] font-black uppercase text-white tracking-[0.2em]">{state.fileName || "AWAITING SIGNAL"}</span>
              </div>
            </div>
          </section>

          <section className="px-6 pb-6">
            <Waveform buffer={state.buffer} currentTime={state.currentTime} duration={state.duration} onSeek={handleSeek} />
          </section>

          {/* Active Processing Rack */}
          <div className="px-6 flex-1 overflow-y-auto no-scrollbar pb-10">
            <div className="max-w-7xl mx-auto h-full">
              {state.activeTab === 'vocal' && <VocalAlignRack settings={state.vocalAlign} onChange={(v) => setState(prev => ({ ...prev, vocalAlign: v }))} />}
              {state.activeTab === 'tune' && <AutoTuneRack settings={state.autoTune} onChange={(t) => setState(prev => ({ ...prev, autoTune: t }))} />}
              {state.activeTab === 'mix' && <MixingRack settings={state.mixing} onChange={(m) => setState(prev => ({ ...prev, mixing: m }))} />}
              {state.activeTab === 'fx' && <FXRack settings={state.mixing} onChange={(m) => setState(prev => ({ ...prev, mixing: m }))} />}
              {state.activeTab === 'master' && <MasteringRack settings={state.mastering} hasAudio={!!state.buffer} isExporting={state.isExporting} onChange={(m) => setState(prev => ({ ...prev, mastering: m }))} onExport={handleExport} />}
              {state.activeTab === 'env' && <EnvironmentRack currentPresetId={state.currentPresetId} onSelect={handlePresetSelect} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default App;