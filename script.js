/* 
  AIML Lab - Interactive Scripts
*/

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple Form Validation / Feedback (Placeholder)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Processing...';
            btn.disabled = true;

            setTimeout(() => {
                const isContactForm = form.id === 'contactForm';
                const message = isContactForm ? 'Message sent successfully!' : 'Action successful! (This is a demo)';
                
                alert(message);
                btn.innerText = originalText;
                btn.disabled = false;
                
                if (isContactForm) {
                    form.reset();
                }
                
                // Redirect to home if login/signup
                if (window.location.pathname.includes('login') || window.location.pathname.includes('signup')) {
                    window.location.href = 'index.html';
                }
            }, 1000);
        });
    });

    // Card Hover Effects (Optional JS enhancement if needed)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add any specific JS hover logic here
        });
    });
});
