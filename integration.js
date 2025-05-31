// Integration script for Facebook Pixel to Telegram notifications
// This script should be added to your website after the existing Meta Pixel code

// Store user contact information when available
let userContactInfo = {};

// Debug mode
const DEBUG = true;

// Debug function
function debug(message) {
  if (DEBUG) {
    console.log(`[Pixel-Telegram] ${message}`);
  }
}

debug('Integration script loaded');

// Function to save user contact information
function saveUserContact(contactData) {
  debug('Saving contact data: ' + JSON.stringify(contactData));
  userContactInfo = { ...userContactInfo, ...contactData };
  
  // Save to localStorage for persistence across page loads
  try {
    localStorage.setItem('userContactInfo', JSON.stringify(userContactInfo));
    debug('Contact info saved to localStorage');
  } catch (e) {
    debug('Failed to save contact info to localStorage: ' + e.message);
    console.error('Failed to save contact info to localStorage:', e);
  }
  
  return userContactInfo;
}

// Function to load saved contact information
function loadUserContact() {
  debug('Loading contact info from localStorage');
  try {
    const savedContact = localStorage.getItem('userContactInfo');
    if (savedContact) {
      userContactInfo = JSON.parse(savedContact);
      debug('Loaded contact info: ' + JSON.stringify(userContactInfo));
    } else {
      debug('No saved contact info found');
    }
  } catch (e) {
    debug('Failed to load contact info from localStorage: ' + e.message);
    console.error('Failed to load contact info from localStorage:', e);
  }
  
  return userContactInfo;
}

// Load any previously saved contact info
loadUserContact();

// Helper function to generate a unique event ID
function generateEventId() {
  return 'event_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Custom function to capture Facebook Pixel events and send them to our webhook
function capturePixelEvent(event, params, contactInfo) {
  debug(`Capturing event: ${event} with params: ${JSON.stringify(params || {})}`);
  
  // First, track the event with Facebook Pixel as normal
  if (typeof fbq !== 'undefined') {
    debug('Sending event to Facebook Pixel');
    fbq('track', event, params);
  } else {
    debug('ERROR: fbq is not defined. Facebook Pixel may not be initialized correctly.');
  }
  
  // If contact info is provided with this event, save it
  if (contactInfo) {
    debug('Contact info provided with event');
    saveUserContact(contactInfo);
  }
  
  // Then, send the same event data to our webhook
  const webhookUrl = 'http://localhost:3000/pixel-webhook';
  debug(`Sending event to webhook: ${webhookUrl}`);
  
  // Prepare the data to send
  const eventData = {
    event: event,
    params: params,
    eventID: generateEventId(),
    timestamp: new Date().toISOString(),
    url: window.location.href,
    value: params?.value || null,
    userContact: userContactInfo
  };
  
  debug(`Event data: ${JSON.stringify(eventData)}`);
  
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
      debug('Event sent to webhook successfully');
    } else {
      debug(`Failed to send event to webhook: ${response.status} ${response.statusText}`);
      console.error('Failed to send event to webhook');
    }
    return response.json().catch(() => ({}));
  })
  .then(data => {
    debug(`Webhook response: ${JSON.stringify(data)}`);
  })
  .catch(error => {
    debug(`Error sending event to webhook: ${error.message}`);
    console.error('Error sending event to webhook:', error);
  });
}

// Function to update user contact info without tracking an event
function updateUserContact(contactData) {
  debug('Updating user contact info: ' + JSON.stringify(contactData));
  saveUserContact(contactData);
  console.log('User contact information updated:', userContactInfo);
}

// Override the existing click handler for the install button to track the event
document.addEventListener('DOMContentLoaded', function() {
  debug('DOM content loaded, setting up event handlers');
  
  const installButton = document.getElementById('installButton');
  if (installButton) {
    debug('Found install button, adding event listener');
    const originalHref = installButton.getAttribute('href');
    
    installButton.addEventListener('click', function(e) {
      debug('Install button clicked');
      // Capture the click event
      capturePixelEvent('Lead', {
        content_name: 'Install Button Click',
        content_category: 'Conversion'
      });
      
      // Continue with the original link behavior
      // The default action will proceed after our event is tracked
    });
  } else {
    debug('Install button not found');
  }
  
  // Track PageView on load
  debug('Tracking PageView event');
  capturePixelEvent('PageView');
}); 