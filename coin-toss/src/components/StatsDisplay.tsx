/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TossStats } from '../types';
import { Award, Percent, RefreshCw } from 'lucide-react';

interface StatsDisplayProps {
  stats: TossStats;
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  const headsPct = stats.total > 0 ? stats.headsPercentage : 0;
  const tailsPct = stats.total > 0 ? stats.tailsPercentage : 0;

  return (
    <div className="bg-slate-950/45 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg" id="stats-dashboard">
      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-2.5 flex flex-col items-center">
          <div className="rounded-lg p-1.5 bg-white/10 text-slate-200 mb-1">
            <RefreshCw className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total</span>
          <span className="text-lg font-bold text-white font-sans mt-0.5">{stats.total}</span>
        </div>

        <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-2.5 flex flex-col items-center">
          <div className="rounded-lg p-1.5 bg-yellow-500/15 text-amber-400 mb-1 animate-pulse">
            <Percent className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Split (H/T)</span>
          <span className="text-xs font-bold text-slate-200 font-sans mt-0.5">
            {headsPct}% / {tailsPct}%
          </span>
        </div>

        <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-2.5 flex flex-col items-center">
          <div className="rounded-lg p-1.5 bg-indigo-500/15 text-indigo-400 mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Streak</span>
          <span className="text-xs font-bold text-slate-100 font-sans mt-0.5 flex items-center gap-0.5">
            {stats.currentStreak.count > 0 ? (
              <>
                <span className="capitalize">{stats.currentStreak.outcome}</span>
                <span className="text-indigo-400">x{stats.currentStreak.count}</span>
              </>
            ) : (
              <span className="text-slate-500">0</span>
            )}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar Ratio */}
      {stats.total > 0 && (
         <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
            <span>HEADS ({stats.headsCount})</span>
            <span>TAILS ({stats.tailsCount})</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400/80 to-yellow-300/80"
              initial={{ width: 0 }}
              animate={{ width: `${headsPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div
              className="h-full bg-gradient-to-r from-slate-500 to-slate-400"
              initial={{ width: 0 }}
              animate={{ width: `${tailsPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
