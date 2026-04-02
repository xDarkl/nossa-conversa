//Começo da Lógica das Estatísticas

if (document.getElementById("stats")) {
    const div = document.getElementById("stats");

    div.innerHTML = `
        <h2> Número de Mensagens </h2>
        <p>Total: ${dados.totalMensagens}</p>
        <p>Você: ${dados.porPessoa["Couto"]}</p>
        <p>Ela: ${dados.porPessoa["Abi"]}</p>

        <h2>Tempo e Conteúdo das Mensagens</h2>
        <p>Hora mais ativa: ${dados.horaMaisAtiva}h</p>
        <p>Dias conversados: ${dados.diasConversados}</p>
        <p>Mídias (Fotos, Figurinhas e GIFs): ${dados.midias}</p>

        <h2>Algumas Palavras Chave da Nossa Conversa</h2>
        <p>Número de "amor": ${dados.palavras.amor}</p>
        <p>Número de "eu te amo": ${dados.palavras.euTeAmo}</p>
        <p>Número de "little couto": ${dados.palavras.littleCouto}</p>
        <p>Número de "abimon": ${dados.palavras.abimon}</p>
        <p>Número de "filhos": ${dados.palavras.filhos}</p>
        <p>Número de "casa": ${dados.palavras.casa}</p>
        <p>Número de "futuro": ${dados.palavras.futuro}</p>
        <p>Número de "aceitar": ${dados.palavras.aceitar}</p>
        <p>Número de "trans": ${dados.palavras.trans}</p>    
        `;
}

//Começo da Lógica do Quiz

if (document.getElementById("quiz")) {

    let indice = 0;
    let pontos = 0;

    const perguntas = [
        {
            pergunta: "Quem mandou mais mensagens?",
            resposta: "Couto",
            opcoes: ["Couto", "Abi"]
        },
        {
            pergunta: "Qual foi a Hora em que mais mandamos mensagens?",
            resposta: "12",
            opcoes: ["18", "12", "16"]
        },
        {
            pergunta: "Quantos dias diferentes nós nos falamos?",
            resposta: "334",
            opcoes: ["405", "324", "334"]
        },
        {
            pergunta: "Quantas mídias (entre fotos, gifs e figurinhas) mandamos?",
            resposta: dados.midias,
            opcoes: ["33234", "23453", "29053", dados.midias]
        },
        {
            pergunta: `Quantos "amor" enviamos?`,
            resposta: dados.palavras.amor,
            opcoes: ["23267", "19332", "16345", dados.palavras.amor]
        },
        {
            pergunta: `Quantoss "eu te amo" mandamos? xxxx`,
            resposta: dados.palavras.amor,
            opcoes: ["23267", "19332", "16345", dados.palavras.amor]
        },
        {
            pergunta: "Quantos dias diferentes nós nos falamos? xxxx",
            resposta: "334",
            opcoes: ["405", "324", "334"]
        },
    ];

    function mostrarPergunta() {
        const q = perguntas[indice];
        document.getElementById("quiz").innerHTML = `
            <h2>${q.pergunta}</h2>
            ${q.opcoes.map(op =>
                `<button class="bQuiz" onclick="responder('${op}')">${op}</button>`
            ).join("")}
        `;
    }

    window.responder = function(op) {
        if (op === perguntas[indice].resposta) pontos++;

        indice++;

        if (indice < perguntas.length) {
            mostrarPergunta();
        } else {
            document.getElementById("quiz").innerHTML =
                `<h2>Resultado: ${pontos}</h2>`;
        }
    }

    mostrarPergunta();
}


//Começo da lógia da busca

let historicoBuscas = [];
let textoConversa = "";

fetch("../conversa.txt")
    .then(res => res.text())
    .then(texto => {  
        textoConversa = texto.toLowerCase();
        console.log("Arquivo carregado");
    })
    .catch(err => console.error("Erro ao carregar arquivo:", err));

function pegarCor(q) {
    if (q < 1000) return "#c6c3c3";
    if (q < 5000) return "#e4e8a3";
    if (q < 10000) return "#f6e585";
    return "#ffd700";
}

function mostrarHistorico() {
    const div = document.getElementById("historico");

    if (!div) return;

    div.innerHTML = historicoBuscas
        .map(item => {
            const cor = pegarCor(item.quantidade);

            return `
                <div class="card" style="background-color: ${cor}">
                    ${item.termo} — ${item.quantidade}
                </div>
            `;
        })
        .join("");
}

function atualizarHistorico(termo, ocorrencias) {
    const existente = historicoBuscas.find(item => item.termo === termo);

    if (existente) {
        existente.quantidade = ocorrencias;
    } else {
        historicoBuscas.push({ termo, quantidade: ocorrencias });
    }

    historicoBuscas.sort((a, b) => b.quantidade - a.quantidade);
    mostrarHistorico();
}

function buscar() {
    const termoInput = document.getElementById("inputBusca").value;

    if (!textoConversa || !termoInput) {
        return;
    }

    const texto = textoConversa.toLowerCase();
    const termo = termoInput.toLowerCase().trim();

    const termoSeguro = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let regex;

    if (termo.includes(" ")) {
        regex = new RegExp(termoSeguro, "g");
    } else {
        regex = new RegExp(`\\b${termoSeguro}\\b`, "g");
    }

    const ocorrencias = (texto.match(regex) || []).length;

    document.getElementById("resultado").innerText =
        `Aparece ${ocorrencias} vezes`;

    // ✅ agora certo
    atualizarHistorico(termo, ocorrencias);
}