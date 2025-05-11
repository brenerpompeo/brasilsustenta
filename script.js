document.addEventListener("DOMContentLoaded", function() {

    // --- Seletores Globais ---
    const header = document.getElementById("main-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    const navLinksContainer = document.getElementById("nav-links");
    const currentYearEl = document.getElementById("current-year");
    const sections = document.querySelectorAll("main > section[id]"); // Seções diretas do main com ID
    const navLinks = navLinksContainer ? Array.from(navLinksContainer.querySelectorAll("a.nav-link")) : [];
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const submitButton = document.getElementById("submit-button");
    const animatedItems = document.querySelectorAll('.animate-item');
    const programItems = document.querySelectorAll('.program-journey-item');

    // --- Atualizar Ano no Footer ---
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Header com Sombra e Padding no Scroll ---
    if (header) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
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
                requestAnimationFrame(() => {
                    mobileMenu.classList.add('opacity-100', 'translate-y-0');
                    mobileMenu.classList.remove('opacity-0', 'translate-y-[-100%]');
                });
                document.body.style.overflow = 'hidden';
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                mobileMenu.classList.add('opacity-0', 'translate-y-[-100%]');
                document.body.style.overflow = '';
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                 setTimeout(() => {
                    if (menuToggle.getAttribute("aria-expanded") === "false") {
                         mobileMenu.classList.add('hidden');
                    }
                 }, 300); // Duração da transição CSS
            }
        };
        menuToggle.addEventListener("click", toggleMenu);
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (menuToggle.getAttribute("aria-expanded") === "true") toggleMenu();
            });
        });
    }

    // --- Active Navigation (Scrollspy) ---
    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        let lastActiveLinkId = 'home';
        const homeLinkForSpy = navLinksContainer?.querySelector('a.nav-link[href="#home"]'); // Link Home para scrollspy

        const observerOptions = {
            root: null,
            rootMargin: `-${(header?.offsetHeight || 70) + 20}px 0px -60% 0px`, // Ajuste fino
            threshold: 0
        };

        const observerCallback = (entries) => {
            let currentActiveSectionId = null;
            let topEntry = null;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!topEntry || entry.boundingClientRect.top < topEntry.boundingClientRect.top) {
                        topEntry = entry;
                    }
                }
            });

            if (topEntry) {
                currentActiveSectionId = topEntry.target.getAttribute('id');
            } else if (window.scrollY < window.innerHeight * 0.3) { // Se muito perto do topo, é home
                currentActiveSectionId = 'home';
            } else { // Senão, mantém o último ativo se nada for detectado
                currentActiveSectionId = lastActiveLinkId;
            }

            if (currentActiveSectionId !== lastActiveLinkId) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
                        link.classList.add("active");
                    }
                });
                // Caso especial para o link #home no scrollspy
                if (homeLinkForSpy) {
                    if (currentActiveSectionId === 'home') {
                        homeLinkForSpy.classList.add('active');
                    } else {
                        homeLinkForSpy.classList.remove('active');
                    }
                }
                lastActiveLinkId = currentActiveSectionId;
            }
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => { if(section) observer.observe(section); });

        // Ativa 'home' inicialmente se não houver hash
        if (!window.location.hash && homeLinkForSpy) {
            homeLinkForSpy.classList.add('active');
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
                    const headerHeight = header?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerHeight - 20; // Espaço extra
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
                    // Aplica a classe de animação definida no Tailwind config
                    entry.target.classList.add('is-visible', 'animate-fade-in-up');
                    // Pega o delay customizado do style (se existir)
                    const delay = entry.target.style.getPropertyValue('--animation-delay');
                    if (delay) entry.target.style.animationDelay = delay;
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
        animatedItems.forEach(item => animationObserver.observe(item));
    }

    // --- Interatividade Programas (Acordeão/Linha do Tempo) ---
    if (programItems.length > 0) {
        programItems.forEach(item => {
            const title = item.querySelector('.program-journey-title');
            if (title) {
                title.addEventListener('click', () => {
                    // Fecha todos os outros abertos
                    programItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active-program');
                        }
                    });
                    // Alterna o item clicado
                    item.classList.toggle('active-program');
                });
            }
        });
        // Opcional: Abrir o primeiro item por padrão
        // if (programItems[0]) programItems[0].classList.add('active-program');
    }


    // --- Formulário de Contato (Funcionalidade de Envio DESATIVADA) ---
    if (contactForm && submitButton && formMessage) {
         contactForm.addEventListener('submit', (e) => {
             e.preventDefault(); // Impede o envio real do formulário
             console.log('Envio de formulário DESATIVADO nesta versão de demonstração.');

             submitButton.disabled = true;
             submitButton.innerHTML = 'Envio Desativado';
             formMessage.textContent = "O envio online está temporariamente desativado nesta demonstração.";
             formMessage.className = "error"; // Usa a classe de erro para feedback visual
             formMessage.classList.remove('hidden');

             setTimeout(() => {
                 // Não reseta o botão para 'Enviar mensagem' para deixar claro que está desativado
                 // submitButton.disabled = false;
                 // submitButton.innerHTML = 'Enviar mensagem';
                 // formMessage.classList.add('hidden');
                 // formMessage.textContent = '';
             }, 4000);
         });
     } else {
         console.warn("Elementos do formulário de contato (#contact-form, #submit-button, #form-message) não encontrados.");
     }

    console.log("Brasil Sustenta - Script V4 Inicializado (Formulário Desativado)");

}); // Fim do DOMContentLoaded
