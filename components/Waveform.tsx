import React, { useRef, useEffect } from 'react';
import { audioEngine } from '../services/audioEngine';

interface WaveformProps {
  buffer: AudioBuffer | null;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const Waveform: React.FC<WaveformProps> = ({ buffer, currentTime, duration, onSeek }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  
  // Ref to store the latest onSeek callback to prevent stale closures in window event listeners
  const onSeekRef = useRef(onSeek);
  const durationRef = useRef(duration);
  const bufferRef = useRef(buffer);
  const currentTimeRef = useRef(currentTime);

  useEffect(() => {
    onSeekRef.current = onSeek;
  }, [onSeek]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    bufferRef.current = buffer;
  }, [buffer]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const handleInteraction = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !durationRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const seekTime = Math.max(0, Math.min(durationRef.current, (x / rect.width) * durationRef.current));
    onSeekRef.current(seekTime);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleInteraction(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (isDragging.current) {
        handleInteraction(moveEvent.clientX);
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const drawStaticWave = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const currentBuffer = bufferRef.current;
    if (!currentBuffer) return;
    const data = currentBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i++) {
      let min = 1.0; let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();
  };

  const drawVisuals = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const { wet, dry } = audioEngine.getAnalysers();
    if (!wet || !dry) {
      rafRef.current = requestAnimationFrame(drawVisuals);
      return;
    }

    const wetData = new Uint8Array(wet.frequencyBinCount);
    const dryData = new Uint8Array(dry.frequencyBinCount);
    
    wet.getByteFrequencyData(wetData);
    dry.getByteFrequencyData(dryData);

    ctx.clearRect(0, 0, width, height);
    drawStaticWave(ctx, width, height);

    const totalBins = dryData.length * 0.7; 

    // Background dry fill
    ctx.beginPath();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.moveTo(0, height);
    for (let i = 0; i < width; i++) {
      const binIdx = Math.floor((i / width) * totalBins);
      const v = dryData[binIdx] / 255.0;
      const y = height - (v * height * 0.95);
      ctx.lineTo(i, y);
    }
    ctx.lineTo(width, height);
    ctx.fill();

    // Compression/Gain Delta Visualization
    for (let i = 0; i < width; i++) {
      const binIdx = Math.floor((i / width) * totalBins);
      const d = dryData[binIdx] / 255.0;
      const w = wetData[binIdx] / 255.0;
      
      const dryY = height - (d * height * 0.95);
      const wetY = height - (w * height * 0.95);

      if (Math.abs(wetY - dryY) > 2) {
        ctx.beginPath();
        if (wetY < dryY) { ctx.fillStyle = 'rgba(34, 197, 94, 0.25)'; }
        else { ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'; }
        ctx.fillRect(i, Math.min(wetY, dryY), 1, Math.abs(wetY - dryY));
      }
    }

    // Dynamic Wet Line
    ctx.beginPath();
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i++) {
      const binIdx = Math.floor((i / width) * totalBins);
      const v = wetData[binIdx] / 255.0;
      const y = height - (v * height * 0.95);
      if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Playhead Line
    if (durationRef.current > 0) {
      const px = (currentTimeRef.current / durationRef.current) * width;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - 1, 0, 2, height);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.fillRect(px - 0.5, 0, 1, height);
      ctx.shadowBlur = 0;
    }

    rafRef.current = requestAnimationFrame(drawVisuals);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }
    
    // Start animation loop once on mount
    rafRef.current = requestAnimationFrame(drawVisuals);
    
    // Clean up animation loop on unmount
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // Only run once on mount

  return (
    <div className="relative w-full h-36 bg-slate-950 rounded-[30px] overflow-hidden border border-white/5 cursor-pointer shadow-inner select-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        onMouseDown={onMouseDown}
      />
      <div className="absolute top-3 left-4 text-[7px] font-black text-slate-400 flex gap-4 uppercase tracking-[0.1em] bg-black/50 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-lg pointer-events-none">
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Wet</span>
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div> Dry</span>
      </div>
      <div className="absolute bottom-2 right-6 text-[7px] font-mono text-slate-700 uppercase tracking-widest pointer-events-none">
        Spectrum Delta Visualizer
      </div>
    </div>
  );
};

export default Waveform;