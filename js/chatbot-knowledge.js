/**
 * Saha Institute Chatbot Knowledge Base
 * Contains predefined responses and course information
 */

const CHATBOT_KNOWLEDGE = {
    // Welcome messages
    welcome: [
        "Hello! 👋 Welcome to Saha Institute of Management and Technology. I'm here to help you with information about our courses and admissions.",
        "Hi there! 🎓 I'm the Saha Institute assistant. How can I help you today?",
        "Welcome! I can help you learn about our B.Ed, LLB, and MBA programs. What would you like to know?"
    ],

    // Course information
    courses: {
        "bed": {
            name: "Bachelor of Education (B.Ed)",
            duration: "2 Years",
            description: "Transform into an inspiring educator with our comprehensive teaching program",
            features: [
                "Teaching Excellence Training",
                "Practical Teaching Experience", 
                "Government Job Preparation",
                "100% Placement Support"
            ],
            eligibility: "Bachelor's degree in any discipline with minimum 50% marks",
            universities: "UGC & NCTE Approved"
        },
        "med": {
            name: "Master of Education (M.Ed)",
            duration: "2 Years",
            description: "Advanced degree for educational leadership and specialized teaching roles",
            features: [
                "Educational Leadership",
                "Research Methodology",
                "Curriculum Development",
                "Administrative Roles"
            ],
            eligibility: "B.Ed degree with minimum 50% marks",
            universities: "University Affiliated"
        },
        "llb": {
            name: "Bachelor of Laws (LLB)",
            duration: "3 Years", 
            description: "Build a prestigious legal career with our comprehensive law program",
            features: [
                "Constitutional Law",
                "Criminal & Civil Procedures",
                "Corporate Law Specialization",
                "Court Practice Training"
            ],
            eligibility: "Bachelor's degree in any discipline with minimum 50% marks",
            universities: "Dr. Ambedkar University"
        },
        "mba": {
            name: "Master of Business Administration (MBA)",
            duration: "2 Years",
            description: "Accelerate your business career with advanced management skills",
            features: [
                "Strategic Management",
                "Financial Analysis", 
                "Marketing & Operations",
                "Leadership Development"
            ],
            eligibility: "Bachelor's degree in any discipline with minimum 50% marks",
            universities: "MDU Rohtak"
        }
    },

    // Contact information
    contact: {
        phone: ["+91 9871261719", "0129-4055280"],
        email: "sahaedu@gmail.com",
        address: "H.No 2219 sector 3 faridabad, Near pani tanki, Haryana",
        timings: "Monday to Saturday: 9:00 AM - 6:00 PM"
    },

    // Common responses
    responses: {
        admission: "For admission information, please call us at +91 9871261719 or visit our office. Our counselors will guide you through the complete process.",
        fees: "For detailed fee structure, please contact our admission office at +91 9871261719. We offer flexible payment options.",
        placement: "We provide 100% placement support with dedicated placement cell. Our graduates work in top educational institutions and organizations.",
        eligibility: "Most of our programs require a bachelor's degree with minimum 50% marks. Specific eligibility may vary by course.",
        documents: "Required documents typically include: Academic certificates, ID proof, passport size photos, and entrance test scores (where applicable).",
        hostel: "Please contact our office for hostel and accommodation information at +91 9871261719.",
        scholarship: "We offer various scholarship programs for deserving students. Contact our admission office for details."
    },

    // Keywords for intent detection
    keywords: {
        courses: ["course", "program", "degree", "bed", "b.ed", "llb", "mba", "med", "m.ed", "bachelor", "master"],
        admission: ["admission", "apply", "application", "enroll", "enrollment", "join", "register"],
        fees: ["fee", "fees", "cost", "price", "payment", "installment", "scholarship"],
        contact: ["contact", "phone", "call", "email", "address", "location", "visit"],
        eligibility: ["eligibility", "eligible", "qualification", "requirement", "criteria"],
        placement: ["placement", "job", "career", "employment", "salary"],
        documents: ["document", "documents", "certificate", "marksheet", "id proof"],
        timing: ["time", "timing", "hours", "schedule", "when", "open"]
    },

    // Priority keywords that trigger admin notification
    priorityKeywords: [
        "urgent", "emergency", "complaint", "problem", "issue", "help me",
        "admission deadline", "fee payment", "document verification",
        "speak to someone", "human", "person", "counselor", "advisor"
    ],

    // Fallback responses
    fallback: [
        "I'm not sure about that specific question. Let me connect you with our admission counselor who can help you better.",
        "That's a great question! For detailed information, please call us at +91 9871261719.",
        "I'd like to help you with that. Could you please contact our office at +91 9871261719 for personalized assistance?"
    ]
};

// Export for use in main chatbot
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHATBOT_KNOWLEDGE;
}