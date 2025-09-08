
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SelectObject from './index';

describe('SelectObject', () => {
  const options = [
    { id: 1, short_name: 'Option 1' },
    { id: 2, short_name: 'Option 2' },
  ];
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('renders the select object with options', () => {
    render(<SelectObject options={options} onSelect={onSelect} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    const option1 = screen.getByText('Option 1');
    expect(option1).toBeInTheDocument();

    const option2 = screen.getByText('Option 2');
    expect(option2).toBeInTheDocument();
  });

  it('calls onSelect with the correct value when an option is selected', () => {
    render(<SelectObject options={options} onSelect={onSelect} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '2' } });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
