/**
 * Saha Institute AI Chatbot
 * Provides instant student support and admin notifications
 */

class SahaInstituteChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.sessionId = this.generateSessionId();
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotWidget();
        this.attachEventListeners();
        this.loadWelcomeMessage();
    }

    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createChatbotWidget() {
        // Create chatbot widget HTML structure
        const chatbotHTML = `
            <!-- Chatbot Floating Button -->
            <div id="chatbot-widget" class="chatbot-widget">
                <div class="chatbot-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chatbot-notification-badge" id="chatbot-badge" style="display: none;">
                    <span id="badge-count">1</span>
                </div>
            </div>

            <!-- Chat Container -->
            <div id="chat-container" class="chat-container" style="display: none;">
                <div class="chat-header">
                    <div class="chat-header-content">
                        <div class="chat-avatar">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="chat-title">
                            <h4>Saha Institute Assistant</h4>
                            <p class="chat-status">Online • Ready to help</p>
                        </div>
                    </div>
                    <div class="chat-controls">
                        <button id="minimize-chat" class="chat-control-btn" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button id="close-chat" class="chat-control-btn" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="chat-messages" id="chat-messages">
                    <!-- Messages will be dynamically added here -->
                </div>

                <div class="chat-input-container">
                    <div class="typing-indicator" id="typing-indicator" style="display: none;">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span class="typing-text">Assistant is typing...</span>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chat-input-field" placeholder="Type your message..." maxlength="500">
                        <button id="send-message" class="send-btn" title="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add chatbot to page
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        // Floating widget click
        document.getElementById('chatbot-widget').addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chat button
        document.getElementById('close-chat').addEventListener('click', () => {
            this.closeChat();
        });

        // Minimize chat button
        document.getElementById('minimize-chat').addEventListener('click', () => {
            this.minimizeChat();
        });

        // Send message button
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in input field
        document.getElementById('chat-input-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Focus input when chat opens
        document.getElementById('chat-input-field').addEventListener('focus', () => {
            this.hideNotificationBadge();
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatContainer = document.getElementById('chat-container');
        const widget = document.getElementById('chatbot-widget');
        
        chatContainer.style.display = 'flex';
        widget.classList.add('chat-open');
        
        // Animate chat opening
        setTimeout(() => {
            chatContainer.classList.add('chat-visible');
        }, 10);

        this.isOpen = true;
        this.isMinimized = false;
        
        // Add welcome message if this is the first time opening
        if (this.messages.length === 0) {
            setTimeout(() => {
                this.addMessage("Hello! 👋 Welcome to Saha Institute of Management and Technology!\n\nI can help you with:\n🎓 Course information (B.Ed, LLB, MBA, M.Ed)\n📝 Admission process\n💰 Fee details\n📞 Contact information\n\nWhat would you like to know?", 'bot');
            }, 500);
        }
        
        // Focus input field
        setTimeout(() => {
            document.getElementById('chat-input-field').focus();
        }, 800);

        this.hideNotificationBadge();
    }

    closeChat() {
        const chatContainer = document.getElementById('chat-container');
        const widget = document.getElementById('chatbot-widget');
        
        chatContainer.classList.remove('chat-visible');
        widget.classList.remove('chat-open');
        
        setTimeout(() => {
            chatContainer.style.display = 'none';
        }, 300);

        this.isOpen = false;
        this.isMinimized = false;
    }

    minimizeChat() {
        const chatContainer = document.getElementById('chat-container');
        
        if (this.isMinimized) {
            // Restore chat
            chatContainer.classList.remove('chat-minimized');
            this.isMinimized = false;
            document.getElementById('minimize-chat').innerHTML = '<i class="fas fa-minus"></i>';
        } else {
            // Minimize chat
            chatContainer.classList.add('chat-minimized');
            this.isMinimized = true;
            document.getElementById('minimize-chat').innerHTML = '<i class="fas fa-window-restore"></i>';
        }
    }

    sendMessage() {
        const inputField = document.getElementById('chat-input-field');
        const message = inputField.value.trim();
        
        if (message === '') return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        inputField.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message with basic keyword matching
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.processUserMessage(message);
            this.addMessage(response, 'bot');
        }, 1500);
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageId = 'msg_' + Date.now();
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const messageHTML = `
            <div class="chat-message ${sender}-message" id="${messageId}">
                <div class="message-content">
                    <div class="message-text">${this.formatMessage(content)}</div>
                    <div class="message-time">${timestamp}</div>
                </div>
                ${sender === 'bot' ? '<div class="message-avatar"><i class="fas fa-robot"></i></div>' : ''}
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({
            id: messageId,
            content: content,
            sender: sender,
            timestamp: new Date()
        });
    }

    showTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'flex';
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'none';
    }

    showNotificationBadge(count = 1) {
        const badge = document.getElementById('chatbot-badge');
        const badgeCount = document.getElementById('badge-count');
        badgeCount.textContent = count;
        badge.style.display = 'block';
    }

    hideNotificationBadge() {
        document.getElementById('chatbot-badge').style.display = 'none';
    }

    loadWelcomeMessage() {
        // Add welcome message when chatbot initializes
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotificationBadge();
            }
        }, 3000);
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for course inquiries
        if (this.containsKeywords(lowerMessage, ['bed', 'b.ed', 'bachelor of education', 'teaching'])) {
            return "🎓 **Bachelor of Education (B.Ed)** - 2 Years\n\nTransform into an inspiring educator! Our B.Ed program includes:\n• Teaching Excellence Training\n• Practical Teaching Experience\n• Government Job Preparation\n• 100% Placement Support\n\n📞 Call +91 9871261719 for admission details!";
        }
        
        if (this.containsKeywords(lowerMessage, ['llb', 'law', 'legal', 'bachelor of laws'])) {
            return "⚖️ **Bachelor of Laws (LLB)** - 3 Years\n\nBuild a prestigious legal career! Our LLB program covers:\n• Constitutional Law\n• Criminal & Civil Procedures\n• Corporate Law Specialization\n• Court Practice Training\n\n📞 Call +91 9871261719 for admission details!";
        }
        
        if (this.containsKeywords(lowerMessage, ['mba', 'business', 'management', 'master of business'])) {
            return "💼 **Master of Business Administration (MBA)** - 2 Years\n\nAccelerate your business career! Our MBA program includes:\n• Strategic Management\n• Financial Analysis\n• Marketing & Operations\n• Leadership Development\n\n📞 Call +91 9871261719 for admission details!";
        }
        
        if (this.containsKeywords(lowerMessage, ['med', 'm.ed', 'master of education'])) {
            return "🎯 **Master of Education (M.Ed)** - 2 Years\n\nAdvanced degree for educational leadership:\n• Educational Leadership\n• Research Methodology\n• Curriculum Development\n• Administrative Roles\n\n📞 Call +91 9871261719 for admission details!";
        }
        
        // Check for admission inquiries
        if (this.containsKeywords(lowerMessage, ['admission', 'apply', 'enroll', 'join', 'register'])) {
            return "📝 **Admission Process:**\n\n1. Call us at +91 9871261719\n2. Visit our office for counseling\n3. Submit required documents\n4. Complete application form\n5. Pay admission fees\n\n📍 **Address:** H.No 2219 sector 3 faridabad, Near pani tanki, Haryana\n\n✨ We accept students from ALL graduation backgrounds!";
        }
        
        // Check for fee inquiries
        if (this.containsKeywords(lowerMessage, ['fee', 'fees', 'cost', 'price', 'payment'])) {
            return "💰 **Fee Information:**\n\nFor detailed fee structure and payment options:\n📞 Call: +91 9871261719\n📧 Email: sahaedu@gmail.com\n\nWe offer:\n• Flexible payment plans\n• Scholarship programs\n• Easy installment options\n\nContact our admission office for personalized fee details!";
        }
        
        // Check for contact inquiries
        if (this.containsKeywords(lowerMessage, ['contact', 'phone', 'call', 'email', 'address', 'location'])) {
            return "📞 **Contact Information:**\n\n**Phone:** +91 9871261719, 0129-4055280\n**Email:** sahaedu@gmail.com\n**Address:** H.No 2219 sector 3 faridabad, Near pani tanki, Haryana\n\n**Office Hours:** Monday to Saturday, 9:00 AM - 6:00 PM\n\nFeel free to visit us for personalized guidance!";
        }
        
        // Check for eligibility inquiries
        if (this.containsKeywords(lowerMessage, ['eligibility', 'eligible', 'qualification', 'requirement'])) {
            return "✅ **Eligibility Requirements:**\n\n**Good News!** We accept students from ALL graduation backgrounds!\n\n📋 **General Requirements:**\n• Bachelor's degree in any discipline\n• Minimum 50% marks in graduation\n• Age limit as per university norms\n• Valid entrance test score (where applicable)\n\n📞 Call +91 9871261719 for course-specific eligibility!";
        }
        
        // Check for placement inquiries
        if (this.containsKeywords(lowerMessage, ['placement', 'job', 'career', 'employment', 'salary'])) {
            return "🚀 **100% Placement Support:**\n\n✨ **Our Commitment:**\n• Dedicated placement cell\n• Career guidance & counseling\n• Interview preparation\n• Industry connections\n• Job assistance guarantee\n\n📊 **Our Success:**\n• 5000+ successful graduates\n• Top educational institutions\n• Government & private sectors\n\n📞 Call +91 9871261719 to learn more!";
        }
        
        // Check for greeting
        if (this.containsKeywords(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            return "Hello! 👋 Welcome to Saha Institute of Management and Technology!\n\nI can help you with information about:\n🎓 Our courses (B.Ed, LLB, MBA, M.Ed)\n📝 Admission process\n💰 Fee structure\n📞 Contact details\n✅ Eligibility requirements\n\nWhat would you like to know?";
        }
        
        // Check for priority keywords that need admin attention
        if (this.containsKeywords(lowerMessage, ['urgent', 'emergency', 'complaint', 'problem', 'issue', 'help me', 'speak to someone', 'human', 'person'])) {
            // This will trigger admin notification in later tasks
            return "I understand you need immediate assistance. Let me connect you with our admission counselor right away.\n\n📞 **Immediate Help:**\nCall: +91 9871261719\nEmail: sahaedu@gmail.com\n\nOur team will contact you shortly to resolve your query!";
        }
        
        // Default fallback response
        const fallbackResponses = [
            "Thank you for your question! For detailed information, please call us at +91 9871261719. Our admission counselors are ready to help you.",
            "That's a great question! I'd recommend speaking with our admission team at +91 9871261719 for personalized guidance.",
            "I'd love to help you with that! Please contact our office at +91 9871261719 or email sahaedu@gmail.com for detailed assistance."
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword.toLowerCase()));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatMessage(text) {
        // Escape HTML first
        let formatted = this.escapeHtml(text);
        
        // Convert line breaks to <br> tags
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Convert **bold** text to <strong> tags
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert bullet points
        formatted = formatted.replace(/•/g, '•');
        
        return formatted;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on non-admin pages
    if (!window.location.pathname.includes('admin')) {
        window.sahaInstituteChatbot = new SahaInstituteChatbot();
    }
});