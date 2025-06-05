// Preloader Início
const preloader = document.getElementById("preloader");
const star = document.getElementById("star");
const finalText = document.getElementById("finalText");
const mainContent = document.getElementById("mainContent");

// Criar planetas com movimento aleatório
const numPlanets = 24;
for (let i = 0; i < numPlanets; i++) {
    const planet = document.createElement("div");
    planet.classList.add("planet");
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 400 + 100;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    planet.style.transform = `translate(${x}px, ${y}px)`;
    planet.style.animationDelay = `${Math.random() * 2}s`;
    preloader.appendChild(planet);
}

// Esconder preloader e mostrar conteúdo principal
setTimeout(() => {
    finalText.style.opacity = 1;
    setTimeout(() => {
        preloader.style.display = "none";
    }, 3000);
}, 5500);
// Preloader Fim

// Dropdown Menu Início
document.addEventListener('DOMContentLoaded', () => {
    const toggleIcon = document.querySelector('.menu-dropdown i');
    const dropdown = document.querySelector('.dropdown-menu');
    toggleIcon.addEventListener('click', () => {
        const isOpen = getComputedStyle(dropdown).display === 'block';
        if (!isOpen) {
            dropdown.style.display = 'block';
            toggleIcon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            dropdown.style.display = 'none';
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !toggleIcon.contains(e.target)) {
            dropdown.style.display = 'none';
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
});
// Dropdown Menu Fim