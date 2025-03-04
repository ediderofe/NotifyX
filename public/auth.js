document.addEventListener('DOMContentLoaded', function() {
  // Determine which form we're dealing with
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('remember-me')?.checked || false;
      
      // Validate form
      if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      if (!password) {
        showNotification('Please enter your password', 'error');
        return;
      }
      
      // Simulate login API call
      showNotification('Logging in...', 'info');
      
      // In a real application, you would make an API call here
      setTimeout(() => {
        // Simulate successful login
        localStorage.setItem('notifyX_user', JSON.stringify({
          email: email,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        }));
        
        if (rememberMe) {
          localStorage.setItem('notifyX_remember', 'true');
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to admin panel after successful login
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1500);
      }, 1000);
    });
  }
  
  // Handle signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const termsAgreed = document.getElementById('terms').checked;
      
      // Validate form
      if (!firstName || !lastName) {
        showNotification('Please enter your full name', 'error');
        return;
      }
      
      if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
      }
      
      if (!termsAgreed) {
        showNotification('You must agree to the Terms of Service and Privacy Policy', 'error');
        return;
      }
      
      // Simulate signup API call
      showNotification('Creating your account...', 'info');
      
      // In a real application, you would make an API call here
      setTimeout(() => {
        // Simulate successful signup
        localStorage.setItem('notifyX_user', JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          isLoggedIn: true,
          signupTime: new Date().toISOString()
        }));
        
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Redirect to admin panel after successful signup
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1500);
      }, 1000);
    });
  }
  
  // Social login buttons
  const socialButtons = document.querySelectorAll('.btn-social');
  socialButtons.forEach(button => {
    button.addEventListener('click', function() {
      const provider = this.classList.contains('btn-google') ? 'Google' : 'GitHub';
      showNotification(`${provider} authentication is not implemented in this demo`, 'info');
    });
  });
  
  // Helper functions
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  function showNotification(message, type = 'info') {
    // Check if NotifyX is available
    if (typeof NotifyX !== 'undefined') {
      NotifyX.show({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message: message,
        type: type,
        duration: 3000,
        position: 'top-right'
      });
    } else {
      // Fallback to alert if NotifyX is not available
      alert(message);
    }
  }
}); 