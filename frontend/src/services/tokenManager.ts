/**
 * Token Manager Service
 * 
 * Centralized token management for Alpha Asimov API
 * Features:
 * - Get/Set tokens (config file + localStorage)
 * - Check expiry
 * - Auto refresh (when refresh token available)
 * - Sync between storage and config
 */

import { AUTH_CONFIG, STORAGE_KEYS } from '../config/auth.config';
import axios from 'axios';

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user?: string;
  role?: string;
}

class TokenManager {
  private static instance: TokenManager;

  private constructor() {
    // Initialize tokens from localStorage or config on startup
    this.syncTokens();
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Sync tokens: localStorage → Config file
   * Priority: localStorage > Config file
   */
  private syncTokens(): void {
    const storedAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    // If localStorage is empty, populate from config
    if (!storedAccessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, AUTH_CONFIG.ACCESS_TOKEN);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, AUTH_CONFIG.REFRESH_TOKEN);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, AUTH_CONFIG.TOKEN_INFO.expiresAt.toString());
    }
  }

  /**
   * Get current access token
   * Priority: localStorage > Config file
   */
  public getAccessToken(): string {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || AUTH_CONFIG.ACCESS_TOKEN;
  }

  /**
   * Get current refresh token
   */
  public getRefreshToken(): string {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || AUTH_CONFIG.REFRESH_TOKEN;
  }

  /**
   * Get token expiry time (Unix timestamp)
   */
  public getTokenExpiry(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    return stored ? parseInt(stored, 10) : AUTH_CONFIG.TOKEN_INFO.expiresAt;
  }

  /**
   * Set new tokens
   */
  public setTokens(accessToken: string, refreshToken: string, expiresAt: number): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString());
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  public isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiry();
    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 5 * 60; // 5 minutes buffer
    
    return now >= (expiresAt - bufferTime);
  }

  /**
   * Get time until token expires (in seconds)
   */
  public getTimeUntilExpiry(): number {
    const expiresAt = this.getTokenExpiry();
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, expiresAt - now);
  }

  /**
   * Get token info for display
   */
  public getTokenInfo(): TokenInfo {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      expiresAt: this.getTokenExpiry(),
      user: AUTH_CONFIG.TOKEN_INFO.user,
      role: AUTH_CONFIG.TOKEN_INFO.role
    };
  }

  /**
   * Refresh access token using refresh token
   * @returns New access token or null if failed
   */
  public async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        console.error('[TokenManager] No refresh token available');
        return null;
      }

      console.log('[TokenManager] Refreshing access token...');

      const response = await axios.post(
        `${AUTH_CONFIG.AUTH_BASE_URL}/connect/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: AUTH_CONFIG.CLIENT_ID
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;

      if (access_token) {
        // Calculate expiry time
        const expiresAt = Math.floor(Date.now() / 1000) + expires_in;
        
        // Save new tokens
        this.setTokens(access_token, refresh_token || refreshToken, expiresAt);
        
        console.log('[TokenManager] ✅ Token refreshed successfully');
        console.log(`[TokenManager] New expiry: ${new Date(expiresAt * 1000).toLocaleString()}`);
        
        return access_token;
      }

      return null;
    } catch (error) {
      console.error('[TokenManager] ❌ Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Get valid access token (auto refresh if expired)
   */
  public async getValidAccessToken(): Promise<string | null> {
    if (this.isTokenExpired()) {
      console.log('[TokenManager] Token expired, attempting to refresh...');
      return await this.refreshAccessToken();
    }
    return this.getAccessToken();
  }

  /**
   * Clear all tokens (logout)
   */
  public clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  }

  /**
   * Format time remaining in human-readable format
   */
  public getFormattedTimeRemaining(): string {
    const seconds = this.getTimeUntilExpiry();
    
    if (seconds <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export class for testing
export default TokenManager;
