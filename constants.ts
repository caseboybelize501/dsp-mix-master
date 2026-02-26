import { EnvironmentPreset, MixingSettings, MasteringSettings, AudioState, VocalAlignSettings, AutoTuneSettings } from './types';

export const EQ_FREQS = [20, 32, 45, 64, 90, 125, 180, 250, 350, 500, 800, 1200, 2000, 3000, 5000, 8000, 12000, 18000];
export const EQ_LABELS = ['Sub-Infra', 'Sub', 'Deep', 'Thump', 'Bottom', 'Weight', 'Body', 'Mud', 'Boxy', 'Honk', 'Low-Mid', 'Def', 'Presence', 'Edge', 'Bite', 'Sibil', 'Air', 'Sparkle'];

export const PRESETS: EnvironmentPreset[] = [
  { id: 'dry', name: 'Studio Monitors', icon: 'fa-headphones', roomSize: 0, damping: 1.0, wetLevel: 0, hpFreq: 20, lpFreq: 20000, description: 'Flat response.' },
  { id: 'car', name: 'Compact Car', icon: 'fa-car', roomSize: 0.2, damping: 0.8, wetLevel: 0.4, hpFreq: 65, lpFreq: 7500, description: 'Tight vehicle acoustics.' },
  { id: 'hallway', name: 'Large Hallway', icon: 'fa-archway', roomSize: 0.85, damping: 0.3, wetLevel: 0.6, hpFreq: 100, lpFreq: 14000, description: 'Long reflections.' },
  { id: 'outdoor', name: 'Outdoor Park', icon: 'fa-tree', roomSize: 0.05, damping: 0.1, wetLevel: 0.05, hpFreq: 180, lpFreq: 20000, description: 'Minimal reflections.' }
];

export const INITIAL_VOCAL_ALIGN: VocalAlignSettings = {
  alignIntensity: 0.8,
  rhythmTightness: 0.7,
  swingAmount: 0,
  isProcessing: false
};

export const INITIAL_AUTO_TUNE: AutoTuneSettings = {
  retuneSpeed: 20,
  humanize: 0.3,
  rootKey: 'C',
  scale: 'Major',
  vibratoAmount: 0,
  formantShift: 0
};

export const INITIAL_MIXING: MixingSettings = {
  eqBands: new Array(18).fill(0),
  compThreshold: -20, compRatio: 3, compAttack: 0.01, compRelease: 0.1, compKnee: 10, compMakeUp: 0,
  delayTime: 0.25, delayFeedback: 0.3, delayMix: 0,
  reverbSize: 0.5, reverbDecay: 1.5, reverbMix: 0,
  phaserRate: 0.5, phaserDepth: 0.3, chorusMix: 0,
  bitcrush: 0, drive: 0,
  enhanceLow: 0, enhanceMid: 0, enhanceHigh: 0,
  punch: 0, sustain: 0,
  resonanceDuck: 0, duckFrequency: 500, duckQ: 8,
};

export const INITIAL_MASTERING: MasteringSettings = {
  inputGain: 0, eqLow: 0, eqMid: 0, eqHigh: 0, excitation: 0, softClip: 0,
  tubeWarmth: 0, airGlow: 0, peakTamer: 0, spectralClarity: 0, stereoHighWidth: 1.0, maximizerDrive: 0,
  glueThreshold: 0, glueRatio: 2, glueAttack: 0.03, glueRelease: 0.1,
  tapeDrive: 0, tapeFlux: 0.5, tapeHiss: 0,
  mbPriorityLow: 1, mbPriorityMid: 1, mbPriorityHigh: 1,
  stereoRotation: 0, stereoAsymmetry: 0,
  mbLowThresh: -12, mbMidThresh: -12, mbHighThresh: -12, mbRatio: 2.0,
  sideDrive: 0, transientImpact: 0, clarityTame: 0,
  stereoWidth: 1.0, stereoPan: 0, bassFocus: 150,
  limiterCeiling: -0.1, limiterLookahead: 0.005
};

export const INITIAL_STATE: AudioState = {
  isPlaying: false,
  buffer: null,
  currentTime: 0,
  duration: 0,
  fileName: null,
  videoUrl: null,
  mixing: { ...INITIAL_MIXING },
  mastering: INITIAL_MASTERING,
  vocalAlign: INITIAL_VOCAL_ALIGN,
  autoTune: INITIAL_AUTO_TUNE,
  isBypassed: false,
  currentPresetId: 'dry',
  masterGain: 1.0,
  activeTab: 'mix',
  isExporting: false
};