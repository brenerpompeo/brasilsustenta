document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    const navLinksContainer = document.getElementById('nav-links');
    const currentYearSpan = document.getElementById('current-year');
    const sections = document.querySelectorAll('main > section[id]'); // Seleciona seções com ID dentro do main
    const navLinks = navLinksContainer ? Array.from(navLinksContainer.querySelectorAll('a.nav-link')) : [];
    let intersectionObserver; // Guardar referência ao observer

    // --- Menu Mobile ---
    if (menuBtn && mobileMenu && iconOpen && iconClose) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenu.classList.toggle('hidden');
            iconOpen.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });

        // Fecha o menu ao clicar em um link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            });
        });
    } else {
        console.warn("Mobile menu elements not found.");
    }

    // --- Atualizar Ano no Footer ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active State na Navegação Desktop ao Rolar ---
    // Verifica se a API está disponível e se há elementos para observar
    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null, // Observa em relação ao viewport
            rootMargin: '0px 0px -65% 0px', // Ativa quando 35% da seção está visível na parte superior
            threshold: 0 // Qualquer pixel visível dispara
        };

        const observerCallback = (entries) => {
            let currentActiveSectionId = null;
            // Encontra a seção mais visível no topo
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentActiveSectionId = entry.target.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                // Tira a classe de todos primeiro
                link.classList.remove('active');
                // Adiciona a classe se o href corresponder à seção ativa
                if (linkHref === `#${currentActiveSectionId}`) {
                    link.classList.add('active');
                }
            });

            // Se o usuário rolou para o topo da página (acima da primeira seção observável), desativa todos
             if (window.scrollY < sections[0].offsetTop / 2 && currentActiveSectionId === null) {
                  navLinks.forEach(link => link.classList.remove('active'));
             }
        };

        try {
            intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
            sections.forEach(section => {
                if(section) intersectionObserver.observe(section);
            });
        } catch (e) {
            console.error("Intersection Observer setup failed:", e);
            // A funcionalidade de link ativo na rolagem não funcionará
        }

    } else {
        console.log("Intersection Observer not supported or no sections/navlinks found for active state highlighting.");
    }

    // --- Smooth Scroll para links internos ---
    // Adiciona listeners a TODOS os links que começam com #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Garante que não é apenas um '#' vazio
            if (hrefAttribute.length > 1) {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault(); // Previne o salto padrão
                    // Calcula a posição do elemento de destino
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    // Considera a altura do header fixo (ajuste o valor se o header mudar de altura)
                    const headerOffset = document.getElementById('main-header')?.offsetHeight || 70; // Pega altura ou usa fallback
                    const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth" // Rolagem suave
                    });
                }
            }
        });
    });


    // --- Tratamento de Erros (Observação) ---
    // Console logs para ajudar a depurar os erros externos, se persistirem.
    window.addEventListener('error', function(event) {
        console.error('Global Error Caught:', event.error, event.message, event.filename, event.lineno, event.colno);
    });
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled Promise Rejection Caught:', event.reason);
    });


    console.log("Brasil Sustenta LP Script Initialized");

}); // Fim do DOMContentLoaded
