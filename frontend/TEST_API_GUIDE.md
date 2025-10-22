# 🧪 Hướng dẫn Test API Alpha Asimov Backend

Bạn đã có **Access Token** và **Refresh Token** từ hệ thống. Bây giờ có 3 cách để test API:

---

## 🎯 CÁCH 1: Test nhanh với Node.js (KHUYẾN NGHỊ) ⭐

### Chạy script test đơn giản:

```bash
node test-api-simple.js
```

Script này sẽ:
- ✅ Kiểm tra token có hợp lệ không
- ✅ Kiểm tra thời gian hết hạn
- ✅ Gọi API lấy danh sách Orders
- ✅ Hiển thị kết quả chi tiết

**Kết quả mong đợi:**
```
🧪 TEST ALPHA ASIMOV BACKEND API
============================================================

🔑 Token Info:
   Username: khoadang09102004
   Email: khoadang09102004@gmail.com
   Role: mod
   Expires: ...
   Time left: XX minutes
   ✅ Token còn hiệu lực

📡 Calling API: GET /api/app/orders

✅ SUCCESS! Status: 200
📊 Total orders: XX
📦 Returned: 5 orders

📋 Orders:
  1. Order: ORD-XXXX
     Status: ...
     Sender: ...
     Recipient: ...
```

---

## 🎯 CÁCH 2: Test với CURL

```bash
# Test lấy danh sách orders
curl -X GET "https://api.alphaasimov.com/api/app/orders?maxResultCount=5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

Thay `YOUR_ACCESS_TOKEN` bằng token của bạn.

---

## 🎯 CÁCH 3: Test trong React App

### Bước 1: Thêm route

Thêm vào `App.tsx` hoặc router:

```tsx
import TestApiPage from './pages/TestApiPage';

// Trong routes:
<Route path="/test-api" element={<TestApiPage />} />
```

### Bước 2: Chạy dev server

```bash
npm run dev
```

### Bước 3: Mở trang test

Truy cập: `http://localhost:5173/test-api`

Nhấn các nút để test API và xem kết quả.

---

## 📝 Token Management

### Token của bạn:

**Access Token:** Đã lưu trong `src/services/test-api.ts`  
**Expires:** Khoảng 2 giờ (kiểm tra bằng cách chạy test)  
**Role:** mod  
**Username:** khoadang09102004

### Khi token hết hạn:

**Cách 1: Refresh Token** (Tự động)
```typescript
// Sử dụng refresh token để lấy access token mới
// POST https://auth.alphaasimov.com/connect/token
{
  grant_type: 'refresh_token',
  refresh_token: 'YOUR_REFRESH_TOKEN',
  client_id: 'BackOffice_App'
}
```

**Cách 2: Lấy token mới từ Portal** (Thủ công)
1. Đăng nhập: https://portal.alphaasimov.com
2. Mở DevTools (F12) → Application
3. Local Storage → Tìm `abp.auth.session`
4. Copy `access_token` và `refresh_token`
5. Update vào file `src/services/test-api.ts`

---

## 🔍 Kiểm tra Token Info

Decode token để xem thông tin:

```javascript
// Trong browser console:
const token = 'YOUR_TOKEN';
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);

// Kiểm tra hết hạn:
const exp = new Date(payload.exp * 1000);
console.log('Expires:', exp.toLocaleString());
console.log('Expired:', Date.now() > exp.getTime());
```

Hoặc dùng website: https://jwt.io

---

## 📚 API Endpoints có sẵn

Với token hiện tại, bạn có thể gọi:

```
GET    /api/app/orders                    # Danh sách orders
GET    /api/app/orders/{id}               # Chi tiết order
GET    /api/app/orders/live-orders        # Orders đang hoạt động
GET    /api/app/orders/mine               # Orders của user
POST   /api/app/orders/create-order       # Tạo order mới
POST   /api/app/orders/cancel-order       # Hủy order
GET    /api/app/orders/tracking/{id}      # Tracking (public)
POST   /api/app/orders/delivery-quote     # Tính phí
```

---

## ⚠️ Troubleshooting

### ❌ Lỗi 401 Unauthorized
→ Token đã hết hạn. Lấy token mới hoặc dùng refresh token.

### ❌ Lỗi 403 Forbidden
→ User không có quyền. Liên hệ admin cấp permission:
- `BackOffice.Orders.Default`
- `BackOffice.Orders.Create`
- `BackOffice.Orders.Details`

### ❌ CORS Error (trong browser)
→ Backend chưa config CORS cho domain của bạn.  
→ Liên hệ admin thêm `http://localhost:5173` vào whitelist.

### ❌ Network Error
→ Kiểm tra:
1. Internet connection
2. API URL đúng: `https://api.alphaasimov.com`
3. Không bị firewall chặn

---

## 💡 Next Steps

Sau khi test thành công:

1. ✅ **Sử dụng trong React components:**
   ```typescript
   import { ordersApi } from '@/services/orders-api-simple';
   
   const orders = await ordersApi.getOrders();
   ```

2. ✅ **Tự động refresh token:**
   - Implement refresh token flow
   - Xem file `src/services/auth.service.ts`

3. ✅ **Xử lý errors:**
   - Catch 401 → Refresh token
   - Catch 403 → Show "No permission"
   - Catch 5xx → Retry hoặc fallback

4. ✅ **Cache data:**
   - Dùng React Query hoặc SWR
   - Giảm số lần gọi API

---

## 📞 Support

Nếu gặp vấn đề:
- 📧 Liên hệ admin của API
- 📝 Check file: `README_API_USAGE.md`
- 🔍 Xem logs trong Console (F12)

---

## ✅ Checklist

- [x] Có Access Token
- [x] Có Refresh Token
- [x] Token chưa hết hạn
- [ ] Đã test với `node test-api-simple.js` → **CHẠY NGAY!**
- [ ] Test thành công → Dùng trong React app
- [ ] Setup auto refresh token
- [ ] Handle errors properly

**👉 BẮT ĐẦU NGAY: Chạy `node test-api-simple.js` để test!**
