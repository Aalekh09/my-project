document.addEventListener('DOMContentLoaded', function() {
    // Scroll reveal animation with different directions
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-down, .reveal-zoom');
    const revealLists = document.querySelectorAll('.reveal-list');
    
    function reveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });

        // Handle list animations
        revealLists.forEach(list => {
            const listTop = list.getBoundingClientRect().top;
            const listVisible = 150;
            
            if (listTop < window.innerHeight - listVisible) {
                list.classList.add('active');
            }
        });
    }
    
    // Initial check for elements in view
    reveal();
    
    // Add scroll event listener
    window.addEventListener('scroll', reveal);
    
    // Add animation classes to sections with delays
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.classList.add('animate-in');
        if (index > 0) {
            section.classList.add(`reveal-delay-${index}`);
        }
    });

    // Add fade-in animation to specific elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });

    // Add scale-in animation to specific elements
    const scaleElements = document.querySelectorAll('.scale-in');
    scaleElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
}); 