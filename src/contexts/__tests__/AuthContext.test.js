/**
 * Tests for AuthContext - authentication state management
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/authService';

// Mock the authService
jest.mock('../../services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getMe: jest.fn(),
  },
}));

// Test component to access auth context
const TestComponent = () => {
  const { user, loading, error, isAuthenticated, login, logout, register } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="error">{error || 'null'}</div>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
      <button
        onClick={() => register({ email: 'new@example.com', password: 'password', name: 'New User' })}
        data-testid="register-btn"
      >
        Register
      </button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear.mockClear();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  });

  describe('Initial State', () => {
    it('should complete loading check for stored token', async () => {
      localStorage.getItem.mockReturnValue(null);
      
      renderWithAuthProvider();
      
      // After checking token, loading should be false
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
    });

    it('should set user to null when no token exists', async () => {
      localStorage.getItem.mockReturnValue(null);
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });

    it('should load user when valid token exists', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', role: 'client' };
      localStorage.getItem.mockReturnValue('valid-token');
      authService.getMe.mockResolvedValue(mockUser);
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
      expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    });

    it('should clear storage and set user to null on invalid token', async () => {
      localStorage.getItem.mockReturnValue('invalid-token');
      authService.getMe.mockRejectedValue(new Error('Unauthorized'));
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      expect(localStorage.clear).toHaveBeenCalled();
      expect(screen.getByTestId('user').textContent).toBe('null');
    });
  });

  describe('Login', () => {
    it('should set user on successful login', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', role: 'client' };
      localStorage.getItem.mockReturnValue(null);
      authService.login.mockResolvedValue(mockUser);
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('true');
      });
      
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('should set error on failed login', async () => {
      localStorage.getItem.mockReturnValue(null);
      authService.login.mockRejectedValue({
        response: { data: { error: { message: 'Invalid credentials' } } }
      });
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Invalid credentials');
      });
      
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });

    it('should use default error message when no specific error provided', async () => {
      localStorage.getItem.mockReturnValue(null);
      authService.login.mockRejectedValue(new Error('Network error'));
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Login failed');
      });
    });
  });

  describe('Logout', () => {
    it('should clear user on logout', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      localStorage.getItem.mockReturnValue('valid-token');
      authService.getMe.mockResolvedValue(mockUser);
      authService.logout.mockResolvedValue();
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('true');
      });
      
      await act(async () => {
        screen.getByTestId('logout-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(screen.getByTestId('authenticated').textContent).toBe('false');
      });
    });

    it('should clear error on logout', async () => {
      localStorage.getItem.mockReturnValue(null);
      authService.login.mockRejectedValue({
        response: { data: { error: { message: 'Login error' } } }
      });
      authService.logout.mockResolvedValue();
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      // First login to create an error
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Login error');
      });
      
      // Then logout to clear error
      await act(async () => {
        screen.getByTestId('logout-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('null');
      });
    });
  });

  describe('Register', () => {
    it('should set user on successful registration', async () => {
      const mockUser = { id: 'new-user', email: 'new@example.com', role: 'client' };
      localStorage.getItem.mockReturnValue(null);
      authService.register.mockResolvedValue(mockUser);
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      await act(async () => {
        screen.getByTestId('register-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('true');
      });
      
      expect(authService.register).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password',
        name: 'New User'
      });
    });

    it('should set error on failed registration', async () => {
      localStorage.getItem.mockReturnValue(null);
      authService.register.mockRejectedValue({
        response: { data: { error: { message: 'Email already exists' } } }
      });
      
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      
      await act(async () => {
        screen.getByTestId('register-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Email already exists');
      });
    });
  });

  describe('useAuth Hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const TestOutsideProvider = () => {
        useAuth();
        return null;
      };
      
      expect(() => render(<TestOutsideProvider />)).toThrow(
        'useAuth must be used within an AuthProvider'
      );
      
      consoleSpy.mockRestore();
    });
  });
});

describe('AuthContext Value Shape', () => {
  it('should provide all expected values and functions', async () => {
    localStorage.getItem.mockReturnValue(null);
    
    let authValue;
    const CaptureContext = () => {
      authValue = useAuth();
      return null;
    };
    
    render(
      <AuthProvider>
        <CaptureContext />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(authValue.loading).toBe(false);
    });
    
    expect(authValue).toHaveProperty('user');
    expect(authValue).toHaveProperty('loading');
    expect(authValue).toHaveProperty('error');
    expect(authValue).toHaveProperty('login');
    expect(authValue).toHaveProperty('register');
    expect(authValue).toHaveProperty('logout');
    expect(authValue).toHaveProperty('isAuthenticated');
    
    expect(typeof authValue.login).toBe('function');
    expect(typeof authValue.register).toBe('function');
    expect(typeof authValue.logout).toBe('function');
  });
});
