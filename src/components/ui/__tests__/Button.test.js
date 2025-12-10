/**
 * Tests for Button component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with children text', () => {
      render(<Button>Click Me</Button>);
      
      expect(screen.getByRole('button')).toHaveTextContent('Click Me');
    });

    it('should render as a button element', () => {
      render(<Button>Test</Button>);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should apply default variant styles', () => {
      render(<Button>Default</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-fitness-orange');
    });

    it('should apply default size styles', () => {
      render(<Button>Default</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4', 'py-2');
    });
  });

  describe('Variants', () => {
    it('should apply destructive variant styles', () => {
      render(<Button variant="destructive">Delete</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('should apply outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-input');
    });

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
    });

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent');
    });

    it('should apply link variant styles', () => {
      render(<Button variant="link">Link</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary', 'underline-offset-4');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'px-3');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-11', 'px-8');
    });

    it('should apply icon size styles', () => {
      render(<Button size="icon">+</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Interactions', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply disabled styles when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Custom className', () => {
    it('should merge custom className with default classes', () => {
      render(<Button className="custom-class">Custom</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('inline-flex'); // Default class should still be present
    });
  });

  describe('Forwarded Props', () => {
    it('should forward type prop to button element', () => {
      render(<Button type="submit">Submit</Button>);
      
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should forward data attributes', () => {
      render(<Button data-testid="custom-button">Test</Button>);
      
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('should forward aria attributes', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<Button>Focusable</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('should have focus-visible styles', () => {
      render(<Button>Focus</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:pointer-events-none');
    });
  });
});

describe('buttonVariants', () => {
  it('should be exported for use in other components', async () => {
    const { buttonVariants } = await import('../Button');
    expect(buttonVariants).toBeDefined();
    expect(typeof buttonVariants).toBe('function');
  });
});
