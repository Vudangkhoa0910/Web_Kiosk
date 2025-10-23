/**
 * 🔐 Authentication & Token Configuration
 * 
 * ===========================================
 * 📝 CÁCH CẬP NHẬT TOKEN (Dành cho Tester/Developer)
 * ===========================================
 * 
 * Khi token hết hạn, chỉ cần:
 * 1. Copy token mới vào AUTH_CONFIG.ACCESS_TOKEN và REFRESH_TOKEN
 * 2. Update AUTH_CONFIG.TOKEN_INFO.updatedAt và expiresAt
 * 3. Save file → Auto reload
 * 
 * Hoặc dùng UI: http://localhost:5173/token-update
 * 
 * ===========================================
 * 🚀 PRODUCTION DEPLOYMENT
 * ===========================================
 * 
 * Tạo file .env.local với:
 * VITE_ACCESS_TOKEN=your_token_here
 * VITE_REFRESH_TOKEN=your_refresh_token_here
 * 
 * Token trong .env.local sẽ override token dưới đây
 */

export const AUTH_CONFIG = {
  // API Endpoints
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.alphaasimov.com',
  AUTH_BASE_URL: import.meta.env.VITE_AUTH_BASE_URL || 'https://auth.alphaasimov.com',
  
  // OAuth Client
  CLIENT_ID: 'BackOffice_App',
  
  // ============================================
  // 🔑 ACCESS TOKEN - Update khi hết hạn (Mỗi ~2 giờ)
  // ============================================
  ACCESS_TOKEN: import.meta.env.VITE_ACCESS_TOKEN || 
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1NjZFOEEzNDA2RTU1MkIxRDIxMkIwQzI3OURENjZEMDQ2MkY4OTMiLCJ4NXQiOiJKV2JvbzBCdVZTc2RJU3NNSjUzV2JRUmktSk0iLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiIyNGQ2N2RmYS1kNTRiLTQ2ZWUtOTU3NC05MDlhNDFmYWRkODciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJraG9hZGFuZzA5MTAyMDA0IiwiZW1haWwiOiJraG9hZGFuZzA5MTAyMDA0QGdtYWlsLmNvbSIsInJvbGUiOiJtb2QiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJGYWxzZSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJ1bmlxdWVfbmFtZSI6Imtob2FkYW5nMDkxMDIwMDQiLCJvaV9wcnN0IjoiQmFja09mZmljZV9BcHAiLCJpc3MiOiJodHRwczovL2F1dGguYWxwaGFhc2ltb3YuY29tLyIsIm9pX2F1X2lkIjoiODJmM2U2Y2EtZDFmOC1hMWE1LTAyYTQtM2ExNDhmOTMzMTljIiwiY2xpZW50X2lkIjoiQmFja09mZmljZV9BcHAiLCJvaV90a25faWQiOiJjMjU5YjljOS0xZTQ4LTUyNTktZWM4My0zYTFkMWQ0YzYyNDIiLCJhdWQiOiJCYWNrT2ZmaWNlIiwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MgQmFja09mZmljZSIsImp0aSI6IjE0MzFkNWI0LTJjYjMtNDVkMS1iNWMzLWViOGM3NjVjMDk0MiIsImV4cCI6MTc2MTEzMDQwNywiaWF0IjoxNzYxMTIzMjA3fQ.5xW8it7Fl3LkRiraEC7tHSHvyWt2Kn9zO4hntG1iX9oZCYfZZub1jEowOSCTxk8I4p_W2V_BV6O4sS2_r_8HUi894fIxckV7N95d8Km_fviZDqh7-pfUklPwf3JpuV9ob47sTrbBcQoAFvW219DDtC00_sCy2exyLo88I_tcXdTHN-Kxi5QA23zThNb5XUY3G0QgZrWAdR_oEFZ7UtpAcOCv-S0Yts9U_k3dbL57L1vv17FkxR2iR3hL32Oq0vVk-jkWrMLvXlRtENT_lFcqk_z7Pak6aLG2G7bjfJ4Qe-HLZij9uzVngQJLBI8QFlNAXYMzCVF-nKT3i_ETslbOEg',
  
  // ============================================
  // 🔄 REFRESH TOKEN - Update cùng lúc với Access Token
  // ============================================
  REFRESH_TOKEN: import.meta.env.VITE_REFRESH_TOKEN ||
    'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZDQkMtSFM1MTIiLCJraWQiOiI0QTA5QThGNEUxNjY5QzFDNjY0RkQyNDYxNkI1QzRERjI2RjYxMjYwIiwidHlwIjoib2lfcmVmdCtqd3QiLCJjdHkiOiJKV1QifQ.ZK33Iob83uJil_LQyXAB1VBbunSst8LPAPZPWOVp_im2N0X3axWYdNS4CWsIGFTPiR54lKO2WOfYaZK0YGeAEeoTzoHtgj3RpYjeSGjCTf0jIIBD4hcZPre95hoV0SK_ZrJ3_rcJO7QqCDGNLcrvYwUgnIUptkedXY3IIQsFAerQSDv3VBmYW8dNl8DoLVaeIjcM3dmklluU_nJkdVqCU20pxi4Og0m99PpxP_1FA-JYEIoMnvh6YOKgfE-qYIb6v0Uf_ZWptW-HYvwN7zzxymEumi2mlw5ZSjHvlmRkwauxN8wgo5uaA9Ws9nA39LiWgi36LjrxZ6RA4jkJL__Qzw.A5665XrkZU23p4sANgnwhQ.h4OHzadQtmpwSb1uXTIjlGz4qvIBj7fbZagd1vvhc5WtjzdslMaq0XUmFBUdZdnMWvwIIg3HqJ3deMs9vTE5nbAGqB0gKrsEyWu3D7cY8eaNggewc8YZf6d0NqNEOeTCYEUXO1WPFFmX5OY_WzZCAt91JOKpCjKg1Lj8W_ig4HFf9LLlOdk4GVCYehcpO4wqINFs6muF4Yda07ZFVbUjm1x6Qa95EcyQTz1a1etFFCQLfuqhcoBkl6zUuOO_qd6k4yRUpGNelcHXVE9fNcbTY4SmkXWS2YD9sZYYdPUZvN5yf_U51XPBirA48rEOgyZGSHOd9OWt0Zw_oX0EpwGq1d3PICmw54RIFd6b7J4wtTRvctY5qaqz4zFqsAJeCarboJJL-HV7UEOBndQtEonBoL7KReIR7-vq1m7MOSUWJ3kZoK11tvbf1bKi5-vbna1U4bnpM1qATBR8lYxvHq5NlZ5fvB9uiH792LjZBSFR6S2yCR8iYOxNu2lEkQWm6SapcUr6SG9YsS46xsaXUVVV07T0xWRGqDmudSswVtUxLZGit0__FCzKo4cewPZEf14YkVULrjE9JNOUSGdcDzTvHok65qPoeA9DSI8x3fq1LJFwAnYc8Y8XT6eaWu3QDuQqsusrV1bnlXC4CzJFWkji2rnLgb1FmsMyqnewJOo-Jap9SqVviNftvBX0llNoYVtoMRsXx1NN3bZwJShM3uxZHMnSqgpBO_fNVuTodsdD0oTBwIcI4-eP8gedBurUui9FISVtZsgyx9oaKNo9Oyez5BUyGhKYUXQojyx0qs0r_M9IB05TqWmHAqxXbnilceSav5xqiyqd-n32BA1wb2-XOpiH_j_jZX6iQk_1xnfie_LKi12vrCZRtsKrn5491G-Pyefaf2Q1Wccy3CQ91McZjG_lUdZ61ReRV-Qm2BpP19AGV-N1aomLCpdKRyNFlMDNCWOx2CWuppeqccNYHW1t2Y2Ea88B0s7V1_3YAacTR2D9k8k4JOrZ3WyHmacDmef5np3vx6LBV7DdC4h53bdD-Iif5NkXpDLudGO6zoMQIL58AIcruvH_KwNP9oqGVn6WNOhDIjd9PQGHrsp1oWMTp9bY1ooNj6-auWAHTpLBiosnPwh70AiQ4pmN3jvyx77pf1pvtP7NqZGZAbIYgfhANjZHF8bqkzmAaun9FwKp7vJMlL2oGf7bkxlL1BzTFnZvJ92bGmDr6xyZ2PKmH86b8dFPUS3SO0QLIxaOCwlnT_qvJiNPO0VT6iyTyu6s8ONLJ_sYGkKoyrJuGHnipDk34xfrnn9mtOFvYrmKqUIoOPwtTtbn7-O0INMo5ET_1W4oi5tPcTevfqSQm4e5TQtN4R1R2u0DL0HF_BboORPZB-E34maAIIg1CMwhtkTt0prxQuAlnI4Fni75X90LORy3tYAdE6iY-txh0h77nJoKsQs0n7lDHQs4tTF-Cnwo5LoRW9o5VmCR-yVHEf9Ku0qFwqHZqIlq_-AQke9Yx8Mel_Ldn998L9BmIhmEm1hAQO1X6GzmmFf8o29fpl7qLxlLlqkDh7GR-w1jg37WdI0wUVsuVYi9Kz7slFfAKSD-gKrGgUQ_wyLmIsn6HFYyFjs9tldp_2NqSLl_Mkjbg9Hez0mtFdjUoXpXqtIHtWtiBAssoXvP2oKa-j5iN6Kjunq7lRo7_ir4b71OOaa9QoTV5MHb4TkT6Qjt8ZV5zOi1BW3tfcciCps6Ii9rcnWPBD_I0o0Ypk3dwCLQp0OlH9x1ThtwLm9ghZyAZihBkDwsVzgXHD4WuAek5rMPmEavUfNN7-Y7lGw8-6YlEscOKFHCAxGtItCOarplthbB9yjRWwL-_M3d1dA4AQ7fjyxGrHiM6uTWxJQEbpoqhMV_TNyB1cklli_bQ9iBjhfOsU4lZAym3MtE8Jn2lV4qN8YPmSJnFhqDNTBBP-x5knclQSbRVdK_fE1y3jFaLqhUnDq4u8g0oLpMSFhJkiCki_vXi7PEs8RlcdSGcR7WdbwEERhKPo0aCkjya3baNvl1ebYdi_eNiA3qex5QtF25RdeUF4RTe0uN-BIG2SoELJbeY6Hog9qq52RzdYNuTfc6r7oA2INmmMKAENNxX8vXtV2KWCgIGOn4A66onpo2pdK2CoenyvlpQ9ZwQilD1BoO4_pixrl-GkjTZmMEFtt-6SHDBcy2hPShd2mH4qho-K2r7iM5c1Yx_SO2aFgZv-ljRqBUy4cPwkaG34WMQRpmQO2x4-SXKt6bgcXGuraYglYEimgNFjHKGcuARHol66ySnF0Xqd7qbvux5urWcD4cu16Dx9KtXhggisjoiIuCdptDE3s6bb5hqdZUVrAegmhs7EgvyYoEgiG3H1NOew2juWiaRxAWnl3pF3T40NqoaSShQ-IZV3TFncN9YwHkEvz8Cx0lUZQJQaeDNZDvwQfvo1bQrPTbOVgJCwwzUeC_IG7mWrip7--sfTdfFFv-xNpCJnsdefN8DSGmdkKE8JiL4wfsYQlZaG2l2Ew86U5DBvN46Y6W4y3YJWQM1QmKgllGfDMrooZInGMQMruT9zkMHpX4iAYOr864XXC9Cy66aQshgoMqtokpsAawSunl5La5Ld6rwfraBB5yHKzD4e0McvmHLGVQkKQGZnViTu2kuc2jLLhrey11Oa8EBnRPKIgXnFDBRZoyirnZ8gLgoy3LWvIEWM2-eA60uQ5swLLXgzQFdo6InIaNLEeHsrPyJfTxH3XMoZr82gp8ayAkummJnkd_HSzC-a50WTu2g1XNqGu5Q_4SYDEG3pXayFCbyOnd_bUZcOcBeah6n8fp4RvxzLcQgihZSkjpnlQ-3lqBRT6TVm8oinm1V0HRGU8oL65TyGRI4-6wCvRNvzEduXq5QtuYVFX7Y5JRkrSF0adXMuug1-uRSbq77AtIvGMQz3YVhtQSO7omS25ocqHaBtNcuQqLBIjSwUogFPvrYUdeyWW0NOEhCnniR58x5uVpmnTItZRw9TAUjNNyl8WPef7e07tM0033aMiko7ZcN_ZTOJhrDGO0sNo.5q2Z1eRJ7aMsmgwwlvx4JwK4Ig-MkU3-6dxWl-uCsJg',
  
  // ============================================
  // 📊 Token Metadata (Để tracking)
  // ============================================
  TOKEN_INFO: {
    updatedAt: '2024-12-22',  // Ngày update token lần cuối
    expiresAt: 1761130407,    // Unix timestamp khi token hết hạn
    user: 'khoadang09102004@gmail.com',
    role: 'mod'
  }
} as const;

// Storage keys for localStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'aa_access_token',
  REFRESH_TOKEN: 'aa_refresh_token',
  TOKEN_EXPIRY: 'aa_token_expiry'
} as const;

// ===========================================
// Legacy OAuth Config (Kept for reference)
// ===========================================
export const authConfig = {
  // Auth Server URL - nơi xác thực user
  authority: 'https://auth.alphaasimov.com/',
  
  // Client ID được cấp bởi admin của API
  client_id: 'BackOffice_App',
  
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
