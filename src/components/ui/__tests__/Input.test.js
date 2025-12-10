/**
 * Tests for Input component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render an input element', () => {
      render(<Input />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render without explicit type attribute (defaults to text)', () => {
      render(<Input />);
      
      // Input without type attribute defaults to text behavior
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with custom type', () => {
      render(<Input type="email" />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should render password type', () => {
      render(<Input type="password" data-testid="password-input" />);
      
      expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
    });

    it('should apply default styles', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md');
    });
  });

  describe('Props Handling', () => {
    it('should accept and display placeholder', () => {
      render(<Input placeholder="Enter your email" />);
      
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('should accept and use value prop', () => {
      render(<Input value="test value" onChange={() => {}} />);
      
      expect(screen.getByRole('textbox')).toHaveValue('test value');
    });

    it('should accept name prop', () => {
      render(<Input name="email" />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
    });

    it('should accept id prop', () => {
      render(<Input id="email-input" />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email-input');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef();
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Interactions', () => {
    it('should handle onChange events', async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      await userEvent.type(screen.getByRole('textbox'), 'hello');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should update value on user input', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      
      render(<TestComponent />);
      
      await userEvent.type(screen.getByRole('textbox'), 'test');
      
      expect(screen.getByRole('textbox')).toHaveValue('test');
    });

    it('should handle onFocus events', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      
      fireEvent.focus(screen.getByRole('textbox'));
      
      expect(handleFocus).toHaveBeenCalled();
    });

    it('should handle onBlur events', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      
      fireEvent.blur(screen.getByRole('textbox'));
      
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Input disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('should not accept input when disabled', async () => {
      render(<Input disabled value="" onChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test');
      
      expect(input).toHaveValue('');
    });
  });

  describe('Custom className', () => {
    it('should merge custom className with default classes', () => {
      render(<Input className="custom-input-class" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input-class');
      expect(input).toHaveClass('flex'); // Default class should still be present
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      
      expect(input).toHaveFocus();
    });

    it('should have focus-visible styles', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Email address" />);
      
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(
        <>
          <Input aria-describedby="email-help" />
          <span id="email-help">Enter a valid email</span>
        </>
      );
      
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'email-help');
    });

    it('should support required attribute', () => {
      render(<Input required />);
      
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('File Input', () => {
    it('should render file input with correct type', () => {
      render(<Input type="file" data-testid="file-input" />);
      
      expect(screen.getByTestId('file-input')).toHaveAttribute('type', 'file');
    });

    it('should have file-specific styles', () => {
      render(<Input type="file" data-testid="file-input" />);
      
      const input = screen.getByTestId('file-input');
      expect(input).toHaveClass('file:border-0', 'file:bg-transparent');
    });
  });
});
