document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    const navLinksContainer = document.getElementById('nav-links');
    const currentYearSpan = document.getElementById('current-year');
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formMessageDiv = document.getElementById('form-message');
    const scrollAnimatedItems = document.querySelectorAll('.animate-on-scroll');

    let intersectionObserver; // For nav active state
    let animationObserver; // For scroll animations

    // --- Mobile Menu Toggle ---
    if (menuBtn && mobileMenu && iconOpen && iconClose) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenu.classList.toggle('open'); // Use class for transition
            mobileMenu.classList.toggle('hidden'); // Still needed for initial state
            iconOpen.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            });
        });
    } else {
        console.warn("Mobile menu elements not found.");
    }

    // --- Update Footer Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Smooth Scroll for Internal Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute.length > 1) {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = header?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = window.pageYOffset + elementPosition - headerOffset - 10; // Extra 10px padding

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                     // Close mobile menu if open after clicking a link
                     if (menuBtn?.getAttribute('aria-expanded') === 'true') {
                        menuBtn.click();
                    }
                }
            }
        });
    });

    // --- Active State for Desktop Navigation on Scroll ---
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = navLinksContainer ? Array.from(navLinksContainer.querySelectorAll('a.nav-link')) : [];

    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // Adjust trigger point: activates earlier from top, later from bottom
            threshold: 0
        };

        const observerCallback = (entries) => {
             let currentActiveSectionId = null;
             // Find the *last* intersecting entry coming from the top or the first one fully visible
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                    currentActiveSectionId = entry.target.getAttribute('id');
                 }
             });

            // If scrolled to the top, no section might be 'active' based on margin
            if (window.scrollY < sections[0].offsetTop * 0.5) {
                 currentActiveSectionId = 'home'; // Force home active when near top
            }

             navLinks.forEach(link => {
                 link.classList.remove('active');
                 if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                     link.classList.add('active');
                 }
             });
        };

        try {
            intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
            sections.forEach(section => {
                intersectionObserver.observe(section);
            });
            // Also observe the hero section if it's separate
            const homeSection = document.getElementById('home');
            if (homeSection) intersectionObserver.observe(homeSection);

        } catch (e) {
            console.error("Intersection Observer setup failed:", e);
        }
    } else {
        console.log("Intersection Observer not supported or elements missing for scrollspy.");
    }


    // --- Simple Fade-in Animations on Scroll ---
     if ('IntersectionObserver' in window && scrollAnimatedItems.length > 0) {
        const animObserverOptions = {
            root: null,
            rootMargin: '0px 0px -15% 0px', // Trigger when item is 15% from bottom edge
            threshold: 0.1 // Trigger when 10% visible
        };

        const animObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Stop observing once animated to save resources
                    // observer.unobserve(entry.target);
                }
                // Optional: Remove class if element scrolls out of view (for repeat animations)
                // else {
                //     entry.target.classList.remove('is-visible');
                // }
            });
        };

        try {
            animationObserver = new IntersectionObserver(animObserverCallback, animObserverOptions);
            scrollAnimatedItems.forEach(item => {
                // Add specific animation class based on data-attribute or default
                const animationType = item.dataset.animation || 'fade-in-up'; // Default to fade-in-up
                 item.classList.add(animationType);
                animationObserver.observe(item);
            });
        } catch (e) {
            console.error("Animation Observer setup failed:", e);
        }
    }


    // --- Formspree Contact Form Submission ---
    if (contactForm && submitButton && formMessageDiv) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default page reload

            const formData = new FormData(contactForm);
            const originalButtonText = submitButton.innerHTML;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
            `;
            formMessageDiv.textContent = ''; // Clear previous messages
            formMessageDiv.className = 'form-message text-center text-sm mt-4'; // Reset classes

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    contactForm.reset();
                    formMessageDiv.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    formMessageDiv.classList.add('text-green-600'); // Success color
                    submitButton.innerHTML = 'Enviado!';
                     // Keep disabled or re-enable after a delay
                     setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                        formMessageDiv.textContent = '';
                     }, 5000);
                } else {
                    response.json().then(data => {
                        const errorMessage = data?.errors?.map(err => err.message).join(', ') || 'Ocorreu um erro ao enviar. Tente novamente.';
                        formMessageDiv.textContent = `Erro: ${errorMessage}`;
                        formMessageDiv.classList.add('text-red-600'); // Error color
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    }).catch(() => {
                         formMessageDiv.textContent = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
                         formMessageDiv.classList.add('text-red-600');
                         submitButton.disabled = false;
                         submitButton.innerHTML = originalButtonText;
                    });
                }
            }).catch(error => {
                console.error('Form submission error:', error);
                 formMessageDiv.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
                 formMessageDiv.classList.add('text-red-600');
                 submitButton.disabled = false;
                 submitButton.innerHTML = originalButtonText;
            });
        });
    } else {
         console.warn("Contact form elements not fully found for JS interaction.");
    }

    console.log("Brasil Sustenta LP Script Initialized - Redesign v1");

}); // End DOMContentLoaded
