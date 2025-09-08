
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SelectObject from '../index';

describe('SelectObject', () => {
  it('renders the select object with options', () => {
    const options = [
      { id: 1, short_name: 'Option 1' },
      { id: 2, short_name: 'Option 2' },
    ];
    const onSelect = vi.fn();

    render(<SelectObject options={options} onSelect={onSelect} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    const option1 = screen.getByText('Option 1');
    expect(option1).toBeInTheDocument();

    const option2 = screen.getByText('Option 2');
    expect(option2).toBeInTheDocument();
  });
});
