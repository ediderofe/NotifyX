/**
 * NotifyX - Lightweight Website Notification Tool
 * v1.0.0
 */

(function() {
  // Configuration
  const scriptTag = document.currentScript;
  const notificationId = scriptTag.getAttribute('data-id');
  const apiUrl = scriptTag.getAttribute('data-api') || 'https://notifyx.com';
  
  // Notification state
  let notification = null;
  let notificationShown = false;
  let notificationElement = null;
  
  // Fetch notification data
  const fetchNotification = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/notification/${notificationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notification');
      }
      notification = await response.json();
      
      // Track view (just fetch, don't wait for response)
      fetch(`${apiUrl}/api/analytics/view/${notificationId}`, {
        method: 'POST',
      }).catch(err => console.error('Failed to track view:', err));
      
      // Set up triggers
      setupTriggers();
    } catch (error) {
      console.error('NotifyX Error:', error);
    }
  };
  
  // Set up notification triggers
  const setupTriggers = () => {
    if (!notification || !notification.active) return;
    
    const { trigger } = notification;
    
    switch (trigger.type) {
      case 'time':
        // Show after X seconds
        setTimeout(() => {
          showNotification();
        }, trigger.value * 1000);
        break;
        
      case 'scroll':
        // Show when user scrolls X% of the page
        window.addEventListener('scroll', () => {
          const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercentage >= trigger.value && !notificationShown) {
            showNotification();
          }
        });
        break;
        
      case 'exit':
        // Show on exit intent
        document.addEventListener('mouseleave', (e) => {
          if (e.clientY <= 0 && !notificationShown) {
            showNotification();
          }
        });
        break;
    }
  };
  
  // Create and show notification
  const showNotification = () => {
    if (notificationShown || !notification) return;
    
    // Create notification element
    notificationElement = document.createElement('div');
    notificationElement.className = 'notifyx-notification';
    
    // Set position
    notificationElement.classList.add(`notifyx-${notification.position || 'bottom-right'}`);
    
    // Create notification content
    const content = document.createElement('div');
    content.className = 'notifyx-content';
    
    // Add image if available
    if (notification.imageUrl) {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'notifyx-image-container';
      
      const image = document.createElement('img');
      image.src = `${apiUrl}${notification.imageUrl}`;
      image.className = 'notifyx-image';
      imageContainer.appendChild(image);
      content.appendChild(imageContainer);
    }
    
    // Add text content
    const textContent = document.createElement('div');
    textContent.className = 'notifyx-text-content';
    
    const title = document.createElement('h3');
    title.className = 'notifyx-title';
    title.textContent = notification.title;
    textContent.appendChild(title);
    
    const message = document.createElement('p');
    message.className = 'notifyx-message';
    message.textContent = notification.message;
    textContent.appendChild(message);
    
    content.appendChild(textContent);
    notificationElement.appendChild(content);
    
    // Add button if available
    if (notification.buttonText && notification.buttonUrl) {
      const button = document.createElement('a');
      button.className = 'notifyx-button';
      button.textContent = notification.buttonText;
      button.href = notification.buttonUrl;
      button.target = '_blank';
      button.style.backgroundColor = notification.buttonColor || '#4361ee';
      button.style.color = notification.buttonTextColor || '#ffffff';
      
      // Track click
      button.addEventListener('click', () => {
        fetch(`${apiUrl}/api/analytics/click/${notificationId}`, {
          method: 'POST',
        }).catch(err => console.error('Failed to track click:', err));
      });
      
      notificationElement.appendChild(button);
    }
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notifyx-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', hideNotification);
    notificationElement.appendChild(closeButton);
    
    // Apply styles
    notificationElement.style.backgroundColor = notification.backgroundColor || '#ffffff';
    notificationElement.style.color = notification.textColor || '#000000';
    
    // Add styles to document
    addStyles();
    
    // Add to document
    document.body.appendChild(notificationElement);
    
    // Show with animation
    setTimeout(() => {
      notificationElement.classList.add('notifyx-show');
    }, 10);
    
    notificationShown = true;
    
    // Auto-hide after 7 seconds if not interacted with
    setTimeout(() => {
      if (notificationElement && notificationElement.parentNode) {
        hideNotification();
      }
    }, 7000);
  };
  
  // Hide notification
  const hideNotification = () => {
    if (!notificationElement) return;
    
    notificationElement.classList.remove('notifyx-show');
    
    // Remove after animation
    setTimeout(() => {
      if (notificationElement && notificationElement.parentNode) {
        notificationElement.parentNode.removeChild(notificationElement);
      }
      notificationElement = null;
    }, 300);
  };
  
  // Add CSS styles
  const addStyles = () => {
    if (document.getElementById('notifyx-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'notifyx-styles';
    styleElement.textContent = `
      .notifyx-notification {
        position: fixed;
        width: 320px;
        max-width: 90%;
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 16px;
        z-index: 9999;
        opacity: 0;
        transform: translateX(30px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
      
      .notifyx-show {
        opacity: 1;
        transform: translateX(0);
      }
      
      .notifyx-top-left {
        top: 20px;
        left: 20px;
        transform: translateX(-30px);
      }
      
      .notifyx-top-right {
        top: 20px;
        right: 20px;
      }
      
      .notifyx-bottom-left {
        bottom: 20px;
        left: 20px;
        transform: translateX(-30px);
      }
      
      .notifyx-bottom-right {
        bottom: 20px;
        right: 20px;
      }
      
      .notifyx-content {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      
      .notifyx-image-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
      }
      
      .notifyx-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
      }
      
      .notifyx-text-content {
        flex: 1;
      }
      
      .notifyx-title {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
      
      .notifyx-message {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
        color: #666;
      }
      
      .notifyx-button {
        display: inline-block;
        padding: 8px 16px;
        background-color: #4361ee;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin-top: 4px;
        align-self: flex-start;
      }
      
      .notifyx-button:hover {
        opacity: 0.9;
      }
      
      .notifyx-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      
      .notifyx-close:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      @media (max-width: 576px) {
        .notifyx-notification {
          width: calc(100% - 40px);
          max-width: none;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
  };
  
  // Initialize
  if (notificationId) {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fetchNotification);
    } else {
      fetchNotification();
    }
  } else {
    console.error('NotifyX Error: Missing data-id attribute');
  }
})(); 