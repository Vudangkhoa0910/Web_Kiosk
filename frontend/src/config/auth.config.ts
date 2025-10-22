/**
 * OAuth 2.0 Configuration
 * Cấu hình để connect với Alpha Asimov Backend API
 */

export const authConfig = {
  // Auth Server URL - nơi xác thực user
  authority: 'https://auth.alphaasimov.com/',
  
  // Client ID được cấp bởi admin của API
  // TODO: Thay bằng Client ID thực tế được cấp cho bạn
  client_id: 'Web_Kiosk_Client',
  
  // Redirect URI sau khi đăng nhập thành công
  redirect_uri: window.location.origin + '/auth/callback',
  
  // Silent renew để tự động refresh token
  silent_redirect_uri: window.location.origin + '/auth/silent-callback',
  
  // Redirect sau khi logout
  post_logout_redirect_uri: window.location.origin,
  
  // Response type - authorization code flow
  response_type: 'code',
  
  // Scopes - quyền truy cập API
  scope: 'openid profile email offline_access BackOffice',
  
  // Tự động refresh token trước khi hết hạn
  automaticSilentRenew: true,
  
  // Load user info sau khi đăng nhập
  loadUserInfo: true,
  
  // Validate HTTPS
  strictDiscoveryDocumentValidation: false,
};

/**
 * API Configuration
 */
export const apiConfig = {
  // Backend API URL
  baseURL: 'https://api.alphaasimov.com',
  
  // Timeout
  timeout: 30000,
  
  // Headers mặc định
  headers: {
    'Content-Type': 'application/json',
  },
};
