// Conexão com Supabase
const SUPABASE_URL = 'https://ehrsonmsjtnsfnznitsl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVocnNvbm1zanRuc2Zuem5pdHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MzkyMDEsImV4cCI6MjA2MjQxNTIwMX0.Wl9JJvUxPA5r-rgVKYoMsi2nhYGjumArB7N3RnOGSwA'; // chave completa aqui
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// --- Início do Dropdown Menu, Upload e Galeria ---
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

    // Fotos da galeria
    let fotos = [];
    let indice = 0;
    let fotoParaExcluir = null;

    // Função para carregar fotos automaticamente (exemplo simples, pode adaptar para Supabase ou API)
    function carregarFotosAutomaticamente() {
        async function carregarFotosAutomaticamente() {
            console.log("Fotos encontradas:", data);
            try {
                const { data, error } = await client.storage.from('fotos').list('', {
                    limit: 100, // pode ajustar esse valor conforme necessário
                    sortBy: { column: 'created_at', order: 'desc' }
                });

                if (error) {
                    console.error("Erro ao listar fotos:", error);
                    return;
                }

                const galeriaGrid = document.querySelector('.galeria-grid');
                galeriaGrid.innerHTML = ''; // limpa a galeria para evitar duplicações

                fotos = [];

                for (const item of data) {
                    const { data: publicUrlData } = client.storage.from('fotos').getPublicUrl(item.name);
                    const urlImagem = publicUrlData.publicUrl;

                    // Extração de dados do nome do arquivo
                    const partes = item.name.split('_');
                    const milhao = partes[0];
                    const nomeGuerra = partes[1];
                    const nomeArquivo = item.name;

                    const novaImagem = document.createElement('img');
                    novaImagem.src = urlImagem;
                    novaImagem.alt = nomeArquivo.replace(/\.[^/.]+$/, "") || "Foto";

                    const divFoto = document.createElement('div');
                    divFoto.className = 'foto';
                    divFoto.dataset.milhao = milhao;
                    divFoto.dataset.nomeGuerra = nomeGuerra;
                    divFoto.dataset.nomeArquivo = nomeArquivo;

                    divFoto.appendChild(novaImagem);

                    const botaoDelete = document.createElement('button');
                    botaoDelete.className = 'botao-deletar';
                    botaoDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    divFoto.appendChild(botaoDelete);

                    galeriaGrid.appendChild(divFoto);
                    fotos.push(divFoto);
                }
            } catch (err) {
                console.error("Erro inesperado ao carregar as fotos:", err);
            }
        }
    }
    carregarFotosAutomaticamente();

    // Toggle do dropdown menu
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

    // Fecha dropdown clicando fora
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !toggleIcon.contains(e.target)) {
            dropdown.style.display = 'none';
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
            document.body.classList.remove('menu-open');
        }
    });

    // Botão para abrir popup de upload
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

    // Função global para fechar popups
    window.closePopup = function () {
        popupUpload.style.display = 'none';
        popupErroMilhao.style.display = 'none';
        popupConfirmacao.style.display = 'none';
    };

    // Previne scroll indesejado no campo Milhão
    milhaoInput.addEventListener('wheel', e => e.preventDefault());
    milhaoInput.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    });

    // Valida Milhão ao pressionar Enter ou Tab
    milhaoInput.addEventListener('keydown', e => {
        const milhao = parseInt(milhaoInput.value, 10);
        if ((e.key === 'Enter' || e.key === 'Tab') &&
            (isNaN(milhao) || milhao < 1001 || milhao > 1492 || milhaoInput.value.length !== 4)) {
            e.preventDefault();
            popupUpload.style.display = 'none';
            popupErroMilhao.style.display = 'flex';
        }
    });

    // Valida Milhão no blur (perda de foco)
    milhaoInput.addEventListener('blur', () => {
        const milhao = parseInt(milhaoInput.value, 10);
        if (isNaN(milhao) || milhao < 1001 || milhao > 1492 || milhaoInput.value.length !== 4) {
            popupUpload.style.display = 'none';
            popupErroMilhao.style.display = 'flex';
        }
    });

    // Upload do formulário
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

            (async () => {
                try {
                    if (!arquivo || arquivo.size === 0) {
                        alert("Arquivo inválido ou vazio.");
                        return;
                    }

                    const extensao = arquivo.name.split('.').pop().toLowerCase();
                    const nomeLimpo = arquivo.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');

                    const nomeArquivo = `${milhao}_${nomeGuerra}_${Date.now()}_${nomeLimpo}`;

                    // Faz o upload da imagem para o bucket 'fotos'
                    const { data, error } = await client.storage
                        .from('fotos')
                        .upload(nomeArquivo, arquivo, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (error) {
                        alert("Erro ao enviar a imagem para o Supabase.");
                        console.error(error);
                        return;
                    }

                    // Recupera a URL pública da imagem
                    const { data: publicUrlData } = client.storage
                        .from('fotos')
                        .getPublicUrl(nomeArquivo);

                    const urlImagem = publicUrlData.publicUrl;

                    // Cria os elementos HTML com a imagem e insere na galeria
                    const novaImagem = document.createElement('img');
                    novaImagem.src = urlImagem;
                    novaImagem.alt = arquivo.name.replace(/\.[^/.]+$/, "") || "Foto";

                    const divFoto = document.createElement('div');
                    divFoto.className = 'foto';
                    divFoto.dataset.milhao = milhao;
                    divFoto.dataset.nomeGuerra = nomeGuerra;
                    divFoto.dataset.nomeArquivo = nomeArquivo; // usado depois para exclusão
                    divFoto.appendChild(novaImagem);

                    const botaoDelete = document.createElement('button');
                    botaoDelete.className = 'botao-deletar';
                    botaoDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    divFoto.appendChild(botaoDelete);

                    document.querySelector('.galeria-grid').appendChild(divFoto);
                    fotos = [...document.querySelectorAll('.foto')];

                } catch (err) {
                    alert("Erro inesperado ao processar a imagem.");
                    console.error(err);
                }
            })();
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

    // Navegação da foto expandida
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

    // Confirmação da exclusão
    botaoConfirmarExclusao.addEventListener('click', () => {
        const milhaoConfirma = inputMilhaoConfirma.value.trim();
        const nomeGuerraConfirma = inputGuerraConfirma.value.trim();

        if (!fotoParaExcluir) {
            alert("Erro: Nenhuma foto selecionada para exclusão.");
            popupConfirmacao.style.display = 'none';
            return;
        }

        if (milhaoConfirma === fotoParaExcluir.dataset.milhao &&
            nomeGuerraConfirma.toLowerCase() === fotoParaExcluir.dataset.nomeGuerra.toLowerCase()) {
            // Remove foto
            fotoParaExcluir.remove();
            fotos = [...document.querySelectorAll('.foto')];
            popupConfirmacao.style.display = 'none';
            fotoExpandida.classList.remove('active');
            fotoParaExcluir = null;
        } else {
            alert("Milhão ou Nome de Guerra incorretos. Exclusão cancelada.");
        }
    });

    botaoCancelarExclusao.addEventListener('click', () => {
        popupConfirmacao.style.display = 'none';
        fotoParaExcluir = null;
    });

    // Deleção via botão deletar na foto
    document.querySelector('.galeria-grid').addEventListener('click', e => {
        if (e.target.closest('.botao-deletar')) {
            fotoParaExcluir = e.target.closest('.foto');
            if (fotoParaExcluir) {
                inputMilhaoConfirma.value = '';
                inputGuerraConfirma.value = '';
                popupConfirmacao.style.display = 'flex';
            }
        }
    });

    // Atualiza foto expandida
    function updateFoto(i) {
        if (i < 0 || i >= fotos.length) return;
        indice = i;
        const foto = fotos[i];
        const img = foto.querySelector('img');
        if (!img) return;

        imagemGrande.src = img.src;
        tituloFoto.textContent = img.alt || "Sem título";
        indiceFoto.textContent = `${i + 1} / ${fotos.length}`;
        fotoExpandida.classList.add('active');
    }

    // Clique na foto para expandir
    document.querySelector('.galeria-grid').addEventListener('click', e => {
        const target = e.target;
        const fotoDiv = target.closest('.foto');
        if (fotoDiv) {
            const idx = fotos.indexOf(fotoDiv);
            if (idx !== -1) {
                updateFoto(idx);
            }
        }
    });
});