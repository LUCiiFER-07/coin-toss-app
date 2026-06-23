/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoundPresetId } from '../types';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private preset: SoundPresetId = 'classic';

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public setSoundPreset(preset: SoundPresetId) {
    this.preset = preset;
  }

  public getSoundPreset(): SoundPresetId {
    return this.preset;
  }

  /**
   * Synthesizes a beautiful metallic or futuristic launch resonance
   * depending on the active preset sound.
   */
  public playToss() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      switch (this.preset) {
        case 'bullion': {
          // Heavy Gold Bullion - Luxurious A-Major-7th rich chime
          const masterGain = this.ctx.createGain();
          masterGain.gain.setValueAtTime(0.0, now);
          masterGain.gain.linearRampToValueAtTime(0.22, now + 0.015); // Slightly softer, heavier attack
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2); // Extra long premium decay

          // Pure golden frequencies (low to mid-resonance chord)
          const freqs = [329.63, 440.0, 554.37, 659.25, 880.0]; // E4, A4, C#5, E5, A5
          
          freqs.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            // Combination of rich warm triangle & sine waves
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Gentle physical spin drift wobble (vibrato)
            const mod = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();
            mod.frequency.setValueAtTime(4.5, now); // Slow premium 4.5Hz wobble
            modGain.gain.setValueAtTime(idx * 2.5, now);
            mod.connect(modGain);
            modGain.connect(osc.frequency);
            mod.start(now);
            mod.stop(now + 2.2);

            const oscGain = this.ctx.createGain();
            oscGain.gain.setValueAtTime(idx === 1 ? 0.8 : 0.45 / (idx + 1), now);

            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 2.2);
          });

          // Low-pass warm filter to keep it feeling massive and rich
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2200, now);

          masterGain.connect(filter);
          filter.connect(this.ctx.destination);
          break;
        }

        case 'cyber': {
          // Future Cyber Synth - futuristic retro laser-sweep digital coin
          const masterGain = this.ctx.createGain();
          masterGain.gain.setValueAtTime(0.0, now);
          masterGain.gain.linearRampToValueAtTime(0.18, now + 0.005);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

          // Fast downward pitch sweep with high resonance
          const osc1 = this.ctx.createOscillator();
          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(1200, now);
          osc1.frequency.exponentialRampToValueAtTime(280, now + 0.35);

          const osc2 = this.ctx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(600, now);
          osc2.frequency.exponentialRampToValueAtTime(140, now + 0.4);

          // Sub frequency for fat low response
          const subOsc = this.ctx.createOscillator();
          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(80, now);

          // Connect to individual filters
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2500, now);
          filter.frequency.exponentialRampToValueAtTime(400, now + 0.5);
          filter.Q.setValueAtTime(3.5, now);

          const subGain = this.ctx.createGain();
          subGain.gain.setValueAtTime(0.12, now);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(masterGain);

          subOsc.connect(subGain);
          subGain.connect(this.ctx.destination);

          masterGain.connect(this.ctx.destination);

          osc1.start(now);
          osc1.stop(now + 1.0);
          osc2.start(now);
          osc2.stop(now + 1.0);
          subOsc.start(now);
          subOsc.stop(now + 0.25);
          break;
        }

        case 'glass': {
          // Celestial Crystal Glass - crystalline shimmer
          const masterGain = this.ctx.createGain();
          masterGain.gain.setValueAtTime(0.0, now);
          masterGain.gain.linearRampToValueAtTime(0.16, now + 0.008);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

          // Ultra high crystalline overtones
          const freqs = [1500, 2200, 3100, 4400, 5800];
          
          freqs.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Shimmery ultra-fast vibrato simulating glass twinkling
            const mod = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();
            mod.frequency.setValueAtTime(35, now); // Super fast 35Hz sparkle
            modGain.gain.setValueAtTime(22, now);
            mod.connect(modGain);
            modGain.connect(osc.frequency);
            mod.start(now);
            mod.stop(now + 1.5);

            const oscGain = this.ctx.createGain();
            oscGain.gain.setValueAtTime(0.08 / (idx + 1), now);

            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 1.5);
          });

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1800, now);
          filter.Q.setValueAtTime(6.0, now);

          masterGain.connect(filter);
          filter.connect(this.ctx.destination);
          break;
        }

        case 'classic':
        default: {
          // Classic Silver Coin Ring
          const masterGain = this.ctx.createGain();
          masterGain.gain.setValueAtTime(0.0, now);
          masterGain.gain.linearRampToValueAtTime(0.18, now + 0.01);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

          const freqs = [880, 1175, 1480, 1760];

          freqs.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            osc.type = idx === 1 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            const mod = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();
            mod.frequency.setValueAtTime(8, now); // 8 Hz wobble
            modGain.gain.setValueAtTime(idx * 4, now);
            mod.connect(modGain);
            modGain.connect(osc.frequency);
            mod.start(now);
            mod.stop(now + 1.2);

            const oscGain = this.ctx.createGain();
            oscGain.gain.setValueAtTime(idx === 0 ? 0.7 : 0.4 / idx, now);
            
            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 1.2);
          });

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1000, now);
          filter.Q.setValueAtTime(1.0, now);

          masterGain.connect(filter);
          filter.connect(this.ctx.destination);
          break;
        }
      }
    } catch (e) {
      console.warn('Audio synthesis playToss failed:', e);
    }
  }

  /**
   * Synthesizes a soft, solid, physical "catch" or "landing" sound
   * configured to fit the active sound preset.
   */
  public playCatch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      switch (this.preset) {
        case 'bullion': {
          // Soft massive gold thump - deep, weighted impact
          const bodyOsc = this.ctx.createOscillator();
          bodyOsc.type = 'sine';
          bodyOsc.frequency.setValueAtTime(110, now);
          bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

          const bodyGain = this.ctx.createGain();
          bodyGain.gain.setValueAtTime(0.0, now);
          bodyGain.gain.linearRampToValueAtTime(0.5, now + 0.003); // Softer punchy impact
          bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          bodyOsc.connect(bodyGain);
          bodyGain.connect(this.ctx.destination);
          bodyOsc.start(now);
          bodyOsc.stop(now + 0.15);
          break;
        }

        case 'cyber': {
          // Cyber dynamic click - clean synthetic release trigger
          const clickOsc = this.ctx.createOscillator();
          clickOsc.type = 'triangle';
          clickOsc.frequency.setValueAtTime(440, now);
          clickOsc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

          const clickGain = this.ctx.createGain();
          clickGain.gain.setValueAtTime(0.0, now);
          clickGain.gain.linearRampToValueAtTime(0.28, now + 0.001);
          clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          clickOsc.connect(clickGain);
          clickGain.connect(this.ctx.destination);
          clickOsc.start(now);
          clickOsc.stop(now + 0.06);
          break;
        }

        case 'glass': {
          // Crystal tink catch - rapid high glass strike
          const glassOsc = this.ctx.createOscillator();
          glassOsc.type = 'sine';
          glassOsc.frequency.setValueAtTime(2800, now);
          glassOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);

          const glassGain = this.ctx.createGain();
          glassGain.gain.setValueAtTime(0.0, now);
          glassGain.gain.linearRampToValueAtTime(0.18, now + 0.001);
          glassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          glassOsc.connect(glassGain);
          glassGain.connect(this.ctx.destination);
          glassOsc.start(now);
          glassOsc.stop(now + 0.04);
          break;
        }

        case 'classic':
        default: {
          // Standard physical thump & coin slap
          const bodyOsc = this.ctx.createOscillator();
          bodyOsc.type = 'sine';
          bodyOsc.frequency.setValueAtTime(160, now);
          bodyOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

          const bodyGain = this.ctx.createGain();
          bodyGain.gain.setValueAtTime(0.0, now);
          bodyGain.gain.linearRampToValueAtTime(0.35, now + 0.002);
          bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          bodyOsc.connect(bodyGain);
          bodyGain.connect(this.ctx.destination);
          bodyOsc.start(now);
          bodyOsc.stop(now + 0.1);

          // Micro noise crackle/slap for material texture
          const bufferSize = this.ctx.sampleRate * 0.015;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noiseNode = this.ctx.createBufferSource();
          noiseNode.buffer = buffer;

          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(1800, now);
          noiseFilter.Q.setValueAtTime(2.0, now);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.0, now);
          noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.001);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

          noiseNode.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(this.ctx.destination);
          noiseNode.start(now);
          noiseNode.stop(now + 0.02);
          break;
        }
      }
    } catch (e) {
      console.warn('Audio synthesis playCatch failed:', e);
    }
  }
}

export const coinAudio = new AudioSynthesizer();
export default coinAudio;
