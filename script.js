let carrinho = [];

// Alternar Menus
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

function toggleSearch() {
    const search = document.getElementById('search-bar');
    search.style.display = search.style.display === 'block' ? 'none' : 'block';
}

// Navegação entre Secções
function mostrarSecao(secaoId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById('secao-' + secaoId);
    if(target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filtro de Categorias no Catálogo
function filtrarCatalogo(categoria) {
    mostrarSecao('catalogo');
    const title = document.getElementById('catalog-title');
    if(title) {
        title.innerText = categoria === 'todos' ? 'IN STOCK NOW' : categoria.toUpperCase();
    }

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
    if(btn) btn.classList.add('active');
    filtrarCatalogo(categoria);
}

// Pesquisa
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

// Trocar Foto da Galeria
function trocarFoto(imgId, src, thumb) {
    document.getElementById(imgId).src = src;
    const parent = thumb.parentElement;
    parent.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
    }
    atualizarCarrinho();
    
    // Abre o carrinho
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

    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    cartCount.innerText = totalItens;

    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg" style="color:#666; text-align:center; margin-top:30px;">O teu carrinho está vazio.</p>';
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

// Accordion
function toggleAccordion(btn) {
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

// Finalizar Encomenda no WhatsApp
function finalizarWhatsApp() {
    if (carrinho.length === 0) {
        alert("Adiciona produtos ao carrinho primeiro.");
        return;
    }
    
    let mensagem = "Olá! Gostaria de encomendar os seguintes artigos:\n\n";
    let total = 0;
    
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} (x${item.quantidade}) - ${(item.preco * item.quantidade).toFixed(2)}€\n`;
        total += item.preco * item.quantidade;
    });
    
    mensagem += `\nTotal: ${total.toFixed(2)}€`;
    
    const url = `https://wa.me/351916097477?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}
