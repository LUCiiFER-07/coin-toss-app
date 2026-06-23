/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { FlipRecord } from '../types';
import { Trash2, TrendingUp, History } from 'lucide-react';
import { COIN_THEMES } from '../utils/themes';

interface HistoryListProps {
  history: FlipRecord[];
  onClear: () => void;
}

export function HistoryList({ history, onClear }: HistoryListProps) {
  const getThemeBadge = (coinStyleId: string) => {
    const theme = COIN_THEMES.find((t) => t.id === coinStyleId) || COIN_THEMES[0];
    return (
      <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border ${theme.borderColor} ${theme.headsColor} ${theme.textColor} font-semibold font-mono tracking-wider`}>
        {theme.name.split(' ')[0]}
      </span>
    );
  };

  const formatTime = (ts: number) => {
    const dt = new Date(ts);
    return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (ts: number) => {
    const dt = new Date(ts);
    return dt.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-slate-950/45 backdrop-blur-xl rounded-2xl border border-white/10 flex-1 flex flex-col min-h-0 shadow-lg" id="history-container">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400 animate-pulse" />
          <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-slate-300">
            Flip History
          </h3>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-[10px] text-rose-450 hover:text-rose-400 transition-colors flex items-center gap-1 font-medium font-mono uppercase bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/20 px-2 py-1 rounded-md cursor-pointer"
            title="Clear all records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* List Body */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar max-h-76" style={{ minHeight: '150px' }}>
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center py-10 text-center text-slate-400"
            >
              <div className="w-10 h-10 border-2 border-dashed border-slate-800 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 opacity-40 text-slate-500" />
              </div>
              <p className="text-xs font-mono text-slate-400">No tosses registered yet.</p>
              <p className="text-[10px] text-slate-500 mt-1">Tap the coin above to make a toss.</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {history.map((record, index) => {
                const isHeads = record.outcome === 'heads';
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.25, ease: 'easeOut', delay: Math.min(index * 0.03, 0.15) }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
                    id={`history-row-${record.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Heads/Tails Visual Indicator */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-sans text-xs border shadow-sm select-none
                          ${isHeads
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-amber-400 text-amber-950 shadow-yellow-500/10'
                            : 'bg-gradient-to-tr from-slate-600 to-slate-400 border-slate-500 text-slate-950 shadow-slate-400/10'
                          }
                        `}
                      >
                        {isHeads ? 'H' : 'T'}
                      </div>

                      {/* Descriptive Metadata */}
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white capitalize font-sans leading-tight">
                          {record.outcome}
                        </span>
                        <span className="text-[10px] text-slate-450 font-mono mt-0.5">
                          {formatDate(record.timestamp)} @ {formatTime(record.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {getThemeBadge(record.coinStyle)}
                      <span className="text-[9px] font-mono text-slate-400">
                        {record.durationMs}ms
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
