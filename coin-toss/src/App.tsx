/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Info, 
  HelpCircle, 
  Sparkles, 
  RefreshCcw, 
  Wifi, 
  Battery, 
  CircleDot,
  CheckCircle,
  Command,
  ArrowRightLeft,
  Fingerprint,
  SlidersHorizontal
} from 'lucide-react';

import { Coin } from './components/Coin';
import { StatsDisplay } from './components/StatsDisplay';
import { HistoryList } from './components/HistoryList';
import { CoinTheme, FlipRecord, CoinOutcome, HapticSettings, HapticIntensity, SoundPresetId, SoundPreset } from './types';
import { COIN_THEMES } from './utils/themes';
import { CoinHistoryDatabase } from './utils/storage';
import { coinAudio } from './utils/audio';

const SOUND_PRESETS: SoundPreset[] = [
  { id: 'classic', name: 'Classic Silver', description: 'Crisp hand-minted metallic ring' },
  { id: 'bullion', name: 'Golden Vault', description: 'Deep, rich E-Major luxury chime' },
  { id: 'cyber', name: 'Cyber Synth', description: 'Neon rapid laser-sweep wave' },
  { id: 'glass', name: 'Ethereal Glass', description: 'Crystalline shimmering magical bell' }
];

export default function App() {
  // Coin states
  const [selectedTheme, setSelectedTheme] = useState<CoinTheme>(COIN_THEMES[0]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<CoinOutcome>('heads');
  const [rotationY, setRotationY] = useState<number>(0);

  // Dynamic audio preset selection
  const [selectedSound, setSelectedSound] = useState<SoundPresetId>(() => {
    try {
      const saved = localStorage.getItem('coin_toss_sound_preset');
      if (saved && (saved === 'classic' || saved === 'bullion' || saved === 'cyber' || saved === 'glass')) {
        return saved as SoundPresetId;
      }
    } catch (e) {
      console.warn('Failed to restore sound preset:', e);
    }
    return 'classic';
  });

  // Sync selected preset with acoustic engine
  useEffect(() => {
    coinAudio.setSoundPreset(selectedSound);
  }, [selectedSound]);

  const handleSelectSound = (presetId: SoundPresetId) => {
    if (isFlipping) return;
    setSelectedSound(presetId);
    coinAudio.setSoundPreset(presetId);
    localStorage.setItem('coin_toss_sound_preset', presetId);
    // Play preview of the toss sound!
    setTimeout(() => {
      coinAudio.playToss();
    }, 50);
  };
  
  // Real-time landing effect flag to trigger visual haptics / flash
  const [triggerFlash, setTriggerFlash] = useState<boolean>(false);

  // Persistence States
  const [history, setHistory] = useState<FlipRecord[]>([]);
  const [stats, setStats] = useState(() => CoinHistoryDatabase.calculateStats([]));
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Simulated Device states
  const [deviceShaking, setDeviceShaking] = useState<boolean>(false);
  const [sensorEnabled, setSensorEnabled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  // Haptic Settings State - Loaded from Local Storage
  const [hapticSettings, setHapticSettings] = useState<HapticSettings>(() => {
    try {
      const saved = localStorage.getItem('coin_toss_haptic_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to restore haptic configuration:', e);
    }
    return { enabled: true, intensity: 'medium' };
  });

  // Pulse effect simulation on the device body mock for direct desktop visual confirmation
  const [hapticVisualPulse, setHapticVisualPulse] = useState<boolean>(false);

  // Prevent double triggers with a ref
  const flippingRef = useRef(false);

  // Master Physical and Virtual Haptic Trigger
  const triggerHapticFeedback = useCallback((intensityOverride?: HapticIntensity) => {
    const isEnabled = hapticSettings.enabled;
    const intensity = intensityOverride || hapticSettings.intensity;
    
    if (!isEnabled && !intensityOverride) return;

    // Trigger standard browser vibration API
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        const ms = intensity === 'light' ? 15 : intensity === 'medium' ? 45 : 95;
        navigator.vibrate(ms);
      } catch (err) {
        console.warn('Navigator physical vibration trigger failed/blocked:', err);
      }
    }

    // Trigger visual feedback representation for devices without tactile hardware (e.g. desktops)
    setHapticVisualPulse(true);
    setTimeout(() => setHapticVisualPulse(false), 200);
  }, [hapticSettings]);

  // Sync Audio Muteness to synthesizer state
  useEffect(() => {
    const savedMute = localStorage.getItem('coin_toss_muted') === 'true';
    setIsMuted(savedMute);
    coinAudio.setMute(savedMute);
  }, []);

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    coinAudio.setMute(nextMute);
    localStorage.setItem('coin_toss_muted', String(nextMute));
  };

  // Sync local history from mock-DB
  const loadDatabaseHistory = useCallback(async () => {
    const records = await CoinHistoryDatabase.getAllFlips();
    setHistory(records);
    setStats(CoinHistoryDatabase.calculateStats(records));
  }, []);

  useEffect(() => {
    loadDatabaseHistory();
  }, [loadDatabaseHistory]);

  // Keep simulated status bar clock updated!
  useEffect(() => {
    const updateClock = () => {
      const dt = new Date();
      let hrs = dt.getHours();
      let mins: string | number = dt.getMinutes();
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12; // 0 should be 12
      mins = mins < 10 ? '0' + mins : mins;
      setCurrentTime(`${hrs}:${mins} ${ampm}`);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 30000);
    return () => clearInterval(clockInterval);
  }, []);

  // Primary Flip Engine Algorithm
  const triggerToss = useCallback(async (byShake = false) => {
    if (isFlipping || flippingRef.current) return;
    
    isFlipping ? null : null; // Safe guard
    setIsFlipping(true);
    flippingRef.current = true;

    // Shake rattle effect
    if (byShake) {
      setDeviceShaking(true);
      setTimeout(() => setDeviceShaking(false), 560);
    }

    // Gentle physical launch haptic indicator
    triggerHapticFeedback('light');

    // Play synthesized crispy metal launch "ting!"
    coinAudio.playToss();

    // Random choice logic
    const nextOutcome: CoinOutcome = Math.random() < 0.5 ? 'heads' : 'tails';

    // Calculate elegant progressive rotational values to preserve physical spinning trajectory
    // We add 1440 degrees (4 full rotations) to the base, and adjust alignment for final outcome:
    // Heads resting state = multiple of 360 (e.g. 0, 720, 1440)
    // Tails resting state = offset of 180 degrees (e.g. 180, 540, 900)
    const currentBase = Math.floor(rotationY / 360) * 360;
    const isNextHeads = nextOutcome === 'heads';
    const rotationTarget = currentBase + 1440 + (isNextHeads ? 0 : 180);

    setRotationY(rotationTarget);
    setOutcome(nextOutcome);

    // Exact Landing Sequence matches spin timing
    setTimeout(async () => {
      // Play solid thump/catch tactile sound
      coinAudio.playCatch();
      
      // Trigger full land haptic feedback
      triggerHapticFeedback();

      // Trigger subtle haptic full-page glow flash
      setTriggerFlash(true);
      setTimeout(() => setTriggerFlash(false), 450);

      const record: FlipRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        outcome: nextOutcome,
        timestamp: Date.now(),
        durationMs: 1400,
        coinStyle: selectedTheme.id,
      };

      // Push to the database layer
      const freshHistory = await CoinHistoryDatabase.saveFlip(record);
      setHistory(freshHistory);
      setStats(CoinHistoryDatabase.calculateStats(freshHistory));

      setIsFlipping(false);
      flippingRef.current = false;
    }, 1400);

  }, [isFlipping, rotationY, selectedTheme, triggerHapticFeedback]);

  // Accelerometer Shake Trigger integration for mobile devices
  useEffect(() => {
    if (!sensorEnabled) return;

    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    const threshold = 14; // Shaking physical force limit

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (flippingRef.current) return;
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const { x, y, z } = accel;
      if (x === null || y === null || z === null) return;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        // Compute force vectors
        if (
          (deltaX > threshold && deltaY > threshold) || 
          (deltaX > threshold && deltaZ > threshold) || 
          (deltaY > threshold && deltaZ > threshold)
        ) {
          triggerToss(true);
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    try {
      window.addEventListener('devicemotion', handleDeviceMotion);
    } catch (e) {
      console.warn('Sensors not allowed/supported in devicemotion:', e);
    }

    return () => {
      try {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      } catch (e) {}
    };
  }, [sensorEnabled, triggerToss]);

  // Keyboard shortcut listener ('Space' and 'Enter')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        triggerToss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerToss]);

  // Request accelerometer permission (required for modern iOS mobile safari)
  const toggleMobileSensor = async () => {
    if (sensorEnabled) {
      setSensorEnabled(false);
      return;
    }

    const deviceMotionEvent = window.DeviceMotionEvent as any;
    if (deviceMotionEvent && typeof deviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await deviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setSensorEnabled(true);
        } else {
          alert('Sensor permission declined. You can still use the shake simulator button.');
        }
      } catch (e) {
        console.error('Error asking accelerometer permissions:', e);
        // Fallback for desktop simulators or other browsers
        setSensorEnabled(true);
      }
    } else {
      // Fallback for Android/others which don't require explicit permissions
      setSensorEnabled(true);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Do you really want to clear the toss history? This action cannot be undone.')) {
      await CoinHistoryDatabase.clearAll();
      await loadDatabaseHistory();
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] flex flex-col lg:flex-row items-center justify-center p-4 md:p-8 gap-8 overflow-x-hidden antialiased relative font-sans text-slate-100">
      {/* Aurora Cybernetic Backglow */}
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-indigo-600/25 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-fuchsia-600/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-[25%] right-[5%] w-[45%] h-[45%] bg-cyan-500/20 rounded-full blur-[120px]"></div>
      </div>

      {/* LEFT SIDE: Architectural Details & Desktop controls */}
      <div className="max-w-md w-full flex flex-col justify-between space-y-6 md:py-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400">
              Acoustic Neon Framework
            </span>
          </div>
          <h1 className="text-3.5xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            Chance & Co.
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            An ultra-polished, immersive coin-tossing experience. Crafted with reactive physical Web Audio API, dynamic tactile haptics, state persistence, and responsive simulated weight gravity.
          </p>
        </div>

        {/* User Directives */}
        <div className="space-y-4 bg-slate-900/40 backdrop-blur-xl rounded-[28px] p-6 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-350 flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> User Directives
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]" />
              <span>Press <kbd className="px-1.5 py-0.5 bg-slate-850 border border-white/10 rounded text-[10px] font-mono text-cyan-300 shadow-inner">Spacebar</kbd> on any screen to launch.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Tap the physical coin or simulated trigger buttons.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Click <b className="text-slate-200">Simulate Shake</b> to apply mechanical force to the core.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>On mobile, tilt/shake with <b className="text-slate-200">Gravity ON</b>.</span>
            </li>
          </ul>
        </div>

        {/* Coin Theme Selector */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Coin Material Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COIN_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => !isFlipping && setSelectedTheme(theme)}
                disabled={isFlipping}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedTheme.id === theme.id
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] scale-[1.01]'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                } ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                id={`theme-btn-${theme.id}`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">{theme.name}</span>
                  <span className="text-[9px] opacity-75 font-mono mt-1">
                    {theme.id === 'gold' ? '24K Gold' : theme.id === 'silver' ? 'Classic Silver' : theme.id === 'slate' ? 'Carbon Steel' : 'Chroma Glass'}
                  </span>
                </div>
                {/* Visual miniature dot of gradient theme */}
                <div className={`w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm ${theme.headsColor}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Acoustic Sound presets */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Flipping Sound Vibe
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SOUND_PRESETS.map((p) => {
              const isSelected = selectedSound === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectSound(p.id)}
                  disabled={isFlipping}
                  className={`flex flex-col justify-between p-3 rounded-xl border text-left transition-all h-[70px] ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-[1.01]'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                  } ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  id={`sound-btn-${p.id}`}
                >
                  <span className="text-xs font-bold leading-none">{p.name}</span>
                  <span className="text-[9px] opacity-65 leading-tight font-mono mt-1">
                    {p.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tactile Haptic Engine Console */}
        <div className="space-y-4 bg-slate-900/40 backdrop-blur-xl rounded-[28px] p-6 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Fingerprint className="w-4 h-4 text-pink-400 animate-pulse" /> Haptic Engine
            </h4>
            
            <button
              onClick={() => {
                const updated = { ...hapticSettings, enabled: !hapticSettings.enabled };
                setHapticSettings(updated);
                localStorage.setItem('coin_toss_haptic_settings', JSON.stringify(updated));
                if (updated.enabled) {
                  setTimeout(() => triggerHapticFeedback('light'), 50);
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-white/10 transition-colors duration-200 ease-in-out focus:outline-none ${
                hapticSettings.enabled ? 'bg-indigo-650' : 'bg-slate-850'
              }`}
              id="haptic-toggle-master"
            >
              <span className="sr-only">Toggle Haptic Feedback</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  hapticSettings.enabled ? 'translate-x-[20px]' : 'translate-x-[0px]'
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Triggers physical tactile response on supported mobile hosts, and simulates bounce wave impulses dynamically.
          </p>

          {hapticSettings.enabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3.5 pt-3.5 border-t border-white/5 overflow-hidden"
              id="haptic-intensity-panel"
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">
                Impact Force:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'medium', 'strong'] as HapticIntensity[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      const updated = { ...hapticSettings, intensity: level };
                      setHapticSettings(updated);
                      localStorage.setItem('coin_toss_haptic_settings', JSON.stringify(updated));
                      setTimeout(() => {
                        triggerHapticFeedback(level);
                      }, 50);
                    }}
                    className={`py-1.5 px-3 rounded-full text-[10px] font-sans font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                      hapticSettings.intensity === level
                        ? 'bg-indigo-600 text-white shadow-lg scale-[1.03] border border-indigo-400/25'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                    id={`haptic-opt-${level}`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <button
                onClick={() => triggerHapticFeedback()}
                className="w-full mt-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 transition-colors flex items-center justify-center gap-1.5 border border-white/5 shadow-sm cursor-pointer"
                id="test-haptic-btn"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-pink-400" />
                Sample Tactile Pulse
              </button>
            </motion.div>
          )}
        </div>

        {/* Technical Footer */}
        <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between border-t border-white/10 pt-4">
          <span>PORT: Acoustic Sandbox</span>
          <span>SYSTEM STATE: CALIBRATED</span>
        </div>
      </div>

      {/* RIGHT SIDE: Immersive Smartphone Mockup UI wrapper */}
      <div className="relative flex justify-center items-center z-10">
        {/* Physical outer shadow for perspective */}
        <div className="absolute top-24 bottom-24 -left-12 -right-12 bg-indigo-950/5 rounded-[60px] blur-3xl pointer-events-none" />

        <motion.div
          animate={
            deviceShaking 
              ? {
                  x: [0, -14, 14, -10, 10, -6, 6, 0],
                  rotate: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
                  scale: [1, 0.98, 1.01, 0.99, 1]
                }
              : hapticVisualPulse
              ? {
                  y: hapticSettings.intensity === 'light' ? [0, 1.5, -1.5, 0] : hapticSettings.intensity === 'medium' ? [0, 3, -3, 0] : [0, 6, -6, 2, -2, 0],
                  scale: hapticSettings.intensity === 'light' ? [1, 0.995, 1.002, 1] : hapticSettings.intensity === 'medium' ? [1, 0.99, 1.005, 1] : [1, 0.975, 1.012, 0.99, 1]
                }
              : {}
          }
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative max-w-md w-[385px] h-[812px] rounded-[52px] border-[12px] border-slate-900 bg-slate-950/75 backdrop-blur-2xl shadow-2xl flex flex-col items-stretch overflow-hidden select-none outline-none border-b-[14px]"
          id="smartphone-frame"
          style={{
            boxShadow: '0 25px 100px -20px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 40px rgba(99, 102, 241, 0.05)'
          }}
        >
          {/* iOS-styled Top Speaker & Micro Notch details */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-40 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center border-b border-white/5">
            {/* Speaker hole */}
            <div className="w-12 h-1 bg-neutral-900 rounded-full mb-1" />
            {/* Camera circle */}
            <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full absolute right-8 top-1.5" />
          </div>

          {/* SIMULATED HARDWARE STATUS BAR */}
          <div className="px-6 pt-3 pb-1 flex justify-between items-center text-xs text-slate-300 font-sans tracking-wide z-40 bg-black/30 backdrop-blur-sm border-b border-white/5 select-none">
            <span className="font-semibold text-[11px] leading-none">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono leading-none font-bold">5G</span>
              <Battery className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          {/* APP WINDOW INNER VIEW CONTAINER */}
          <div className="flex-1 flex flex-col justify-between p-5 relative overflow-y-auto custom-scrollbar pt-5 bg-slate-950/30">
            {/* Tactile Audio and Physical Sensor Toggles */}
            <div className="flex justify-between items-center z-10">
              <div className="flex gap-1">
                {/* MUTE TOGGLE */}
                <button
                  onClick={handleToggleMute}
                  className={`p-2.5 rounded-full transition-all border shadow-sm cursor-pointer ${
                    isMuted
                      ? 'bg-red-950/40 text-red-400 border-red-500/20 hover:bg-red-900/60'
                      : 'bg-white/5 text-slate-250 border-white/10 hover:bg-white/15'
                  }`}
                  title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  id="mute-sound-btn"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* HEAVY MOBILE ACCELEROMETER SENSOR SWITCH */}
                <button
                  onClick={toggleMobileSensor}
                  className={`p-2.5 rounded-full transition-all border shadow-sm flex items-center justify-center cursor-pointer ${
                    sensorEnabled
                      ? 'bg-emerald-950/40 text-emerald-450 border-emerald-500/20 hover:bg-emerald-900/60'
                      : 'bg-white/5 text-slate-250 border-white/10 hover:bg-white/15'
                  }`}
                  title="Enable Accelerometer Sensor for real mobile shake control"
                  id="accelerometer-toggle-btn"
                >
                  <Smartphone className="w-4 h-4" />
                </button>

                {/* QUICK HAPTIC TOGGLE */}
                <button
                  onClick={() => {
                    const updated = { ...hapticSettings, enabled: !hapticSettings.enabled };
                    setHapticSettings(updated);
                    localStorage.setItem('coin_toss_haptic_settings', JSON.stringify(updated));
                    if (updated.enabled) {
                      triggerHapticFeedback('light');
                    }
                  }}
                  className={`p-2.5 rounded-full transition-all border shadow-sm flex items-center justify-center cursor-pointer ${
                    hapticSettings.enabled
                      ? 'bg-rose-950/40 text-rose-450 border-rose-500/20 hover:bg-rose-900/65'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/15'
                  }`}
                  title={hapticSettings.enabled ? 'Haptic feedback on (tap to mute)' : 'Haptic feedback off (tap to enable)'}
                  id="quick-haptic-btn"
                >
                  <Fingerprint className="w-4 h-4" />
                </button>
              </div>

              {/* Theme Name Badge */}
              <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-sm">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 flex items-center gap-1 capitalize">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedTheme.headsColor}`} />
                  {selectedTheme.name}
                </span>
              </div>
            </div>

            {/* STAGE AREA: Coin placement & active flash */}
            <div className="relative flex flex-col items-center justify-center py-6 h-68 my-1">
              {/* Backglow Aura on Success / Land */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`w-64 h-64 rounded-full transition-all duration-700 blur-3xl opacity-0 scale-95
                    ${triggerFlash ? 'opacity-40 scale-125' : ''}
                    ${selectedTheme.id === 'gold' ? 'bg-amber-400' : ''}
                    ${selectedTheme.id === 'silver' ? 'bg-slate-300' : ''}
                    ${selectedTheme.id === 'slate' ? 'bg-neutral-650' : ''}
                    ${selectedTheme.id === 'hologram' ? 'bg-indigo-400' : ''}
                  `}
                />
              </div>

              {/* Coin Click Trigger Container */}
              <div 
                onClick={() => !isFlipping && triggerToss()}
                className={`relative z-10 cursor-pointer ${isFlipping ? 'pointer-events-none' : 'hover:scale-[1.03] transition-transform active:scale-[0.98]'}`}
                title="Tap directly to flip"
                id="interactive-coin-hitbox"
              >
                <Coin
                  theme={selectedTheme}
                  outcome={outcome}
                  isFlipping={isFlipping}
                  rotationY={rotationY}
                />
              </div>
            </div>

            {/* LOWER INTERACTIVES & PRIMARY TRIGGER ACTIONS */}
            <div className="space-y-4">
              {/* LANDING TEXT POPUP BANNER */}
              <div className="h-14 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isFlipping && history.length > 0 ? (
                    <motion.div
                      key={outcome}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="text-center"
                    >
                      <h2 className="text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-150 to-indigo-200 capitalize">
                        {outcome}
                      </h2>
                      <div className="mt-1 px-3 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[9px] uppercase tracking-widest font-bold text-cyan-400 inline-block border border-white/10">
                        Result Confirmed
                      </div>
                    </motion.div>
                  ) : isFlipping ? (
                    <motion.div
                      key="flipping"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-cyan-400 text-xs font-mono tracking-widest flex items-center gap-2 pb-1"
                    >
                      <CircleDot className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      FLIPPING...
                    </motion.div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono tracking-wide text-center">
                      Tap the coin or press CTA below
                    </span>
                  )}
                </AnimatePresence>
              </div>

              {/* DETAILED CONTROLS GRID */}
              <div className="grid grid-cols-2 gap-2">
                {/* PRIMARY ACTION CTA */}
                <button
                  onClick={() => triggerToss()}
                  disabled={isFlipping}
                  className={`col-span-2 py-4 rounded-full font-sans font-extrabold text-sm tracking-widest transition-all shadow-xl active:scale-95 transition-all outline-none border border-indigo-400/20 transform cursor-pointer ${
                    isFlipping
                      ? 'bg-slate-900 text-slate-600 border-white/5 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_4px_25px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.55)]'
                  }`}
                  id="primary-toss-btn"
                >
                  {isFlipping ? 'SPINNING...' : 'TOSS COIN'}
                </button>

                {/* SIMULATED SHAKE BUTTON */}
                <button
                  onClick={() => triggerToss(true)}
                  disabled={isFlipping}
                  className={`py-2.5 rounded-full text-[11px] font-bold font-sans tracking-wide transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    isFlipping
                      ? 'bg-white/5 text-slate-600 border-white/5 shadow-none'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 backdrop-blur-md'
                  }`}
                  title="Simulates shaking the phone device housing"
                  id="simulate-shake-btn"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 rotate-45 text-pink-400" />
                  Simulate Shake
                </button>

                {/* LIVE ACCELEROMETER TOGGLE LABEL */}
                <button
                  onClick={toggleMobileSensor}
                  className={`py-2.5 rounded-full text-[11px] font-bold font-sans tracking-wide transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    sensorEnabled
                      ? 'bg-emerald-950/40 border-emerald-500/25 text-emerald-450 font-bold shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  id="live-accelerometer-badge"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  {sensorEnabled ? 'Gravity ON' : 'Gravity OFF'}
                </button>
              </div>

              {/* INTEGRATED DASHBOARD & SESSIONS HISTORY */}
              <div className="space-y-3 pt-1">
                <StatsDisplay stats={stats} />
                <HistoryList history={history} onClear={handleClearHistory} />
              </div>
            </div>
          </div>

          {/* PHYSICAL iOS BOTTOM HOME BAR */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
