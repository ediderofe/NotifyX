/**
 * NotifyX - Frontend Application
 */

// Configuration
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? `http://${window.location.hostname}:3000` 
  : 'https://notifyx.com';

// DOM Elements
const notificationForm = document.getElementById('notification-form');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const previewBtn = document.getElementById('preview-btn');
const saveBtn = document.getElementById('save-btn');
const copyCodeBtn = document.getElementById('copy-code');
const previewNotification = document.getElementById('preview-notification');
const embedCode = document.getElementById('embed-code');
const analyticsContainer = document.querySelector('.analytics-container');
const templateCards = document.querySelectorAll('.template-card');
const page1 = document.getElementById('page-1');
const page2 = document.getElementById('page-2');

// Form Elements
const notificationIdInput = document.getElementById('notificationId');
const userIdInput = document.getElementById('userId');
const titleInput = document.getElementById('title');
const messageInput = document.getElementById('message');
const buttonTextInput = document.getElementById('buttonText');
const buttonUrlInput = document.getElementById('buttonUrl');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');
const backgroundColorInput = document.getElementById('backgroundColor');
const textColorInput = document.getElementById('textColor');
const buttonColorInput = document.getElementById('buttonColor');
const buttonTextColorInput = document.getElementById('buttonTextColor');
const positionSelect = document.getElementById('position');
const triggerTypeRadios = document.querySelectorAll('input[name="triggerType"]');
const triggerValueInput = document.getElementById('triggerValue');
const durationValueInput = document.getElementById('durationValue');
const timeControls = document.getElementById('time-controls');
const triggerValueLabel = document.getElementById('trigger-value-label');

// Preview Elements
const previewTitle = document.getElementById('preview-title');
const previewMessage = document.getElementById('preview-message');
const previewButton = document.getElementById('preview-button');
const previewImage = document.getElementById('preview-image');
const previewImageContainer = document.getElementById('preview-image-container');

// Analytics Elements
const viewCount = document.getElementById('view-count');
const clickCount = document.getElementById('click-count');
const ctrElement = document.getElementById('ctr');

// State
let currentNotification = null;
let imageFile = null;

// Template definitions
const templates = {
  visitors: {
    title: '3405 Visitors',
    message: 'in the last 24 hours',
    buttonText: '',
    buttonUrl: '',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    buttonColor: '#4361ee',
    buttonTextColor: '#ffffff',
    position: 'bottom-right',
    triggerType: 'time',
    triggerValue: 5,
    imageUrl: 'https://via.placeholder.com/40/6c5ce7/ffffff?text=👥'
  },
  email: {
    title: 'Check your mails!',
    message: 'we sent you a present',
    buttonText: '',
    buttonUrl: '',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    buttonColor: '#4361ee',
    buttonTextColor: '#ffffff',
    position: 'bottom-right',
    triggerType: 'time',
    triggerValue: 5,
    imageUrl: 'https://via.placeholder.com/40/e74c3c/ffffff?text=✉️'
  },
  social: {
    title: 'Follow me on X!',
    message: 'for questions and feedback :)',
    buttonText: '',
    buttonUrl: '',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    buttonColor: '#4361ee',
    buttonTextColor: '#ffffff',
    position: 'bottom-right',
    triggerType: 'time',
    triggerValue: 5,
    imageUrl: 'https://via.placeholder.com/40/1da1f2/ffffff?text=𝕏'
  },
  custom: {
    title: 'Custom Notification',
    message: 'Create your own notification',
    buttonText: 'Learn More',
    buttonUrl: '#',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    buttonColor: '#4361ee',
    buttonTextColor: '#ffffff',
    position: 'bottom-right',
    triggerType: 'time',
    triggerValue: 5,
    imageUrl: 'https://via.placeholder.com/40/27ae60/ffffff?text=★'
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Load user's notifications (if any)
  loadNotifications();
  
  // Set up event listeners
  notificationForm.addEventListener('submit', handleFormSubmit);
  nextBtn.addEventListener('click', showPage2);
  backBtn.addEventListener('click', showPage1);
  copyCodeBtn.addEventListener('click', copyEmbedCode);
  
  // Template selection
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      const templateName = card.getAttribute('data-template');
      applyTemplate(templateName);
    });
  });
  
  // Live preview updates
  titleInput.addEventListener('input', updatePreview);
  messageInput.addEventListener('input', updatePreview);
  buttonTextInput.addEventListener('input', updatePreview);
  buttonUrlInput.addEventListener('input', updatePreview);
  backgroundColorInput.addEventListener('input', updatePreview);
  textColorInput.addEventListener('input', updatePreview);
  buttonColorInput.addEventListener('input', updatePreview);
  buttonTextColorInput.addEventListener('input', updatePreview);
  positionSelect.addEventListener('change', updatePreviewPosition);
  
  // Image preview
  imageInput.addEventListener('change', handleImageChange);
  
  // Trigger type change
  triggerTypeRadios.forEach(radio => {
    radio.addEventListener('change', updateTriggerValueLabel);
  });
});

function showPage1() {
  page2.style.display = 'none';
  page1.style.display = 'block';
  page1.style.animation = 'fadeIn 0.3s ease';
}

function showPage2() {
  // Validate required fields on page 1
  if (!titleInput.value || !messageInput.value) {
    alert('Please fill in all required fields');
    return;
  }
  
  page1.style.display = 'none';
  page2.style.display = 'block';
  page2.style.animation = 'fadeIn 0.3s ease';
}

// Apply template to form
function applyTemplate(templateName) {
  const template = templates[templateName];
  if (!template) return;
  
  // Set form values
  titleInput.value = template.title;
  messageInput.value = template.message;
  buttonTextInput.value = template.buttonText || '';
  buttonUrlInput.value = template.buttonUrl || '';
  backgroundColorInput.value = template.backgroundColor;
  textColorInput.value = template.textColor;
  buttonColorInput.value = template.buttonColor;
  buttonTextColorInput.value = template.buttonTextColor;
  positionSelect.value = template.position;
  
  // Set trigger type
  document.getElementById(`trigger-${template.triggerType}`).checked = true;
  
  // Set trigger value
  triggerValueInput.value = template.triggerValue;
  
  // Update trigger value label
  updateTriggerValueLabel();
  
  // Update image preview if exists
  if (template.imageUrl) {
    imagePreview.style.backgroundImage = `url(${template.imageUrl})`;
    imagePreview.style.display = 'block';
    
    // Update notification preview
    previewImageContainer.style.display = 'block';
    previewImage.src = template.imageUrl;
  } else {
    imagePreview.style.backgroundImage = '';
    imagePreview.style.display = 'flex';
    previewImageContainer.style.display = 'none';
  }
  
  // Update preview
  updatePreview();
  
  // Scroll to form
  document.querySelector('.notification-form').scrollIntoView({ behavior: 'smooth' });
}

// Load user's notifications
async function loadNotifications() {
  try {
    const userId = userIdInput.value;
    
    if (!userId) return;
    
    const response = await fetch(`${API_URL}/api/notifications/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load notifications');
    }
    
    const notifications = await response.json();
    
    if (notifications.length > 0) {
      // Load the first notification
      loadNotification(notifications[0]);
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

// Load a notification into the form
function loadNotification(notification) {
  currentNotification = notification;
  
  // Set form values
  notificationIdInput.value = notification._id;
  titleInput.value = notification.title;
  messageInput.value = notification.message;
  buttonTextInput.value = notification.buttonText || '';
  buttonUrlInput.value = notification.buttonUrl || '';
  backgroundColorInput.value = notification.backgroundColor || '#ffffff';
  textColorInput.value = notification.textColor || '#000000';
  buttonColorInput.value = notification.buttonColor || '#4CAF50';
  buttonTextColorInput.value = notification.buttonTextColor || '#ffffff';
  positionSelect.value = notification.position || 'bottom-right';
  
  // Set trigger type
  const triggerType = notification.trigger?.type || 'time';
  document.getElementById(`trigger-${triggerType}`).checked = true;
  
  // Set trigger value
  triggerValueInput.value = notification.trigger?.value || 5;
  
  // Update trigger value label
  updateTriggerValueLabel();
  
  // Update image preview if exists
  if (notification.imageUrl) {
    imagePreview.style.backgroundImage = `url(${API_URL}${notification.imageUrl})`;
    imagePreview.style.display = 'block';
  } else {
    imagePreview.style.backgroundImage = '';
    imagePreview.style.display = 'flex';
  }
  
  // Update embed code
  updateEmbedCode(notification._id);
  
  // Load analytics
  loadAnalytics(notification._id);
  
  // Update preview
  updatePreview();
}

// Update the preview
function updatePreview() {
  // Update text content
  previewTitle.textContent = titleInput.value || 'Notification Title';
  previewMessage.textContent = messageInput.value || 'Your notification message will appear here.';
  
  // Update colors
  previewNotification.style.backgroundColor = backgroundColorInput.value;
  previewNotification.style.color = textColorInput.value;
  
  // Update button if both text and URL are provided
  if (buttonTextInput.value && buttonUrlInput.value) {
    previewButton.textContent = buttonTextInput.value;
    previewButton.href = buttonUrlInput.value;
    previewButton.style.display = 'inline-block';
  } else {
    previewButton.style.display = 'none';
  }
}

// Update preview position
function updatePreviewPosition() {
  // Remove all position classes
  previewNotification.classList.remove(
    'notifyx-top-left', 
    'notifyx-top-right', 
    'notifyx-bottom-left', 
    'notifyx-bottom-right'
  );
  
  // Add selected position class
  previewNotification.classList.add(`notifyx-${positionSelect.value}`);
}

// Update trigger value label based on selected trigger type
function updateTriggerValueLabel() {
  const selectedTriggerType = document.querySelector('input[name="triggerType"]:checked').value;
  
  if (selectedTriggerType === 'exit') {
    timeControls.style.display = 'none';
  } else if (selectedTriggerType === 'scroll') {
    timeControls.style.display = 'block';
    triggerValueInput.max = 100;
    triggerValueInput.value = Math.min(triggerValueInput.value, 100);
    document.querySelector('.time-control:first-child span').textContent = '%';
  } else {
    timeControls.style.display = 'block';
    triggerValueInput.max = 300;
    document.querySelector('.time-control:first-child span').textContent = 'seconds';
  }
}

// Handle image change
function handleImageChange(event) {
  const file = event.target.files[0];
  
  if (!file) {
    imagePreview.style.backgroundImage = '';
    imagePreview.style.display = 'flex';
    imageFile = null;
    previewImageContainer.style.display = 'none';
    return;
  }
  
  // Store file for later upload
  imageFile = file;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    // Create a temporary image to get dimensions
    const img = new Image();
    img.onload = function() {
      // Create a canvas to resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set the canvas size to 48x48 (our desired icon size)
      canvas.width = 48;
      canvas.height = 48;
      
      // Calculate the crop dimensions to maintain aspect ratio
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;
      
      if (img.width > img.height) {
        sourceWidth = img.height;
        sourceX = (img.width - img.height) / 2;
      } else {
        sourceHeight = img.width;
        sourceY = (img.height - img.width) / 2;
      }
      
      // Draw the image on the canvas with proper cropping
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,  // Source rectangle
        0, 0, 48, 48                                  // Destination rectangle
      );
      
      // Get the resized image data
      const resizedImage = canvas.toDataURL('image/png');
      
      // Update previews
      imagePreview.style.backgroundImage = `url(${resizedImage})`;
      imagePreview.style.display = 'block';
      imagePreview.style.backgroundSize = 'cover';
      
      // Update notification preview
      previewImageContainer.style.display = 'flex';
      previewImage.src = resizedImage;
      previewImage.style.display = 'block';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  
  try {
    // Create FormData object
    const formData = new FormData();
    
    // Add form fields
    formData.append('userId', userIdInput.value);
    formData.append('title', titleInput.value);
    formData.append('message', messageInput.value);
    formData.append('buttonText', buttonTextInput.value);
    formData.append('buttonUrl', buttonUrlInput.value);
    formData.append('backgroundColor', backgroundColorInput.value);
    formData.append('textColor', textColorInput.value);
    formData.append('buttonColor', buttonColorInput.value);
    formData.append('buttonTextColor', buttonTextColorInput.value);
    formData.append('position', positionSelect.value);
    formData.append('duration', durationValueInput.value);
    
    // Add trigger data
    const triggerType = document.querySelector('input[name="triggerType"]:checked').value;
    formData.append('trigger[type]', triggerType);
    formData.append('trigger[value]', triggerType === 'exit' ? 0 : triggerValueInput.value);
    
    // Add image if selected
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Determine if this is a create or update operation
    const notificationId = notificationIdInput.value;
    let url = `${API_URL}/api/notifications`;
    let method = 'POST';
    
    if (notificationId) {
      url = `${API_URL}/api/notifications/${notificationId}`;
      method = 'PUT';
    }
    
    // Disable save button and show loading state
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    // Send request
    const response = await fetch(url, {
      method,
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to save notification');
    }
    
    // Get saved notification
    const savedNotification = await response.json();
    
    // Update form with saved notification
    loadNotification(savedNotification);
    
    // Show success message
    alert('Notification saved successfully!');
  } catch (error) {
    console.error('Error saving notification:', error);
    alert('Failed to save notification. Please try again.');
  } finally {
    // Re-enable save button
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Notification';
  }
}

// Update embed code
function updateEmbedCode(notificationId) {
  if (!notificationId) {
    embedCode.textContent = '<script src="https://notifyx.com/notifyx.js" data-id="your-notification-id"></script>';
    return;
  }
  
  embedCode.textContent = `<script src="https://notifyx.com/notifyx.js" data-id="${notificationId}"></script>`;
}

// Copy embed code to clipboard
function copyEmbedCode() {
  const code = embedCode.textContent;
  navigator.clipboard.writeText(code)
    .then(() => {
      // Show success feedback
      const originalText = copyCodeBtn.innerHTML;
      copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';
      
      setTimeout(() => {
        copyCodeBtn.innerHTML = originalText;
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy code:', err);
      alert('Failed to copy code. Please try again.');
    });
}

// Load analytics for a notification
async function loadAnalytics(notificationId) {
  if (!notificationId) {
    analyticsContainer.style.display = 'none';
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/analytics/${notificationId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load analytics');
    }
    
    const analytics = await response.json();
    
    // Update analytics display
    viewCount.textContent = analytics.views || 0;
    clickCount.textContent = analytics.clicks || 0;
    
    // Calculate CTR
    const views = analytics.views || 0;
    const clicks = analytics.clicks || 0;
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : 0;
    ctrElement.textContent = `${ctr}%`;
    
    // Show analytics container
    analyticsContainer.style.display = 'block';
  } catch (error) {
    console.error('Error loading analytics:', error);
    analyticsContainer.style.display = 'none';
  }
} 