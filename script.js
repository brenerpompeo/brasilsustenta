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

            if (mobileMenu.classList.contains('hidden')) {
                // Abrindo
                mobileMenu.classList.remove('hidden');
                // Força reflow para garantir que a transição inicial funcione
                void mobileMenu.offsetWidth;
                mobileMenu.classList.add('flex', 'opacity-100', 'translate-y-0');
                mobileMenu.classList.remove('opacity-0', '-translate-y-full'); // Garante estado inicial correto para animação
                document.body.classList.add("overflow-hidden");
            } else {
                // Fechando
                mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                 mobileMenu.classList.add('opacity-0', '-translate-y-full');
                // Espera a transição terminar para adicionar 'hidden' e remover 'flex'
                 setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                 }, 300); // Deve corresponder à duração da transição CSS
                document.body.classList.remove("overflow-hidden");
            }

            menuIcon.classList.toggle("hidden");
            closeIcon.classList.toggle("hidden");
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
                header.classList.add("py-2"); // Menos padding
                header.classList.remove("py-3"); // Mais padding
            } else {
                header.classList.remove("py-2");
                header.classList.add("py-3");
            }
            lastScrollTop = scrollTop;
        });
    }

   // Active navigation based on scroll position
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("nav a.nav-link"); // Seleciona links de navegação com a classe

    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -50% 0px", // Ativa um pouco antes do topo, desativa mais tarde
            threshold: 0 // Dispara assim que entra/sai da margem
        };

        let lastActiveSectionId = 'home'; // Inicia com home

        const observerCallback = (entries) => {
            let currentVisibleSections = [];
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     currentVisibleSections.push({id: entry.target.getAttribute('id'), ratio: entry.intersectionRatio, top: entry.boundingClientRect.top});
                 }
             });

            let bestMatchId = lastActiveSectionId; // Mantém o último ativo se nada for encontrado

            if (currentVisibleSections.length > 0) {
                // Ordena por proximidade ao topo (menor 'top' positivo) ou maior visibilidade
                currentVisibleSections.sort((a, b) => {
                    // Prioriza o que está mais perto do topo da viewport (mas ainda visível nela)
                    const topA = Math.max(0, a.top);
                    const topB = Math.max(0, b.top);
                    if (topA < window.innerHeight * 0.5 || topB < window.innerHeight * 0.5) {
                         return topA - topB;
                    }
                    // Se ambos estão abaixo do meio, prioriza o mais visível
                    return b.ratio - a.ratio;
                });
                bestMatchId = currentVisibleSections[0].id;
            }

            // Caso especial para o topo da página
             if (window.scrollY < window.innerHeight * 0.3) {
                 bestMatchId = 'home';
             }

            if(bestMatchId !== lastActiveSectionId) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${bestMatchId}`) {
                        link.classList.add("active");
                    }
                });
                lastActiveSectionId = bestMatchId;
            }
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
                    const headerHeight = document.getElementById('main-header')?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = window.pageYOffset + elementPosition - headerHeight - 15; // Offset extra

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Fecha menu mobile se estiver aberto
                    if (menuToggle?.getAttribute('aria-expanded') === 'true') {
                        menuToggle.click();
                    }
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
                    // Adiciona a classe que dispara a animação definida no CSS
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target); // Anima apenas uma vez
                }
            });
        }, {
            root: null,
            rootMargin: "0px 0px -10% 0px", // Trigger 10% antes do fundo
            threshold: 0.1 // Pelo menos 10% visível
        });

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    // Formspree Contact Form Submission
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const submitButton = document.getElementById("submit-button");

    if (contactForm && submitButton && formMessage) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const originalButtonHTML = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2 inline-block align-middle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...`;
            formMessage.textContent = '';
            formMessage.className = 'mb-4 hidden'; // Reseta

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                formMessage.classList.remove('hidden');
                if (response.ok) {
                    formMessage.textContent = "Mensagem enviada com sucesso! Entraremos em contato em breve.";
                    formMessage.className = "mb-4 success"; // Classe CSS para sucesso
                    contactForm.reset();
                    submitButton.innerHTML = 'Enviado!';
                    setTimeout(() => { // Volta ao normal após um tempo
                         submitButton.disabled = false;
                         submitButton.innerHTML = originalButtonHTML;
                         formMessage.classList.add('hidden');
                         formMessage.textContent = '';
                    }, 5000);
                } else {
                     response.json().then(data => {
                         const errorMsg = data?.errors?.map(err => err.message).join(', ') || "Ocorreu um erro.";
                         formMessage.textContent = `Erro: ${errorMsg}. Por favor, tente novamente.`;
                         formMessage.className = "mb-4 error"; // Classe CSS para erro
                         submitButton.disabled = false;
                         submitButton.innerHTML = originalButtonHTML;
                     }).catch(() => {
                         formMessage.textContent = "Ocorreu um erro ao enviar. Verifique os campos e tente novamente.";
                         formMessage.className = "mb-4 error";
                         submitButton.disabled = false;
                         submitButton.innerHTML = originalButtonHTML;
                     });
                }
            }).catch(error => {
                console.error('Erro no Fetch:', error);
                formMessage.classList.remove('hidden');
                formMessage.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
                formMessage.className = "mb-4 error";
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            });
        });
    } else {
        console.warn("Formulário de contato ou elementos relacionados não encontrados.");
    }

    // Prevent pinch zoom
    window.addEventListener("wheel", (e) => {
        if (e.ctrlKey && e.deltaY !== 0) e.preventDefault();
    }, { passive: false });
     window.addEventListener("touchstart", (e) => {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
     window.addEventListener("touchmove", (e) => {
         if (e.touches.length > 1) e.preventDefault();
     }, { passive: false });


    console.log("Brasil Sustenta - Script Inicializado (v. Play CDN Simplificada)");
});
