// Observr.io Landing Page Scripts

document.addEventListener('DOMContentLoaded', function() {

    // Word cycling animation
    const wordCycleElement = document.querySelector('.word-cycle');
    if (wordCycleElement) {
        const words = JSON.parse(wordCycleElement.dataset.words);
        let currentIndex = 0;

        setInterval(() => {
            wordCycleElement.style.opacity = '0';
            wordCycleElement.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % words.length;
                wordCycleElement.textContent = words[currentIndex];
                wordCycleElement.style.opacity = '1';
                wordCycleElement.style.transform = 'translateY(0)';
            }, 300);
        }, 2500);
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks?.classList.toggle('mobile-open');
            navCta?.classList.toggle('mobile-open');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;

                // For contact section, scroll so the submit button is visible
                if (href === '#contact') {
                    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
                    if (submitBtn) {
                        const btnRect = submitBtn.getBoundingClientRect();
                        const targetPosition = btnRect.bottom + window.pageYOffset - window.innerHeight + 100;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                mobileMenuBtn?.classList.remove('active');
                navLinks?.classList.remove('mobile-open');
                navCta?.classList.remove('mobile-open');
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards, step cards, and use case cards
    document.querySelectorAll('.feature-card, .step-card, .use-case-card, .problem-stat').forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Submit to Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.textContent = 'Thanks! We\'ll be in touch soon';
                    submitBtn.style.background = '#22c55e';
                    this.reset();
                } else {
                    submitBtn.textContent = 'Something went wrong';
                    submitBtn.style.background = '#ef4444';
                }
            })
            .catch(error => {
                submitBtn.textContent = 'Something went wrong';
                submitBtn.style.background = '#ef4444';
            })
            .finally(() => {
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // Animate stats counter (optional enhancement)
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Optional: Add parallax effect to hero
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroVisual.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }
});

// Add CSS for animations dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-target {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .animate-target.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .navbar.scrolled {
        background: #ffffff;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    }

    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-links.mobile-open {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 80px;
            left: 16px;
            right: 16px;
            background: #ffffff;
            padding: 20px 24px;
            gap: 8px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            text-align: center;
        }

        .nav-links.mobile-open a {
            padding: 12px 0;
            font-size: 1rem;
        }

        .nav-cta.mobile-open {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 220px;
            left: 16px;
            right: 16px;
            background: #ffffff;
            padding: 16px 24px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            z-index: 1000;
        }

        .nav-cta.mobile-open .btn {
            width: 100%;
            text-align: center;
        }

        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    }

    /* Stagger animation delays for cards */
    .feature-card:nth-child(1) { transition-delay: 0s; }
    .feature-card:nth-child(2) { transition-delay: 0.1s; }
    .feature-card:nth-child(3) { transition-delay: 0.2s; }
    .feature-card:nth-child(4) { transition-delay: 0.3s; }
    .feature-card:nth-child(5) { transition-delay: 0.4s; }
    .feature-card:nth-child(6) { transition-delay: 0.5s; }

    .step-card:nth-child(1) { transition-delay: 0s; }
    .step-card:nth-child(2) { transition-delay: 0.15s; }
    .step-card:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);
