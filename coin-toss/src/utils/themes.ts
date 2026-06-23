/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoinTheme } from '../types';

export const COIN_THEMES: CoinTheme[] = [
  {
    id: 'gold',
    name: 'Royal Gold',
    headsColor: 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500',
    tailsColor: 'bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600',
    borderColor: 'border-yellow-600 shadow-yellow-500/10',
    accentColor: 'text-yellow-900',
    headsText: 'HEADS',
    tailsText: 'TAILS',
    textColor: 'text-yellow-950',
  },
  {
    id: 'silver',
    name: 'Lunar Silver',
    headsColor: 'bg-gradient-to-r from-slate-300 via-zinc-100 to-slate-400',
    tailsColor: 'bg-gradient-to-r from-slate-400 via-zinc-200 to-slate-500',
    borderColor: 'border-slate-500 shadow-slate-400/10',
    accentColor: 'text-slate-800',
    headsText: 'HEADS',
    tailsText: 'TAILS',
    textColor: 'text-slate-900',
  },
  {
    id: 'slate',
    name: 'Calm Slate',
    headsColor: 'bg-gradient-to-r from-zinc-800 via-neutral-700 to-zinc-900',
    tailsColor: 'bg-gradient-to-r from-zinc-900 via-neutral-800 to-stone-950',
    borderColor: 'border-zinc-900 shadow-zinc-800/20',
    accentColor: 'text-amber-500/90',
    headsText: 'HEADS',
    tailsText: 'TAILS',
    textColor: 'text-zinc-100',
  },
  {
    id: 'hologram',
    name: 'Cosmic Hologram',
    headsColor: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    tailsColor: 'bg-gradient-to-br from-fuchsia-600 via-indigo-600 to-cyan-500',
    borderColor: 'border-fuchsia-700 shadow-indigo-500/30',
    accentColor: 'text-cyan-200',
    headsText: 'HEADS',
    tailsText: 'TAILS',
    textColor: 'text-white',
  },
];
