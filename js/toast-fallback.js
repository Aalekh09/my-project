/* Toast Fallback for Admin Dashboard */
(function() {
  'use strict';
  
  // Simple toast implementation as fallback
  function createSimpleToast(message, type) {
    // Remove existing toasts
    var existingToasts = document.querySelectorAll('.simple-toast');
    existingToasts.forEach(function(toast) {
      toast.remove();
    });
    
    // Create toast element
    var toast = document.createElement('div');
    toast.className = 'simple-toast simple-toast-' + type;
    toast.innerHTML = 
      '<div class="simple-toast-content">' +
        '<span class="simple-toast-icon">' + (type === 'success' ? '✓' : '⚠') + '</span>' +
        '<span class="simple-toast-message">' + message + '</span>' +
        '<button class="simple-toast-close" onclick="this.parentElement.parentElement.remove()">×</button>' +
      '</div>';
    
    // Add styles
    toast.style.cssText = 
      'position: fixed; top: 20px; right: 20px; z-index: 9999; ' +
      'max-width: 350px; padding: 1rem; margin: 0.5rem; ' +
      'background: ' + (type === 'success' ? '#d4edda' : '#f8d7da') + '; ' +
      'color: ' + (type === 'success' ? '#155724' : '#721c24') + '; ' +
      'border: 1px solid ' + (type === 'success' ? '#c3e6cb' : '#f5c6cb') + '; ' +
      'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); ' +
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; ' +
      'animation: slideIn 0.3s ease-out;';
    
    toast.querySelector('.simple-toast-content').style.cssText = 
      'display: flex; align-items: center; gap: 0.5rem;';
    
    toast.querySelector('.simple-toast-icon').style.cssText = 
      'font-weight: bold; font-size: 1.2rem;';
    
    toast.querySelector('.simple-toast-message').style.cssText = 
      'flex: 1; font-size: 0.9rem;';
    
    toast.querySelector('.simple-toast-close').style.cssText = 
      'background: none; border: none; font-size: 1.2rem; cursor: pointer; ' +
      'padding: 0; margin-left: 0.5rem; opacity: 0.7;';
    
    // Add animation styles
    if (!document.getElementById('toast-animations')) {
      var style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = 
        '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }' +
        '@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
      document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
      if (toast.parentNode) {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 5000);
    
    return toast;
  }
  
  // Override the toast functions with fallbacks
  window.originalShowSuccessToast = window.showSuccessToast;
  window.originalShowErrorToast = window.showErrorToast;
  
  window.showSuccessToast = function(message) {
    try {
      // Try Bootstrap Toast first
      if (window.bootstrap && window.bootstrap.Toast) {
        if (window.originalShowSuccessToast) {
          window.originalShowSuccessToast(message);
          return;
        }
      }
    } catch (e) {
      console.log('Bootstrap Toast failed, using fallback');
    }
    
    // Use simple fallback
    createSimpleToast(message, 'success');
  };
  
  window.showErrorToast = function(message) {
    try {
      // Try Bootstrap Toast first
      if (window.bootstrap && window.bootstrap.Toast) {
        if (window.originalShowErrorToast) {
          window.originalShowErrorToast(message);
          return;
        }
      }
    } catch (e) {
      console.log('Bootstrap Toast failed, using fallback');
    }
    
    // Use simple fallback
    createSimpleToast(message, 'error');
  };
  
})();