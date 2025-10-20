// Test the internship API from frontend context
import { fetchInternshipOpportunities, fetchInternshipLocations, fetchInternshipCompanies } from '../src/utils/internshipAPI.js';

// Test the API functions
async function testInternshipAPI() {
  try {
    console.log('Testing internship API...');

    // Test fetching internships
    console.log('1. Fetching internships...');
    const internshipsResult = await fetchInternshipOpportunities();
    console.log(`✓ Successfully fetched ${internshipsResult.internships.length} internships`);

    // Test fetching locations
    console.log('2. Fetching locations...');
    const locations = await fetchInternshipLocations();
    console.log(`✓ Successfully fetched ${locations.length} unique locations`);

    // Test fetching companies
    console.log('3. Fetching companies...');
    const companies = await fetchInternshipCompanies();
    console.log(`✓ Successfully fetched ${companies.length} companies`);

    console.log('All tests passed! 🎉');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if in browser environment
if (typeof window !== 'undefined') {
  testInternshipAPI();
}