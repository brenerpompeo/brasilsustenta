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
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = navLinksContainer ? Array.from(navLinksContainer.querySelectorAll("a.nav-link")) : [];
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const submitButton = document.getElementById("submit-button");

    // --- Atualizar Ano no Footer ---
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Menu Mobile Toggle ---
    if (menuToggle && mobileMenu && menuIcon && closeIcon) {
        menuToggle.addEventListener("click", function() {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);

            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                void mobileMenu.offsetWidth;
                mobileMenu.classList.add('flex', 'opacity-100', 'translate-y-0');
                mobileMenu.classList.remove('opacity-0', '-translate-y-full');
                document.body.style.overflow = 'hidden';
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                mobileMenu.classList.add('opacity-0', '-translate-y-full');
                document.body.style.overflow = '';
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                 setTimeout(() => {
                    if (menuToggle.getAttribute("aria-expanded") === "false") {
                         mobileMenu.classList.add('hidden');
                         mobileMenu.classList.remove('flex');
                    }
                 }, 300);
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener("click", function() {
                if (menuToggle.getAttribute("aria-expanded") === "true") {
                    menuToggle.click();
                }
            });
        });
    } else {
        console.warn("Elementos do menu mobile não encontrados.");
    }

    // --- Active Navigation based on Scroll Position ---
    if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
        let lastActiveLinkId = null;
        const observerOptions = {
            root: null,
            rootMargin: `-${(header?.offsetHeight || 70) + 20}px 0px -65% 0px`,
            threshold: 0
        };

        const observerCallback = (entries) => {
            let currentActiveSectionId = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                     if (!currentActiveSectionId) {
                         currentActiveSectionId = entry.target.getAttribute('id');
                     }
                }
            });
            if (!currentActiveSectionId && window.scrollY < window.innerHeight * 0.5) {
                 currentActiveSectionId = 'home';
            }
            if (!currentActiveSectionId && lastActiveLinkId) {
                 currentActiveSectionId = lastActiveLinkId;
            } else if (!currentActiveSectionId) {
                currentActiveSectionId = 'home';
            }

            if (currentActiveSectionId && currentActiveSectionId !== lastActiveLinkId) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    // Adiciona a classe 'relative' aqui para garantir que o ::after funcione
                    link.classList.add("relative");
                    if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
                        link.classList.add("active");
                    }
                });
                lastActiveLinkId = currentActiveSectionId;
            }
        };

         try {
            const observer = new IntersectionObserver(observerCallback, observerOptions);
            sections.forEach(section => {
                if(section) observer.observe(section);
            });
         } catch (e) {
              console.error("Erro ao iniciar IntersectionObserver para scrollspy:", e);
         }
    } else {
        console.log("Scrollspy não iniciado: IntersectionObserver não suportado ou elementos não encontrados.");
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                const targetElement = document.getElementById(hrefAttribute.substring(1));
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = window.pageYOffset + elementPosition - headerHeight - 15;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    if (this.classList.contains('mobile-nav-link') && menuToggle?.getAttribute('aria-expanded') === 'true') {
                        menuToggle.click();
                    }
                }
            }
        });
    });

    // --- Animations on Scroll ---
    const animatedElements = document.querySelectorAll('.section-animate');
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: "0px 0px -15% 0px",
            threshold: 0.1
        });
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    // --- Formspree Contact Form Submission (DESATIVADO NESTA VERSÃO) ---
    /* << Comentar ou remover este bloco para desativar envio >>
    if (contactForm && submitButton && formMessage) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const originalButtonHTML = submitButton.innerHTML;
            const formAction = contactForm.action; // Precisa ter o action correto no HTML

            if (!formAction || formAction.includes("YOUR_FORM_ID")) {
                 console.error("Formspree action URL não configurada no HTML.");
                 formMessage.textContent = "Erro: Configuração do formulário incompleta.";
                 formMessage.className = "error";
                 formMessage.classList.remove('hidden');
                 return; // Impede o envio
            }

            submitButton.disabled = true;
            submitButton.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 inline-block align-middle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Enviando...`;
            formMessage.textContent = '';
            formMessage.className = 'hidden';

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                formMessage.classList.remove('hidden');
                if (response.ok) {
                    formMessage.textContent = "Mensagem enviada com sucesso! Agradecemos o contato.";
                    formMessage.className = "success";
                    contactForm.reset();
                    submitButton.innerHTML = 'Enviado!';
                    setTimeout(() => {
                          submitButton.disabled = false;
                          submitButton.innerHTML = originalButtonHTML;
                          formMessage.classList.add('hidden');
                          formMessage.textContent = '';
                    }, 5000);
                } else {
                    const data = await response.json().catch(() => ({}));
                    const errorMsg = data?.errors?.map(err => err.message).join(', ') || `Status: ${response.status}`;
                    formMessage.textContent = `Erro ao enviar: ${errorMsg}. Verifique os dados.`;
                    formMessage.className = "error";
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonHTML;
                }
            } catch (error) {
                console.error('Erro no Fetch:', error);
                formMessage.classList.remove('hidden');
                formMessage.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
                formMessage.className = "error";
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    } else {
        console.warn("Formulário de contato ou elementos relacionados não encontrados ou JS desativado.");
    }
    */ // << Fim do bloco comentado

    console.log("Brasil Sustenta - Script Inicializado (v.Final - Formulário Desativado)");

}); // Fim do DOMContentLoaded
