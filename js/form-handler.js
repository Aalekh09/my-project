// Google Apps Script Web App URL (you'll need to replace this with your actual URL)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9mVeoZrUfsRFtWyO9BWgORRrzGKtfAcBub4DxZblNs4Gv_7W8uMUy5qs9e6zKvpvz/exec';

// Form submission handler
async function submitForm(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp
    data.timestamp = new Date().toLocaleString();
    
    try {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        
        // Send data to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Reset form
        form.reset();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('enquiryModal'));
        modal.hide();
        
        // Show success message
        const toast = new bootstrap.Toast(document.getElementById('successToast'));
        toast.show();
        
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your enquiry. Please try again later.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enquiryForm');
    const phoneInput = document.getElementById('phone');
    
    // Phone number validation
    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
    
    // Form validation
    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });
}); 