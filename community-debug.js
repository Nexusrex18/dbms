// This is a simple debugging script to help investigate the community post issues
// Run this in the browser console to check various aspects of the functionality

function debugCommunityService() {
  console.log('Starting community service debug...');
  
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  console.log('Auth token exists:', !!token);
  console.log('User exists:', !!user);
  
  if (user) {
    console.log('User ID:', user.id);
    console.log('User email:', user.email);
  }
  
  // Test API connection
  fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      console.log('Auth API response status:', res.status);
      return res.json().catch(() => ({ error: 'Failed to parse JSON' }));
    })
    .then(data => console.log('Auth API response:', data))
    .catch(err => console.error('Auth API error:', err));
    
  // Test Community API
  fetch('http://localhost:5000/api/community/posts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      console.log('Community API response status:', res.status);
      return res.json().catch(() => ({ error: 'Failed to parse JSON' }));
    })
    .then(data => console.log('Community API response:', data))
    .catch(err => console.error('Community API error:', err));
    
  // Test POST request to create a post
  fetch('http://localhost:5000/api/community/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: 'Debug test post',
      category: 'general'
    })
  })
    .then(res => {
      console.log('Create post API response status:', res.status);
      return res.json().catch(() => ({ error: 'Failed to parse JSON' }));
    })
    .then(data => console.log('Create post API response:', data))
    .catch(err => console.error('Create post API error:', err));
}

// Execute debug function
debugCommunityService();
