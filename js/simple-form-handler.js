// Simple form handler for basic inquiry forms
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzz5FtYbvX5LH2QJVddOtoMN2h0DTjSivyeDEcXRcZUuFQkseR0spcR4ckwvzKnT6_I/exec';

document.addEventListener('DOMContentLoaded', function() {
    // Handle simple inquiry forms
    const inquiryForms = document.querySelectorAll('.inquiry-form');
    
    inquiryForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name') || '',
                phone: formData.get('phone') || '',
                course: formData.get('course') || '',
                message: formData.get('message') || '',
                timestamp: new Date().toLocaleString(),
                formType: 'simple_inquiry'
            };
            
            // Get submit button
            const submitBtn = this.querySelector('.btn-submit, button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                // Send to Google Sheets
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully!';
                submitBtn.style.background = '#10b981';
                
                // Reset form
                this.reset();
                
                // Show success notification
                showSuccessNotification('Thank you! Your inquiry has been submitted successfully. We will contact you soon.');
                
                // Close modal if it exists
                const modal = this.closest('.modal');
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        setTimeout(() => modalInstance.hide(), 2000);
                    }
                }
                
            } catch (error) {
                console.error('Error submitting form:', error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
                submitBtn.style.background = '#ef4444';
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    });
});

function showSuccessNotification(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        z-index: 9999;
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .notification-content i {
            font-size: 1.25rem;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}