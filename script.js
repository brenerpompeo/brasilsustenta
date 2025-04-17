document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.getElementById('nav-links');
    const currentYearSpan = document.getElementById('current-year');
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = navLinksContainer ? Array.from(navLinksContainer.querySelectorAll('a.nav-link')) : [];

    // --- Menu Mobile ---
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            // Aqui você pode adicionar lógica para trocar o ícone do botão se desejar
        });

        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Atualizar Ano no Footer ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active State na Navegação Desktop ao Rolar ---
    if (sections.length > 0 && navLinks.length > 0 && window.IntersectionObserver) {
        let observer; // Declare observer aqui para poder desconectar se necessário

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -70% 0px', // Ativa quando a seção entra nos 30% superiores da tela
            threshold: 0
        };

        const observerCallback = (entries) => {
            let activeSectionId = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeSectionId = entry.target.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (linkHref === `#${activeSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
             // Caso especial: se estiver no topo, nenhum link deve estar ativo
            if (window.scrollY < 200) { // Ajuste este valor conforme necessário
                 navLinks.forEach(link => link.classList.remove('active'));
            }
        };

        try {
             observer = new IntersectionObserver(observerCallback, observerOptions);
             sections.forEach(section => {
                 if(section) observer.observe(section); // Verifica se a seção existe
             });
         } catch (e) {
            console.error("Intersection Observer setup failed:", e);
            // Implementar fallback ou simplesmente não ter a funcionalidade ativa
        }

    } else {
        console.log("Intersection Observer not supported or no sections/navlinks found.");
    }


    // --- Tratamento de Erros (Observação) ---
    // Os erros `net::ERR_NAME_NOT_RESOLVED`, `connect to service worker error`,
    // e `runtime.lastError: ...message channel closed` são quase certamente
    // causados por extensões do navegador, problemas de rede/DNS, ou
    // Service Workers/código de extensões interferindo. O código da página em si
    // (HTML/CSS/JS fornecido) não causa esses erros específicos.
    // Recomendações:
    // 1. Teste em uma janela anônima/privada (desabilita a maioria das extensões).
    // 2. Verifique sua conexão de rede e DNS.
    // 3. Limpe o cache e os Service Workers do navegador para este domínio (nas Ferramentas de Desenvolvedor > Application > Service Workers).
    // 4. Verifique se alguma extensão está bloqueando recursos ou injetando scripts.

    console.log("Brasil Sustenta LP Script Initialized (v3)");

}); // Fim do DOMContentLoaded
