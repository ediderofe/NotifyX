document.addEventListener('DOMContentLoaded', function() {
  // Check user authentication
  const user = JSON.parse(localStorage.getItem('notifyX_user') || '{}');
  if (!user.isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }

  // Update user info in header
  updateUserInfo(user);

  // Setup menu navigation
  setupMenuNavigation();

  // Handle date filter buttons
  setupDateFilters();

  // Handle notification actions
  setupNotificationActions();

  // Handle website actions
  setupWebsiteActions();

  // Handle new notification button
  setupNewNotificationButton();

  // Handle search functionality
  setupSearch();

  // Initial load of stats
  updateStats('today');
});

function updateUserInfo(user) {
  const userNameElement = document.querySelector('.user-name');
  const userEmailElement = document.querySelector('.user-email');
  const userAvatarElement = document.querySelector('.user-avatar');

  if (userNameElement && userEmailElement) {
    userNameElement.textContent = user.firstName ? `${user.firstName} ${user.lastName}` : user.email;
    userEmailElement.textContent = user.email;
  }
}

function setupMenuNavigation() {
  const menuItems = document.querySelectorAll('.sidebar-nav a');
  const dashboardContent = document.querySelector('.admin-content').innerHTML; // Store original dashboard content
  
  const contentSections = {
    'dashboard': createDashboardSection(dashboardContent),
    'notifications': createNotificationsSection(),
    'websites': createWebsitesSection(),
    'analytics': createAnalyticsSection(),
    'settings': createSettingsSection()
  };

  // Show dashboard by default
  showSection('dashboard');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.getAttribute('href').replace('#', '');
      
      // Update active state
      menuItems.forEach(mi => mi.parentElement.classList.remove('active'));
      item.parentElement.classList.add('active');

      // Show selected section
      showSection(sectionId);
    });
  });

  function showSection(sectionId) {
    const mainContent = document.querySelector('.admin-content');
    mainContent.innerHTML = ''; // Clear current content
    
    // Show selected section
    const section = contentSections[sectionId];
    if (section) {
      mainContent.appendChild(section);
    }
  }
}

function createDashboardSection(dashboardContent) {
  const section = document.createElement('div');
  section.className = 'dashboard-section';
  section.innerHTML = `
    <div class="dashboard-header">
      <h2>Dashboard Overview</h2>
      <div class="date-filter">
        <button class="btn btn-outline btn-sm active">Today</button>
        <button class="btn btn-outline btn-sm">Week</button>
        <button class="btn btn-outline btn-sm">Month</button>
        <button class="btn btn-outline btn-sm">Custom</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-eye"></i>
        </div>
        <div class="stat-info">
          <h3>Total Views</h3>
          <p class="stat-value" data-stat="views">12,543</p>
          <p class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            8.2% vs last week
          </p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-mouse-pointer"></i>
        </div>
        <div class="stat-info">
          <h3>Click Rate</h3>
          <p class="stat-value" data-stat="click-rate">4.8%</p>
          <p class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            1.2% vs last week
          </p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-info">
          <h3>Avg. Time</h3>
          <p class="stat-value" data-stat="avg-time">2.3s</p>
          <p class="stat-change negative">
            <i class="fas fa-arrow-down"></i>
            0.3s vs last week
          </p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>Conversions</h3>
          <p class="stat-value" data-stat="conversions">324</p>
          <p class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            12.5% vs last week
          </p>
        </div>
      </div>
    </div>
    <div class="dashboard-grid">
      <div class="dashboard-card notifications-list">
        <div class="card-header">
          <h3>Active Notifications</h3>
          <button class="btn btn-outline btn-sm">View All</button>
        </div>
        <div class="notification-items">
          <!-- Notification items will be loaded here -->
        </div>
      </div>
      <div class="dashboard-card websites-list">
        <div class="card-header">
          <h3>Connected Websites</h3>
          <button class="btn btn-outline btn-sm">Add Website</button>
        </div>
        <div class="website-items">
          <!-- Website items will be loaded here -->
        </div>
      </div>
    </div>
  `;
  return section;
}

function createNotificationsSection() {
  const section = document.createElement('div');
  section.className = 'notifications-section';
  section.innerHTML = `
    <div class="dashboard-header">
      <h2>All Notifications</h2>
      <button class="btn btn-primary btn-sm">Create New Notification</button>
    </div>
    <div class="notification-items">
      <div class="notification-item">
        <div class="notification-preview">
          <div class="notification-icon">
            <i class="fas fa-tag"></i>
          </div>
          <div class="notification-content">
            <h4>Special Offer</h4>
            <p>Get 20% off your first purchase</p>
          </div>
        </div>
        <div class="notification-stats">
          <span class="stat">
            <i class="fas fa-eye"></i>
            2.4k
          </span>
          <span class="stat">
            <i class="fas fa-mouse-pointer"></i>
            5.2%
          </span>
        </div>
        <div class="notification-actions">
          <button class="btn btn-icon">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-icon">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  return section;
}

function createWebsitesSection() {
  const section = document.createElement('div');
  section.className = 'websites-section';
  section.innerHTML = `
    <div class="dashboard-header">
      <h2>Connected Websites</h2>
      <button class="btn btn-primary btn-sm">Add New Website</button>
    </div>
    <div class="website-items">
      <div class="website-item">
        <div class="website-info">
          <img src="https://via.placeholder.com/32" alt="Website" class="website-icon">
          <div class="website-details">
            <h4>example.com</h4>
            <p>3 active notifications</p>
          </div>
        </div>
        <div class="website-stats">
          <span class="stat">
            <i class="fas fa-eye"></i>
            7.2k views
          </span>
          <span class="stat">
            <i class="fas fa-mouse-pointer"></i>
            5.4% CTR
          </span>
        </div>
        <button class="btn btn-icon">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
  `;
  return section;
}

function createAnalyticsSection() {
  const section = document.createElement('div');
  section.className = 'analytics-section';
  section.innerHTML = `
    <div class="dashboard-header">
      <h2>Analytics Overview</h2>
      <div class="date-filter">
        <button class="btn btn-outline btn-sm active">Today</button>
        <button class="btn btn-outline btn-sm">Week</button>
        <button class="btn btn-outline btn-sm">Month</button>
        <button class="btn btn-outline btn-sm">Custom</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-eye"></i>
        </div>
        <div class="stat-info">
          <h3>Total Views</h3>
          <p class="stat-value" data-stat="views">12,543</p>
          <p class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            8.2% vs last week
          </p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-mouse-pointer"></i>
        </div>
        <div class="stat-info">
          <h3>Click Rate</h3>
          <p class="stat-value" data-stat="click-rate">4.8%</p>
          <p class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            1.2% vs last week
          </p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-info">
          <h3>Avg. Time</h3>
          <p class="stat-value" data-stat="avg-time">2.3s</p>
          <p class="stat-change negative">
            <i class="fas fa-arrow-down"></i>
            0.3s vs last week
          </p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>Conversions</h3>
          <p class="stat-value" data-stat="conversions">324</p>
          <p class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            12.5% vs last week
          </p>
        </div>
      </div>
    </div>
  `;
  return section;
}

function createSettingsSection() {
  const section = document.createElement('div');
  section.className = 'settings-section';
  section.innerHTML = `
    <div class="dashboard-header">
      <h2>Account Settings</h2>
    </div>
    <div class="dashboard-card">
      <div class="card-header">
        <h3>Profile Settings</h3>
      </div>
      <form id="profile-settings">
        <div class="form-group">
          <label>Name</label>
          <input type="text" value="${JSON.parse(localStorage.getItem('notifyX_user') || '{}').firstName || ''}" placeholder="Your name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" value="${JSON.parse(localStorage.getItem('notifyX_user') || '{}').email || ''}" placeholder="Your email">
        </div>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>
    </div>
  `;
  section.style.display = 'none';
  document.querySelector('.admin-content').appendChild(section);
  return section;
}

function setupDateFilters() {
  const dateButtons = document.querySelectorAll('.dashboard-header button');
  dateButtons.forEach(button => {
    button.addEventListener('click', function() {
      dateButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updateStats(this.textContent.toLowerCase());
    });
  });
}

function setupNotificationActions() {
  // View All button
  const viewAllBtn = document.querySelector('.notifications-list .card-header button');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      showNotification('Viewing all notifications...', 'info');
      // Implement view all logic
    });
  }

  // Edit and Delete buttons
  document.querySelectorAll('.notification-actions button').forEach(button => {
    button.addEventListener('click', function() {
      const action = this.querySelector('i').classList.contains('fa-edit') ? 'edit' : 'delete';
      const notificationItem = this.closest('.notification-item');
      
      if (action === 'edit') {
        window.location.href = 'index.html#dashboard';
      } else {
        if (confirm('Are you sure you want to delete this notification?')) {
          notificationItem.remove();
          showNotification('Notification deleted successfully', 'success');
        }
      }
    });
  });
}

function setupWebsiteActions() {
  // Add Website button
  const addWebsiteBtn = document.querySelector('.websites-list .card-header button');
  if (addWebsiteBtn) {
    addWebsiteBtn.addEventListener('click', () => {
      const user = JSON.parse(localStorage.getItem('notifyX_user') || '{}');
      if (user.plan === 'free' && document.querySelectorAll('.website-item:not(.disabled)').length >= 1) {
        showUpgradePrompt();
      } else {
        showAddWebsiteModal();
      }
    });
  }

  // Website menu buttons
  document.querySelectorAll('.website-item .btn-icon').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const websiteItem = this.closest('.website-item');
      showWebsiteMenu(this, websiteItem);
    });
  });

  // Upgrade button
  document.querySelectorAll('.upgrade-btn, button.upgrade').forEach(button => {
    button.addEventListener('click', () => {
      showUpgradePrompt();
    });
  });
}

function setupNewNotificationButton() {
  const newNotificationBtn = document.querySelector('.header-actions button');
  if (newNotificationBtn) {
    newNotificationBtn.addEventListener('click', () => {
      window.location.href = 'index.html#dashboard';
    });
  }
}

function setupSearch() {
  const searchInput = document.querySelector('.header-search input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      searchNotifications(this.value);
    }, 300));
  }
}

function updateStats(period) {
  const stats = {
    today: {
      views: '12,543',
      clickRate: '4.8%',
      avgTime: '2.3s',
      conversions: '324'
    },
    week: {
      views: '85,234',
      clickRate: '5.2%',
      avgTime: '2.1s',
      conversions: '2,156'
    },
    month: {
      views: '342,198',
      clickRate: '4.9%',
      avgTime: '2.2s',
      conversions: '8,432'
    }
  };

  const selectedStats = stats[period] || stats.today;
  
  document.querySelector('[data-stat="views"]').textContent = selectedStats.views;
  document.querySelector('[data-stat="click-rate"]').textContent = selectedStats.clickRate;
  document.querySelector('[data-stat="avg-time"]').textContent = selectedStats.avgTime;
  document.querySelector('[data-stat="conversions"]').textContent = selectedStats.conversions;
}

function showWebsiteMenu(button, websiteItem) {
  const menu = document.createElement('div');
  menu.className = 'website-menu';
  menu.innerHTML = `
    <div class="menu-item"><i class="fas fa-chart-line"></i> View Analytics</div>
    <div class="menu-item"><i class="fas fa-cog"></i> Settings</div>
    <div class="menu-item"><i class="fas fa-code"></i> Copy Script</div>
    <div class="menu-item delete"><i class="fas fa-trash"></i> Remove Website</div>
  `;

  menu.style.cssText = `
    position: absolute;
    background: var(--background-light);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 200px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;

  const rect = button.getBoundingClientRect();
  menu.style.top = rect.bottom + 5 + 'px';
  menu.style.left = rect.left - 150 + 'px';

  document.body.appendChild(menu);

  menu.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.textContent.trim();
      handleWebsiteAction(action, websiteItem);
      menu.remove();
    });
  });

  document.addEventListener('click', function closeMenu(e) {
    if (!menu.contains(e.target) && e.target !== button) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  });
}

function handleWebsiteAction(action, websiteItem) {
  switch (action) {
    case 'View Analytics':
      showNotification('Opening analytics...', 'info');
      break;
    case 'Settings':
      showNotification('Opening settings...', 'info');
      break;
    case 'Copy Script':
      const script = `<script src="https://notifyx.com/notifyx.js" data-website="${websiteItem.querySelector('h4').textContent}"></script>`;
      navigator.clipboard.writeText(script).then(() => {
        showNotification('Script copied to clipboard', 'success');
      });
      break;
    case 'Remove Website':
      if (confirm('Are you sure you want to remove this website?')) {
        websiteItem.remove();
        showNotification('Website removed successfully', 'success');
      }
      break;
  }
}

function showAddWebsiteModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Add Website</h3>
      <form id="add-website-form">
        <div class="form-group">
          <label>Website URL</label>
          <input type="url" required placeholder="https://example.com">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Website</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.btn-outline').addEventListener('click', () => modal.remove());
  modal.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target.querySelector('input').value;
    addNewWebsite(url);
    modal.remove();
  });
}

function showUpgradePrompt() {
  if (confirm('Upgrade to Premium to add more websites and unlock all features?')) {
    window.location.href = 'index.html#pricing';
  }
}

function searchNotifications(query) {
  // Implement notification search logic
  console.log('Searching for:', query);
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
    alert(message);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function addNewWebsite(url) {
  const websitesList = document.querySelector('.website-items');
  const newWebsite = document.createElement('div');
  newWebsite.className = 'website-item';
  newWebsite.innerHTML = `
    <div class="website-info">
      <img src="https://www.google.com/s2/favicons?domain=${url}" alt="Website" class="website-icon">
      <div class="website-details">
        <h4>${new URL(url).hostname}</h4>
        <p>0 active notifications</p>
      </div>
    </div>
    <div class="website-stats">
      <span class="stat">
        <i class="fas fa-eye"></i>
        0 views
      </span>
      <span class="stat">
        <i class="fas fa-mouse-pointer"></i>
        0% CTR
      </span>
    </div>
    <button class="btn btn-icon">
      <i class="fas fa-ellipsis-v"></i>
    </button>
  `;

  // Insert before the "Add another website" item
  const addAnotherItem = websitesList.querySelector('.website-item.disabled');
  websitesList.insertBefore(newWebsite, addAnotherItem);

  showNotification('Website added successfully', 'success');
} 