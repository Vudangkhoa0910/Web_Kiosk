/**
 * Test Script for Robot Map Tracking
 * 
 * This script helps verify that all components are working correctly.
 * Run this in the browser console when on the map tracking page.
 */

// Test 1: Check if Leaflet is loaded
export function testLeafletLoaded() {
  if (typeof window.L !== 'undefined') {
    console.log('✅ Leaflet library loaded successfully');
    console.log('   Version:', window.L.version);
    return true;
  } else {
    console.error('❌ Leaflet library not loaded');
    return false;
  }
}

// Test 2: Check if robot image exists
export async function testRobotImage() {
  const imagePath = '/images/Bulldog/5.png';
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Robot image loaded successfully');
      console.log('   Path:', imagePath);
      console.log('   Size:', img.width, 'x', img.height);
      resolve(true);
    };
    img.onerror = () => {
      console.error('❌ Robot image failed to load');
      console.error('   Path:', imagePath);
      console.error('   Make sure the file exists in public/images/Bulldog/');
      resolve(false);
    };
    img.src = imagePath;
  });
}

// Test 3: Check if Socket.IO is connected
export function testSocketConnection() {
  // This assumes socketMqttService is available globally or through context
  const isConnected = (window as any).__socketConnected || false;
  
  if (isConnected) {
    console.log('✅ Socket.IO connection established');
    return true;
  } else {
    console.warn('⚠️  Socket.IO not connected');
    console.log('   Check backend server is running on:', import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000');
    return false;
  }
}

// Test 4: Validate robot data structure
export function testRobotData(robot: any) {
  const requiredFields = ['id', 'name', 'location', 'batteryLevel', 'speed', 'status'];
  const requiredLocationFields = ['lat', 'lng'];
  
  const missingFields = requiredFields.filter(field => !(field in robot));
  
  if (missingFields.length > 0) {
    console.error('❌ Robot data missing required fields:', missingFields);
    return false;
  }
  
  const missingLocationFields = requiredLocationFields.filter(
    field => !(field in robot.location)
  );
  
  if (missingLocationFields.length > 0) {
    console.error('❌ Robot location missing required fields:', missingLocationFields);
    return false;
  }
  
  // Validate data types and ranges
  const validations = [
    { field: 'batteryLevel', type: 'number', min: 0, max: 100 },
    { field: 'speed', type: 'number', min: 0 },
    { field: 'location.lat', type: 'number', min: -90, max: 90 },
    { field: 'location.lng', type: 'number', min: -180, max: 180 },
  ];
  
  for (const validation of validations) {
    const value = validation.field.includes('.') 
      ? robot.location[validation.field.split('.')[1]]
      : robot[validation.field];
    
    if (typeof value !== validation.type) {
      console.error(`❌ ${validation.field} should be ${validation.type}, got ${typeof value}`);
      return false;
    }
    
    if (validation.min !== undefined && value < validation.min) {
      console.error(`❌ ${validation.field} should be >= ${validation.min}, got ${value}`);
      return false;
    }
    
    if (validation.max !== undefined && value > validation.max) {
      console.error(`❌ ${validation.field} should be <= ${validation.max}, got ${value}`);
      return false;
    }
  }
  
  console.log('✅ Robot data structure is valid');
  console.log('   Robot:', robot.name);
  console.log('   Location:', robot.location.lat.toFixed(4), robot.location.lng.toFixed(4));
  console.log('   Battery:', robot.batteryLevel + '%');
  console.log('   Speed:', robot.speed + ' m/s');
  return true;
}

// Test 5: Calculate distance function
export function testDistanceCalculation() {
  // Test with known coordinates (Hanoi to Saigon ~1,700km)
  const hanoi = { lat: 21.0285, lng: 105.8542 };
  const saigon = { lat: 10.8231, lng: 106.6297 };
  
  const distance = calculateDistance(hanoi.lat, hanoi.lng, saigon.lat, saigon.lng);
  const expectedDistance = 1700000; // ~1,700 km in meters
  const tolerance = 100000; // 100km tolerance
  
  if (Math.abs(distance - expectedDistance) < tolerance) {
    console.log('✅ Distance calculation working correctly');
    console.log('   Hanoi -> Saigon:', (distance / 1000).toFixed(0), 'km');
    return true;
  } else {
    console.error('❌ Distance calculation incorrect');
    console.error('   Expected ~', expectedDistance / 1000, 'km');
    console.error('   Got:', distance / 1000, 'km');
    return false;
  }
}

// Helper: Calculate distance (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Test 6: Check CSS animations
export function testAnimations() {
  const testElements = [
    { selector: '.robot-marker', animation: 'robotPulse' },
    { selector: '.destination-marker', animation: 'destinationBounce' },
  ];
  
  let allPassed = true;
  
  for (const test of testElements) {
    const element = document.querySelector(test.selector);
    if (!element) {
      console.warn(`⚠️  Element ${test.selector} not found (might be loaded later)`);
      continue;
    }
    
    const style = window.getComputedStyle(element);
    const animation = style.animationName;
    
    if (animation && animation !== 'none') {
      console.log(`✅ Animation working for ${test.selector}`);
      console.log('   Animation:', animation);
    } else {
      console.error(`❌ No animation found for ${test.selector}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

// Test 7: Performance check
export function testPerformance() {
  const startTime = performance.now();
  
  // Simulate 100 position updates
  for (let i = 0; i < 100; i++) {
    calculateDistance(21.0131, 105.7234, 21.0150, 105.7250);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration < 10) {
    console.log('✅ Performance test passed');
    console.log('   100 calculations in', duration.toFixed(2), 'ms');
    return true;
  } else {
    console.warn('⚠️  Performance might be slow');
    console.warn('   100 calculations took', duration.toFixed(2), 'ms');
    return false;
  }
}

// Run all tests
export async function runAllTests(robot?: any) {
  console.log('🧪 Running Robot Map Tracking Tests...\n');
  
  const results = {
    leaflet: testLeafletLoaded(),
    robotImage: await testRobotImage(),
    socket: testSocketConnection(),
    robotData: robot ? testRobotData(robot) : null,
    distance: testDistanceCalculation(),
    performance: testPerformance(),
  };
  
  // Skip animations test as it needs DOM
  // results.animations = testAnimations();
  
  console.log('\n📊 Test Results Summary:');
  console.log('━'.repeat(50));
  
  let passedTests = 0;
  let totalTests = 0;
  
  for (const [name, result] of Object.entries(results)) {
    if (result !== null) {
      totalTests++;
      if (result) passedTests++;
      
      const icon = result ? '✅' : '❌';
      console.log(`${icon} ${name}: ${result ? 'PASSED' : 'FAILED'}`);
    }
  }
  
  console.log('━'.repeat(50));
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! System is ready.');
  } else {
    console.log('⚠️  Some tests failed. Check errors above.');
  }
  
  return results;
}

// Mock data for testing
export const mockRobotData = {
  id: 'robot-test-01',
  name: 'Test Robot Alpha',
  location: {
    lat: 21.0131,
    lng: 105.7234,
    heading: 45,
  },
  batteryLevel: 85,
  speed: 1.2,
  status: 'delivering' as const,
  estimatedTimeArrival: 15,
  distanceToDestination: 500,
};

export const mockDestination = {
  lat: 21.0150,
  lng: 105.7250,
  name: 'Test Destination',
  address: 'Ocean Park 2, Hanoi',
};

// Usage instructions
console.log(`
🧪 Robot Map Tracking Test Suite

Run tests in browser console:

1. Test single component:
   > testLeafletLoaded()
   > await testRobotImage()
   > testRobotData(mockRobotData)

2. Run all tests:
   > await runAllTests()

3. Test with real robot data:
   > await runAllTests(yourRobotData)

4. Use mock data:
   > mockRobotData
   > mockDestination
`);

export default {
  runAllTests,
  testLeafletLoaded,
  testRobotImage,
  testSocketConnection,
  testRobotData,
  testDistanceCalculation,
  testAnimations,
  testPerformance,
  mockRobotData,
  mockDestination,
};
