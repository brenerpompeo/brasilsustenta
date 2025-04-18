document.addEventListener("DOMContentLoaded", function() {

    // --- Seletores Globais Adaptados ---
    const header = document.getElementById("main-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const mobileLinks = document.querySelectorAll("#mobile-menu .mobile-nav-link[href^='#']"); // Target links inside mobile menu
    const currentYearEl = document.getElementById("current-year");
    const sections = document.querySelectorAll("main section[id]"); // Select all sections with an ID in main
    // Get desktop nav links specifically for scrollspy
    const desktopNavLinks = header ? Array.from(header.querySelectorAll("#nav-links a.nav-link[href^='#']")) : [];
    const contactForm = document.getElementById("contact-form"); // Assuming this ID remains for the main form
    const formMessage = document.getElementById("form-message");
    const submitButton = document.getElementById("submit-button"); // Assuming this ID remains for the main submit button

    // --- Constantes ---
    const HEADER_HEIGHT_DEFAULT = 70; // Adjust if header height changes significantly
    const SCROLL_OFFSET_MARGIN = 20; // Extra margin for scroll target below header

    // --- Atualizar Ano no Footer ---
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento #current-year não encontrado no footer.");
    }

    // --- Menu Mobile Toggle ---
    if (menuToggle && mobileMenu && menuIcon && closeIcon) {
        menuToggle.addEventListener("click", function() {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));

            if (!isExpanded) { // Opening menu
                mobileMenu.classList.remove('hidden');
                void mobileMenu.offsetWidth; // Force reflow
                mobileMenu.classList.add('flex', 'opacity-100', 'translate-y-0');
                mobileMenu.classList.remove('opacity-0', '-translate-y-full');
                document.body.style.overflow = 'hidden';
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else { // Closing menu
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
                 }, 300); // Match CSS transition duration
            }
        });

        // Close mobile menu when a link inside it is clicked
        mobileLinks.forEach(link => {
            link.addEventListener("click", function() {
                if (menuToggle.getAttribute("aria-expanded") === "true") {
                    menuToggle.click();
                }
            });
        });
    } else {
        console.warn("Elementos essenciais do menu mobile não encontrados.");
    }

    // --- Active Navigation based on Scroll Position (Scrollspy) ---
    const headerHeight = header?.offsetHeight || HEADER_HEIGHT_DEFAULT;
    const scrollspyObserverOptions = {
        root: null,
        rootMargin: `-${headerHeight + SCROLL_OFFSET_MARGIN}px 0px -60% 0px`, // Adjust bottom margin sensitivity
        threshold: 0
    };

    if ('IntersectionObserver' in window && sections.length > 0 && desktopNavLinks.length > 0) {
        let lastActiveLinkId = null;

        const observerCallback = (entries) => {
            let currentActiveSectionId = null;

            // Find the topmost intersecting section within the rootMargin bounds
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!currentActiveSectionId) { // Prioritize the first one found (usually highest on screen)
                         currentActiveSectionId = entry.target.getAttribute('id');
                    }
                }
            });

             // Fallback Logic: If near top, default to 'home'
             // Use window.scrollY and check if it's less than half the viewport height minus header
             const scrollYThreshold = (window.innerHeight - headerHeight) / 2;
             if (!currentActiveSectionId && window.scrollY < Math.max(100, scrollYThreshold)) {
                 currentActiveSectionId = 'home';
             }

            // If scrolled past everything, keep the last one active (often 'faca-parte' or similar)
             const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50; // 50px buffer
             if (isAtBottom && !currentActiveSectionId && lastActiveLinkId) {
                  // Check if the last section should be active instead
                  const lastSection = sections[sections.length - 1];
                   if (lastSection) {
                       currentActiveSectionId = lastSection.id;
                   } else {
                        currentActiveSectionId = lastActiveLinkId; // Fallback to previous if last section isn't found
                   }
             } else if (!currentActiveSectionId && lastActiveLinkId) {
                  // If not intersecting and not at bottom, keep last active id
                 currentActiveSectionId = lastActiveLinkId;
             } else if (!currentActiveSectionId) {
                  // Final fallback if nothing matches
                  currentActiveSectionId = 'home';
             }


            // Update Nav Links if active section changed
            if (currentActiveSectionId && currentActiveSectionId !== lastActiveLinkId) {
                desktopNavLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
                        link.classList.add("active");
                    }
                });
                lastActiveLinkId = currentActiveSectionId;
            }
        };

         try {
            const scrollspyObserver = new IntersectionObserver(observerCallback, scrollspyObserverOptions);
            sections.forEach(section => {
                if(section) scrollspyObserver.observe(section);
            });
         } catch (e) {
              console.error("Erro ao iniciar IntersectionObserver para scrollspy:", e);
         }
    } else if (sections.length === 0 || desktopNavLinks.length === 0) {
         console.warn("Scrollspy não iniciado: Seções com ID ou links de navegação do desktop não encontrados.");
    } else {
        console.log("Scrollspy não iniciado: IntersectionObserver não suportado.");
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                try {
                    const targetId = hrefAttribute.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        e.preventDefault();

                        const currentHeaderHeight = header?.offsetHeight || HEADER_HEIGHT_DEFAULT;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = window.pageYOffset + elementPosition - currentHeaderHeight - SCROLL_OFFSET_MARGIN;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if the click came from inside it
                        if (this.closest('#mobile-menu') && menuToggle?.getAttribute('aria-expanded') === 'true') {
                            menuToggle.click();
                        }
                        // Update URL hash manually after scrolling for better history/linking (optional)
                        // setTimeout(() => {
                        //    history.pushState(null, null, hrefAttribute);
                        // }, 400); // Delay slightly after scroll animation

                    } else {
                         console.warn(`Elemento com ID "${targetId}" não encontrado para scroll suave.`);
                    }
                } catch (error) {
                     console.error("Erro durante o scroll suave:", error);
                }
            }
        });
    });

    // --- Animations on Scroll ---
    const animatedElements = document.querySelectorAll('.section-animate');
    const animationObserverOptions = {
        root: null,
        rootMargin: "0px 0px -15% 0px", // Trigger animation when element is 15% from bottom edge into view
        threshold: 0.1 // Or a lower value like 0.01 if elements are small
    };

    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Add small delay based on existing style attribute, if any
                const delay = entry.target.style.transitionDelay || '0s';
                if (entry.isIntersecting) {
                     setTimeout(() => {
                        entry.target.classList.add('animate-fade-in');
                     }, parseFloat(delay) * 1000); // Convert CSS delay (e.g., '0.1s') to ms
                    observer.unobserve(entry.target);
                }
            });
        }, animationObserverOptions);

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else if (animatedElements.length > 0) {
         console.log("Animação de scroll não iniciada: IntersectionObserver não suportado. Animando tudo.");
         // Fallback for browsers without IntersectionObserver
         animatedElements.forEach(el => el.classList.add('animate-fade-in'));
    }

    // --- Formspree Contact Form Submission (DESATIVADO NESTA VERSÃO) ---
    /* << Bloco Comentado Mantido >>
    if (contactForm && submitButton && formMessage) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const originalButtonHTML = submitButton.innerHTML;
            const formAction = contactForm.action; // Needs the correct action URL in the HTML

            // Basic check for Formspree URL
            if (!formAction || !formAction.includes("formspree.io")) {
                 console.error("Formspree action URL não configurada ou inválida no HTML.");
                 formMessage.textContent = "Erro: Configuração do formulário incompleta.";
                 formMessage.className = "error";
                 formMessage.classList.remove('hidden');
                 return;
            }

            // Basic Check: Ensure consent checkbox is checked
            const consentCheckbox = contactForm.querySelector('input[name="consent"]');
            if (consentCheckbox && consentCheckbox.required && !consentCheckbox.checked) {
                 formMessage.textContent = "Por favor, concorde com a Política de Privacidade para enviar.";
                 formMessage.className = "error";
                 formMessage.classList.remove('hidden');
                 // Optionally, focus the checkbox
                 // consentCheckbox.focus();
                 return;
            }

            submitButton.disabled = true;
            submitButton.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 inline-block align-middle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span class="sr-only">Enviando...</span><span>Enviando...</span>`;
            formMessage.textContent = '';
            formMessage.classList.add('hidden');
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
                    let errorMsg = `Ocorreu um erro (Status: ${response.status}).`;
                    try {
                        const data = await response.json();
                        if (data && data.errors) {
                             errorMsg = data.errors.map(err => err.message).join(', ') || 'Erro desconhecido ao validar os dados.';
                        }
                    } catch (jsonError) {
                        console.warn("Não foi possível parsear a resposta de erro como JSON.");
                    }
                    formMessage.textContent = `Erro ao enviar: ${errorMsg}. Verifique os dados e tente novamente.`;
                    formMessage.className = "error";
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonHTML;
                }
            } catch (error) {
                console.error('Erro de rede ou fetch:', error);
                formMessage.classList.remove('hidden');
                formMessage.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
                formMessage.className = "error";
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    } else {
        if (contactForm) {
            console.warn("Formulário de contato principal encontrado, mas botão de envio ou área de mensagem estão ausentes ou com IDs incorretos.");
        } else {
            console.log("Formulário de contato principal não encontrado ou JS desativado para ele.");
        }
    }
    */ // << Fim do bloco comentado

    console.log("Brasil Sustenta - Script da Landing Page Inicializado (v.PromptExec - Formulário Desativado)");

}); // Fim do DOMContentLoaded
