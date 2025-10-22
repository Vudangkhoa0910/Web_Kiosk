/**
 * Simple Node.js script to test API
 * Chạy: node test-api-simple.js
 */

import https from 'https';

const API_CONFIG = {
  host: 'api.alphaasimov.com',
  accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1NjZFOEEzNDA2RTU1MkIxRDIxMkIwQzI3OURENjZEMDQ2MkY4OTMiLCJ4NXQiOiJKV2JvbzBCdVZTc2RJU3NNSjUzV2JRUmktSk0iLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiIyNGQ2N2RmYS1kNTRiLTQ2ZWUtOTU3NC05MDlhNDFmYWRkODciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJraG9hZGFuZzA5MTAyMDA0IiwiZW1haWwiOiJraG9hZGFuZzA5MTAyMDA0QGdtYWlsLmNvbSIsInJvbGUiOiJtb2QiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJGYWxzZSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJ1bmlxdWVfbmFtZSI6Imtob2FkYW5nMDkxMDIwMDQiLCJvaV9wcnN0IjoiQmFja09mZmljZV9BcHAiLCJpc3MiOiJodHRwczovL2F1dGguYWxwaGFhc2ltb3YuY29tLyIsIm9pX2F1X2lkIjoiODJmM2U2Y2EtZDFmOC1hMWE1LTAyYTQtM2ExNDhmOTMzMTljIiwiY2xpZW50X2lkIjoiQmFja09mZmljZV9BcHAiLCJvaV90a25faWQiOiI2ZDk4MTcwMi1lMzg2LThhYzYtNDdlZC0zYTFkMWNkNjQzNTQiLCJhdWQiOiJCYWNrT2ZmaWNlIiwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MgQmFja09mZmljZSIsImp0aSI6IjJjMzBkZjAyLTM2NGMtNDRkMy05MjNjLTA1YTBhNTNhMGNjMSIsImV4cCI6MTc2MTEyMjY2NiwiaWF0IjoxNzYxMTE1NDY2fQ.LwTfQz_cv2DpGXNI4TN_u87OUflq_NOaD1VXdcFZ_l-MwFntGXDOks70nSeW6R6u6fcmzsD1chRkPmBkmKbn8Ijxfc6UzXk7JO3CTVGxtisFfPpXstrCA0JaEbjdLZEBKTdKki_VPZsTLJxwNTpMMgxUMhF8PapE4Rxf_kg3ajJdVHb8z54m_yE3E-O3ytVJRJdTlbz8MaC7BOP3cHWmbOdOMbkz13HV2b-aQ1wjqOoM-c22s_rkVBXZ9mN3yjeQrOhDRs2zupgTqz-8y-RcBJwx-CfL0gPaJcMIzsi0PeSshcG2vieBsQUa-lgAaPjkJJMuEHggRAuGdaRK8g5meQ'
};

function testApi() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST ALPHA ASIMOV BACKEND API');
  console.log('='.repeat(60));

  // Test token info
  console.log('\n🔑 Token Info:');
  try {
    const tokenParts = API_CONFIG.accessToken.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    console.log(`   Username: ${payload.unique_name}`);
    console.log(`   Email: ${payload.email}`);
    console.log(`   Role: ${payload.role}`);
    
    const expiresAt = new Date(payload.exp * 1000);
    const now = new Date();
    const timeLeft = Math.floor((expiresAt.getTime() - now.getTime()) / 1000 / 60);
    
    console.log(`   Expires: ${expiresAt.toLocaleString('vi-VN')}`);
    console.log(`   Time left: ${timeLeft} minutes`);
    
    if (timeLeft <= 0) {
      console.log('   ⚠️  TOKEN ĐÃ HẾT HẠN!');
      return;
    } else {
      console.log('   ✅ Token còn hiệu lực');
    }
  } catch (e) {
    console.error('   ❌ Error parsing token:', e.message);
    return;
  }

  // Test API call
  console.log('\n📡 Calling API: GET /api/app/orders');
  
  const options = {
    hostname: API_CONFIG.host,
    path: '/api/app/orders?maxResultCount=5',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.accessToken}`
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        const result = JSON.parse(data);
        console.log(`\n✅ SUCCESS! Status: ${res.statusCode}`);
        console.log(`📊 Total orders: ${result.totalCount}`);
        console.log(`📦 Returned: ${result.items.length} orders`);
        
        if (result.items.length > 0) {
          console.log('\n📋 Orders:');
          result.items.forEach((order, index) => {
            console.log(`\n  ${index + 1}. Order: ${order.code || order.id}`);
            console.log(`     Status: ${order.status}`);
            console.log(`     Type: ${order.type}`);
            if (order.sender) {
              console.log(`     Sender: ${order.sender.name} - ${order.sender.phone}`);
            }
            if (order.recipient) {
              console.log(`     Recipient: ${order.recipient.name} - ${order.recipient.phone}`);
            }
            console.log(`     Created: ${new Date(order.creationTime).toLocaleString('vi-VN')}`);
          });
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ API HOẠT ĐỘNG BÌNH THƯỜNG!');
        console.log('='.repeat(60));
        console.log('\n💡 Bạn có thể sử dụng API này trong React app!');
        console.log('📝 Xem file: src/services/orders-api-simple.ts\n');
        
      } else {
        console.log(`\n❌ ERROR! Status: ${res.statusCode}`);
        console.log('Response:', data);
        printTroubleshooting();
      }
    });
  });

  req.on('error', (e) => {
    console.error(`\n❌ Request Error: ${e.message}`);
    printTroubleshooting();
  });

  req.end();
}

function printTroubleshooting() {
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Token hết hạn → Lấy token mới từ portal');
  console.log('   2. Không có quyền → Liên hệ admin cấp permission');
  console.log('   3. CORS error → Liên hệ admin config CORS');
  console.log('   4. Network error → Kiểm tra kết nối internet\n');
}

// Run test
testApi();
