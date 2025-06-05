// Preloader Início
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".preloader").style.display = "none";
    }, 6000);
});
// Preloader Fim

// Tarjetas Animadas Início
setTimeout(() => {
    const container = document.getElementById('grito-container');
    if (!container) return;

    const frases = [
        "Na força do combate",
        "no sangue do inimigo",
        "a Azul não se abate",
        "e não foge do perigo",
        "nossa força vem do céu",
        "e do homem interior",
        "Especialistas nós seremos",
        "pois conhecemos seu valor",
        "Azul 91"
    ];

    const cabecalho = document.querySelector('.cabecalho-tarjeta');
    const cabecalhoHeight = cabecalho ? cabecalho.getBoundingClientRect().bottom : 0;
    const minDistance = 80;

    let tarjetasAtivas = [];

    function colide(pos1, pos2) {
        return !(
            pos1.left + pos1.width + minDistance < pos2.left ||
            pos1.left > pos2.left + pos2.width + minDistance ||
            pos1.top + pos1.height + minDistance < pos2.top ||
            pos1.top > pos2.top + pos2.height + minDistance
        );
    }

    function gerarPosicao(tarjetaWidth, tarjetaHeight) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const maxAttempts = 80;

        for (let i = 0; i < maxAttempts; i++) {
            const left = Math.random() * (vw - tarjetaWidth);
            const top = Math.random() * (vh - cabecalhoHeight - tarjetaHeight) + cabecalhoHeight;

            const novaPos = { left, top, width: tarjetaWidth, height: tarjetaHeight };

            if (!tarjetasAtivas.some(pos => colide(novaPos, pos))) {
                return novaPos;
            }
        }

        // fallback
        const fallbackleft = Math.random() * (vw - tarjetaWidth);
        const fallbacktop = Math.random() * (vh - cabecalhoHeight - tarjetaHeight) + cabecalhoHeight;

        return {
            left: fallbackleft,
            top: fallbacktop,
            width: tarjetaWidth,
            height: tarjetaHeight
        };
    }

    const intervaloEntreTarjetas = 800;

    // Remove tarjetas vazias (fantasmas) antes de começar
    const tarjetasFantasmas = document.querySelectorAll('.tarjeta-generica');
    tarjetasFantasmas.forEach(t => {
        if (!t.textContent.trim()) {
            t.remove();
        }
    });

    function exibirTarjetasLoop() {
        tarjetasAtivas = [];

        frases.forEach((texto, index) => {
            setTimeout(() => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta-generica';
                tarjeta.setAttribute('data-valida', 'true');
                tarjeta.textContent = texto;
                tarjeta.style.opacity = '0';

                container.appendChild(tarjeta);

                // Espera renderizar para medir e posicionar
                requestAnimationFrame(() => {
                    const rect = tarjeta.getBoundingClientRect();
                    const pos = gerarPosicao(rect.width, rect.height);

                    tarjeta.style.top = `${pos.top}px`;
                    tarjeta.style.left = `${pos.left}px`;
                    tarjeta.style.opacity = '1';

                    tarjetasAtivas.push(pos);
                });

                setTimeout(() => tarjeta.remove(), 5000);
            }, index * intervaloEntreTarjetas);
        });

        const tempoTotal = (frases.length - 1) * intervaloEntreTarjetas + 5000;
        setTimeout(exibirTarjetasLoop, tempoTotal);
    }

    function exibirMiniaturasLoop() {
        const imagensFixas = [
            "../../assets/imagens/5_bgNomeTurma.png",
            "../../assets/imagens/12_caneca.png"
        ];

        imagensFixas.forEach((src, index) => {
            setTimeout(() => {
                const img = document.createElement("img");
                img.src = src;
                img.className = "miniatura-animada";
                img.setAttribute('alt', `Miniatura ${index + 1}`);
                img.style.opacity = "0";
                container.appendChild(img);

                requestAnimationFrame(() => {
                    const rect = img.getBoundingClientRect();
                    const pos = gerarPosicao(rect.width, rect.height);
                    img.style.top = `${pos.top}px`;
                    img.style.left = `${pos.left}px`;
                    img.style.opacity = "1";
                    tarjetasAtivas.push(pos);
                });

                setTimeout(() => img.remove(), 5000);
            }, index * 600);
        });

        // moeda giratória
        setTimeout(() => {
            const moedaWrapper = document.createElement("div");
            moedaWrapper.className = "moeda-container";

            const moeda = document.createElement("div");
            moeda.className = "moeda";

            const frente = document.createElement("img");
            frente.src = "../../assets/imagens/10_moedaFrente.png";
            frente.className = "moeda-face moeda-frente";

            const verso = document.createElement("img");
            verso.src = "../../assets/imagens/11_moedaVerso.png";
            verso.className = "moeda-face moeda-verso";

            moeda.appendChild(frente);
            moeda.appendChild(verso);
            moedaWrapper.appendChild(moeda);
            container.appendChild(moedaWrapper);

            const rect = moedaWrapper.getBoundingClientRect();
            const pos = gerarPosicao(rect.width, rect.height);
            moedaWrapper.style.top = `${pos.top}px`;
            moedaWrapper.style.left = `${pos.left}px`;

            tarjetasAtivas.push({
                top: pos.top,
                left: pos.left,
                width: rect.width,
                height: rect.height
            });

            setTimeout(() => {
                moeda.style.transform = "rotateY(180deg)";
            }, 2500); // gira no meio do tempo

            setTimeout(() => {
                moedaWrapper.remove();
            }, 5000);
        }, imagensFixas.length * 600);

        // repete ciclo
        setTimeout(exibirMiniaturasLoop, 7000);
    }

    exibirTarjetasLoop();
    exibirMiniaturasLoop();
}, 5500);
// Tarjetas Animadas Fim

function exibirMiniaturasAleatorias() {
    imagensMiniaturas.forEach((src, index) => {
        setTimeout(() => {
            const img = document.createElement("img");
            img.src = src;
            img.className = "miniatura-animada";
            img.setAttribute('alt', `Miniatura ${index + 1}`);
            img.style.opacity = "0";

            container.appendChild(img);

            requestAnimationFrame(() => {
                const rect = img.getBoundingClientRect();
                const pos = gerarPosicao(rect.width, rect.height);

                img.style.top = `${pos.top}px`;
                img.style.left = `${pos.left}px`;
                img.style.opacity = "1";

                tarjetasAtivas.push(pos);
            });

            setTimeout(() => img.remove(), 5000);
        }, index * 600); // um pequeno intervalo entre elas
    });
}

// Dropdown Menu Início
document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const toggleIcon = document.querySelector('.menu-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const botoesGerar = document.querySelectorAll('.botao-gerar');

    // Só continua se todos os elementos essenciais existirem
    if (!toggleIcon || !dropdownMenu) {
        console.warn('Elementos para dropdown não encontrados.');
        return;
    }

    console.log("Script do dropdown carregado");

    function fecharDropdown() {
        if (dropdownMenu.classList.contains('active')) {
            dropdownMenu.classList.remove('active');
            toggleIcon.classList.remove('active');
        }
    }

    toggleIcon.addEventListener('click', function () {
        console.log('Ícone clicado! Toggle menu');
        dropdownMenu.classList.toggle('active');

        // Trocar ícone
        const icon = toggleIcon.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    botoesGerar.forEach(botao => {
        botao.addEventListener('click', () => {
            dropdownMenu.classList.remove('active');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1025) {
            fecharDropdown();
        }
    });
});
// Dropdown Menu Fim

// Popup Gerar Tarjeta Início
// Abrir o popup quando clicar no botão "Gerar Tarjeta"
document.querySelectorAll('.botao-gerar').forEach(botao => {
    botao.addEventListener('click', function () {
        // Limpar os Campos do Formulário
        uploadForm.reset();

        // Exibir o popup
        document.getElementById('popupUpload').style.display = 'flex';
    });
});

// Função para abrir o popup
function abrirPopup() {
    // Limpar os campos do formulário
    uploadForm.reset();

    // Exibir o popup
    document.getElementById('popupUpload').style.display = 'flex';
}

// Validação do Milhão
const uploadForm = document.getElementById('uploadForm');
const milhaoInput = document.getElementById('milhao');
const popupErroMilhao = document.getElementById('popupErroMilhao');

// Impede a rolagem ou teclas de setas no campo Milhão
milhaoInput.addEventListener('wheel', e => e.preventDefault());
milhaoInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
    }
});

// Evento de envio do formulário
uploadForm.addEventListener('submit', function (e) {
    const milhao = parseInt(milhaoInput.value, 10);
    const nomeVal = document.getElementById("nomeGuerra").value.trim().toUpperCase();

    if (
        isNaN(milhao) ||
        milhao < 1001 ||
        milhao > 1492 ||
        milhaoInput.value.length !== 4 ||
        nomeVal === ""
    ) {
        e.preventDefault(); // Impede envio do formulário
        popupErroMilhao.style.display = 'flex';
        return;
    }
});

// Fechar Popup Gerar Tarjeta
function closePopup() {
    document.getElementById('popupUpload').style.display = 'none';

    // Reexibir Ícone Bars ao fechar Popup Gerar Tarjeta
    const menuDropdown = document.querySelector('.menu-dropdown');
    const toggleIcon = document.querySelector('.menu-dropdown i');

    menuDropdown.classList.remove('escondido');
    toggleIcon.classList.remove('fa-xmark');
    toggleIcon.classList.add('fa-bars');
}

// Botão "Ok" do erro de Milhão
document.getElementById('botaoOkErro').addEventListener('click', function () {
    popupErroMilhao.style.display = 'none';
    closePopup(); // Fecha o popup de adicionar foto
});

// Tarjeta Personalizada Início
document.getElementById("uploadForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const milhaoVal = document.getElementById("milhao").value;
    const nomeVal = document.getElementById("nomeGuerra").value.trim().toUpperCase();

    if (!/^\d{4}$/.test(milhaoVal) || parseInt(milhaoVal) < 1001 || parseInt(milhaoVal) > 1492 || nomeVal === "") {
        document.getElementById("popupErroMilhao").style.display = 'flex';
        return;
    }

    // Dados da tarjeta
    const textoAluno = "ALUNO";
    const fullMilhao = `91-${milhaoVal}`;
    const fullNome = nomeVal;
    const totalCaracteres = textoAluno.length + fullMilhao.length + fullNome.length;

    // Referências
    const tarjeta = document.getElementById("tarjetaFinal");
    const finalAluno = document.getElementById("finalAluno");
    const finalMilhao = document.getElementById("finalMilhao");
    const finalNome = document.getElementById("finalNome");
    const container = document.getElementById("tarjetaFinalContainer");
    const loader = document.getElementById("tarjetaLoader");
    const btnVerTarjetaContainer = document.getElementById("btnVerTarjetaContainer");

    // Reset
    finalAluno.textContent = "";
    finalMilhao.textContent = "";
    finalNome.textContent = "";
    container.style.display = "none";
    tarjeta.style.display = "none";
    tarjeta.style.transform = "scale(1)";
    tarjeta.style.animation = "none";
    loader.style.display = "none";
    btnVerTarjetaContainer.style.display = "none";

    // Fecha Formulário Gerador de Tarjeta
    document.getElementById("popupUpload").style.display = "none";

    // Oculta Tarjeta Existente
    container.style.display = "flex";
    tarjeta.style.display = "flex";
    tarjeta.style.animation = "spinTarjeta 3s linear infinite";

    const tempoPorCaractere = 400;
    let tempoTotal = totalCaracteres * tempoPorCaractere;
    tempoTotal = Math.max(6000, Math.min(tempoTotal, 12000));

    let step = 0;
    let ultimoTimestamp = null;

    loader.style.display = "block";

    function animar(timestamp) {
        if (!ultimoTimestamp) ultimoTimestamp = timestamp;
        const delta = timestamp - ultimoTimestamp;

        if (delta >= tempoPorCaractere && step < totalCaracteres) {
            if (step < textoAluno.length) {
                finalAluno.textContent += textoAluno[step];
            } else if (step < textoAluno.length + fullMilhao.length) {
                finalMilhao.textContent += fullMilhao[step - textoAluno.length];
            } else {
                finalNome.textContent += fullNome[step - textoAluno.length - fullMilhao.length];
            }
            tarjeta.style.transform = `scale(1) rotate(${step * 20}deg)`;
            step++;
            ultimoTimestamp = timestamp;
        }

        if (step < totalCaracteres) {
            requestAnimationFrame(animar);
        } else {
            tarjeta.style.animation = "none";
            tarjeta.style.transform = "scale(1)";
            loader.style.display = "none";
            btnVerTarjetaContainer.style.display = "block";
        }
    }

    // Início da animação
    requestAnimationFrame(animar);
});

function esconderTarjeta() {
    const tarjeta = document.getElementById("tarjetaFinal");
    const container = document.getElementById("tarjetaFinalContainer");
    const btnVerTarjetaContainer = document.getElementById("btnVerTarjetaContainer");

    tarjeta.style.display = "none";
    container.style.display = "none";
    tarjeta.style.animation = "none";
    btnVerTarjetaContainer.style.display = "none";
}

// Adiciona Evento Esconder Tarjeta ao clicar nos botões "Gerar Tarjeta"
document.querySelectorAll(".botao-gerar").forEach(botao => {
    botao.addEventListener("click", esconderTarjeta);
});

document.getElementById("btnVerTarjeta").addEventListener("click", esconderTarjeta);
document.querySelectorAll(".botao-gerar").forEach(botao => {
    botao.addEventListener("click", esconderTarjeta);
});

// Função para uma Nova Tarjeta ser Construída
function mostrarBotaoVerTarjeta() {
    document.getElementById("btnVerTarjetaContainer").style.display = "block";
}
// Tarjeta Personalizada Fim


// Abrir Tarjeta Expandida
document.getElementById("btnVerTarjeta").addEventListener("click", () => {
    const popup = document.getElementById("popupTarjetaExpandida");
    const nome = document.getElementById("finalNome").textContent || "NOME";
    const titulo = document.getElementById("tituloExpandido");
    const destino = document.getElementById("areaTarjetaExpandida");
    const original = document.getElementById("tarjetaFinal");

    titulo.textContent = `Tarjeta de ${nome}`;
    destino.innerHTML = "";

    const clone = original.cloneNode(true);
    clone.removeAttribute("id");

    // Tamanho da Tarjeta Expandida
    clone.style.display = "flex";
    clone.style.transform = "scale(1.1)";
    destino.appendChild(clone);

    popup.style.display = "flex";

    // Oculta a Tarjeta Pequena
    document.getElementById("tarjetaFinalContainer").style.display = "none";
});

// Fechar Popup de Tarjeta Expandida
document.getElementById("fecharExpandida").addEventListener("click", () => {
    fecharPopupExpandida();
});

// Salvar Tarjeta Expandida
document.getElementById("btnSalvarExpandida").addEventListener("click", () => {
    const tarjeta = document.querySelector("#areaTarjetaExpandida .tarjeta");
    html2canvas(tarjeta).then(canvas => {
        const link = document.createElement('a');
        const nome = document.getElementById("finalMilhao").textContent.replace("91-", "");
        link.download = `tarjeta-${nome}.png`;
        link.href = canvas.toDataURL();
        link.click();
        fecharPopupExpandida();
    });
});

function fecharPopupExpandida() {
    document.getElementById("popupTarjetaExpandida").style.display = "none";
    document.getElementById("areaTarjetaExpandida").innerHTML = "";
}