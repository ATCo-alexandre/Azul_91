// Preloader Início
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        document.getElementById('preloader').style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
        }, 500);
    }, 5000);
});
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

// Galeria de Vídeos
// Popup de Vídeo
const popup = document.getElementById('popup-video');
const videoContainer = document.querySelector('.video-container');
const videoTitle = document.getElementById('video-title');
const closeBtn = document.getElementById('close-popup');
const counter = document.getElementById('video-counter');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Thumbnails (devem ter a classe 'thumbnail' na galeria)
const thumbnails = document.querySelectorAll('.thumbnail');

// Lista de vídeos
const videos = [
    {
        type: 'local',
        src: 'https://ehrsonmsjtnsfnznitsl.supabase.co/storage/v1/object/public/videos//1_primeira_serie.mp4',
        title: '1ª Série',
    },
    {
        type: 'local',
        src: 'https://ehrsonmsjtnsfnznitsl.supabase.co/storage/v1/object/public/videos//2_placar_100_dias.mp4',
        title: 'Placar dos 100 Dias',
    },
    {
        type: 'local',
        src: 'https://ehrsonmsjtnsfnznitsl.supabase.co/storage/v1/object/public/videos//3_alvorada_festiva.mp4',
        title: 'Alvorada Festiva',
    },
    {
        type: 'local',
        src: 'https://ehrsonmsjtnsfnznitsl.supabase.co/storage/v1/object/public/videos//4_formatura_Azul_91.mp4',
        title: 'Formatura',
    },
    {
        type: 'local',
        src: 'https://ehrsonmsjtnsfnznitsl.supabase.co/storage/v1/object/public/videos//5_jubileu_de_prata_eear_2016.mp4',
        title: 'Jubileu de Prata 2016 EEAR',
    },
    {
        type: 'local',
        src: 'https://ehrsonmsjtnsfnznitsl.supabase.co/storage/v1/object/public/videos//6_encontro_2017.mp4',
        title: 'Encontro de Turma 2017 - Brasília',
    },
];

let currentIndex = 0;

// Função para abrir o vídeo no popup
function openVideo(index) {
    const video = videos[index];
    currentIndex = index;

    // Atualiza o título do vídeo no popup
    videoTitle.textContent = video.title;
    videoContainer.innerHTML = ''; // Limpa o conteúdo anterior

    // Criação do elemento de vídeo (local ou YouTube)
    if (video.type === 'local') {
        const videoEl = document.createElement('video');
        videoEl.controls = true;
        videoEl.autoplay = true;
        videoEl.muted = false;
        videoEl.innerHTML = `<source src="${video.src}" type="video/mp4">Seu navegador não suporta vídeo.`;
        videoContainer.appendChild(videoEl);
    } else {
        const iframe = document.createElement('iframe');
        iframe.src = video.src + '?autoplay';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        videoContainer.appendChild(iframe);
    }

    // Atualiza o contador (apenas número atual)
    counter.textContent = String(index + 1).padStart(2, '0');

    // Exibe o popup
    popup.style.display = 'block';
}

// Fechar popup
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    videoContainer.innerHTML = ''; // Limpa o conteúdo do vídeo
});

// Navegação anterior
prevBtn.addEventListener('click', () => {
    const newIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    openVideo(newIndex);
});

// Navegação seguinte
nextBtn.addEventListener('click', () => {
    const newIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
    openVideo(newIndex);
});

// Clique nos thumbnails
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        openVideo(index); // Ao clicar, abre o vídeo correspondente
    });
});