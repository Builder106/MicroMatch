import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import EmptyState from '$lib/components/EmptyState.svelte';

describe('EmptyState', () => {
  it('renders default copy when no props are provided', () => {
    const { getByRole, getByText } = render(EmptyState, {});
    expect(getByRole('heading', { level: 3 })).toHaveTextContent('Nothing here yet');
    expect(getByText('Check back later or adjust your filters.')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    const { getByRole, getByText } = render(EmptyState, {
      title: 'No tasks found',
      description: 'Try a different keyword or clear filters.'
    });
    expect(getByRole('heading', { level: 3 })).toHaveTextContent('No tasks found');
    expect(getByText('Try a different keyword or clear filters.')).toBeInTheDocument();
  });

  it('does not render a CTA button when ctaText/ctaHref are omitted', () => {
    const { container } = render(EmptyState, { title: 'No tasks' });
    expect(container.querySelector('a, button[href]')).toBeNull();
  });

  it('renders the CTA when both ctaText and ctaHref are provided', () => {
    const { getByText } = render(EmptyState, {
      title: 'No tasks',
      ctaText: 'Browse all tasks',
      ctaHref: '/tasks'
    });
    expect(getByText('Browse all tasks')).toBeInTheDocument();
  });

  it('does not render the CTA when only ctaText is provided', () => {
    const { queryByText } = render(EmptyState, {
      title: 'No tasks',
      ctaText: 'Browse all tasks'
      // ctaHref intentionally omitted
    });
    expect(queryByText('Browse all tasks')).toBeNull();
  });
});
