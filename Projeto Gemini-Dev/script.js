let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input");
let dados = []; // Variável para guardar os jogos carregados

async function iniciarBusca() {
    // 1. Se os dados ainda não foram carregados, busca do JSON
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            cardContainer.innerHTML = "<p>Erro ao carregar a base de dados.</p>";
            return; 
        }
    }

    // 2. Pega o que foi digitado e converte para minúsculas
    const termoBusca = campoBusca.value.toLowerCase().trim();

    // 3. Filtra os dados
    // Dica: Se o termoBusca for vazio (""), o .includes retorna true para tudo,
    // então ele exibe a lista completa (efeito de carregar tudo).
    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca) ||
        dado.plataforma.toLowerCase().includes(termoBusca)
    );

    // 4. Chama a função que desenha na tela
    renderizarCards(dadosFiltrados);
}

function renderizarCards(listaDeJogos) {
    cardContainer.innerHTML = ""; // Limpa os cards antigos

    // Se a busca não retornou nada
    if (listaDeJogos.length === 0) {
        cardContainer.innerHTML = "<p style='text-align:center; width:100%; margin-top:2rem;'>Nenhum jogo encontrado.</p>";
        return;
    }

    // Usamos forEach para ter acesso ao 'index' (posição 0, 1, 2...)
    listaDeJogos.forEach((dado, index) => {
        let article = document.createElement("article");
        article.classList.add("card");

        // --- A MÁGICA DA CASCATA ---
        // Define o atraso da animação baseado na posição do card.
        // Card 0: 0s | Card 1: 0.1s | Card 2: 0.2s ...
        article.style.animationDelay = `${index * 0.1}s`;

        // Monta o HTML interno respeitando o CSS que criamos (card-content)
        article.innerHTML = `
            <img src="${dado.imagem}" alt="Capa do jogo ${dado.nome}">
            
            <div class="card-content">
                <h2>${dado.nome}</h2>
                
                <p><strong>Lançamento:</strong> ${dado.data_lancamento}</p>
                <p><strong>Plataforma:</strong> ${dado.plataforma}</p>
                <p><strong>Criador:</strong> ${dado.criador}</p>
                
                <p style="margin-top: 0.5rem; font-style: italic; opacity: 0.8;">
                    "${dado.descricao}"
                </p>
                
                <a href="${dado.link}" target="_blank">Página Oficial</a>
            </div>
        `;

        cardContainer.appendChild(article);
    });
}

// --- BÔNUS: Permitir buscar apertando "ENTER" ---
campoBusca.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});