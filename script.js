document.addEventListener("DOMContentLoaded", function() {

    // --- Seletores Globais ---
    const header = document.getElementById("main-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    const navLinksContainer = document.getElementById("nav-links"); // Ensure this ID exists in your HTML for desktop links if needed by JS
    const currentYearEl = document.getElementById("current-year");
    const sections = document.querySelectorAll("main section[id]");
    // Get desktop nav links directly for scrollspy
    const desktopNavLinks = header ? Array.from(header.querySelectorAll("nav:not(#mobile-menu) a.nav-link[href^='#']")) : [];
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const submitButton = document.getElementById("submit-button");

    // --- Constantes ---
    const HEADER_HEIGHT_DEFAULT = 70; // Default header height if element not found
    const SCROLL_OFFSET_MARGIN = 15; // Extra margin for smooth scroll target

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
            menuToggle.setAttribute("aria-expanded", String(!isExpanded)); // Use String() for boolean attributes

            if (!isExpanded) { // Opening menu
                mobileMenu.classList.remove('hidden');
                // Force reflow to ensure transition plays
                void mobileMenu.offsetWidth;
                mobileMenu.classList.add('flex', 'opacity-100', 'translate-y-0');
                mobileMenu.classList.remove('opacity-0', '-translate-y-full');
                document.body.style.overflow = 'hidden'; // Prevent body scrolling
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else { // Closing menu
                mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                mobileMenu.classList.add('opacity-0', '-translate-y-full');
                document.body.style.overflow = ''; // Restore body scrolling
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                // Hide with delay to allow transition to finish
                 setTimeout(() => {
                     // Check again in case the user clicked rapidly
                    if (menuToggle.getAttribute("aria-expanded") === "false") {
                         mobileMenu.classList.add('hidden');
                         mobileMenu.classList.remove('flex'); // Remove display flex
                    }
                 }, 300); // Match transition duration
            }
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener("click", function() {
                if (menuToggle.getAttribute("aria-expanded") === "true") {
                    menuToggle.click(); // Simulate click to trigger close logic
                }
            });
        });
    } else {
        console.warn("Elementos essenciais do menu mobile (toggle, menu, icons) não encontrados.");
    }

    // --- Active Navigation based on Scroll Position (Scrollspy) ---
    const headerHeight = header?.offsetHeight || HEADER_HEIGHT_DEFAULT;
    // Adjusted rootMargin: Top margin accounts for header + extra space. Bottom margin determines when the *next* section triggers.
    // -65% bottom means the current section remains active until the next one occupies a good portion (~35%) of the viewport below the top margin.
    const scrollspyObserverOptions = {
        root: null, // viewport
        rootMargin: `-${headerHeight + 20}px 0px -65% 0px`,
        threshold: 0 // Trigger as soon as element enters/leaves rootMargin boundary
    };

    if ('IntersectionObserver' in window && sections.length > 0 && desktopNavLinks.length > 0) {
        let lastActiveLinkId = null; // Track the last activated link ID

        const observerCallback = (entries) => {
            let currentActiveSectionId = null;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                     // Prioritize the first intersecting entry from the top
                     if (!currentActiveSectionId) {
                         currentActiveSectionId = entry.target.getAttribute('id');
                     }
                }
            });

            // --- Fallback Logic ---
            // If near the top of the page, default to 'home'
            if (!currentActiveSectionId && window.scrollY < window.innerHeight * 0.5) {
                 currentActiveSectionId = 'home';
            }
             // If scrolled past all sections but no intersection detected (e.g., at the very bottom), keep the last active one
            if (!currentActiveSectionId && lastActiveLinkId) {
                 currentActiveSectionId = lastActiveLinkId;
            // Final fallback if nothing else matches (should rarely happen)
            } else if (!currentActiveSectionId) {
                currentActiveSectionId = 'home'; // Or perhaps the first section ID if 'home' isn't guaranteed
            }

            // --- Update Nav Links ---
            if (currentActiveSectionId && currentActiveSectionId !== lastActiveLinkId) {
                desktopNavLinks.forEach(link => {
                    link.classList.remove("active");
                    // The 'relative' class should be on the link itself (added in CSS/HTML)
                    // link.classList.add("relative"); // Not needed if applied in CSS/HTML
                    if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
                        link.classList.add("active");
                    }
                });
                lastActiveLinkId = currentActiveSectionId; // Update the tracker
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
         console.warn("Scrollspy não iniciado: Seções ou links de navegação do desktop não encontrados.");
    } else {
        console.log("Scrollspy não iniciado: IntersectionObserver não suportado.");
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hrefAttribute = this.getAttribute('href');
            // Ensure it's a valid internal link (#something, not just #)
            if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                try {
                    const targetId = hrefAttribute.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        e.preventDefault(); // Prevent default jump

                        const currentHeaderHeight = header?.offsetHeight || HEADER_HEIGHT_DEFAULT;
                        const elementPosition = targetElement.getBoundingClientRect().top; // Position relative to viewport
                        const offsetPosition = window.pageYOffset + elementPosition - currentHeaderHeight - SCROLL_OFFSET_MARGIN;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // If the clicked link was inside the mobile menu, close the menu
                        if (this.classList.contains('mobile-nav-link') && menuToggle?.getAttribute('aria-expanded') === 'true') {
                            menuToggle.click(); // Simulate click to trigger close logic
                        }
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
        rootMargin: "0px 0px -15% 0px", // Trigger when element is 15% from bottom edge into view
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, animationObserverOptions);

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else if (animatedElements.length === 0) {
         console.log("Nenhum elemento '.section-animate' encontrado para animação de scroll.");
    } else {
         console.log("Animação de scroll não iniciada: IntersectionObserver não suportado.");
         // Fallback: Optionally add the animation class directly if IO isn't supported
         // animatedElements.forEach(el => el.classList.add('animate-fade-in'));
    }

    // --- Formspree Contact Form Submission (DESATIVADO NESTA VERSÃO) ---
    /* << Keep this block commented out as per instructions >>
    if (contactForm && submitButton && formMessage) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const originalButtonHTML = submitButton.innerHTML;
            const formAction = contactForm.action; // Needs the correct action URL in the HTML

            // Basic check for Formspree URL (replace with your actual endpoint part if needed)
            if (!formAction || !formAction.includes("formspree.io")) {
                 console.error("Formspree action URL não configurada ou inválida no HTML.");
                 formMessage.textContent = "Erro: Configuração do formulário incompleta.";
                 formMessage.className = "error"; // Use class directly defined in CSS
                 formMessage.classList.remove('hidden');
                 return; // Stop submission
            }

            // Basic Check: Ensure consent checkbox is checked if it exists and is required
            const consentCheckbox = contactForm.querySelector('input[name="consent"]');
            if (consentCheckbox && consentCheckbox.required && !consentCheckbox.checked) {
                 formMessage.textContent = "Por favor, concorde com a Política de Privacidade para enviar.";
                 formMessage.className = "error";
                 formMessage.classList.remove('hidden');
                 return;
            }


            submitButton.disabled = true;
            // More accessible loading state
            submitButton.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 inline-block align-middle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span class="sr-only">Enviando...</span><span>Enviando...</span>`;
            formMessage.textContent = ''; // Clear previous messages
            formMessage.classList.add('hidden'); // Hide message area initially
            formMessage.className = 'hidden'; // Reset classes


            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                formMessage.classList.remove('hidden'); // Show message area

                if (response.ok) {
                    formMessage.textContent = "Mensagem enviada com sucesso! Agradecemos o contato.";
                    formMessage.className = "success"; // Use class defined in CSS
                    contactForm.reset(); // Clear the form
                    submitButton.innerHTML = 'Enviado!'; // Confirmation state
                    // Re-enable after a delay, reset button text
                    setTimeout(() => {
                          submitButton.disabled = false;
                          submitButton.innerHTML = originalButtonHTML;
                          formMessage.classList.add('hidden'); // Hide success message after delay
                          formMessage.textContent = '';
                    }, 5000);
                } else {
                    // Try to get specific Formspree errors
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
                    formMessage.className = "error"; // Use class defined in CSS
                    submitButton.disabled = false; // Re-enable button immediately on error
                    submitButton.innerHTML = originalButtonHTML;
                }
            } catch (error) {
                console.error('Erro de rede ou fetch:', error);
                formMessage.classList.remove('hidden');
                formMessage.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
                formMessage.className = "error"; // Use class defined in CSS
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    } else {
        // Warning only if the form itself is expected to exist but other elements are missing
        if (contactForm) {
            console.warn("Formulário de contato encontrado, mas botão de envio ou área de mensagem estão ausentes.");
        } else {
             // Log if form is completely missing (or JS disabled deliberately)
            console.log("Formulário de contato não encontrado ou JS desativado para ele.");
        }
    }
    */ // << Fim do bloco comentado

    console.log("Brasil Sustenta - Script Inicializado (v.Final - Formulário Desativado)");

}); // Fim do DOMContentLoaded
