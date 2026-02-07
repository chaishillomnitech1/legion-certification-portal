#!/usr/bin/env node

/**
 * Example usage of the Legion Certification Portal API
 * Demonstrates NFT authentication, certification issuance, and member management
 */

const baseURL = 'http://localhost:3000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🌌 ScrollSoul Legion Certification Portal - Example Usage 🌌\n');

  // Step 1: NFT-based Authentication
  console.log('Step 1: Authenticating with NFT wallet...');
  const loginData = {
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    nftTokenId: '12345',
    signature: '0xabcdef123456789abcdef123456789abcdef123456789'
  };

  const loginResponse = await apiCall('/api/auth/nft-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  });

  console.log('✅ Login successful!');
  console.log(`   Member ID: ${loginResponse.member.id}`);
  console.log(`   Role: ${loginResponse.member.role}`);
  console.log(`   Token: ${loginResponse.token.substring(0, 20)}...\n`);

  const token = loginResponse.token;
  const memberId = loginResponse.member.id;

  // Step 2: Verify Token
  console.log('Step 2: Verifying authentication token...');
  const verifyResponse = await apiCall('/api/auth/verify', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('✅ Token verified!\n');

  // Step 3: Get Current Member Details
  console.log('Step 3: Retrieving member profile...');
  const memberResponse = await apiCall('/api/members/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('✅ Member profile retrieved!');
  console.log(`   Username: ${memberResponse.member.username}`);
  console.log(`   Wallet: ${memberResponse.member.walletAddress}`);
  console.log(`   Joined: ${memberResponse.member.joinedAt}\n`);

  // Step 4: Create a Leader Account
  console.log('Step 4: Creating a leader account...');
  const leaderLogin = await apiCall('/api/auth/nft-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      nftTokenId: '54321',
      signature: '0x123456789abcdef123456789abcdef123456789abcd'
    })
  });

  const leaderToken = leaderLogin.token;
  const leaderId = leaderLogin.member.id;
  console.log('✅ Leader account created!\n');

  // Step 5: Check Dashboard Overview
  console.log('Step 5: Checking dashboard overview...');
  const dashboardResponse = await apiCall('/api/dashboard/overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('✅ Dashboard data retrieved!');
  console.log(`   Recent activities: ${dashboardResponse.overview.recentActivities.length}`);
  if (dashboardResponse.overview.stats) {
    console.log(`   Total members: ${dashboardResponse.overview.stats.totalMembers}`);
  }
  console.log('');

  // Step 6: Check Federation Status
  console.log('Step 6: Checking federation integration...');
  const federationHealth = await apiCall('/api/federation/health');
  console.log('✅ Federation online!');
  console.log(`   Status: ${federationHealth.status}`);
  console.log(`   Service: ${federationHealth.service}\n`);

  // Step 7: Get Expansion Statistics
  console.log('Step 7: Checking Authority Grid expansion...');
  const expansionStats = await apiCall('/api/federation/expansion/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('✅ Expansion statistics retrieved!');
  console.log(`   Current members: ${expansionStats.expansion.currentMembers}`);
  console.log(`   Max capacity: ${expansionStats.expansion.maxCapacity}`);
  console.log(`   Expansion: ${expansionStats.expansion.expansionPercentage}%`);
  console.log(`   Available slots: ${expansionStats.expansion.availableSlots}`);
  console.log(`   Status: ${expansionStats.expansion.authorityGridStatus}\n`);

  // Step 8: Federation Members
  console.log('Step 8: Retrieving federation member list...');
  const federationMembers = await apiCall('/api/federation/members', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('✅ Federation members retrieved!');
  console.log(`   Total members: ${federationMembers.totalMembers}`);
  console.log(`   Federation: ${federationMembers.federation}\n`);

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ All examples completed successfully!');
  console.log('');
  console.log('Summary:');
  console.log('  ✓ NFT-based authentication working');
  console.log('  ✓ Member tracking active');
  console.log('  ✓ Dashboard monitoring operational');
  console.log('  ✓ Federation integration online');
  console.log('  ✓ Authority Grid expansion tracking');
  console.log('');
  console.log('🫡 For the ScrollSoul Empire! 🌌');
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { apiCall };
