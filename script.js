document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Normalmente, aqui seria enviado para um servidor.
        // Apenas exibindo a mensagem de sucesso.
        successModal.classList.remove('hidden');
        contactForm.reset();
    });

    closeModal.addEventListener('click', function() {
        successModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.add('hidden');
        }
    });

    // Animated Counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.disconnect(); // Animar apenas uma vez
            }
        });
    }, { threshold: 0.3 }); // Iniciar animação um pouco antes de 50%

    const impactSection = document.getElementById('impact'); // A seção que dispara a animação
    if (impactSection) {
        counterObserver.observe(impactSection);
    }

    function animateCounters() {
        // *** VALORES DE EXEMPLO - SUBSTITUIR PELOS REAIS ***
        animateCounter('counter-jovens', 500, 1500);        // Ex: 500 jovens impactados
        animateCounter('counter-satisfacao', 85, 1500);    // Ex: 85% de satisfação
        animateCounter('counter-projetos', 45, 2000);      // Ex: 45 projetos iniciados
        animateCounter('counter-parcerias', 20, 1500);     // Ex: 20 parcerias ativas
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
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            let current = start + (target - start) * easedProgress;

            const value = Math.floor(current);

            // Tratamento especial para porcentagem (se houver span dentro)
            const span = element.querySelector('span');
            if (span) {
                 span.textContent = value;
            } else {
                element.textContent = formatNumber(value); // Formata números grandes se necessário
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                 // Garante que o valor final seja exato
                 if (span) {
                    span.textContent = target;
                 } else {
                    element.textContent = formatNumber(target);
                 }
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Função para formatar números grandes (mantida, caso algum contador precise)
    function formatNumber(num) {
        // Formata apenas se for maior que 999
        if (num > 999) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Usa ponto como separador de milhar
        }
        return num.toString();
    }

    // Smooth scrolling for anchor links (mantido do original)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calcula o offset do header fixo
                const headerOffset = document.querySelector('header').offsetHeight + 10; // Adiciona uma pequena margem
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
