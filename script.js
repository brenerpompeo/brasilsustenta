// ===== Menu Mobile Toggle =====
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Fecha o menu mobile ao clicar em um link do menu
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});


// ===== Smooth Scrolling (Alternativa/Reforço ao `scroll-smooth` do HTML) =====
// O `scroll-smooth` no HTML geralmente funciona bem, mas isso é um fallback
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//   anchor.addEventListener('click', function (e) {
//     // Apenas se for link interno na mesma página
//     if (this.hash !== "" && document.querySelector(this.hash)) {
//       e.preventDefault(); // Previne o salto padrão

//       const targetElement = document.querySelector(this.hash);
//       if (targetElement) {
//          // Calcula a posição considerando o header fixo (ajuste o valor '80' conforme a altura do seu header)
//          const headerOffset = 80;
//          const elementPosition = targetElement.getBoundingClientRect().top;
//          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

//         window.scrollTo({
//            top: offsetPosition,
//            behavior: "smooth"
//         });
//       }
//     }
//   });
// });


// ===== Atualizar Ano no Footer =====
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}


// ===== Animação de Fade-in para Seções (Opcional) =====
/*
const sections = document.querySelectorAll('.fade-in-section');

const observerOptions = {
  root: null, // Observa em relação ao viewport
  rootMargin: '0px',
  threshold: 0.1 // Trigger quando 10% da seção estiver visível
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Opcional: parar de observar depois que animar uma vez
      // observer.unobserve(entry.target);
    }
    // Opcional: remover a classe se sair da tela (para re-animar)
    // else {
    //   entry.target.classList.remove('is-visible');
    // }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});
*/
// Para usar a animação acima:
// 1. Descomente o código JS acima.
// 2. Descomente o código CSS no <style> do <head> do index.html.
// 3. Adicione a classe `fade-in-section` às tags `<section>` que você quer animar no index.html.
