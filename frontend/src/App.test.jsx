import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import App from './App.jsx';

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ formatted_result: '4', result: 4, interpreted_expression: '2+2' }) }));
});

describe('Calculator UI', () => {
  it('renders the calculator shell and mode controls', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /AI Scientific Calculator/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/AI scientific calculator/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /scientific/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Calculator keypad/i)).toBeInTheDocument();
  });

  it('shows scientific panel after mode toggle', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: /scientific/i }));
    expect(screen.getByLabelText(/Scientific functions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sqrt(' })).toBeInTheDocument();
  });

  it('shows AI assist panel and handles missing prompt', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: /ai-assist/i }));
    expect(screen.getByLabelText(/AI assist panel/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Interpret with Claude/i }));
    await waitFor(() => expect(screen.getByText(/Type a prompt first/i)).toBeInTheDocument());
  });

  it('supports keyboard entry, evaluation, and history recall', async () => {
    render(<App />);
    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: '+' });
    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument());
    const historyItem = screen.getByRole('button', { name: /2\+2 = 4/i });
    await userEvent.click(historyItem);
    expect(screen.getByText('2+2')).toBeInTheDocument();
  });

  it('clears with Escape and deletes with Backspace', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: '7' });
    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    fireEvent.keyDown(window, { key: '8' });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('renders API errors from failed calculation', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, json: async () => ({ detail: { code: 'DIVIDE_BY_ZERO', message: 'Singularity detected' } }) }));
    render(<App />);
    fireEvent.keyDown(window, { key: '1' });
    fireEvent.keyDown(window, { key: '/' });
    fireEvent.keyDown(window, { key: '0' });
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => expect(screen.getByText(/Singularity detected/i)).toBeInTheDocument());
  });
});
