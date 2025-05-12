document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); // Garante que os ícones sejam criados após o DOM carregar

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuToggle.querySelector('[data-lucide="menu"]');
    const closeIcon = menuToggle.querySelector('[data-lucide="x"]');

    if (menuToggle && mobileMenu && menuIcon && closeIcon) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
            // Bloquear/desbloquear scroll do body
            document.body.classList.toggle('overflow-hidden', !isExpanded);
        });

        // Fechar menu ao clicar em um link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        });
    }

    // --- Smooth Scrolling (para links internos) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ignora links que são apenas '#'
            if (href === '#') return; 
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = document.querySelector('header')?.offsetHeight || 80; // Ajuste conforme altura do header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Fecha o menu mobile se estiver aberto
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                     menuToggle.click();
                }
            }
        });
    });

    // --- Animação de Contagem (Intersection Observer) ---
    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const targetValue = parseInt(counterElement.getAttribute('data-counter'), 10);
                const suffix = counterElement.getAttribute('data-suffix') || '';
                const format = counterElement.getAttribute('data-format') === 'true';
                
                animateCounter(counterElement, targetValue, suffix, format);
                observer.unobserve(counterElement); // Anima só uma vez
            }
        });
    }, { threshold: 0.5 }); // Inicia quando 50% do elemento está visível

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(element, target, suffix = '', format = false) {
        let current = 0;
        const duration = 1500; // Duração da animação em ms
        const stepTime = Math.abs(Math.floor(duration / target)) || 50; // Ajusta velocidade baseada no valor
        const increment = Math.max(Math.ceil(target / (duration / stepTime)), 1); // Garante incremento de pelo menos 1

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = format ? formatNumber(current) + suffix : current + suffix;
        }, stepTime);
    }

    function formatNumber(num) {
        // Formata número com pontos (ex: 53.200.000)
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- Animação ao Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                 // Adiciona um delay progressivo baseado no atributo data-delay ou na ordem
                const delay = parseFloat(entry.target.getAttribute('data-delay') || '0') * 1000; 
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target); // Anima só uma vez
            }
        });
    }, { threshold: 0.15 }); // Inicia quando 15% do elemento está visível

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

     // --- Parallax Effect (Sutil no Background do Hero) ---
    const parallaxLayer = document.querySelector('.dynamic-gradient[data-speed]');
    if (parallaxLayer && window.matchMedia('(min-width: 769px)').matches) { // Evita em mobile se pesar
        const speed = parseFloat(parallaxLayer.getAttribute('data-speed'));
        window.addEventListener('scroll', () => {
            const yOffset = window.pageYOffset;
            // Aplica o transform diretamente no estilo do elemento
            parallaxLayer.style.transform = `translateY(${yOffset * speed}px)`;
        });
    }

    // --- Formulário de Contato ---
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const successModalContent = document.getElementById('success-modal-content');
    const closeModalButton = document.getElementById('close-modal-button');
    const closeModalX = document.getElementById('close-modal-x');
    const formStatus = document.getElementById('form-status');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const submitButtonText = submitButton.querySelector('.button-text');
    const spinner = submitButton.querySelector('.spinner');

    if (contactForm && successModal && closeModalButton && closeModalX && formStatus && submitButton) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = ''; // Limpa status anterior
            submitButton.disabled = true;
            submitButton.classList.add('submitting');

            // Simulação de envio (substituir por chamada fetch real)
            // Exemplo com Fetch:
            // const formData = new FormData(contactForm);
            // try {
            //     const response = await fetch('URL_DO_SEU_ENDPOINT', {
            //         method: 'POST',
            //         body: formData,
            //         // headers: { 'Accept': 'application/json' } // Se o backend retornar JSON
            //     });
            //     if (response.ok) {
            //         showSuccessModal();
            //         contactForm.reset();
            //     } else {
            //         // Tratar erro da API
            //         const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
            //         formStatus.textContent = `Erro: ${errorData.message || response.statusText}`;
            //         formStatus.style.color = 'red';
            //     }
            // } catch (error) {
            //      console.error('Fetch Error:', error);
            //      formStatus.textContent = 'Erro ao conectar. Tente novamente.';
            //      formStatus.style.color = 'red';
            // } finally {
            //     submitButton.disabled = false;
            //     submitButton.classList.remove('submitting');
            // }

            // ---- Início da Simulação ----
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula tempo de resposta da rede
            const simulateError = false; // Mude para true para testar erro

            if (simulateError) {
                 formStatus.textContent = 'Ocorreu um erro ao enviar. Tente novamente.';
                 formStatus.style.color = 'red';
                 submitButton.disabled = false;
                 submitButton.classList.remove('submitting');
            } else {
                showSuccessModal();
                contactForm.reset(); // Limpa o formulário
                submitButton.disabled = false;
                submitButton.classList.remove('submitting');
            }
            // ---- Fim da Simulação ----
        });

        // Função para exibir o modal
        function showSuccessModal() {
            document.body.classList.add('modal-open');
            successModal.classList.remove('hidden');
            // Force reflow para garantir que a transição funcione
            void successModal.offsetWidth; 
            successModal.style.opacity = '1';
            successModalContent.style.opacity = '1';
            successModalContent.style.transform = 'scale(1)';
        }

        // Função para fechar o modal
        function closeModal() {
            document.body.classList.remove('modal-open');
            successModal.style.opacity = '0';
            successModalContent.style.opacity = '0';
            successModalContent.style.transform = 'scale(0.95)';
            // Espera a transição terminar antes de esconder
            setTimeout(() => {
                 successModal.classList.add('hidden');
            }, 300); // Tempo da transition-duration
        }

        // Event listeners para fechar o modal
        closeModalButton.addEventListener('click', closeModal);
        closeModalX.addEventListener('click', closeModal);
        // Fechar ao clicar fora do conteúdo do modal
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
         // Fechar com a tecla Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // --- Botão Voltar ao Topo ---
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Mostra o botão após rolar 300px
                backToTopButton.classList.add('show');
                backToTopButton.classList.remove('hidden'); // Garante que não esteja hidden
            } else {
                backToTopButton.classList.remove('show');
                 // Adiciona um pequeno delay antes de esconder para a animação de saída
                setTimeout(() => {
                    if(window.scrollY <= 300) { // Verifica novamente caso o usuário role rápido para cima/baixo
                       backToTopButton.classList.add('hidden');
                    }
                }, 300); // Duração da transição
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // --- Atualiza Ano no Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // Fim do DOMContentLoaded
