/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlipRecord, TossStats, CoinOutcome } from '../types';

const STORAGE_KEY = 'coin_toss_history_v1';

export class CoinHistoryDatabase {
  /**
   * Loads all historical coin flips from offline local storage.
   */
  public static async getAllFlips(): Promise<FlipRecord[]> {
    return new Promise((resolve) => {
      // Simulate micro database query latency (20ms) for high-fidelity interactive state
      setTimeout(() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) {
            resolve([]);
            return;
          }
          const records: FlipRecord[] = JSON.parse(raw);
          // Sort by timestamp descending (newest first)
          resolve(records.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) {
          console.error('Failed to read from local DB:', e);
          resolve([]);
        }
      }, 20);
    });
  }

  /**
   * Saves a new flip record into persistence.
   */
  public static async saveFlip(record: FlipRecord): Promise<FlipRecord[]> {
    return new Promise(async (resolve) => {
      try {
        const history = await this.getAllFlips();
        history.unshift(record); // Add to the front since it is sorted descending
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        resolve(history);
      } catch (e) {
        console.error('Failed to save record to local DB:', e);
        resolve([]);
      }
    });
  }

  /**
   * Deletes all persistency records.
   */
  public static async clearAll(): Promise<void> {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem(STORAGE_KEY);
        resolve();
      } catch (e) {
        console.error('Failed to purge local DB:', e);
        resolve();
      }
    });
  }

  /**
   * Computes clean, robust aggregated metrics on-the-fly.
   */
  public static calculateStats(history: FlipRecord[]): TossStats {
    const total = history.length;
    if (total === 0) {
      return {
        total: 0,
        headsCount: 0,
        tailsCount: 0,
        headsPercentage: 0,
        tailsPercentage: 0,
        currentStreak: { outcome: null, count: 0 },
      };
    }

    let headsCount = 0;
    let tailsCount = 0;

    // Calculate current streak (scanned newest to oldest)
    let currentStreakOutcome: CoinOutcome | null = null;
    let currentStreakCount = 0;

    // Sort to iterate forward (oldest to newest) to correctly build final streaks
    const chronologicalHistory = [...history].reverse();

    chronologicalHistory.forEach((record, index) => {
      if (record.outcome === 'heads') {
        headsCount++;
      } else {
        tailsCount++;
      }

      if (index === 0) {
        currentStreakOutcome = record.outcome;
        currentStreakCount = 1;
      } else {
        if (record.outcome === currentStreakOutcome) {
          currentStreakCount++;
        } else {
          currentStreakOutcome = record.outcome;
          currentStreakCount = 1;
        }
      }
    });

    const headsPercentage = Math.round((headsCount / total) * 100);
    const tailsPercentage = Math.round((tailsCount / total) * 100);

    return {
      total,
      headsCount,
      tailsCount,
      headsPercentage,
      tailsPercentage,
      currentStreak: {
        outcome: currentStreakOutcome,
        count: currentStreakCount,
      },
    };
  }
}
