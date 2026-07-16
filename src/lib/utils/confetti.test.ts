import { describe, it, expect, vi, beforeEach } from 'vitest';

const confettiMock = vi.hoisted(() => vi.fn());
vi.mock('canvas-confetti', () => ({ default: confettiMock }));

import { fireConfettiBurst } from './confetti';

describe('fireConfettiBurst', () => {
  beforeEach(() => {
    confettiMock.mockReset();
  });

  it('calls the confetti library with a burst configuration', async () => {
    await fireConfettiBurst();
    expect(confettiMock).toHaveBeenCalledWith(
      expect.objectContaining({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
    );
  });

  it('does not throw if the confetti dependency is unavailable', async () => {
    confettiMock.mockImplementation(() => { throw new Error('module not installed'); });
    await expect(fireConfettiBurst()).resolves.toBeUndefined();
  });
});
