import { describe, expect, it, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));
import { calculateOptimalWakeTime, calculateSleepDebt } from '../src/hooks/useSleepTracking';
import type { SleepSession } from '../src/hooks/useSleepTracking';

describe('sleep tracking utilities', () => {
  describe('calculateOptimalWakeTime', () => {
    it('calculates five 90-minute cycles plus sleep latency', () => {
      expect(calculateOptimalWakeTime('22:30', '07:00', 5)).toEqual({
        optimalWakeTime: '06:15',
        cycles: 5,
        totalMinutes: 465,
      });
    });

    it('handles a target wake time on the following day', () => {
      expect(calculateOptimalWakeTime('23:00', '06:30', 4)).toEqual({
        optimalWakeTime: '05:15',
        cycles: 4,
        totalMinutes: 375,
      });
    });

    it('limits requested cycles to those that fit the available window', () => {
      const result = calculateOptimalWakeTime('23:30', '05:00', 5);
      expect(result.cycles).toBe(3);
      expect(result.totalMinutes).toBe(285);
    });
  });

  describe('calculateSleepDebt', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-10T12:00:00.000Z'));
    });

    it('sums deficits for completed sessions in the requested period', () => {
      const sessions: SleepSession[] = [
        {
          id: 'one',
          startTime: new Date('2025-01-09T22:00:00.000Z').getTime(),
          endTime: new Date('2025-01-10T06:00:00.000Z').getTime(),
          duration: 420,
          sleepLatency: 15,
          efficiency: 90,
          quality: 80,
          phases: [],
        },
        {
          id: 'two',
          startTime: new Date('2025-01-07T22:00:00.000Z').getTime(),
          endTime: new Date('2025-01-08T06:00:00.000Z').getTime(),
          duration: 480,
          sleepLatency: 10,
          efficiency: 95,
          quality: 90,
          phases: [],
        },
        {
          id: 'old',
          startTime: new Date('2024-12-20T22:00:00.000Z').getTime(),
          endTime: new Date('2024-12-21T06:00:00.000Z').getTime(),
          duration: 300,
          sleepLatency: 20,
          efficiency: 70,
          quality: 50,
          phases: [],
        },
      ];

      expect(calculateSleepDebt(sessions, 480, 7)).toBe(60);
      vi.useRealTimers();
    });
  });
});
