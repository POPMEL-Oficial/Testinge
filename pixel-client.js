// This file demonstrates how to set up Facebook Pixel to send events to our webhook
// Add this to your website where Facebook Pixel is implemented

// Initialize Facebook Pixel with your Pixel ID
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Use your actual Facebook Pixel ID
fbq('init', '24192442997008925');
fbq('track', 'PageView');

// Store user contact information when available
let userContactInfo = {};

// Function to save user contact information
function saveUserContact(contactData) {
  userContactInfo = { ...userContactInfo, ...contactData };
  
  // You might want to save this to localStorage for persistence across page loads
  try {
    localStorage.setItem('userContactInfo', JSON.stringify(userContactInfo));
  } catch (e) {
    console.error('Failed to save contact info to localStorage:', e);
  }
  
  return userContactInfo;
}

// Function to load saved contact information
function loadUserContact() {
  try {
    const savedContact = localStorage.getItem('userContactInfo');
    if (savedContact) {
      userContactInfo = JSON.parse(savedContact);
    }
  } catch (e) {
    console.error('Failed to load contact info from localStorage:', e);
  }
  
  return userContactInfo;
}

// Load any previously saved contact info
loadUserContact();

// Custom function to capture Facebook Pixel events and send them to our webhook
function capturePixelEvent(event, params, contactInfo) {
  // First, track the event with Facebook Pixel as normal
  fbq('track', event, params);
  
  // If contact info is provided with this event, save it
  if (contactInfo) {
    saveUserContact(contactInfo);
  }
  
  // Then, send the same event data to our webhook
  const webhookUrl = 'http://localhost:3000/pixel-webhook';
  
  // Prepare the data to send
  const eventData = {
    event: event,
    params: params,
    eventID: generateEventId(), // Generate a unique ID for this event
    timestamp: new Date().toISOString(),
    url: window.location.href,
    value: params?.value || null,
    userContact: userContactInfo // Include user contact info
  };
  
  // Send the data to our webhook
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })
  .then(response => {
    if (response.ok) {
      console.log('Event sent to webhook successfully');
    } else {
      console.error('Failed to send event to webhook');
    }
  })
  .catch(error => {
    console.error('Error sending event to webhook:', error);
  });
}

// Helper function to generate a unique event ID
function generateEventId() {
  return 'event_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Usage examples:

// Track a page view
capturePixelEvent('PageView');

// Track a purchase with contact info
capturePixelEvent('Purchase', {
  value: 99.99,
  currency: 'USD',
  content_ids: ['12345'],
  content_type: 'product'
}, {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});

// Track a lead with Facebook info
capturePixelEvent('Lead', {
  content_name: 'Signup Form',
  content_category: 'Signup'
}, {
  facebook: 'johndoe'
});

// Standalone function to update contact info without tracking an event
function updateUserContact(contactData) {
  saveUserContact(contactData);
  console.log('User contact information updated:', userContactInfo);
}

// You can replace the standard fbq calls with capturePixelEvent
// For example, instead of:
// fbq('track', 'CompleteRegistration');
// Use:
// capturePixelEvent('CompleteRegistration'); 