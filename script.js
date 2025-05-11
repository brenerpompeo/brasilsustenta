document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.add('hidden');
                body.style.overflow = '';
            });
        });
    }

    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const successModalOverlay = document.getElementById('success-modal-overlay'); // ID adicionado no HTML
    const successModalContent = document.getElementById('success-modal-content'); // ID adicionado no HTML

    function openSuccessModal() {
        if (successModal && successModalOverlay && successModalContent) {
            successModal.classList.remove('hidden');
            // Forçar reflow para garantir que a transição ocorra
            void successModalOverlay.offsetWidth;
            void successModalContent.offsetWidth;
            successModalOverlay.style.opacity = '1';
            successModalContent.style.opacity = '1';
            successModalContent.style.transform = 'scale(1) translateY(0)';
            body.style.overflow = 'hidden';
        }
    }

    function closeSuccessModal() {
        if (successModal && successModalOverlay && successModalContent) {
            successModalOverlay.style.opacity = '0';
            successModalContent.style.opacity = '0';
            successModalContent.style.transform = 'scale(0.95) translateY(10px)';
            setTimeout(() => {
                successModal.classList.add('hidden');
                body.style.overflow = '';
            }, 300); // Tempo da transição
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulação de envio
            console.log('Formulário enviado:', new FormData(contactForm));
            openSuccessModal();
            contactForm.reset();
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeSuccessModal);
    if (successModalOverlay) successModalOverlay.addEventListener('click', closeSuccessModal);

    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal && !successModal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    });

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const impactStatsSection = document.getElementById('impact-stats');
    if (impactStatsSection) {
        counterObserver.observe(impactStatsSection);
    }

    function animateCounters() {
        animateCounter('counter-jovens', 750, 2000);
        animateCounter('counter-projetos', 60, 2000);
        animateCounter('counter-mentoria', 1200, 2500);
        animateCounter('counter-parcerias', 30, 2000);
    }

    function animateCounter(id, target, duration) {
        const element = document.getElementById(id);
        if (!element) return;
        let start = 0;
        const startTime = performance.now();
        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(1, elapsedTime / duration);
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            let current = start + (target - start) * easedProgress;
            element.textContent = formatNumber(Math.floor(current));
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = formatNumber(target);
            }
        };
        requestAnimationFrame(updateCounter);
    }

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') { // Ignora links vazios ou apenas '#'
                 e.preventDefault();
                 return;
            }
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 70; // Default offset if header not found
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    menuToggle.click();
                }
            }
        });
    });

    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) { // Menor valor para ativar a sombra mais cedo
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});
