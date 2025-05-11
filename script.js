document.addEventListener("DOMContentLoaded", function() {
    const header = document.getElementById("main-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a.mobile-nav-link") : [];
    const navLinksContainer = document.getElementById("nav-links");
    const navLinks = navLinksContainer ? Array.from(navLinksContainer.querySelectorAll("a.nav-link")) : [];
    const currentYearEl = document.getElementById("current-year");
    const animatedItems = document.querySelectorAll('.animate-item');
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message"); // Garanta que este ID exista no HTML
    const submitButton = document.getElementById("submit-button"); // Garanta que este ID exista no HTML

    // --- Atualizar Ano no Footer ---
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Header com Sombra no Scroll ---
    if (header) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 30) { // Pequeno scroll para ativar
                header.classList.add('scrolled', 'shadow-md');
                header.classList.remove('border-transparent');
                header.classList.add('border-bs-gray-medium');
            } else {
                header.classList.remove('scrolled', 'shadow-md');
                header.classList.add('border-transparent');
                header.classList.remove('border-bs-gray-medium');
            }
        };
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Estado inicial
    }

    // --- Menu Mobile Toggle ---
    if (menuToggle && mobileMenu && menuIcon && closeIcon) {
        const toggleMenu = () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);

            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                requestAnimationFrame(() => { // Garante que 'hidden' foi removido
                    mobileMenu.classList.add('opacity-100', 'translate-y-0');
                    mobileMenu.classList.remove('opacity-0', 'translate-y-[-100%]');
                });
                document.body.style.overflow = 'hidden'; // Impede scroll do body
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                mobileMenu.classList.add('opacity-0', 'translate-y-[-100%]');
                document.body.style.overflow = ''; // Restaura scroll
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                 setTimeout(() => { // Garante que a transição termine antes de esconder
                    if (menuToggle.getAttribute("aria-expanded") === "false") {
                         mobileMenu.classList.add('hidden');
                    }
                 }, 300); // Duração da transição CSS
            }
        };
        menuToggle.addEventListener("click", toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (menuToggle.getAttribute("aria-expanded") === "true") {
                    toggleMenu(); // Fecha o menu ao clicar em um link
                }
            });
        });
    }

    // --- Active Navigation (Scrollspy) ---
    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        let lastActiveLinkId = null;
        const homeLinkForSpy = navLinksContainer?.querySelector('a.nav-link[href="#home"]');

        const observerOptions = {
            root: null,
            rootMargin: `-${(header?.offsetHeight || 60) + 20}px 0px -60% 0px`, // Offset pelo header + margem
            threshold: 0 // Quando o topo da seção cruza a linha de observação
        };

        const observerCallback = (entries) => {
            let currentActiveSectionId = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!currentActiveSectionId) { // Pega o primeiro que está intersectando
                        currentActiveSectionId = entry.target.getAttribute('id');
                    }
                }
            });

            if (window.scrollY < window.innerHeight * 0.4 && !currentActiveSectionId) { // Perto do topo, força home
                 currentActiveSectionId = 'home';
            } else if (!currentActiveSectionId) { // Se nada foi encontrado, mantém o último ativo
                 currentActiveSectionId = lastActiveLinkId;
            }


            if (currentActiveSectionId && currentActiveSectionId !== lastActiveLinkId) {
                navLinks.forEach(link => link.classList.remove("active"));
                const activeLink = navLinksContainer?.querySelector(`a.nav-link[href="#${currentActiveSectionId}"]`);
                if (activeLink) activeLink.classList.add("active");
                lastActiveLinkId = currentActiveSectionId;
            } else if (currentActiveSectionId === 'home' && lastActiveLinkId !== 'home') { // Garante home ativo no topo
                 navLinks.forEach(link => link.classList.remove("active"));
                 if (homeLinkForSpy) homeLinkForSpy.classList.add('active');
                 lastActiveLinkId = 'home';
            }
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll("main section[id]"); // Re-seleciona aqui para garantir
        sections.forEach(section => { if(section) observer.observe(section); });

        // Ativa 'home' inicialmente se não houver hash e o link existir
        if (!window.location.hash && homeLinkForSpy) {
            homeLinkForSpy.classList.add('active');
            lastActiveLinkId = 'home';
        }
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.startsWith('#') && hrefAttribute.length > 1) {
                const targetElement = document.getElementById(hrefAttribute.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header?.offsetHeight || 60; // Altura do header
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerHeight - 20; // 20px de espaço extra

                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Animações de Entrada ao Rolar ---
    if ('IntersectionObserver' in window && animatedItems.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible'); // Adiciona classe para JS pegar
                                                            // A animação em si ('animate-fade-in-up') é aplicada pelo Tailwind
                    const delay = entry.target.style.getPropertyValue('--animation-delay');
                    if (delay) entry.target.style.animationDelay = delay;

                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
        animatedItems.forEach(item => animationObserver.observe(item));
    }

    // --- Formulário de Contato (Funcionalidade de Envio DESATIVADA) ---
     if (contactForm && submitButton && formMessage) {
         contactForm.addEventListener('submit', (e) => {
             e.preventDefault();
             console.log('Envio de formulário DESATIVADO.');

             if(submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Envio Desativado';
             }
             if(formMessage){
                formMessage.textContent = "O envio online está temporariamente desativado.";
                formMessage.className = "error"; // Usa a classe de erro para feedback visual
                formMessage.classList.remove('hidden');
             }
             // Não há timeout para resetar, pois está desativado.
         });
     } else {
         console.warn("Elementos do formulário não encontrados ou JS de formulário desativado.");
     }

    console.log("Brasil Sustenta - Script V.Final-Clareza Inicializado");
});
