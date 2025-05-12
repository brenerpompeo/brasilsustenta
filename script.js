document.addEventListener('DOMContentLoaded', () => {
    // Cria ícones Lucide após o DOM carregar
    lucide.createIcons(); 

    // --- Constantes Globais do Módulo ---
    const mainHeader = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const desktopNav = document.getElementById('desktop-nav');
    const mobileNav = document.getElementById('mobile-nav');
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const backToTopButton = document.getElementById('back-to-top');
    const body = document.body;

    // --- Mobile Menu Toggle ---
    if (mobileMenuToggle && mobileMenu) {
        const menuIcon = mobileMenuToggle.querySelector('[data-lucide="menu"]');
        const closeIcon = mobileMenuToggle.querySelector('[data-lucide="x"]');

        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
            body.classList.toggle('overflow-hidden', !isExpanded); // Trava/Destrava scroll
        });

        // Fecha menu ao clicar em um link interno do menu
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenuToggle.click(); // Simula clique para fechar e resetar estado
                }
            });
        });
    }

    // --- Smooth Scrolling & Deep Linking ---
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId?.substring(1)); // Remove #
        if (targetElement) {
            const headerOffset = mainHeader?.offsetHeight || 70; // Altura do header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            // Opcional: Atualiza o hash na URL sem saltar (pode causar loop se mal implementado com nav active)
            // history.pushState(null, null, targetId);
            return true;
        }
        return false;
    }

    // Adiciona listener para cliques em links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Ignora links vazios

            e.preventDefault(); // Previne salto padrão
            if (smoothScrollTo(href)) {
                // Fecha o menu mobile se estiver aberto e foi um clique nele
                if (mobileMenu && !mobileMenu.classList.contains('hidden') && e.currentTarget.closest('#mobile-menu')) {
                    // A lógica de fechar ao clicar já está no listener do menu mobile
                }
            }
        });
    });

    // Scroll suave para deep links na carga da página
    if (window.location.hash && window.location.hash.length > 1) {
        // Espera um pouco para garantir que tudo (especialmente imagens) esteja carregado e o layout estável
        window.addEventListener('load', () => {
            setTimeout(() => smoothScrollTo(window.location.hash), 150);
        }, { once: true });
    }

    // --- Header Shadow on Scroll ---
    if (mainHeader) {
        const handleHeaderShadow = () => {
            if (window.scrollY > 30) { // Mostra sombra após rolar 30px
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        };
        // Otimização: Usar Intersection Observer na section logo abaixo do header seria mais performático
        // Mas para simplicidade, o scroll listener é aceitável aqui
        window.addEventListener('scroll', handleHeaderShadow, { passive: true });
        handleHeaderShadow(); // Checa no load inicial
    }

    // --- Active Nav Link Highlighting ---
    const navLinksDesktop = desktopNav ? Array.from(desktopNav.querySelectorAll('.nav-link')) : [];
    const navLinksMobile = mobileNav ? Array.from(mobileNav.querySelectorAll('.nav-link-mobile')) : [];
    const allNavLinks = [...navLinksDesktop, ...navLinksMobile];
    // Mapeia links para IDs de seção
    const sectionsMap = new Map();
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            sectionsMap.set(href.substring(1), link);
        }
    });
    const sections = Array.from(sectionsMap.keys()).map(id => document.getElementById(id)).filter(Boolean);

    if (sections.length > 0) {
        const observerOptions = {
            root: null, // Observa em relação ao viewport
            rootMargin: `-${mainHeader?.offsetHeight || 70}px 0px -50% 0px`, // Ativa quando a seção está ~ no topo até meio da tela
            threshold: 0 // Ativa assim que entra na margem
        };

        const handleIntersection = (entries) => {
            let activeSectionId = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Pega a última seção que está intersectando no topo
                    activeSectionId = entry.target.id;
                }
            });
            
            // Atualiza classes apenas se houver uma seção ativa detectada
            if (activeSectionId) {
                 allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeSectionId}`) {
                        link.classList.add('active');
                    }
                });
            } else {
                 // Opcional: remover 'active' se nenhuma seção estiver visível (ex: no topo ou fim da página)
                 // No topo, talvez manter o link da primeira seção ativo
                 const firstSectionTop = sections[0]?.getBoundingClientRect().top - (mainHeader?.offsetHeight || 70);
                 if (window.scrollY < sections[0]?.offsetTop - (mainHeader?.offsetHeight || 70) - 50) {
                      allNavLinks.forEach(link => link.classList.remove('active'));
                      const firstLink = sectionsMap.get(sections[0]?.id);
                      // firstLink?.classList.add('active'); // Opcional: ativar o primeiro link se estiver acima dele
                 }
            }
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        sections.forEach(section => observer.observe(section));
    }


    // --- Animação de Contagem (Intersection Observer) ---
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length > 0) {
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

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element, target, suffix = '', format = false) {
        let current = 0;
        const duration = 1800; // Duração um pouco maior para suavidade
        const stepTime = Math.max(Math.abs(Math.floor(duration / target)), 10) || 50; // Mínimo 10ms por passo
        const increment = Math.max(Math.ceil(target / (duration / stepTime)), 1); // Incremento mínimo de 1

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            // Atualiza o texto formatado
            element.textContent = format ? formatNumber(current) + suffix : current + suffix;
        }, stepTime);
    }
    // Função auxiliar para formatar números grandes
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    // --- Animação ao Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.getAttribute('data-delay') || '0') * 1000;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target); // Anima só uma vez
                }
            });
        }, { threshold: 0.15 }); // Inicia quando 15% do elemento está visível

        animatedElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Se preferir não ter animação, adiciona a classe is-visible diretamente
        animatedElements.forEach(el => el.classList.add('is-visible'));
    }


    // --- Parallax Effect (usando requestAnimationFrame) ---
    const parallaxLayer = document.querySelector('.dynamic-gradient[data-speed]');
    if (parallaxLayer && window.matchMedia('(min-width: 769px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const speed = parseFloat(parallaxLayer.getAttribute('data-speed'));
        let frameId = null;
        let lastScrollY = window.scrollY;

        const updateParallax = () => {
             if (window.scrollY !== lastScrollY) { // Otimização: só atualiza se houve scroll
                const yOffset = window.scrollY;
                parallaxLayer.style.transform = `translateY(${yOffset * speed}px)`;
                lastScrollY = yOffset;
             }
             frameId = requestAnimationFrame(updateParallax); // Continua o loop
        };
        frameId = requestAnimationFrame(updateParallax); // Inicia o loop
        // Considerar parar o rAF se o elemento sair da viewport usando Intersection Observer
    }

    // --- Formulário de Contato ---
    if (contactForm && successModal) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('form-status');
        let focusedElementBeforeModal; // Para restaurar foco

        // Definição dos campos e suas regras de validação
        const fieldsToValidate = [
            { id: 'name', validation: (val) => val.trim() !== '', message: 'Nome completo é obrigatório.' },
            { id: 'email', validation: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()), message: 'Por favor, insira um endereço de email válido.' },
            { id: 'interest', validation: (val) => val !== '', message: 'Por favor, selecione um interesse.' },
            { id: 'message', validation: (val) => val.trim() !== '', message: 'A mensagem não pode estar vazia.' },
            { id: 'lgpd-consent', validation: (el) => el.checked, message: 'Você deve concordar com a política de privacidade.', errorMsgId: 'lgpd-error-message' }
        ];

        // Função para validar um campo individualmente
        function validateField(fieldElement, validator) {
            // Se o elemento não for encontrado, retorna true (não impede validação)
            if (!fieldElement) return true; 
            
            const value = fieldElement.type === 'checkbox' ? fieldElement : fieldElement.value;
            const isValid = validator.validation(value);
            const errorContainer = document.getElementById(validator.errorMsgId) || fieldElement.parentElement?.querySelector('.form-error-message');

            if (errorContainer) {
                 errorContainer.textContent = isValid ? '' : validator.message;
                 errorContainer.classList.toggle('hidden', isValid);
            }
            fieldElement.classList.toggle('invalid', !isValid);
            // Adiciona/Remove aria-invalid para acessibilidade
            fieldElement.setAttribute('aria-invalid', !isValid); 
            return isValid;
        }

        // Função para validar o formulário inteiro
        function validateForm() {
            let isFormValid = true;
            fieldsToValidate.forEach(fieldConfig => {
                const element = document.getElementById(fieldConfig.id);
                // Valida o campo e acumula o resultado (se um for inválido, o form é inválido)
                if (element && !validateField(element, fieldConfig)) { 
                    isFormValid = false;
                }
            });
            return isFormValid;
        }

        // Adiciona validação on-blur (ao perder foco) para feedback imediato
        fieldsToValidate.forEach(fieldConfig => {
            const element = document.getElementById(fieldConfig.id);
            if (element && element.type !== 'checkbox') { // Não valida checkbox no blur
                 element.addEventListener('blur', () => validateField(element, fieldConfig));
            }
             if (element && element.type === 'checkbox') { // Valida checkbox na mudança
                  element.addEventListener('change', () => validateField(element, fieldConfig));
             }
        });


        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Previne envio padrão
            formStatus.textContent = ''; // Limpa status anterior
            formStatus.style.color = 'inherit';

            // Valida todos os campos antes de enviar
            if (!validateForm()) {
                formStatus.textContent = 'Por favor, corrija os erros destacados no formulário.';
                formStatus.style.color = 'var(--danger-500)';
                // Foca no primeiro campo inválido encontrado
                const firstInvalidField = contactForm.querySelector('[aria-invalid="true"]');
                firstInvalidField?.focus();
                return; // Impede o envio
            }

            // Desabilita botão e mostra loading
            submitButton.disabled = true;
            submitButton.classList.add('submitting');
            focusedElementBeforeModal = document.activeElement || body; // Guarda elemento focado

            // ============================================================
            // == INÍCIO: SUBSTITUIR PELA CHAMADA FETCH REAL DO BACKEND ==
            // ============================================================
            try {
                // Exemplo: Usando Formspree (requer configuração no Formspree)
                // const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID"; // Substitua pelo seu ID
                // const formData = new FormData(contactForm);
                // const response = await fetch(FORMSPREE_ENDPOINT, {
                //     method: 'POST',
                //     body: formData,
                //     headers: { 'Accept': 'application/json' }
                // });

                // Simulação de sucesso/erro (Remover ao usar fetch real)
                 await new Promise(resolve => setTimeout(resolve, 1500));
                 const simulateError = false; // Mude para true para testar erro
                 if (simulateError) throw new Error("Erro simulado no servidor.");
                // Fim da Simulação

                // if (!response.ok && !simulateError) { // Ajustar condição se usar fetch real
                //     const errorData = await response.json().catch(() => ({}));
                //     throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
                // }

                // Sucesso!
                showSuccessModal();
                contactForm.reset(); // Limpa formulário
                // Resetar classes de erro visualmente
                contactForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
                contactForm.querySelectorAll('[aria-invalid]').forEach(el => el.setAttribute('aria-invalid', 'false'));
                contactForm.querySelectorAll('.form-error-message').forEach(el => {el.classList.add('hidden'); el.textContent='';});

            } catch (error) {
                console.error('Erro no envio do formulário:', error);
                formStatus.textContent = `Erro ao enviar: ${error.message || 'Tente novamente mais tarde.'}`;
                formStatus.style.color = 'var(--danger-500)';
            } finally {
                // Reabilita botão e esconde loading
                submitButton.disabled = false;
                submitButton.classList.remove('submitting');
            }
            // ==========================================================
            // == FIM: SUBSTITUIR PELA CHAMADA FETCH REAL DO BACKEND ==
            // ==========================================================
        });

        // --- Lógica do Modal de Sucesso ---
        const successModalContent = document.getElementById('success-modal-content');
        const closeModalButton = document.getElementById('close-modal-button');
        const closeModalX = document.getElementById('close-modal-x');
        // Seletor para elementos focáveis dentro do modal
        const focusableElementsString = 'button, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        let focusableElements = [];

        // Função para prender o foco dentro do modal
        function trapFocus(e) {
            if (e.key !== 'Tab' || focusableElements.length === 0) return;

            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus(); // Vai para o último
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus(); // Vai para o primeiro
                    e.preventDefault();
                }
            }
        }

        function showSuccessModal() {
            body.classList.add('modal-open'); // Trava scroll do body
            successModal.classList.remove('hidden');
            void successModal.offsetWidth; // Força reflow para transição
            successModal.style.opacity = '1';
            successModalContent.style.opacity = '1';
            successModalContent.style.transform = 'scale(1)';

            // Prepara elementos focáveis e foca o primeiro ou botão principal
            focusableElements = Array.from(successModalContent.querySelectorAll(focusableElementsString));
            (focusableElements.find(el => el.id === 'close-modal-button') || focusableElements[0])?.focus();

            document.addEventListener('keydown', trapFocus); // Ativa a trava de foco
        }

        function closeModal() {
            body.classList.remove('modal-open'); // Destrava scroll
            successModal.style.opacity = '0';
            successModalContent.style.opacity = '0';
            successModalContent.style.transform = 'scale(0.95)';
            // Esconde o modal após a transição
            setTimeout(() => {
                 successModal.classList.add('hidden');
            }, 300); // Duração da transition-opacity/transform

            document.removeEventListener('keydown', trapFocus); // Desativa a trava de foco
             // Restaura foco ao elemento que abriu o modal (se existir)
            if (focusedElementBeforeModal && typeof focusedElementBeforeModal.focus === 'function') {
                 focusedElementBeforeModal.focus();
            }
        }

        // Listeners para fechar o modal
        closeModalButton?.addEventListener('click', closeModal);
        closeModalX?.addEventListener('click', closeModal);
        // Fechar ao clicar no fundo (overlay)
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
    } // Fim do if (contactForm && successModal)


    // --- Botão Voltar ao Topo ---
    if (backToTopButton) {
        const handleBackToTopVisibility = () => {
            // Mostra se scroll for maior que meio viewport, por exemplo
            if (window.scrollY > window.innerHeight * 0.5) { 
                if (backToTopButton.style.visibility !== 'visible') {
                    backToTopButton.style.visibility = 'visible';
                    backToTopButton.classList.add('show');
                }
            } else {
                 if (backToTopButton.classList.contains('show')) {
                     backToTopButton.classList.remove('show');
                     // Esconde após a transição para evitar clique fantasma
                     const handleTransitionEnd = (e) => {
                         if (e.propertyName === 'opacity' && !backToTopButton.classList.contains('show')) {
                             backToTopButton.style.visibility = 'hidden';
                             backToTopButton.removeEventListener('transitionend', handleTransitionEnd);
                         }
                     };
                     backToTopButton.addEventListener('transitionend', handleTransitionEnd);
                 }
            }
        };

        // Listener otimizado com debounce (opcional, mas bom para muitos eventos de scroll)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
             clearTimeout(scrollTimeout);
             scrollTimeout = setTimeout(handleBackToTopVisibility, 100); // Verifica a cada 100ms de inatividade no scroll
        }, { passive: true });
        handleBackToTopVisibility(); // Checa no load

        // Ação de clique para rolar suavemente ao topo
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
