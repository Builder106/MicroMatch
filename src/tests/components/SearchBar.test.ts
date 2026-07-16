import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import SearchBar from '$lib/components/SearchBar.svelte';

describe('SearchBar', () => {
  it('renders the placeholder with the "tasks, tags, or skills..." suffix', () => {
    render(SearchBar, { placeholder: 'Search', onInput: undefined });
    expect(screen.getByPlaceholderText('Search tasks, tags, or skills...')).toBeInTheDocument();
  });

  it('reflects the given value', () => {
    render(SearchBar, { value: 'health', onInput: undefined });
    expect(screen.getByRole('textbox')).toHaveValue('health');
  });

  it('calls onInput with the new value when typed into', async () => {
    const onInput = vi.fn();
    render(SearchBar, { onInput });

    const input = screen.getByRole('textbox');
    await fireEvent.input(input, { target: { value: 'translate' } });

    expect(onInput).toHaveBeenCalledWith('translate');
  });
});
