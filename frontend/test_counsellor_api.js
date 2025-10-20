// Test script for counsellor API
const { counsellorAPI } = require('../src/utils/counsellorAPI.js');

async function testCounsellorAPI() {
  console.log('Testing counsellor API utility functions...');

  const testUserId = 59; // Use the actual counsellor user ID

  try {
    // Test getting profile
    console.log('\n1. Testing getProfile...');
    const profileResponse = await counsellorAPI.getProfile(testUserId);
    console.log('✅ Profile fetched successfully:', profileResponse.success);
    console.log('Profile data:', JSON.stringify(profileResponse.profile, null, 2));

    // Test updating profile
    console.log('\n2. Testing updateProfile...');
    const updateData = {
      full_name: 'Dr. Ajantha Athukorala (Updated)',
      bio: 'Experienced counsellor specializing in career guidance and academic planning',
      location: 'Colombo, Sri Lanka',
      expertise: 'Career guidance, Academic planning, Student mentoring',
      experience_years: 6
    };

    const updateResponse = await counsellorAPI.updateProfile(testUserId, updateData);
    console.log('✅ Profile updated successfully:', updateResponse.success);
    console.log('Updated profile:', JSON.stringify(updateResponse.profile, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Note: This would need to be run in a Node.js environment with fetch polyfill
// or in a browser environment. For now, it's just for reference.
console.log('API test script created. Run in appropriate environment.');