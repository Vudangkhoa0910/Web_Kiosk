/**
 * TEST API - Kiểm tra kết nối với Alpha Asimov Backend
 * Chạy file này để test xem API có hoạt động không
 */

import axios from 'axios';

// ============================================
// CONFIG - Token của bạn
// ============================================
const API_CONFIG = {
  baseURL: 'https://api.alphaasimov.com',
  accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1NjZFOEEzNDA2RTU1MkIxRDIxMkIwQzI3OURENjZEMDQ2MkY4OTMiLCJ4NXQiOiJKV2JvbzBCdVZTc2RJU3NNSjUzV2JRUmktSk0iLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiIyNGQ2N2RmYS1kNTRiLTQ2ZWUtOTU3NC05MDlhNDFmYWRkODciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJraG9hZGFuZzA5MTAyMDA0IiwiZW1haWwiOiJraG9hZGFuZzA5MTAyMDA0QGdtYWlsLmNvbSIsInJvbGUiOiJtb2QiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJGYWxzZSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJ1bmlxdWVfbmFtZSI6Imtob2FkYW5nMDkxMDIwMDQiLCJvaV9wcnN0IjoiQmFja09mZmljZV9BcHAiLCJpc3MiOiJodHRwczovL2F1dGguYWxwaGFhc2ltb3YuY29tLyIsIm9pX2F1X2lkIjoiODJmM2U2Y2EtZDFmOC1hMWE1LTAyYTQtM2ExNDhmOTMzMTljIiwiY2xpZW50X2lkIjoiQmFja09mZmljZV9BcHAiLCJvaV90a25faWQiOiI2ZDk4MTcwMi1lMzg2LThhYzYtNDdlZC0zYTFkMWNkNjQzNTQiLCJhdWQiOiJCYWNrT2ZmaWNlIiwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MgQmFja09mZmljZSIsImp0aSI6IjJjMzBkZjAyLTM2NGMtNDRkMy05MjNjLTA1YTBhNTNhMGNjMSIsImV4cCI6MTc2MTEyMjY2NiwiaWF0IjoxNzYxMTE1NDY2fQ.LwTfQz_cv2DpGXNI4TN_u87OUflq_NOaD1VXdcFZ_l-MwFntGXDOks70nSeW6R6u6fcmzsD1chRkPmBkmKbn8Ijxfc6UzXk7JO3CTVGxtisFfPpXstrCA0JaEbjdLZEBKTdKki_VPZsTLJxwNTpMMgxUMhF8PapE4Rxf_kg3ajJdVHb8z54m_yE3E-O3ytVJRJdTlbz8MaC7BOP3cHWmbOdOMbkz13HV2b-aQ1wjqOoM-c22s_rkVBXZ9mN3yjeQrOhDRs2zupgTqz-8y-RcBJwx-CfL0gPaJcMIzsi0PeSshcG2vieBsQUa-lgAaPjkJJMuEHggRAuGdaRK8g5meQ',
  refreshToken: 'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZDQkMtSFM1MTIiLCJraWQiOiI0QTA5QThGNEUxNjY5QzFDNjY0RkQyNDYxNkI1QzRERjI2RjYxMjYwIiwidHlwIjoib2lfcmVmdCtqd3QiLCJjdHkiOiJKV1QifQ.WtxUeQFanfA1bHc33uA4xz8ZLbmunC0uuQJRpbZRL-3GshitZxQtKpSNRvb_unE0V6Ex974l9nTXLj_Jg082_GeV4kBAGXJhOtASKdEUG_hL0F2KM3VkRc_eLyLlhepbrLCWA0OO6-TpAmgoYhAs0vwr6DiAFcgWX2df1ePk9Pju76AK5OqvLUOWXQrUs5L52nYOozvrwVyd6QBIuKABKLq_fmoxvbNDBnZwrtTmVq8ZIJMwusmOna-dtiDdxI6X2g5XftDPs9fgbFw1nZJr8REPrcM9yi7mNS9asViTK0DNn4-Qc71aTZ8lS8kGxPAa7MxDEfJdraErmELHvyMwJQ.VS1MDwPHodgK8uej9bBnAg.aj4bmA4Lg9VLXzdMjZm9Jc_zGXgAXPlp1kVfCXYfOVHQoBoxgv2wWdnBK895Wp-H46uyjz0S7JRuJQ7i1sraOF2V6OQ2jTDPpcvwBCHRRv32axZsM5zu10tSPxxXo9JhrPpuoav9-7MEXW5QNlhqZJA9_mXtE-4XPtCucU7GLlkT_y8pFrioVck4sLS924ohPu7n5MlRNUkLLt5PqtKFmA7G6sogrowOO_75EXEKBrXPxLwwGjGh9KOYOWZN6BbbLMU593hFnfbLgi0s_JKwzzM7wh2IcvkpRiOVU_kdr8wJorKyks5o0ouBgsf_AcjaUFdG_TaHEkWH-JueRBRC9RCk5EeslBN6tbfjYRQ6CHCr75Dh_mx_67z0IwModMU7aNUD4HCGLpp5IhlVcU7ufFSVIk9gFFe-zvjddgp2NS7HjgBuDA8W5M2uw1e9-tbvxhsiyiJmeYO1hh9aux3pB-gfC3eYMeDMtx4Xu2rGcwZplSujYqkLSeQmI86J-HAyqViZH8m_MSkBpfuylZNFm20Gv55wwecDe8GqHk4Qmapl6ud9qDMeQu7v83u83l4w_wAbpqGV1x9HZ8PpI8yl5sdrBWhqU2rW4i8iU0ywrF2XwevdKUDM7dckVAvb9aBZCP2A7xxFXiPuVm64ozW9xh51y-SfMj8Pbjn89V2szwk6T621kcaHCb26he8H_WVV7X16lFputiv3RC1d2GRAtecY5MNCK7CFf9m3LTiTVU2CzWdJYR7oZKmKI-6KBhtgn9_UsdPJvVJMEfusoEl6uxUuYHALdgMtHGOTEF_2ScIplGqfOZSvGYGiAxaUZi8tHXS78TsJtfUF7x0naE7azAa0wwwJW7uvMJyN8yyb3BH9mBhfhizNJzSP03592v9-sEM94u1prmj7ujIYxXqauEoWJQfhF9c5X1GikyaCPKViV-CDgOnj9aneCV96UeDI_KF1w-1E-dxbSAI8tJexva4OFQ2YUhmgEUHOd4ua0jMxisIpB6Ya_a6jDDEZzGRCt2aos6Fj73-nU7xQV8Fr4HHN_ASm4oXcjjehEWMtZuvNT2TJcKmdoQ0rfpIGNN3fxFnLbPk7MG_EoBnJ7fE4THIuKRC3qV7L7vn42LnIbWT-fBZrtW3-7pGTzq4X0WJ_sWCGO9zEz2_2rF1J6nYIlGhp-kqcFF8IckJ_Mi2UwdDpsrhGKXepnnzWnF0xHnuGUyGQG7uGRJqRFuhhu52Ifw-6LXCz4ciZwrRZZJTRQKhYU0tN1v5227udJlXDQCwIb0jLnMX2BuOl0r_fBc9lakCy_af5Fx-hWiRg0h82AXYX9e_M3SKmr6DzXEQBqBpwp766-763bHVSW7XJmHSkDqNOexflPzA8ux4OKWvyNXpFeJCbgWgp03eUjh_lokUaht_HuI-sFjJsSOPMrorBY9f6fWrl95zEmxCUYmYpx5A-PcZcEQ7ZnAk6AvOEobK7QYlmmwh69xvpldKyZtSsLa0cef0abG-GwCYv7-jWhmnUlDANx0ri4KSIZCUbBrtL8PqkN8RoYgIiQpGKUlQrUG1OqP1og2MpuOSuRjdkYChEoMWZzDIfYt63GSPJ6Ncp_U9o6uLlnlSD-w9DNDGQGpvpf3rg3IjUF84iUjRlGjR4-KZV95tsywwECTZeWdK6HAEY_xwmN4iXdekfBnYEwTttTSYZGrB2AZhCCZRxW4PasWsVA15syE2qH2bamL4RaDQT-2PZAtJ9BoMD8Zu6meRZVjV2OEH6fPkpWADN6uqNywbYNNUbk2Wcs-VcoKHor_2x438u8zW5XsDeRDoQ5afIArc4XIZZ-xhdeOEREAiO1eWEsHJTKmBUal-BJMob4avk5b_Gav57ODrRFsFn6sH5kSPNq0gZwixbE170AZdyGyYx-coChPFS_Dbj6y-NSIP2LWKHNVkJ3BRKE48gVddPjBJgjD9uANdppEY_8uqZ7VS50s0zh_Z370l4Q54_Yg0dziabgJYQl8fXVE29mnY1jtFkbRGEAx08WXGMgYCkXEgtWIN7kJJPsasbQYM4Frj6dRYPBxRN9xIAiVJcFwWBnw9fWSabxsZx3a0Pssz2OC4oWkacS5gXGZEQRxUeMgYL9jTqc3qISf6MdrqAnFkOg8uzq3Ekgeio-fG_Ye_3vgyUz3vAeWTj42Qe_9PHhUdltgaZeOC2hYdV2klwpLxR7luIHsT5uUMCW3sKgmIEnbUVXlyHu_5QEuaJ9AvBOaUYWnKsn7fTXx2CC293Gds79hZpVPykU0cIxkLljlQJsVxKwHuyz4AEOwX_VCH0U7Z3DJpuY1Ig5nR8WfTRr3lcgjvXijkyMsOB6iBJDSd8rjuF3WKVK-rFXgMxFaE38U5MD87e57GNTGmxWQNxHPSibiBdMb6rgcTTkciFzwoqJKpRpHTAJRtreeq31N7ymuO21nbmvBT5H0LEn18Lytx7jpY1P8ygunlfAK2TYPpvBxo-IyCF7vVpSeNRay8C41ux1LqeJhi175FBR6qUOUd0418WXzdLDVHJShzvEk8WM25tPtMpCZXKWNHOM6jSQvYhH280PB3e0VccNgA7ILP4W9nLSomXzgtJxwM8wsPA_8iIJAGm9TILz5L_RWZEBtu-KOjoMNHgypsvI7cr8zb4U7S5etJn3Ld8n0BN6LAZWTL-ThaCZ02gEhoXtvvJgMIzHai3K8n9m20f1OLoZLgurW4PJPqgflUguTuifxXEwIFiax0u7kA7YQNzz5O-HpdT7WAXzu7uHDuIZknalOUkMoKp6bzbeI6uH_oDkiN4LHM8aRtyFtf3Ix0Ccycz1mA8z5XNhk2-7lbApDBt3EV08q_sqMrNp-u1DRID0sN5JEEVrQc19mU-lCFZFKCdhsjpxxEKfO8ceZXLU5cOnby8X6b5KDLVAUssKWnS9EaLbPh4IZ6LGb6NoX3YLfMKqZloulKZQKNbAwyPQOKTHVYYfzNCJ8Mg-UdL-0ihGM1Ql2WYeA-Pc3zWkNec8T77_5-jr1uRD_mUXG31EF3aesj9pNBryJB5SMxvsFnEpU4.2VN9FSZB4fQwiX9ioylo9fpJ70UbFgG9BthVVg7P7J4'
};

// ============================================
// Tạo axios instance
// ============================================
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.accessToken}`
  }
});

// ============================================
// TEST FUNCTIONS
// ============================================

/**
 * Test 1: Lấy danh sách Orders
 */
async function testGetOrders() {
  console.log('\n🧪 TEST 1: Lấy danh sách Orders');
  console.log('━'.repeat(60));
  
  try {
    const response = await apiClient.get('/api/app/orders', {
      params: {
        maxResultCount: 5, // Chỉ lấy 5 orders
        skipCount: 0,
      }
    });

    console.log('✅ SUCCESS!');
    console.log(`📊 Tổng số orders: ${response.data.totalCount}`);
    console.log(`📦 Số orders trả về: ${response.data.items.length}`);
    
    if (response.data.items.length > 0) {
      console.log('\n📋 Orders:');
      response.data.items.forEach((order: any, index: number) => {
        console.log(`\n  ${index + 1}. Order ID: ${order.id}`);
        console.log(`     Code: ${order.code || 'N/A'}`);
        console.log(`     Status: ${order.status}`);
        console.log(`     Type: ${order.type}`);
        console.log(`     Sender: ${order.sender?.name || 'N/A'} - ${order.sender?.phone || 'N/A'}`);
        console.log(`     Recipient: ${order.recipient?.name || 'N/A'} - ${order.recipient?.phone || 'N/A'}`);
        console.log(`     Created: ${new Date(order.creationTime).toLocaleString('vi-VN')}`);
      });
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ ERROR!');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.error?.message || error.response.statusText}`);
      console.error(`   Details:`, error.response.data);
    } else {
      console.error(`   ${error.message}`);
    }
    throw error;
  }
}

/**
 * Test 2: Lấy chi tiết 1 Order
 */
async function testGetOrderDetail(orderId: string) {
  console.log('\n🧪 TEST 2: Lấy chi tiết Order');
  console.log('━'.repeat(60));
  console.log(`📍 Order ID: ${orderId}`);
  
  try {
    const response = await apiClient.get(`/api/app/orders/${orderId}`);

    console.log('✅ SUCCESS!');
    console.log('\n📄 Chi tiết Order:');
    const order = response.data;
    console.log(`   ID: ${order.id}`);
    console.log(`   Code: ${order.code}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Type: ${order.type}`);
    console.log(`   Note: ${order.note || 'N/A'}`);
    console.log(`\n   👤 Sender:`);
    console.log(`      Name: ${order.sender?.name}`);
    console.log(`      Phone: ${order.sender?.phone}`);
    console.log(`      Address: ${order.sender?.address}`);
    console.log(`\n   👤 Recipient:`);
    console.log(`      Name: ${order.recipient?.name}`);
    console.log(`      Phone: ${order.recipient?.phone}`);
    console.log(`      Address: ${order.recipient?.address}`);
    
    if (order.items && order.items.length > 0) {
      console.log(`\n   📦 Items:`);
      order.items.forEach((item: any, i: number) => {
        console.log(`      ${i + 1}. ${item.description}`);
      });
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ ERROR!');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.error?.message || error.response.statusText}`);
    } else {
      console.error(`   ${error.message}`);
    }
    throw error;
  }
}

/**
 * Test 3: Kiểm tra token info
 */
function testTokenInfo() {
  console.log('\n🧪 TEST 3: Thông tin Token');
  console.log('━'.repeat(60));
  
  try {
    // Decode JWT token (phần payload)
    const tokenParts = API_CONFIG.accessToken.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    
    console.log('✅ Token hợp lệ!');
    console.log(`\n👤 User Info:`);
    console.log(`   Username: ${payload.unique_name || payload.preferred_username}`);
    console.log(`   Email: ${payload.email}`);
    console.log(`   Role: ${payload.role}`);
    console.log(`   Client ID: ${payload.client_id}`);
    
    console.log(`\n⏰ Token Timing:`);
    const issuedAt = new Date(payload.iat * 1000);
    const expiresAt = new Date(payload.exp * 1000);
    const now = new Date();
    
    console.log(`   Issued At: ${issuedAt.toLocaleString('vi-VN')}`);
    console.log(`   Expires At: ${expiresAt.toLocaleString('vi-VN')}`);
    console.log(`   Current Time: ${now.toLocaleString('vi-VN')}`);
    
    const isExpired = now > expiresAt;
    const timeLeft = Math.floor((expiresAt.getTime() - now.getTime()) / 1000 / 60);
    
    if (isExpired) {
      console.log(`   ⚠️  Token ĐÃ HẾT HẠN!`);
    } else {
      console.log(`   ✅ Token còn hiệu lực: ${timeLeft} phút`);
    }
    
    return payload;
  } catch (error: any) {
    console.error('❌ ERROR parsing token:', error.message);
    throw error;
  }
}

/**
 * Test 4: Lấy Live Orders (orders đang hoạt động)
 */
async function testGetLiveOrders() {
  console.log('\n🧪 TEST 4: Lấy Live Orders (đang hoạt động)');
  console.log('━'.repeat(60));
  
  try {
    const response = await apiClient.get('/api/app/orders/live-orders', {
      params: {
        maxResultCount: 10,
        skipCount: 0,
      }
    });

    console.log('✅ SUCCESS!');
    console.log(`📊 Tổng số live orders: ${response.data.totalCount}`);
    console.log(`📦 Số orders trả về: ${response.data.items.length}`);
    
    if (response.data.items.length > 0) {
      console.log('\n🚀 Live Orders:');
      response.data.items.forEach((item: any, index: number) => {
        const order = item.order;
        const robot = item.robot;
        const delivery = item.delivery;
        
        console.log(`\n  ${index + 1}. Order: ${order.code}`);
        console.log(`     Status: ${order.status}`);
        console.log(`     Robot: ${robot?.code || 'N/A'} (${robot?.name || 'N/A'})`);
        console.log(`     Delivery Status: ${delivery?.status || 'N/A'}`);
        console.log(`     From: ${order.sender?.address || 'N/A'}`);
        console.log(`     To: ${order.recipient?.address || 'N/A'}`);
      });
    } else {
      console.log('   📭 Không có orders đang hoạt động');
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ ERROR!');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.error?.message || error.response.statusText}`);
    } else {
      console.error(`   ${error.message}`);
    }
    throw error;
  }
}

// ============================================
// RUN ALL TESTS
// ============================================
async function runAllTests() {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('🚀 BẮT ĐẦU TEST ALPHA ASIMOV BACKEND API');
  console.log('═'.repeat(60));

  try {
    // Test 3: Token info (không cần call API)
    testTokenInfo();

    // Test 1: Get Orders list
    const ordersResult = await testGetOrders();

    // Test 2: Get Order detail (nếu có order)
    if (ordersResult.items.length > 0) {
      const firstOrderId = ordersResult.items[0].id;
      await testGetOrderDetail(firstOrderId);
    }

    // Test 4: Get Live Orders
    await testGetLiveOrders();

    console.log('\n');
    console.log('═'.repeat(60));
    console.log('✅ TẤT CẢ TESTS ĐÃ HOÀN THÀNH THÀNH CÔNG!');
    console.log('═'.repeat(60));
    console.log('\n💡 Bạn có thể sử dụng API này trong React app của mình!');
    console.log('📝 Tham khảo file: src/services/orders-api-simple.ts');
    console.log('\n');

  } catch (error) {
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('❌ TEST THẤT BẠI!');
    console.log('═'.repeat(60));
    console.log('\n💡 Các nguyên nhân có thể:');
    console.log('   1. Token đã hết hạn → Lấy token mới từ portal');
    console.log('   2. Không có quyền truy cập → Liên hệ admin cấp permission');
    console.log('   3. CORS chưa được config → Liên hệ admin thêm domain');
    console.log('   4. API endpoint không tồn tại → Kiểm tra lại URL');
    console.log('\n');
  }
}

// ============================================
// EXPORT các functions để có thể import vào React
// ============================================
export const testApi = {
  runAllTests,
  testGetOrders,
  testGetOrderDetail,
  testGetLiveOrders,
  testTokenInfo,
  apiClient,
};

// ============================================
// Nếu chạy trực tiếp file này (node)
// ============================================
if (typeof window === 'undefined') {
  runAllTests();
}

export default testApi;
