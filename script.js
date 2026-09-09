// Dados simulados do carrinho
let carrinho = [];

// Temporizador do Drop
function startTimer() {
    const timerElement = document.getElementById('drop-timer');
    let timeLeft = 2 * 24 * 60 * 60 + 14 * 60 * 60 + 35 * 60 + 10; // 02D : 14H : 35M : 10S

    function update() {
        const d = Math.floor(timeLeft / (24 * 60 * 60));
        const h = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
        const m = Math.floor((timeLeft % (60 * 60)) / 60);
        const s = timeLeft % 60;

        timerElement.innerText = `${String(d).padStart(2, '0')}D : ${String(h).padStart(2, '0')}H : ${String(m).padStart(2, '0')}M : ${String(s).padStart(2, '0')}S`;
        timeLeft--;

        if (timeLeft >= 0) {
            setTimeout(update, 1000);
        }
    }
    update();
}
startTimer();

// Alternar Menus Laterais
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}

function toggleCart() {
    const cart = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    cart.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Navegação entre Secções
function mostrarSecao(secaoId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('secao-' + secaoId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filtro de Categorias no Catálogo
function filtrarCatalogo(categoria) {
    mostrarSecao('catalogo');
    const title = document.getElementById('catalog-title');
    title.innerText = categoria === 'todos' ? 'IN STOCK NOW' : categoria.toUpperCase();

    const items = document.querySelectorAll('.product-item');
    items.forEach(item => {
        if (categoria === 'todos' || item.getAttribute('data-categoria') === categoria) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function filtrarCategoriaInterna(categoria, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtrarCatalogo(categoria);
}

// Pesquisa de Produtos
function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.style.display = searchBar.style.display === 'block' ? 'none' : 'block';
}

function pesquisarProdutos(termo) {
    const t = termo.toLowerCase();
    const items = document.querySelectorAll('.product-item');
    items.forEach(item => {
        const nome = item.getAttribute('data-nome').toLowerCase();
        if (nome.includes(t)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Ordenação e Filtro de Tamanhos (Simulado)
function ordenarEFiltrarProdutos() {
    // Implementação simulada
    alert("Função de ordenação e filtro de tamanho ativada.");
}

// Trocar Foto Principal do Produto
function trocarFoto(imgId, src, thumb) {
    document.getElementById(imgId).src = src;
    const parent = thumb.parentElement;
    parent.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

// Adicionar produto ao carrinho (Quantidade Ilimitada)
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        // Incrementa a quantidade, já que há stock ilimitado
        itemExistente.quantidade++;
    } else {
        carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
    }
    atualizarCarrinho();
    
    // Abre o carrinho para confirmação
    const cart = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!cart.classList.contains('active')) {
        cart.classList.add('active');
        overlay.classList.add('active');
    }
}

// Atualizar interface do carrinho
function atualizarCarrinho() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-price');

    cartCount.innerText = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">O teu carrinho está vazio.</p>';
        cartTotal.innerText = '0,00 €';
        return;
    }

    cartItems.innerHTML = carrinho.map((item, index) => `
        <div class="cart-item">
            <div class="item-info">
                <strong>${item.nome}</strong>
                <span>${item.preco.toFixed(2)} €</span>
            </div>
            <div class="item-quantity">
                <button onclick="mudarQuantidade(${index}, -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="mudarQuantidade(${index}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    cartTotal.innerText = `${total.toFixed(2)} €`;
}

// Mudar quantidade no carrinho
function mudarQuantidade(index, delta) {
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    atualizarCarrinho();
}

// Guia de Tamanhos
function abrirGuiaTamanhos() {
    document.getElementById('size-guide-modal').style.display = 'flex';
}
function fecharGuiaTamanhos() {
    document.getElementById('size-guide-modal').style.display = 'none';
}

// Suporte Accordion
function toggleAccordion(btn) {
    btn.classList.toggle('active');
    const body = btn.nextElementSibling;
    const sign = btn.querySelector('.sign');
    if (body.style.display === 'block') {
        body.style.display = 'none';
        sign.innerText = '+';
    } else {
        body.style.display = 'block';
        sign.innerText = '-';
    }
}

// Checkout (WhatsApp)
function abrirCheckout() {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio.");
        return;
    }
    alert("Simulação de Checkout via WhatsApp ativada.");
    toggleCart();
}

// Lógica Específica para a Carhartt
let carharttColor = 'preto'; // Cor padrão

function setCarharttColor(color) {
    carharttColor = color;
}

function adicionarAoCarrinhoCarhartt() {
    const nome = `Casaco Carhartt Detroit (Cor: ${carharttColor.toUpperCase()})`;
    const preco = 80;
    adicionarAoCarrinho(nome, preco);
}
