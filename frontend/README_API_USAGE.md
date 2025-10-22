# Hướng dẫn sử dụng API Alpha Asimov Backend

## 📌 Tình huống hiện tại
- Bạn có React app (Web_Kiosk)
- Muốn sử dụng API từ Alpha Asimov Backend (đã deploy)
- **KHÔNG phải chủ** của API → Cần được cấp quyền

---

## 🎯 Có 2 cách để sử dụng API

### ✅ CÁCH 1: Dùng Fixed Token (ĐƠN GIẢN) ⭐ Recommended để bắt đầu

**Phù hợp khi:**
- Testing/học hỏi API
- Chỉ 1 user sử dụng
- Không cần đăng nhập nhiều tài khoản

**Các bước:**

#### 1. Xin Token từ Admin
Liên hệ admin của API để:
- Tạo account cho bạn trên hệ thống
- Cấp permissions cần thiết (Orders.Create, Orders.View, etc.)
- Lấy access token (hoặc API key)

#### 2. Lấy Token
**Cách A: Lấy từ Portal (nếu có tài khoản)**
```bash
1. Đăng nhập: https://portal.alphaasimov.com
2. Mở DevTools (F12) → Application tab
3. Local Storage → Tìm key 'abp.auth.session'
4. Copy giá trị 'access_token'
```

**Cách B: Xin API Key từ Admin**
Admin có thể tạo API Key không hết hạn cho bạn

#### 3. Setup trong code
```typescript
// src/services/orders-api-simple.ts
const API_CONFIG = {
  baseURL: 'https://api.alphaasimov.com',
  accessToken: 'YOUR_TOKEN_HERE', // Token từ bước 2
};
```

#### 4. Sử dụng
```typescript
import { ordersApi } from '@/services/orders-api-simple';

// Lấy danh sách orders
const orders = await ordersApi.getOrders();

// Tạo order mới
const result = await ordersApi.createOrder({
  sender: { ... },
  recipients: [{ ... }]
});
```

**⚠️ Lưu ý:**
- Token sẽ **hết hạn** (thường sau 1 giờ - 1 ngày)
- Khi gặp lỗi 401 → Lấy token mới
- **KHÔNG commit token vào Git**

---

### ✅ CÁCH 2: OAuth 2.0 Flow (CHUYÊN NGHIỆP)

**Phù hợp khi:**
- App production
- Nhiều users cần đăng nhập
- Cần tự động refresh token

**Các bước:**

#### 1. Xin OAuth Client từ Admin
Yêu cầu admin tạo OAuth Client:
```
Client Name: Web_Kiosk_Client
Client Type: Public (cho React SPA)
Redirect URIs: 
  - http://localhost:5173/auth/callback (dev)
  - https://yourdomain.com/auth/callback (prod)
Grant Types: authorization_code
Scopes: offline_access BackOffice
```

Admin sẽ cung cấp:
- ✅ Client ID: `Web_Kiosk_Client`
- ✅ Auth Server URL: `https://auth.alphaasimov.com`
- ✅ Scopes: `offline_access BackOffice`

#### 2. Install Dependencies
```bash
npm install oidc-client-ts axios
```

#### 3. Config
```typescript
// src/config/auth.config.ts
export const authConfig = {
  authority: 'https://auth.alphaasimov.com/',
  client_id: 'Web_Kiosk_Client', // Từ admin
  redirect_uri: window.location.origin + '/auth/callback',
  scope: 'openid profile email offline_access BackOffice',
  response_type: 'code',
  automaticSilentRenew: true,
};
```

#### 4. Setup Auth Service & API Service
Đã tạo sẵn:
- `src/services/auth.service.ts` - Quản lý OAuth flow
- `src/services/orders-api.service.ts` - Call Orders API với auto token

#### 5. Tạo Auth Callback Page
```typescript
// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.handleCallback()
      .then(() => {
        navigate('/'); // Redirect về trang chủ
      })
      .catch(error => {
        console.error('Auth error:', error);
        navigate('/login');
      });
  }, []);

  return <div>Đang đăng nhập...</div>;
};
```

#### 6. Sử dụng
```typescript
import { ordersApi } from '@/services/orders-api.service';
import { authService } from '@/services/auth.service';

// Login
await authService.login(); // Redirect đến auth server

// Sau khi login, call API (token tự động được thêm)
const orders = await ordersApi.getOrders();
const result = await ordersApi.createOrder({ ... });

// Logout
await authService.logout();
```

---

## 🔒 CORS & Permissions

### Backend phải config CORS
Admin cần thêm domain của bạn vào whitelist:
```csharp
.WithOrigins(
  "http://localhost:5173",      // Dev
  "https://yourdomain.com"      // Production
)
```

### Cần có Permissions
User phải được cấp permissions:
- `BackOffice.Orders.Default` - Xem orders
- `BackOffice.Orders.Create` - Tạo orders
- `BackOffice.Orders.Details` - Xem chi tiết
- `BackOffice.Orders.Update` - Cập nhật
- `BackOffice.Orders.Delete` - Xóa

---

## 📝 API Endpoints có sẵn

```
Base URL: https://api.alphaasimov.com

GET    /api/app/orders                    # Danh sách orders
GET    /api/app/orders/{id}               # Chi tiết order
POST   /api/app/orders/create-order       # Tạo order mới
POST   /api/app/orders/cancel-order       # Hủy order
POST   /api/app/orders/confirm-order      # Xác nhận order
GET    /api/app/orders/live-orders        # Orders đang hoạt động
GET    /api/app/orders/mine               # Orders của user
GET    /api/app/orders/tracking/{id}      # Tracking (public)
POST   /api/app/orders/delivery-quote     # Tính phí giao hàng
```

---

## 🎯 Recommendation

**Bắt đầu với CÁCH 1** (Fixed Token):
1. ✅ Đơn giản, setup nhanh
2. ✅ Không cần config OAuth phức tạp
3. ✅ Phù hợp để học API và testing
4. ✅ File: `src/services/orders-api-simple.ts`

**Upgrade lên CÁCH 2** khi:
- App đi vào production
- Cần nhiều users đăng nhập
- Cần security tốt hơn

---

## 📞 Liên hệ

Để sử dụng API, bạn cần liên hệ:
- **Admin của API** để:
  - Tạo account
  - Cấp permissions
  - Cấp token hoặc OAuth client
  - Config CORS cho domain của bạn

- **Thông tin cần cung cấp:**
  - App name: Web_Kiosk
  - Domain: localhost:5173 (dev) hoặc production URL
  - Permissions cần: Orders module
  - OAuth redirect URIs (nếu dùng OAuth)
