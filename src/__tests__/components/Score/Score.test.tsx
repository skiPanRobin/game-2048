import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Score } from '../../../components/Score/Score';

describe('Score', () => {
  it('displays current score', () => {
    render(<Score score={100} bestScore={500} />);
    expect(screen.getByText('100')).toBeDefined();
  });

  it('displays best score', () => {
    render(<Score score={100} bestScore={500} />);
    expect(screen.getByText('500')).toBeDefined();
  });

  it('displays Score label', () => {
    render(<Score score={0} bestScore={0} />);
    expect(screen.getByText('Score')).toBeDefined();
  });

  it('displays Best label', () => {
    render(<Score score={0} bestScore={0} />);
    expect(screen.getByText('Best')).toBeDefined();
  });

  it('displays zero scores', () => {
    render(<Score score={0} bestScore={0} />);
    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  it('displays large scores', () => {
    render(<Score score={99999} bestScore={100000} />);
    expect(screen.getByText('99999')).toBeDefined();
    expect(screen.getByText('100000')).toBeDefined();
  });
});
