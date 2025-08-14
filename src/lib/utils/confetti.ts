export async function fireConfettiBurst() {
  try {
    const mod = await import('canvas-confetti');
    const confetti = mod.default;
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  } catch {
    // no-op if dependency not installed yet
  }
}

