import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('App scaffold', () => {
  it('renders the calculator shell', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /AI Scientific Calculator/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/AI scientific calculator/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /scientific/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Calculator keypad/i)).toBeInTheDocument();
  });
});
