/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { CoinTheme, CoinOutcome } from '../types';

interface CoinProps {
  theme: CoinTheme;
  outcome: CoinOutcome;
  isFlipping: boolean;
  rotationY: number;
}

export function Coin({ theme, outcome, isFlipping, rotationY }: CoinProps) {
  return (
    <div className="relative w-56 h-56 select-none" style={{ perspective: '1200px' }}>
      {/* 3D Rotator Container */}
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: rotationY,
          scale: isFlipping ? [1, 1.25, 1.15, 1] : 1,
          y: isFlipping ? [-10, -180, -220, -160, -80, 0] : 0,
        }}
        transition={{
          duration: isFlipping ? 1.4 : 0.4,
          ease: isFlipping ? 'easeOut' : [0.25, 1, 0.5, 1],
        }}
      >
        {/* HEADS SIDE (Front) - Visible at 0, 360, etc */}
        <div
          className={`absolute inset-0 rounded-full border-[8px] ${theme.borderColor} ${theme.headsColor} flex flex-col items-center justify-center p-4 shadow-xl`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
          id="coin-face-heads"
        >
          {/* Outer Ring Detail */}
          <div className="absolute inset-[3px] rounded-full border border-current opacity-15" />
          
          {/* Inner Content Border */}
          <div className="absolute inset-3 rounded-full border-2 border-dashed border-current opacity-25 flex items-center justify-center" />

          {/* Core Logo Symbol */}
          <div className={`${theme.textColor} z-10 flex flex-col items-center gap-1`}>
            {theme.id === 'gold' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
            {theme.id === 'silver' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {theme.id === 'slate' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10M2 12h20" />
              </svg>
            )}
            {theme.id === 'hologram' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}

            <span className="font-sans font-bold text-lg tracking-[0.3em] select-none translate-y-1">
              {theme.headsText}
            </span>
          </div>

          {/* Tiny bottom star / decoration */}
          <div className={`absolute bottom-5 ${theme.textColor} opacity-40 text-[8px]`}>✦ ✦ ✦</div>
        </div>

        {/* TAILS SIDE (Back) - Visible at 180, 540, etc */}
        <div
          className={`absolute inset-0 rounded-full border-[8px] ${theme.borderColor} ${theme.tailsColor} flex flex-col items-center justify-center p-4 shadow-xl`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          id="coin-face-tails"
        >
          {/* Outer Ring Detail */}
          <div className="absolute inset-[3px] rounded-full border border-current opacity-15" />

          {/* Inner Content Border */}
          <div className="absolute inset-3 rounded-full border-2 border-dashed border-current opacity-25 flex items-center justify-center" />

          {/* Core Logo Symbol */}
          <div className={`${theme.textColor} z-10 flex flex-col items-center gap-1`}>
            {theme.id === 'gold' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="3" />
              </svg>
            )}
            {theme.id === 'silver' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                <path d="M12 6v6" strokeLinecap="round" />
              </svg>
            )}
            {theme.id === 'slate' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V12M12 12l8.66-5M12 12L3.34 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {theme.id === 'hologram' && (
              <svg className="w-16 h-16 opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a10 10 0 1010 10H12V2z" />
                <path d="M12 2a10 10 0 0110 10H12V2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}

            <span className="font-sans font-bold text-lg tracking-[0.3em] select-none translate-y-1">
              {theme.tailsText}
            </span>
          </div>

          {/* Tiny bottom decoration */}
          <div className={`absolute bottom-5 ${theme.textColor} opacity-40 text-[8px]`}>✦ ✦ ✦</div>
        </div>
      </motion.div>

      {/* Real-time 3D Shadow underneath the floating coin */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-4 bg-slate-900/10 rounded-full blur-md"
        animate={{
          scale: isFlipping ? [1, 0.4, 0.3, 0.5, 0.8, 1] : 1,
          opacity: isFlipping ? [0.6, 0.15, 0.05, 0.2, 0.4, 0.6] : 0.6,
        }}
        transition={{
          duration: isFlipping ? 1.4 : 0.4,
          ease: isFlipping ? 'easeOut' : 'easeInOut',
        }}
      />
    </div>
  );
}
