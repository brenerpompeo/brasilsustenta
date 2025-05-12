@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --primary: #059669; /* Emerald-600 */
    --primary-dark: #047857; /* Emerald-700 */
    --primary-light: #d1fae5; /* Emerald-100 */
    --secondary: #0891b2; /* Cyan-600 */
    --accent-sky: #0ea5e9; /* Sky-500 */
    --accent-amber: #f59e0b; /* Amber-500 */
    
    --text-primary: #111827; /* gray-900 */
    --text-secondary: #374151; /* gray-700 */
    --text-light: #6b7280; /* gray-500 */

    --bg-primary: #ffffff;
    --bg-soft: #f9fafb; /* gray-50 (usado no body como bg-slate-50) */
    --bg-softer: #f3f4f6; /* gray-100 */

    --border-primary: #e5e7eb; /* gray-200 */
    --border-soft: #f3f4f6; /* gray-100 */

    --shadow-color-rgb: 5, 150, 105; /* RGB do Emerald-600 */
    --shadow-soft-color-rgb: 100, 116, 139; /* RGB Slate-500 for softer shadows */

    --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
    --ease-squish: cubic-bezier(0.65, 0, 0.35, 1.25); /* Para botões 3D */
    --ease-morph: cubic-bezier(0.7, 0, 0.3, 1); /* Para animações de entrada */
}

@layer base {
    html {
        font-family: 'Poppins', sans-serif;
        @apply text-base;
    }
    body {
        @apply overflow-x-hidden; /* Prevenir scroll horizontal */
    }
    h1,h2,h3,h4,h5,h6 {
        @apply font-bold text-text-primary;
    }
    h1 { @apply text-4xl sm:text-5xl md:text-6xl leading-tight; }
    h2 { @apply text-3xl sm:text-4xl leading-tight; }
    h3 { @apply text-xl sm:text-2xl; }
    p { @apply leading-relaxed text-text-secondary; }
    /* Custom scrollbar (opcional, cuidado com compatibilidade) */
    /* ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-softer); }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; } */
}

@layer components {
    /* Links de Navegação */
    .nav-link {
        @apply relative text-sm font-medium text-slate-600 hover:text-emerald-600 
               py-1 transition-colors duration-200
               after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 
               after:h-0.5 after:bg-emerald-500 after:-translate-x-1/2
               hover:after:w-full after:transition-all after:duration-300;
    }
    .nav-link-mobile {
        @apply block px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150;
    }

    /* Botões */
    .btn-primary {
        @apply inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3 text-sm sm:text-base font-semibold text-white bg-emerald-600 rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 ease-in-out;
    }
     .btn-primary.btn-sm { /* Navbar desktop */
        @apply px-4 py-2 text-xs sm:text-sm shadow-sm;
    }
     .btn-primary.btn-lg { /* Hero e Form */
        @apply px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg;
    }

    .btn-secondary {
        @apply inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3 text-sm sm:text-base font-semibold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 ease-in-out;
    }
     .btn-secondary.btn-md {
        @apply px-5 py-2.5 text-sm;
    }


    .btn-3d {
        transition: transform 0.15s var(--ease-squish), box-shadow 0.15s ease-in-out;
        transform-style: preserve-3d;
    }
    .btn-3d:hover {
        transform: translateY(-3px) translateZ(4px) rotateX(-2deg); /* Efeito 3D sutil */
        box-shadow: 0 5px 12px -3px rgba(var(--shadow-color-rgb), 0.25), 0 3px 6px -3px rgba(var(--shadow-color-rgb), 0.2);
    }
     .btn-3d:active {
        transform: translateY(-1px) translateZ(1px);
        box-shadow: 0 2px 4px -2px rgba(var(--shadow-color-rgb), 0.3);
    }

    /* Formulários */
    .form-input, .form-select, .form-textarea {
        @apply block w-full px-4 py-2.5 text-sm sm:text-base text-slate-800 bg-white border border-slate-300 rounded-lg shadow-sm
               placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition duration-200 ease-in-out;
    }
    .form-checkbox {
        @apply h-4 w-4 text-emerald-600 border-slate-400 rounded focus:ring-emerald-500/80 focus:ring-offset-0;
    }
    .form-select {
        @apply bg-no-repeat appearance-none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
        background-position: right 0.75rem center;
        background-size: 1.25em 1.25em;
        padding-right: 2.5rem;
    }
    /* Estilo para indicar erro no campo */
    .form-input.error, .form-select.error, .form-textarea.error {
        @apply border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500/80;
    }

    /* Cards */
    .card-impacto { /* Números */
        @apply p-6 sm:p-8 rounded-xl border shadow-lg text-center flex flex-col items-center transition-all duration-300;
    }
    .card-programa { /* Nossas Iniciativas */
        @apply bg-slate-50/60 border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center;
    }
    .card-icon { /* Ícone grande no card de programa */
       @apply w-14 h-14 rounded-full flex items-center justify-center mb-5 ring-4 ring-white/50;
       & > svg { @apply w-7 h-7; }
    }
     .card-beneficio { /* Benefícios */
        @apply bg-white border border-slate-200/70 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300;
    }
    .card-icon-sm { /* Ícone pequeno no card de benefício */
       @apply w-10 h-10 rounded-lg flex items-center justify-center mb-4;
        & > svg { @apply w-5 h-5; }
    }


    /* Footer */
     .footer-heading {
         @apply text-sm font-semibold mb-5 uppercase text-slate-400 tracking-wider;
     }
     .footer-link {
        @apply text-slate-300 hover:text-white hover:underline text-sm transition-colors decoration-emerald-500 underline-offset-4;
    }
    .footer-text-static {
        @apply text-slate-300 text-sm;
    }
    .social-link {
        @apply text-slate-400 hover:text-emerald-400 transition-colors duration-200;
    }
     .footer-icon {
        @apply w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0 text-emerald-400;
    }
}

/* Animações Customizadas */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { /* Classe alternativa se necessário */
    opacity: 0; /* Start hidden */
    animation: fadeInUp 0.6s var(--ease-out-quad) forwards;
}

/* Animação de entrada com base no scroll */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    transition: opacity 0.6s var(--ease-out-quad), transform 0.6s var(--ease-out-quad);
    will-change: opacity, transform;
}
.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}


/* Efeito Tilt (Mantido como estava, parece bom) */
.hover-tilt {
    transition: transform 0.3s var(--ease-squish), box-shadow 0.3s ease-in-out;
    transform-style: preserve-3d;
}
.hover-tilt:hover {
    transform: perspective(1000px) rotateX(2deg) rotateY(-1deg) translateZ(10px) scale(1.02); /* Leve ajuste */
    box-shadow: 0 15px 30px -8px rgba(var(--shadow-soft-color-rgb), 0.15), 0 6px 12px -6px rgba(var(--shadow-soft-color-rgb), 0.1);
}

/* Gradiente Dinâmico Hero */
.dynamic-gradient {
    /* Gradiente mais suave e com tons mais esverdeados/azulados */
    background: linear-gradient(
        135deg, /* Ângulo ajustado */
        hsl(155deg 65% 40% / 0.85) 0%, 
        hsl(165deg 60% 45% / 0.75) 35%,
        hsl(175deg 68% 50% / 0.6) 70%,
        hsl(185deg 75% 55% / 0.4) 100% 
    );
    /* Blur sutil para suavizar - cuidado com performance */
    /* backdrop-filter: blur(10px); */
     /* Efeito de movimento sutil (opcional, pode ser controlado via JS também) */
    background-size: 200% 200%;
    animation: gradient-shift 25s ease infinite;
    will-change: background-position; 
}

@keyframes gradient-shift {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

/* Parallax (Se for usar JS, o CSS pode ser mínimo aqui) */
.parallax-container {
   /* perspective: 1px; // Causa problemas com sticky header, melhor JS */
}
.parallax-layer {
    /* Estilos controlados via JS */
    will-change: transform;
}

/* Ajustes Mobile */
@media (max-width: 768px) {
    h1 { font-size: 2.5rem; line-height: 1.2; } /* 40px */
    h2 { font-size: 2rem; line-height: 1.25; } /* 32px */

    .dynamic-gradient {
         animation: none; /* Desativar animação do gradiente em mobile se pesar */
         background: linear-gradient(135deg, hsl(155deg 65% 40% / 0.9), hsl(175deg 68% 50% / 0.7));
    }
    .parallax-layer {
        /* Se o parallax JS for pesado, desativar transforms */
        /* transform: none !important; */
    }
     .card-impacto {
        padding: 1.25rem; /* Menor padding */
    }
    .card-programa {
        padding: 1.25rem;
    }
     .card-beneficio {
        padding: 1.25rem;
    }
}

/* Estilo para o body quando o modal está aberto */
body.modal-open {
    overflow: hidden;
}

/* Estilo para o botão 'Voltar ao Topo' */
#back-to-top.show {
    opacity: 1;
    transform: translateY(0);
    visibility: visible; /* Garante que esteja visível */
}

/* Spinner no botão de submit */
.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
.btn-primary.submitting .button-text {
    display: none;
}
.btn-primary.submitting .spinner {
    display: inline-block;
}
