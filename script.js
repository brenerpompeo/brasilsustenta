document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body; // Para controlar o scroll do body

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            // Trava/destrava o scroll do body quando o menu mobile abre/fecha
            if (mobileMenu.classList.contains('hidden')) {
                body.style.overflow = '';
            } else {
                body.style.overflow = 'hidden';
            }
            if (typeof lucide !== 'undefined') { // Renderiza ícones se estiverem no menu mobile
                lucide.createIcons();
            }
        });
        // Fechar menu ao clicar em um link (se os links forem para seções da mesma página)
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });
    }


    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === "#" || href === "") return; // Ignora links vazios

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = document.querySelector('header')?.offsetHeight || 80; // Pega altura do header ou usa 80px
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax Effect
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length > 0 && window.matchMedia("(min-width: 769px)").matches) { // Ativar parallax apenas em telas maiores
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.1; // Default speed se não definido
                // Limitar o efeito para não ser excessivo e melhorar performance
                const translateY = Math.min(scrolled * speed, 200); // Ex: limita a 200px de translate
                layer.style.transform = `translateY(${translateY}px)`;
            });
        });
    }


    // Animação de contadores
    const animateCounters = () => {
        const counters = document.querySelectorAll('[data-counter]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = "true"; // Evita reanimar
                    const targetValue = +entry.target.dataset.counter;
                    const duration = parseInt(entry.target.dataset.duration) || 2000;
                    const format = entry.target.dataset.format === "true";
                    const suffix = entry.target.dataset.suffix || '';
                    let startTimestamp = null;

                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = timestamp - startTimestamp;
                        const currentVal = Math.min((progress / duration) * targetValue, targetValue);
                        
                        entry.target.textContent = format ? Math.floor(currentVal).toLocaleString('pt-BR') : Math.floor(currentVal);
                        if(suffix) entry.target.textContent += suffix;
                        
                        if (progress < duration) {
                            requestAnimationFrame(step);
                        } else {
                            entry.target.textContent = format ? targetValue.toLocaleString('pt-BR') : targetValue;
                            if(suffix) entry.target.textContent += suffix;
                        }
                    };
                    requestAnimationFrame(step);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    };
    animateCounters();


    // Formulário de Contato e Modal de Sucesso
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const successModalContent = document.getElementById('success-modal-content');
    const closeModalBtn = document.getElementById('close-modal');

    function openSuccessModal() {
        if (successModal && successModalContent) {
            successModal.classList.remove('hidden');
            body.style.overflow = 'hidden'; // Trava scroll ao abrir modal
            // Animação de entrada do modal
            setTimeout(() => { // Pequeno delay para garantir que 'hidden' foi removido
                successModal.style.opacity = '1';
                successModalContent.style.opacity = '1';
                successModalContent.style.transform = 'scale(1) translateY(0)';
            }, 20);
        }
    }

    function closeSuccessModal() {
        if (successModal && successModalContent) {
            successModal.style.opacity = '0';
            successModalContent.style.opacity = '0';
            successModalContent.style.transform = 'scale(0.95) translateY(10px)';
            setTimeout(() => {
                successModal.classList.add('hidden');
                body.style.overflow = ''; // Libera scroll
            }, 300); // Tempo da transição CSS
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="flex items-center justify-center">Enviando... <i data-lucide="loader-2" class="w-5 h-5 ml-2 animate-spin"></i></span>';
                if (typeof lucide !== 'undefined') lucide.createIcons();

                // Simular envio (substitua pela sua lógica de envio real)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                openSuccessModal();
                form.reset();

            } catch (error) {
                console.error("Erro ao enviar formulário:", error);
                alert("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeSuccessModal);
    }
    if (successModal) { // Fechar clicando fora (no overlay)
        successModal.addEventListener('click', (event) => {
            if (event.target === successModal) {
                closeSuccessModal();
            }
        });
    }
     // Fechar modal com tecla ESC
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal && !successModal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    });


    // Adicionar sombra ao header no scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('shadow-lg', 'border-emerald-100');
                header.classList.remove('border-emerald-100/50');
            } else {
                header.classList.remove('shadow-lg', 'border-emerald-100');
                header.classList.add('border-emerald-100/50');
            }
        });
    }

    // Inicializa Lucide Icons globalmente ao carregar
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
