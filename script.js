document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body; // Para travar scroll

    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        // Trava/destrava o scroll do body quando o menu mobile abre/fecha
        body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
    });

    // Close mobile menu when clicking a nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
            body.style.overflow = ''; // Libera scroll
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = successModal ? successModal.querySelector('.absolute.inset-0') : null;

    if (contactForm && successModal && closeModal && modalOverlay) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulação de envio
            console.log('Form submitted');
            // Exibir modal de sucesso
            successModal.classList.remove('hidden');
            body.style.overflow = 'hidden'; // Trava scroll ao abrir modal
        });

        closeModal.addEventListener('click', function() {
            successModal.classList.add('hidden');
            body.style.overflow = ''; // Libera scroll
        });

        // Fechar modal clicando fora (no overlay)
        modalOverlay.addEventListener('click', function() {
            successModal.classList.add('hidden');
            body.style.overflow = ''; // Libera scroll
        });

        // Fechar modal com tecla ESC
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
                successModal.classList.add('hidden');
                body.style.overflow = ''; // Libera scroll
            }
        });
    } else {
        console.warn('Elementos do formulário ou modal não encontrados.');
    }


    // Animated Counters
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Quando a seção de estatísticas entra na visão
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, { threshold: 0.3 }); // Inicia quando 30% da seção está visível

    const impactStatsSection = document.getElementById('impact-stats');
    if (impactStatsSection) {
        counterObserver.observe(impactStatsSection);
    } else {
         console.warn('Seção de estatísticas com ID "impact-stats" não encontrada.');
    }

    function animateCounters() {
        // *** VALORES DE EXEMPLO - SUBSTITUIR PELOS REAIS OU METAS ***
        // Certifique-se que os IDs no HTML correspondem aqui
        animateCounter('counter-jovens', 750, 2000);      // Ex: 750 jovens engajados
        animateCounter('counter-projetos', 60, 2000);     // Ex: 60 iniciativas lançadas
        animateCounter('counter-mentoria', 1200, 2500);   // Ex: 1200 horas de mentoria
        animateCounter('counter-parcerias', 30, 2000);    // Ex: 30 parceiros conectados
    }

    function animateCounter(id, target, duration) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Elemento contador com ID "${id}" não encontrado.`);
            return;
        }

        let start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(1, elapsedTime / duration); // Garante que não passe de 1

            // Ease-out function (desacelera no final)
            const easedProgress = 1 - Math.pow(1 - progress, 4); // Expoente 4 para desaceleração mais forte
            let current = start + (target - start) * easedProgress;
            const value = Math.floor(current);

            element.textContent = formatNumber(value); // Formata números grandes

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                 element.textContent = formatNumber(target); // Garante valor final exato
            }
        };
        requestAnimationFrame(updateCounter);
    }

    // Função para formatar números grandes (com ponto)
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Smooth scrolling for anchor links (mantido e ajustado no CSS com scroll-padding-top)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ignora links que são apenas '#'
            if (href === '#') {
                 e.preventDefault();
                 return;
            }

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    // block: 'start' // 'start' é o padrão, scroll-padding-top no CSS cuida do offset
                });

                 // Fecha menu mobile se estiver aberto e for um link de navegação
                 if (!mobileMenu.classList.contains('hidden') && href !== '#') {
                    menuToggle.click(); // Simula clique para fechar
                 }
            }
        });
    });

    // Pequeno efeito no scroll do header (adiciona sombra)
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        });
    }

});
