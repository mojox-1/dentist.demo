// ====================================
// Doctor Demo - Main JavaScript
// Professional Dental Clinic
// ====================================

'use strict';

/**
 * Main Application Object
 */
const DoctorDemo = {
    // ====================================
    // WhatsApp Configuration
    // ====================================
    whatsapp: {
        phoneNumber: '94772256700', // Change this to your clinic's WhatsApp number
        message: 'Hello, I want to book a dental appointment.',
        apiUrl: 'https://wa.me/'
    },

    /**
     * Initialize the application
     */
    init() {
        this.setupMobileMenu();
        this.setupFormHandling();
        this.setupScrollAnimations();
        this.setupSmoothScroll();
        this.setupDropdownMenu();
        this.setupBeforeAfter();
        this.setupWhatsApp();
    },

    /**
     * Mobile Menu Toggle
     */
    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = menuToggle?.closest('.main-nav');
        const navMenu = document.getElementById('nav-menu');

        if (!menuToggle || !mainNav || !navMenu) return;

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideNav = mainNav.contains(e.target) || menuToggle.contains(e.target);
            if (!isClickInsideNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    },

    /**
     * Dropdown Menu Handling
     */
    setupDropdownMenu() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-link');
            
            if (!toggle) return;

            // For mobile devices (max-width: 768px)
            if (window.innerWidth <= 768) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    dropdown.classList.toggle('active');
                });
            }
        });

        // Re-initialize on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Remove active class for desktop view (hover instead)
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    },

    /**
     * Form Handling and Validation
     */
    setupFormHandling() {
        const appointmentForm = document.querySelector('.appointment-form');
        if (!appointmentForm) return;

        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(appointmentForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                date: formData.get('date')
            };

            // Basic validation
            if (!this.validateForm(data)) {
                alert('Please fill all required fields correctly.');
                return;
            }

            // Success message
            alert(`Thank you, ${data.name}! Your appointment request has been received. We'll contact you soon.`);
            appointmentForm.reset();
        });
    },

    /**
     * Form Validation
     */
    validateForm(data) {
        // Check if all fields are filled
        if (!data.name || !data.phone || !data.service || !data.date) {
            return false;
        }

        // Basic phone validation (at least 10 digits)
        const phoneRegex = /^\d{10,}$/;
        const phoneDigitsOnly = data.phone.replace(/\D/g, '');
        if (!phoneRegex.test(phoneDigitsOnly)) {
            alert('Please enter a valid phone number.');
            return false;
        }

        // Check if date is in the future
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert('Please select a future date.');
            return false;
        }

        return true;
    },

    /**
     * Scroll-triggered Animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all service cards, feature items, about content, and slider
        document.querySelectorAll('.service-card, .feature, .about-content, .ba-slider-container').forEach(element => {
            observer.observe(element);
        });
    },

    /**
     * Smooth Scroll Behavior
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    /**
     * Before & After Image Slider - Draggable Divider Implementation
     * Features:
     * - Mouse drag support
     * - Touch/mobile support
     * - Smooth animations
     * - Responsive design
     */
    setupBeforeAfter() {
        const container = document.querySelector('.ba-slider-container');
        const divider = document.getElementById('baDivider');
        const handle = document.getElementById('baHandle');
        const imgWrapper = document.querySelector('.ba-img-wrapper');
        
        if (!container || !divider || !handle || !imgWrapper) return;

        let isActive = false;

        /**
         * Handle mouse/touch down - Start dragging
         */
        const handlePointerDown = (e) => {
            isActive = true;
            handle.classList.add('active');
        };

        /**
         * Handle mouse/touch up - Stop dragging
         */
        const handlePointerUp = () => {
            isActive = false;
            handle.classList.remove('active');
        };

        /**
         * Handle mouse/touch move - Update slider position
         */
        const handlePointerMove = (e) => {
            if (!isActive) return;

            // Get container bounds
            const rect = container.getBoundingClientRect();
            let x = e.clientX - rect.left;

            // Handle touch events
            if (e.touches) {
                x = e.touches[0].clientX - rect.left;
            }

            // Keep x within container bounds
            x = Math.max(0, Math.min(x, rect.width));

            // Calculate percentage
            const percentage = (x / rect.width) * 100;

            // Update divider position
            divider.style.left = percentage + '%';

            // Update image wrapper width (after image)
            imgWrapper.style.width = percentage + '%';

            // Update handle position
            handle.style.left = percentage + '%';
        };

        // Event Listeners - Mouse Events
        divider.addEventListener('mousedown', handlePointerDown);
        handle.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('mouseup', handlePointerUp);
        document.addEventListener('mousemove', handlePointerMove);

        // Event Listeners - Touch Events (Mobile)
        container.addEventListener('touchstart', handlePointerDown);
        document.addEventListener('touchend', handlePointerUp);
        document.addEventListener('touchmove', handlePointerMove, { passive: false });

        // Prevent text selection during drag
        container.addEventListener('selectstart', (e) => {
            if (isActive) e.preventDefault();
        });
    },

    /**
     * Utility: Format Phone Number
     */
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },

    /**
     * WhatsApp Integration
     * Handles all WhatsApp button clicks and floating button
     */
    setupWhatsApp() {
        // Get all WhatsApp buttons
        const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
        const whatsappFloat = document.getElementById('whatsappFloat');

        // Build WhatsApp URL
        const getWhatsAppUrl = () => {
            const encoded = encodeURIComponent(this.whatsapp.message);
            return `${this.whatsapp.apiUrl}${this.whatsapp.phoneNumber}?text=${encoded}`;
        };

        // Add click handlers to all buttons
        whatsappButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(getWhatsAppUrl(), '_blank');
            });
        });

        // Setup floating button
        if (whatsappFloat) {
            whatsappFloat.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(getWhatsAppUrl(), '_blank');
            });
        }
    },

    /**
     * Utility: Log Page View Analytics
     */
    trackPageView() {
        console.log('Page viewed:', document.title);
        // Add analytics tracking code here if needed
    }
};

// Initialize on DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DoctorDemo.init());
} else {
    DoctorDemo.init();
}

// ====================================
// Carousel/Slider Support (Optional)
// For carousels, you can add this if needed
// ====================================

const Carousel = {
    /**
     * Initialize carousel if it exists
     */
    init(selector) {
        const carousel = document.querySelector(selector);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        let currentIndex = 0;

        if (!prevBtn || !nextBtn) return;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        showSlide(currentIndex);
    }
};

// ====================================
// Utility Functions
// ====================================

/**
 * Debounce function for event handlers
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Get URL Parameters
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Scroll to Top Button
 */
const ScrollToTop = {
    init() {
        const button = document.querySelector('.scroll-to-top');
        if (!button) return;

        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        }, 250));

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// ====================================
// Export for use in other files
// ====================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DoctorDemo, Carousel, debounce, throttle };
}
