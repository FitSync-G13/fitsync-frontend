/**
 * Tests for authService - authentication API calls
 */

import { authService } from '../authService';
import api from '../api';

// Mock the api module
jest.mock('../api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem.mockClear();
    localStorage.clear.mockClear();
  });

  describe('login', () => {
    it('should call api.post with correct endpoint and credentials', async () => {
      api.post.mockResolvedValue({
        success: true,
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          tokens: { access_token: 'access-123', refresh_token: 'refresh-456' },
        },
      });

      await authService.login('test@example.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should store tokens in localStorage on success', async () => {
      api.post.mockResolvedValue({
        success: true,
        data: {
          user: { id: 'user-1' },
          tokens: { access_token: 'access-123', refresh_token: 'refresh-456' },
        },
      });

      await authService.login('test@example.com', 'password');

      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'access-123');
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'refresh-456');
    });

    it('should return user data on success', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', role: 'client' };
      api.post.mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          tokens: { access_token: 'token', refresh_token: 'refresh' },
        },
      });

      const result = await authService.login('test@example.com', 'password');

      expect(result).toEqual(mockUser);
    });

    it('should throw error when success is false', async () => {
      api.post.mockResolvedValue({
        success: false,
        error: { message: 'Invalid credentials' },
      });

      await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow('Login failed');
    });

    it('should propagate API errors', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      await expect(authService.login('test@example.com', 'password')).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should call api.post with correct endpoint and user data', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        role: 'client',
      };

      api.post.mockResolvedValue({
        success: true,
        data: {
          user: { id: 'new-user', ...userData },
          tokens: { access_token: 'token', refresh_token: 'refresh' },
        },
      });

      await authService.register(userData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
    });

    it('should store tokens in localStorage on success', async () => {
      api.post.mockResolvedValue({
        success: true,
        data: {
          user: { id: 'new-user' },
          tokens: { access_token: 'new-access', refresh_token: 'new-refresh' },
        },
      });

      await authService.register({ email: 'new@example.com', password: 'pass' });

      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'new-access');
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'new-refresh');
    });

    it('should return user data on success', async () => {
      const mockUser = { id: 'new-user', email: 'new@example.com', role: 'client' };
      api.post.mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          tokens: { access_token: 'token', refresh_token: 'refresh' },
        },
      });

      const result = await authService.register({ email: 'new@example.com', password: 'pass' });

      expect(result).toEqual(mockUser);
    });

    it('should throw error when success is false', async () => {
      api.post.mockResolvedValue({
        success: false,
        error: { message: 'Email already exists' },
      });

      await expect(authService.register({ email: 'existing@example.com' })).rejects.toThrow(
        'Registration failed'
      );
    });
  });

  describe('getMe', () => {
    it('should call api.get with correct endpoint', async () => {
      api.get.mockResolvedValue({
        data: { id: 'user-1', email: 'test@example.com' },
      });

      await authService.getMe();

      expect(api.get).toHaveBeenCalledWith('/users/me');
    });

    it('should return user data', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com', role: 'trainer' };
      api.get.mockResolvedValue({ data: mockUser });

      const result = await authService.getMe();

      expect(result).toEqual(mockUser);
    });

    it('should propagate API errors', async () => {
      api.get.mockRejectedValue(new Error('Unauthorized'));

      await expect(authService.getMe()).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('should call api.post with logout endpoint', async () => {
      api.post.mockResolvedValue({});

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should clear localStorage even on successful logout', async () => {
      api.post.mockResolvedValue({});

      await authService.logout();

      expect(localStorage.clear).toHaveBeenCalled();
    });

    it('should clear localStorage even when logout API fails', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      await authService.logout();

      expect(localStorage.clear).toHaveBeenCalled();
    });

    it('should not throw error when logout API fails', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      await expect(authService.logout()).resolves.not.toThrow();
    });
  });
});

describe('authService structure', () => {
  it('should export all required methods', () => {
    expect(authService).toHaveProperty('login');
    expect(authService).toHaveProperty('register');
    expect(authService).toHaveProperty('getMe');
    expect(authService).toHaveProperty('logout');
  });

  it('should have methods as async functions', () => {
    expect(authService.login.constructor.name).toBe('AsyncFunction');
    expect(authService.register.constructor.name).toBe('AsyncFunction');
    expect(authService.getMe.constructor.name).toBe('AsyncFunction');
    expect(authService.logout.constructor.name).toBe('AsyncFunction');
  });
});
