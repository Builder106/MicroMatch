import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ThemeToggle from '$lib/components/ThemeToggle.svelte';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('applies the saved theme from localStorage on mount', async () => {
    localStorage.setItem('theme', 'dark');
    render(ThemeToggle, {});

    await vi.waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('falls back to the OS preference when nothing is saved', async () => {
    const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
    vi.stubGlobal('matchMedia', matchMediaMock);

    render(ThemeToggle, {});

    await vi.waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    vi.unstubAllGlobals();
  });

  it('toggles the theme when clicked and persists to localStorage', async () => {
    localStorage.setItem('theme', 'light');
    render(ThemeToggle, {});

    const button = await screen.findByRole('button', { name: /Toggle color theme/i });
    await vi.waitFor(() => expect(screen.getByText('Dark')).toBeInTheDocument());

    await fireEvent.click(button);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('renders icon-only (no label) in compact mode', async () => {
    localStorage.setItem('theme', 'light');
    render(ThemeToggle, { compact: true });

    await vi.waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
    expect(screen.queryByText('Dark')).toBeNull();
    expect(screen.queryByText('Light')).toBeNull();
  });
});
