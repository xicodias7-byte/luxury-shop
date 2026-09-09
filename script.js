let carrinho = [];

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

function mostrarSecao(secaoId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById('secao-' + secaoId);
    if(target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filtrarCatalogo(categoria) {
    mostrarSecao('catalogo');
    const title = document.getElementById('catalog-title');
    if(title) {
        title.innerText = categoria === 'todos' ? 'IN STOCK NOW' : categoria.toUpperCase();
    }

    const items = document.querySelectorAll('.product-item');
    items.forEach(item => {
        if (categoria === 'todos' || item.getAttribute('data-categoria') === categoria) {
            item.style.display = 'flex';
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

function pesquisarProdutos(termo) {
    const t = termo.toLowerCase();
    const items = document.querySelectorAll('.product-item');
    items.forEach(item => {
        const nome = item.getAttribute('data-nome').toLowerCase();
        if (nome.includes(t)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function trocarFoto(imgId, src, thumb) {
    document.getElementById(imgId).src = src;
    const parent = thumb.parentElement;
    parent.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
    }
    atualizarCarrinho();
    
    const cart = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!cart.classList.contains('active')) {
        cart.classList.add('active');
        overlay.classList.add('active');
    }
}

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
        <div class="cart-item" style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #222;">
            <div>
                <strong style="display:block; font-size:0.85rem;">${item.nome}</strong>
                <span style="color:#d4af37; font-size:0.85rem;">${item.preco.toFixed(2)} €</span>
            </div>
            <div style="display:flex; align-items:center; gap:5px;">
                <button onclick="mudarQuantidade(${index}, -1)" style="background:#222; color:#fff; border:none; width:20px; height:20px;">-</button>
                <span>${item.quantidade}</span>
                <button onclick="mudarQuantidade(${index}, 1)" style="background:#222; color:#fff; border:none; width:20px; height:20px;">+</button>
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

function abrirGuiaTamanhos() {
    document.getElementById('size-guide-modal').style.display = 'flex';
}

function fecharGuiaTamanhos() {
    document.getElementById('size-guide-modal').style.display = 'none';
}

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
