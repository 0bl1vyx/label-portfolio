document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal Logic
    // This creates the "fade in as you scroll" effect
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Target all elements with the 'reveal-element' class
    const elements = document.querySelectorAll('.reveal-element');
    elements.forEach(el => observer.observe(el));

    // 2. Navbar Glass Effect on Scroll
    // Changes the transparency of the navbar when you scroll down
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.classList.replace('bg-brand-dark/70', 'bg-brand-dark/90');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.replace('bg-brand-dark/90', 'bg-brand-dark/70');
        }
    });
});
