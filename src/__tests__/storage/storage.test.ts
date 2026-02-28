import { vi, beforeEach, describe, expect, it } from 'vitest';
import { saveBestScore, loadBestScore } from '../../storage/storage';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => {
    return localStorageMock.store[key] || null;
  }),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value.toString();
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Storage functions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveBestScore', () => {
    it('should save score to localStorage', () => {
      const score = 1000;
      saveBestScore(score);

      expect(localStorage.setItem).toHaveBeenCalledWith('2048-best-score', score.toString());
    });
  });

  describe('loadBestScore', () => {
    it('should return saved score when it exists', () => {
      const savedScore = 1500;
      localStorageMock.store['2048-best-score'] = savedScore.toString();

      const loadedScore = loadBestScore();

      expect(loadedScore).toBe(savedScore);
    });

    it('should return 0 when no score is saved', () => {
      const loadedScore = loadBestScore();

      expect(loadedScore).toBe(0);
    });

    it('should handle valid numeric string from localStorage', () => {
      const savedScore = 2048;
      localStorageMock.store['2048-best-score'] = savedScore.toString();

      const loadedScore = loadBestScore();

      expect(loadedScore).toBe(savedScore);
    });
  });
});