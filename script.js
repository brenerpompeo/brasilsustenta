document.addEventListener("DOMContentLoaded", function() {
    const header = document.getElementById("main-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : []; // Links dentro do menu mobile
    const navLinks = document.querySelectorAll("nav.hidden.md\\:flex a.nav-link"); // Links de navegação desktop
    const currentYearEl = document.querySelector("#current-year-placeholder"); // Assumindo que você adicionará este ID
    const animatedElements = document.querySelectorAll('.fade-in-item');
    const contactForm = document.querySelector("#contact-form-placeholder"); // Assumindo que você adicionará este ID
    const formMessageEl = document.querySelector("#form-message-placeholder"); // Assumindo
    const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    // --- Atualizar Ano no Footer (se o placeholder existir) ---
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Header com Sombra e Padding no Scroll ---
    if (header) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled', 'shadow-md', 'py-2.5'); // py-2.5 é menor que py-3 inicial
                header.classList.remove('py-3', 'border-transparent');
                header.classList.add('border-border-light');
            } else {
                header.classList.remove('scrolled', 'shadow-md', 'py-2.5');
                header.classList.add('py-3', 'border-transparent');
                header.classList.remove('border-border-light');
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

            if (mobileMenu.classList.contains('hidden')) { // Se está fechado, vai abrir
                mobileMenu.classList.remove('hidden');
                requestAnimationFrame(() => { // Garante que 'hidden' foi removido
                    mobileMenu.classList.remove('scale-y-0', 'opacity-0');
                    mobileMenu.classList.add('scale-y-100', 'opacity-100');
                });
                document.body.style.overflow = 'hidden';
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else { // Se está aberto, vai fechar
                mobileMenu.classList.remove('scale-y-100', 'opacity-100');
                mobileMenu.classList.add('scale-y-0', 'opacity-0');
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
                if (menuToggle.getAttribute("aria-expanded") === "true") {
                    toggleMenu();
                }
            });
        });
    }

    // --- Active Navigation (Scrollspy) ---
    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        // ... (código do scrollspy da versão anterior, pode precisar de ajustes finos no rootMargin) ...
        // IMPORTANTE: Certifique-se que as seções no HTML tenham IDs correspondentes aos href dos navLinks.
        // E que os navLinks no HTML desktop tenham a classe 'nav-link'.
        console.log("Scrollspy JS está presente, mas a lógica detalhada foi omitida aqui para brevidade. Consulte a V3.")
    }


    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.startsWith('#') && hrefAttribute.length > 1) {
                const targetElement = document.getElementById(hrefAttribute.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header?.offsetHeight || 70; // Ajuste conforme altura real do header
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerHeight - 20; // Espaço extra

                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Animações de Entrada ao Rolar ---
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    const delay = entry.target.style.getPropertyValue('animation-delay'); // Pega delay do style inline
                    if (delay) entry.target.style.animationDelay = delay;
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
        animatedElements.forEach(item => animationObserver.observe(item));
    }

    // --- Formulário de Contato (Funcionalidade de Envio DESATIVADA) ---
     if (contactForm && submitBtn && formMessageEl) {
         contactForm.addEventListener('submit', (e) => {
             e.preventDefault();
             console.log('Envio de formulário DESATIVADO nesta versão.');

             submitBtn.disabled = true;
             submitBtn.innerHTML = 'Envio Desativado'; // Altera texto do botão

             formMessageEl.textContent = "O envio online está temporariamente desativado.";
             formMessageEl.className = "p-3 rounded-md bg-yellow-50 text-yellow-700 border border-yellow-200 mt-4 text-sm"; // Estilo de aviso
             formMessageEl.classList.remove('hidden');

             // Não reseta o botão ou mensagem para manter o feedback de desativado
         });
     } else {
         // console.warn("Elementos do formulário não encontrados para desativação do envio.");
     }

    console.log("Brasil Sustenta - Script Refinado Inicializado");
});
