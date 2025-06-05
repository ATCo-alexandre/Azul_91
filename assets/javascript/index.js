// Preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').style.opacity = '0';
    document.getElementById('preloader').style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      document.getElementById('preloader').style.display = 'none';
    }, 500);
  }, 5000);
});

// Dropdown Menu
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