import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TaskListItem from '$lib/components/TaskListItem.svelte';

describe('TaskListItem', () => {
  it('renders title, subtitle, and time', () => {
    render(TaskListItem, { title: 'Jane Doe', subtitle: 'Submitted a proof', time: '2h' });
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Submitted a proof')).toBeInTheDocument();
    expect(screen.getByText('2h')).toBeInTheDocument();
  });

  it('links to the given href', () => {
    render(TaskListItem, { title: 'T', href: '/task/123' });
    expect(screen.getByRole('link')).toHaveAttribute('href', '/task/123');
  });

  it('shows the unread badge only when unread > 0', () => {
    render(TaskListItem, { title: 'T', unread: 3 });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides the unread badge when unread is 0', () => {
    render(TaskListItem, { title: 'T', unread: 0 });
    expect(screen.queryByText('0')).toBeNull();
  });
});
