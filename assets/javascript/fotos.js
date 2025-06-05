// Preloader Início
const phraseText = "Memórias em Fotos";
const phraseContainer = document.getElementById("phrase");
const preloader = document.getElementById("preloader");
const mainContent = document.getElementById("mainContent");

// Cria Spans para cada Letra
for (let char of phraseText) {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("letter");
    phraseContainer.appendChild(span);
}

const letters = phraseContainer.querySelectorAll(".letter");

// Mostrar Letras
function showLetters(index = 0) {
    if (index < letters.length) {
        letters[index].classList.add("visible");
        setTimeout(() => showLetters(index + 1), 150);
    } else {

        phraseContainer.classList.add("blink");
        setTimeout(() => {
            preloader.style.display = "none";
            mainContent.style.display = "block";
            document.body.style.overflow = "auto";
        }, 3000);
    }
}

// Começa a animação após um pequeno delay para dar tempo à estrela pulsar
setTimeout(() => {
    phraseContainer.style.opacity = "1";
    showLetters();
}, 1000);
// Preloader Fim

// Dropdown Menu Início
document.addEventListener('DOMContentLoaded', () => {
    const toggleIcon = document.querySelector('.menu-dropdown i');
    const dropdown = document.querySelector('.dropdown-menu');

    const uploadForm = document.getElementById('uploadForm');
    const milhaoInput = document.getElementById('milhao');
    const nomeGuerraInput = document.getElementById('nomeGuerra');
    const popupErroMilhao = document.getElementById('popupErroMilhao');
    const popupUpload = document.getElementById('popupUpload');
    const botaoOkErro = document.getElementById('botaoOkErro');
    const fotoExpandida = document.querySelector('.foto-expandida');
    const botaoFechar = document.querySelector('.botao-fechar');
    const tituloFoto = document.querySelector('.titulo');
    const imagemGrande = document.querySelector('.imagem-grande');
    const indiceFoto = document.querySelector('.indice');
    const setaAnterior = document.querySelector('.seta-anterior');
    const setaProxima = document.querySelector('.seta-proxima');

    const popupConfirmacao = document.getElementById('popupConfirmarExclusao');
    const inputMilhaoConfirma = document.getElementById('milhaoConfirmacao');
    const inputGuerraConfirma = document.getElementById('nomeGuerraConfirmacao');
    const botaoConfirmarExclusao = document.getElementById('confirmarExclusao');
    const botaoCancelarExclusao = document.getElementById('cancelarExclusao');

    let fotos = [...document.querySelectorAll('.foto')];
    let indice = 0;
    let fotoParaExcluir = null;

    toggleIcon.addEventListener('click', () => {
        const isOpen = getComputedStyle(dropdown).display === 'block';
        if (!isOpen) {
            dropdown.style.display = 'block';
            toggleIcon.classList.replace('fa-bars', 'fa-xmark');
            document.body.classList.add('menu-open');
        } else {
            dropdown.style.display = 'none';
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
            document.body.classList.remove('menu-open');
        }
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !toggleIcon.contains(e.target)) {
            dropdown.style.display = 'none';
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
            document.body.classList.remove('menu-open');
        }
    });

    document.querySelectorAll('.botao-adicionar').forEach(botao => {
        botao.addEventListener('click', () => {
            if (uploadForm && popupUpload) {
                uploadForm.reset();
                popupUpload.style.display = 'flex';

                if (window.innerWidth <= 1024 && dropdown.style.display === 'block') {
                    dropdown.style.display = 'none';
                    toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                    dropdown.classList.add('escondido');
                }
            }
        });
    });

    window.closePopup = function () {
        document.getElementById('popupUpload').style.display = 'none';
        document.getElementById('popupErroMilhao').style.display = 'none';
    };

    milhaoInput.addEventListener('wheel', e => e.preventDefault());
    milhaoInput.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    });

    milhaoInput.addEventListener('keydown', e => {
        const milhao = parseInt(milhaoInput.value, 10);
        if ((e.key === 'Enter' || e.key === 'Tab') &&
            (isNaN(milhao) || milhao < 1001 || milhao > 1492 || milhaoInput.value.length !== 4)) {
            e.preventDefault();
            popupUpload.style.display = 'none';
            popupErroMilhao.style.display = 'flex';
        }
    });

    milhaoInput.addEventListener('blur', () => {
        const milhao = parseInt(milhaoInput.value, 10);
        if (isNaN(milhao) || milhao < 1001 || milhao > 1492 || milhaoInput.value.length !== 4) {
            popupUpload.style.display = 'none';
            popupErroMilhao.style.display = 'flex';
        }
    });

    uploadForm.addEventListener('submit', e => {
        e.preventDefault();

        const milhao = milhaoInput.value.trim();
        const nomeGuerra = nomeGuerraInput.value.trim();
        const inputFotos = document.getElementById('foto');
        const arquivos = inputFotos.files;

        if (!milhao || milhao.length !== 4 || isNaN(milhao) || milhao < 1001 || milhao > 1492) {
            popupUpload.style.display = 'none';
            popupErroMilhao.style.display = 'flex';
            return;
        }

        if (!nomeGuerra) {
            alert("Digite o Nome de Guerra.");
            return;
        }

        if (arquivos.length === 0) {
            alert("Por favor, selecione pelo menos uma foto.");
            return;
        }

        for (let i = 0; i < arquivos.length; i++) {
            const arquivo = arquivos[i];
            if (!arquivo.type.startsWith('image/')) continue;

            const reader = new FileReader();

            reader.onload = function (event) {
                const novaImagem = document.createElement('img');
                novaImagem.src = event.target.result;
                novaImagem.alt = arquivo.name.replace(/\.[^/.]+$/, "") || "Foto";

                const divFoto = document.createElement('div');
                divFoto.className = 'foto';
                divFoto.dataset.milhao = milhao;
                divFoto.dataset.nomeGuerra = nomeGuerra;
                divFoto.appendChild(novaImagem);

                const botaoDelete = document.createElement('button');
                botaoDelete.className = 'botao-deletar';
                botaoDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
                divFoto.appendChild(botaoDelete);

                document.querySelector('.galeria-grid').appendChild(divFoto);

                fotos = [...document.querySelectorAll('.foto')];
                atualizarEventosDasFotos();
            };

            reader.readAsDataURL(arquivo);
        }

        closePopup();
    });

    botaoOkErro.addEventListener('click', () => {
        popupErroMilhao.style.display = 'none';
        popupConfirmacao.style.display = 'none';
    });

    botaoFechar.addEventListener('click', () => {
        fotoExpandida.classList.remove('active');
    });

    setaAnterior.addEventListener('click', () => {
        if (indice > 0) {
            updateFoto(indice - 1);
        } else {
            updateFoto(fotos.length - 1);
        }
    });

    setaProxima.addEventListener('click', () => {
        if (indice < fotos.length - 1) {
            updateFoto(indice + 1);
        } else {
            updateFoto(0);
        }
    });

    botaoConfirmarExclusao.addEventListener('click', () => {
        const milhao = inputMilhaoConfirma.value.trim();
        const guerra = inputGuerraConfirma.value.trim();

        if (fotoParaExcluir &&
            fotoParaExcluir.dataset.milhao === milhao &&
            fotoParaExcluir.dataset.nomeGuerra === guerra) {
            fotoParaExcluir.remove();
            fotos = [...document.querySelectorAll('.foto')];
            fotoParaExcluir = null;
            popupConfirmacao.style.display = 'none';
        } else {
            popupErroMilhao.style.display = 'flex';
        }
    });

    botaoCancelarExclusao.addEventListener('click', () => {
        popupConfirmacao.style.display = 'none';
        fotoParaExcluir = null;
    });

    function updateFoto(i) {
        const foto = fotos[i];
        if (!foto) return;
        const img = foto.querySelector('img');
        imagemGrande.src = img.src;
        tituloFoto.textContent = img.alt;
        indiceFoto.textContent = i < 9 ? `0${i + 1}` : `${i + 1}`;
        indice = i;
    }

    function atualizarEventosDasFotos() {
        fotos.forEach(foto => {
            foto.replaceWith(foto.cloneNode(true));
        });

        fotos = [...document.querySelectorAll('.foto')];

        fotos.forEach((foto, i) => {
            const botaoDelete = foto.querySelector('.botao-deletar');

            if (botaoDelete) {
                botaoDelete.onclick = (e) => {
                    e.stopPropagation();
                    fotoParaExcluir = foto;
                    popupConfirmacao.style.display = 'flex';
                    inputMilhaoConfirma.value = '';
                    inputGuerraConfirma.value = '';
                };
            }

            foto.onclick = () => {
                updateFoto(i);
                fotoExpandida.classList.add('active');
            };
        });
    }

    atualizarEventosDasFotos();
});