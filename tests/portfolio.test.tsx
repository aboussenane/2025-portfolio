import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Home from '../app/page';

vi.mock('@/components/ui/FixedText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('recharts', () => ({
  ResponsiveContainer: () => null, LineChart: () => null, XAxis: () => null,
  YAxis: () => null, Tooltip: () => null, Line: () => null,
}));
vi.mock('@octokit/rest', () => ({ Octokit: class { repos = { listForUser: vi.fn().mockResolvedValue({ data: [] }) }; } }));

test('introduces AI implementation and full-stack delivery while retaining personal work', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /AI implementation and full-stack developer/i })).toBeInTheDocument();
  expect(screen.getByText(/discovery and architecture through integrations/)).toBeInTheDocument();
  for (const title of ['I H8 PDFs', 'Regulator', 'Feeds', 'IOA Digital', 'BKL Consultants', 'Kiuloper', 'Ubineer']) {
    expect(screen.getByRole('button', { name: new RegExp(title) })).toBeInTheDocument();
  }
});
