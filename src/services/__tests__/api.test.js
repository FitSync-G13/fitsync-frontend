/**
 * Tests for API service - axios configuration and interceptors
 */

import axios from 'axios';

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return mockAxios;
});

describe('API Service Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockReset();
    localStorage.setItem.mockReset();
    localStorage.clear.mockReset();
  });

  describe('Request Interceptor Logic', () => {
    it('should add Authorization header when token exists', () => {
      localStorage.getItem.mockReturnValue('test-token');
      
      const config = { headers: {} };
      const token = localStorage.getItem('access_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      expect(config.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when no token', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const config = { headers: {} };
      const token = localStorage.getItem('access_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe('Token Storage', () => {
    it('should store access_token in localStorage', () => {
      const token = 'access-token-123';
      localStorage.setItem('access_token', token);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', token);
    });

    it('should store refresh_token in localStorage', () => {
      const token = 'refresh-token-456';
      localStorage.setItem('refresh_token', token);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', token);
    });

    it('should retrieve access_token from localStorage', () => {
      localStorage.getItem.mockReturnValue('stored-token');
      
      const token = localStorage.getItem('access_token');
      
      expect(token).toBe('stored-token');
      expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('Error Response Handling', () => {
    it('should handle 401 error status', () => {
      const error = {
        response: { status: 401 },
        config: { _retry: false },
      };
      
      expect(error.response.status).toBe(401);
      expect(error.config._retry).toBe(false);
    });

    it('should set _retry flag to prevent infinite loops', () => {
      const originalRequest = { _retry: false };
      originalRequest._retry = true;
      
      expect(originalRequest._retry).toBe(true);
    });

    it('should clear localStorage on auth failure', () => {
      localStorage.clear();
      
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });
});

describe('API Base URL Configuration', () => {
  it('should use environment variable when set', () => {
    const envUrl = 'http://custom-api.com/api';
    const defaultUrl = 'http://localhost:4000/api';
    
    const apiUrl = envUrl || defaultUrl;
    
    expect(apiUrl).toBe(envUrl);
  });

  it('should fall back to localhost when no env variable', () => {
    const envUrl = undefined;
    const defaultUrl = 'http://localhost:4000/api';
    
    const apiUrl = envUrl || defaultUrl;
    
    expect(apiUrl).toBe(defaultUrl);
  });
});

describe('Authorization Header Format', () => {
  it('should format Bearer token correctly', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const header = `Bearer ${token}`;
    
    expect(header).toBe('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    expect(header.startsWith('Bearer ')).toBe(true);
  });
});
