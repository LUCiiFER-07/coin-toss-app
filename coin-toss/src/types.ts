/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CoinOutcome = 'heads' | 'tails';

export interface FlipRecord {
  id: string;
  outcome: CoinOutcome;
  timestamp: number;
  durationMs: number;
  coinStyle: CoinThemeId;
}

export type CoinThemeId = 'gold' | 'silver' | 'slate' | 'hologram';

export interface CoinTheme {
  id: CoinThemeId;
  name: string;
  headsColor: string;
  tailsColor: string;
  borderColor: string;
  accentColor: string;
  headsText: string;
  tailsText: string;
  textColor: string;
}

export interface TossStats {
  total: number;
  headsCount: number;
  tailsCount: number;
  headsPercentage: number;
  tailsPercentage: number;
  currentStreak: {
    outcome: CoinOutcome | null;
    count: number;
  };
}

export type HapticIntensity = 'light' | 'medium' | 'strong';

export interface HapticSettings {
  enabled: boolean;
  intensity: HapticIntensity;
}

export type SoundPresetId = 'classic' | 'cyber' | 'bullion' | 'glass';

export interface SoundPreset {
  id: SoundPresetId;
  name: string;
  description: string;
}

