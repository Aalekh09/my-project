// Google Apps Script Web App URL - Updated to latest deployment
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzz5FtYbvX5LH2QJVddOtoMN2h0DTjSivyeDEcXRcZUuFQkseR0spcR4ckwvzKnT6_I/exec';

// Multi-step form management
class ProfessionalFormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.setupValidation();
        this.setupPercentageCalculators();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
        
        // Form submission
        document.getElementById('enquiryForm').addEventListener('submit', (e) => this.submitForm(e));
        
        // Real-time validation
        document.querySelectorAll('.professional-input').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Modal reset on close
        document.getElementById('enquiryModal').addEventListener('hidden.bs.modal', () => this.resetForm());
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateUI();
                if (this.currentStep === 3) {
                    this.populateReview();
                }
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    updateUI() {
        // Update progress steps
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update form steps
        document.querySelectorAll('.form-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active');
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
        nextBtn.style.display = this.currentStep === this.totalSteps ? 'none' : 'inline-flex';
        submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-flex' : 'none';
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('.professional-input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Phone number validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit mobile number';
            }
        }

        // Year validation
        if (field.name.includes('_year') && value) {
            const year = parseInt(value);
            const currentYear = new Date().getFullYear();
            if (year < 1990 || year > currentYear + 1) {
                isValid = false;
                errorMessage = `Please enter a valid year between 1990 and ${currentYear + 1}`;
            }
        }

        // Marks validation
        if ((field.name.includes('_obtained') || field.name.includes('_total')) && value) {
            const marks = parseInt(value);
            if (marks < 0 || marks > 1000) {
                isValid = false;
                errorMessage = 'Please enter valid marks';
            }
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, errorMessage) {
        field.classList.remove('is-valid', 'is-invalid');
        
        if (isValid) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
            
            // Show custom error message
            let feedback = field.parentNode.querySelector('.invalid-feedback');
            if (feedback && errorMessage) {
                feedback.textContent = errorMessage;
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
    }

    setupValidation() {
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });

        // Name fields - only letters and spaces
        ['name', 'fatherName'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
            });
        });
    }

    setupPercentageCalculators() {
        const qualifications = ['tenth', 'twelfth', 'graduation', 'postgraduation'];
        
        qualifications.forEach(qual => {
            const obtainedField = document.getElementById(`${qual}_obtained`);
            const totalField = document.getElementById(`${qual}_total`);
            const percentageDiv = document.getElementById(`${qual}_percentage`);

            [obtainedField, totalField].forEach(field => {
                if (field) {
                    field.addEventListener('input', () => {
                        this.calculatePercentage(qual, obtainedField, totalField, percentageDiv);
                    });
                }
            });
        });
    }

    calculatePercentage(qualification, obtainedField, totalField, percentageDiv) {
        const obtained = parseFloat(obtainedField.value);
        const total = parseFloat(totalField.value);

        if (obtained && total && total > 0) {
            const percentage = ((obtained / total) * 100).toFixed(2);
            percentageDiv.innerHTML = `<i class="fas fa-calculator me-2"></i>Percentage: <strong>${percentage}%</strong>`;
            percentageDiv.classList.add('show');
            
            // Add color coding based on percentage
            percentageDiv.className = 'percentage-display show';
            if (percentage >= 75) {
                percentageDiv.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
                percentageDiv.style.borderLeftColor = '#22c55e';
                percentageDiv.style.color = '#15803d';
            } else if (percentage >= 60) {
                percentageDiv.style.background = 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
                percentageDiv.style.borderLeftColor = '#f59e0b';
                percentageDiv.style.color = '#92400e';
            } else {
                percentageDiv.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';
                percentageDiv.style.borderLeftColor = '#ef4444';
                percentageDiv.style.color = '#dc2626';
            }
        } else {
            percentageDiv.classList.remove('show');
        }
    }

    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('.professional-input');
        
        inputs.forEach(input => {
            this.formData[input.name] = input.value;
        });
    }

    populateReview() {
        // Personal Information Review
        const personalReview = document.getElementById('reviewPersonal');
        personalReview.innerHTML = `
            <div class="review-item">
                <span class="review-label">Full Name:</span>
                <span class="review-value">${this.formData.name || 'Not provided'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Father's Name:</span>
                <span class="review-value">${this.formData.fatherName || 'Not provided'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Contact Number:</span>
                <span class="review-value">${this.formData.phone || 'Not provided'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Course:</span>
                <span class="review-value">${this.formData.course || 'Not selected'}</span>
            </div>
        `;

        // Academic Review
        const academicReview = document.getElementById('reviewAcademic');
        const qualifications = [
            { key: 'tenth', label: '10th Standard' },
            { key: 'twelfth', label: '12th Standard' },
            { key: 'graduation', label: 'Graduation' },
            { key: 'postgraduation', label: 'Post Graduation' }
        ];

        let academicHTML = '';
        qualifications.forEach(qual => {
            const obtained = this.formData[`${qual.key}_obtained`];
            const total = this.formData[`${qual.key}_total`];
            const year = this.formData[`${qual.key}_year`];
            
            // Only show if at least one field has data
            if (obtained || total || year) {
                const percentage = obtained && total ? ((obtained / total) * 100).toFixed(2) : 'N/A';
                
                academicHTML += `
                    <div class="review-item">
                        <span class="review-label">${qual.label}:</span>
                        <span class="review-value">${obtained || 'N/A'}/${total || 'N/A'} (${percentage}%) - ${year || 'N/A'}</span>
                    </div>
                `;
            }
        });

        // Add additional qualification if provided
        if (this.formData.additional_qualification || this.formData.additional_details) {
            academicHTML += `
                <div class="review-item">
                    <span class="review-label">Additional Qualification:</span>
                    <span class="review-value">${this.formData.additional_qualification || 'Not specified'}</span>
                </div>
            `;
            if (this.formData.additional_details) {
                academicHTML += `
                    <div class="review-item">
                        <span class="review-label">Additional Details:</span>
                        <span class="review-value">${this.formData.additional_details}</span>
                    </div>
                `;
            }
        }

        academicReview.innerHTML = academicHTML;
    }

    async submitForm(event) {
        event.preventDefault();
        
        // Final validation
        if (!this.validateCurrentStep()) {
            return;
        }

        // Check terms acceptance
        const termsCheckbox = document.getElementById('termsAccept');
        if (!termsCheckbox.checked) {
            alert('Please accept the terms and conditions to proceed.');
            return;
        }

        this.saveCurrentStepData();
        
        // Add timestamp
        this.formData.timestamp = new Date().toLocaleString();
        
        try {
            // Show loading state
            const submitButton = document.getElementById('submitBtn');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.classList.add('btn-loading');
            
            // Send data to Google Sheets
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.formData)
            });
            
            // Reset form and close modal
            this.resetForm();
            const modal = bootstrap.Modal.getInstance(document.getElementById('enquiryModal'));
            modal.hide();
            
            // Show enhanced success message
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Error:', error);
            this.showErrorMessage();
        } finally {
            // Reset button state
            const submitButton = document.getElementById('submitBtn');
            submitButton.disabled = false;
            submitButton.classList.remove('btn-loading');
            submitButton.innerHTML = originalText;
        }
    }

    resetForm() {
        this.currentStep = 1;
        this.formData = {};
        document.getElementById('enquiryForm').reset();
        document.querySelectorAll('.professional-input').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        document.querySelectorAll('.percentage-display').forEach(div => {
            div.classList.remove('show');
        });
        this.updateUI();
    }

    showSuccessMessage() {
        // Create enhanced success notification
        const successHTML = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <i class="fas fa-check-circle me-2"></i>
                        <strong class="me-auto">Application Submitted Successfully!</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        <p class="mb-2"><strong>Thank you for your application!</strong></p>
                        <p class="mb-1">• We'll contact you within 24 hours</p>
                        <p class="mb-1">• Check your phone for updates</p>
                        <p class="mb-0">• Application ID: #${Date.now().toString().slice(-6)}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHTML);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            const toastElement = document.querySelector('.toast-container');
            if (toastElement) {
                toastElement.remove();
            }
        }, 8000);
    }

    showErrorMessage() {
        alert('There was an error submitting your application. Please try again or contact us directly at +91 9871261719.');
    }
}

// Initialize the professional form manager
document.addEventListener('DOMContentLoaded', function() {
    new ProfessionalFormManager();
}); 