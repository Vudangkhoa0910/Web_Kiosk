/**
 * Authentication Service
 * Quản lý OAuth flow, login, logout, token
 */

import { UserManager, User, WebStorageStateStore } from 'oidc-client-ts';
import { authConfig } from '../config/auth.config';

class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  constructor() {
    // Khởi tạo User Manager với config
    this.userManager = new UserManager({
      ...authConfig,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });

    // Listen cho token expired event
    this.userManager.events.addAccessTokenExpired(() => {
      console.log('Token expired, logging out...');
      this.logout();
    });

    // Listen cho silent renew error
    this.userManager.events.addSilentRenewError((error: Error) => {
      console.error('Silent renew error:', error);
    });

    // Load user từ storage khi khởi động
    this.loadUser();
  }

  /**
   * Đăng nhập - redirect đến Auth Server
   */
  async login(): Promise<void> {
    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Xử lý callback sau khi đăng nhập
   * Gọi trong trang /auth/callback
   */
  async handleCallback(): Promise<User> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      this.user = user;
      return user;
    } catch (error) {
      console.error('Callback error:', error);
      throw error;
    }
  }

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    try {
      await this.userManager.signoutRedirect();
      this.user = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Lấy access token
   */
  async getAccessToken(): Promise<string | null> {
    const user = await this.getUser();
    return user?.access_token || null;
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getUser(): Promise<User | null> {
    if (!this.user) {
      this.user = await this.userManager.getUser();
    }
    return this.user;
  }

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null && !user.expired;
  }

  /**
   * Load user từ storage
   */
  private async loadUser(): Promise<void> {
    this.user = await this.userManager.getUser();
  }

  /**
   * Silent renew - tự động refresh token
   */
  async renewToken(): Promise<User | null> {
    try {
      const user = await this.userManager.signinSilent();
      this.user = user;
      return user;
    } catch (error) {
      console.error('Token renew error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
