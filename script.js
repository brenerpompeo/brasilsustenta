document.addEventListener("DOMContentLoaded", function() {
    // Set current year in footer
    const currentYearEl = document.getElementById("current-year");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const mobileLinks = document.querySelectorAll(".mobile-link"); // Links dentro do menu mobile

    if (menuToggle && mobileMenu && menuIcon && closeIcon) {
        menuToggle.addEventListener("click", function() {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            mobileMenu.classList.toggle("hidden"); // Controla visibilidade inicial/final
            mobileMenu.classList.toggle("flex"); // Controla layout flexível quando visível
            // Força reflow para a transição funcionar corretamente ao adicionar a classe
            void mobileMenu.offsetWidth;
            mobileMenu.classList.toggle("translate-y-0"); // Anima a entrada/saída
            mobileMenu.classList.toggle("opacity-100"); // Anima opacidade

            menuIcon.classList.toggle("hidden");
            closeIcon.classList.toggle("hidden");
            document.body.classList.toggle("overflow-hidden"); // Evita scroll do body com menu aberto
            menuToggle.setAttribute("aria-expanded", !isExpanded);
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener("click", function() {
                if (menuToggle.getAttribute("aria-expanded") === "true") {
                    menuToggle.click(); // Simula clique no botão para fechar
                }
            });
        });
    } else {
        console.warn("Elementos do menu mobile não encontrados.");
    }


    // Shrink header on scroll
    const header = document.getElementById("main-header");
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener("scroll", function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 50) {
                header.classList.add("py-2"); // Tailwind class for less padding
                header.classList.remove("py-3"); // Tailwind class for more padding
            } else {
                header.classList.remove("py-2");
                header.classList.add("py-3");
            }
            lastScrollTop = scrollTop;
        });
    }

    // Active navigation based on scroll position
    const sections = document.querySelectorAll("main section[id]"); // Seleciona seções dentro do main com ID
    const navLinks = document.querySelectorAll("nav a.nav-link"); // Seleciona links de navegação com a classe

    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -50% 0px", // Ajuste para ativar um pouco antes de chegar no topo e desativar mais tarde
            threshold: 0 // Pode ser 0 se rootMargin for suficiente
        };

        const observerCallback = (entries) => {
            let currentActiveSectionId = null;
             // Verifica qual seção está mais visível perto do topo
            entries.forEach(entry => {
                 if (entry.isIntersecting) {
                    // Dá prioridade para a seção que está entrando pelo topo
                     if (entry.boundingClientRect.top >= 0 && entry.boundingClientRect.top < window.innerHeight * 0.5) {
                         currentActiveSectionId = entry.target.getAttribute('id');
                     } else if (!currentActiveSectionId) { // Se nenhuma está no topo, pega a primeira que intersecta
                          currentActiveSectionId = entry.target.getAttribute('id');
                     }
                 }
            });

            // Caso especial para o topo da página
            if (window.scrollY < window.innerHeight * 0.3) {
                currentActiveSectionId = 'home';
            }


            navLinks.forEach(link => {
                link.classList.remove("active"); // Classe definida no style.css
                if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
                    link.classList.add("active");
                }
            });
        };

         try {
            const observer = new IntersectionObserver(observerCallback, observerOptions);
            sections.forEach(section => {
                observer.observe(section);
            });
         } catch (e) {
              console.error("Erro ao iniciar IntersectionObserver para scrollspy:", e);
         }

    } else {
        console.log("Scrollspy não iniciado: IntersectionObserver não suportado ou elementos não encontrados.");
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.getElementById('main-header')?.offsetHeight || 70; // Pega altura do header ou usa fallback
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = window.pageYOffset + elementPosition - headerHeight - 15; // Offset extra

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animations on scroll
    const animatedElements = document.querySelectorAll('.section-animate');
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in'); // Usa a classe CSS para animação
                    observer.unobserve(entry.target); // Anima apenas uma vez
                }
            });
        }, {
            root: null,
            rootMargin: "0px 0px -10% 0px", // Trigger quando 10% da parte inferior entra na viewport
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    // Formspree Contact Form Submission (Melhorado)
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const submitButton = document.getElementById("submit-button");

    if (contactForm && submitButton && formMessage) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const originalButtonText = submitButton.innerHTML; // Guarda o HTML original

            // Mostra estado de loading no botão
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...`;
            formMessage.textContent = '';
            formMessage.className = 'mb-4 hidden'; // Reseta classes e esconde

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                formMessage.classList.remove('hidden'); // Mostra a div de mensagem
                if (response.ok) {
                    formMessage.textContent = "Mensagem enviada com sucesso! Entraremos em contato em breve.";
                    formMessage.className = "mb-4 success"; // Usa a classe CSS para sucesso
                    contactForm.reset();
                    submitButton.innerHTML = 'Enviado!'; // Feedback visual
                    // Opcional: Reabilitar botão após um tempo
                    setTimeout(() => {
                         submitButton.disabled = false;
                         submitButton.innerHTML = originalButtonText;
                    }, 4000);
                } else {
                     response.json().then(data => {
                         const errorMsg = data?.errors?.map(err => err.message).join(', ') || "Ocorreu um erro.";
                         formMessage.textContent = `Erro: ${errorMsg} Por favor, tente novamente.`;
                         formMessage.className = "mb-4 error"; // Usa a classe CSS para erro
                         submitButton.disabled = false; // Reabilita botão no erro
                         submitButton.innerHTML = originalButtonText;
                     }).catch(() => {
                         // Erro ao parsear JSON da resposta de erro
                         formMessage.textContent = "Ocorreu um erro ao enviar. Verifique os campos e tente novamente.";
                         formMessage.className = "mb-4 error";
                         submitButton.disabled = false;
                         submitButton.innerHTML = originalButtonText;
                     });
                }
            }).catch(error => {
                console.error('Erro no Fetch:', error);
                formMessage.classList.remove('hidden');
                formMessage.textContent = "Erro de conexão. Por favor, verifique sua internet e tente novamente.";
                formMessage.className = "mb-4 error";
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
        });
    } else {
        console.warn("Formulário de contato ou elementos relacionados não encontrados.");
    }

    // Prevent pinch zoom (mantido do seu exemplo)
    window.addEventListener("wheel", (e) => {
        const isPinching = e.ctrlKey;
        if (isPinching) e.preventDefault();
    }, { passive: false });

    console.log("Brasil Sustenta - Script Inicializado (v. Play CDN)");
});
