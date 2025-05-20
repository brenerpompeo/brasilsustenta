document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling para links internos ---
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previne o salto padrão

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calcula a posição do elemento alvo levando em conta o header fixo
                const headerOffset = document.getElementById('main-header').offsetHeight || 70; // Altura do header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Scroll suave
                });

                // Fecha o menu mobile se estiver aberto após clicar em um link
                const nav = document.getElementById('main-nav');
                if (nav.classList.contains('is-active')) {
                    nav.classList.remove('is-active');
                    // Opcional: Mudar ícone do botão burger de volta
                     document.getElementById('mobile-menu-toggle').textContent = '☰';
                }
            }
        });
    });

    // --- Animação Fade-in ao rolar ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // Observa em relação ao viewport
        rootMargin: '0px',
        threshold: 0.1 // Aciona quando 10% do elemento está visível
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para de observar após animar uma vez
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });

     // --- Toggle Menu Mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    mobileMenuButton.addEventListener('click', () => {
        mainNav.classList.toggle('is-active');
        // Opcional: Mudar o ícone do botão (Ex: '☰' para '✕')
        if (mainNav.classList.contains('is-active')) {
            mobileMenuButton.textContent = '✕'; // Ícone de fechar
             mobileMenuButton.setAttribute('aria-label', 'Fechar menu');
        } else {
            mobileMenuButton.textContent = '☰'; // Ícone de abrir
             mobileMenuButton.setAttribute('aria-label', 'Abrir menu');
        }
    });

    // --- Atualizar ano no footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Validação básica e 'envio' do formulário (simulado) ---
    const joinFormYoung = document.getElementById('join-form-young');
    if (joinFormYoung) {
        joinFormYoung.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio real do formulário

            // Validação simples (pode ser mais robusta)
            const name = document.getElementById('name-young').value.trim();
            const email = document.getElementById('email-young').value.trim();

            if (name === '' || email === '') {
                alert('Por favor, preencha o nome e o email.');
                return;
            }

            // Simula o envio
            console.log('Formulário de Jovem Enviado (Simulado):');
            console.log('Nome:', name);
            console.log('Email:', email);
            console.log('Interesse:', document.getElementById('interest-young').value);

            alert('Obrigado pelo seu interesse! (Este é um envio simulado)');
            joinFormYoung.reset(); // Limpa o formulário
        });
    }

});
