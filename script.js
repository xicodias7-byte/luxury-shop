let carrinho = [];

function adicionarAoCarrinho(nome, preco, selectId) {
    let tamanho = 'M';
    if (selectId && document.getElementById(selectId)) {
        tamanho = document.getElementById(selectId).value;
    }

    carrinho.push({ nome, preco, tamanho });
    atualizarCarrinho();
    toggleCart();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total-price');

    cartCount.innerText = carrinho.length;

    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">O teu carrinho está vazio.</p>';
        cartTotal.innerText = '0,00 €';
        return;
    }

    let html = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;">
                <div>
                    <strong style="font-size:0.85rem; display:block;">${item.nome}</strong>
                    <span style="font-size:0.75rem; color:#aaa; display:block;">Tamanho: <strong>${item.tamanho}</strong></span>
                    <span style="color:#d4af37; font-size:0.8rem;">${item.preco.toFixed(2)} €</span>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="background:none; border:none; color:#ff4d4d; font-size:1.2rem; cursor:pointer;">&times;</button>
            </div>
        `;
    });

    cartItems.innerHTML = html;
    cartTotal.innerText = total.toFixed(2) + ' €';
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('cart-overlay').classList.toggle('active');
}

function toggleMenu() {
    document.getElementById('side-menu').classList.toggle('active');
    document.getElementById('menu-overlay').classList.toggle('active');
}

function toggleSearch() {
    document.getElementById('search-bar').classList.toggle('active');
}

function abrirGuiaTamanhos() {
    document.getElementById('size-guide-modal').classList.add('active');
}

function fecharGuiaTamanhos() {
    document.getElementById('size-guide-modal').classList.remove('active');
}

function abrirCheckout() {
    if (carrinho.length === 0) {
        alert('Adiciona pelo menos um item ao carrinho.');
        return;
    }

    let total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    document.getElementById('checkout-total-val').innerText = total.toFixed(2) + ' €';

    toggleCart();
    document.getElementById('checkout-modal').classList.add('active');
}

function fecharCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
}

function processarEncomenda(event) {
    event.preventDefault();

    const dados = {
        nome: document.getElementById('cust-nome').value,
        rua: document.getElementById('cust-rua').value,
        porta: document.getElementById('cust-porta').value,
        cp: document.getElementById('cust-cp').value,
        cidade: document.getElementById('cust-cidade').value,
        estado: document.getElementById('cust-estado').value,
        pais: document.getElementById('cust-pais').value,
        telefone: document.getElementById('cust-telefone').value,
        itens: carrinho.map(i => `${i.nome} (${i.tamanho})`).join(', '),
        total: document.getElementById('checkout-total-val').innerText
    };

    alert(`Obrigado ${dados.nome}!\n\nA tua encomenda foi registada com sucesso.\nItens: ${dados.itens}\n\nPor favor faz o MB WAY de ${dados.total} para o número 916 097 477 para procedermos ao envio.`);

    carrinho = [];
    atualizarCarrinho();
    fecharCheckout();
}

function trocarFoto(imgId, newSrc, thumbElement) {
    document.getElementById(imgId).src = newSrc;
    let thumbnails = thumbElement.parentElement.getElementsByClassName('thumb');
    for (let t of thumbnails) {
        t.classList.remove('active');
    }
    thumbElement.classList.add('active');
}

function mostrarSecao(secao) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.getElementById('secao-' + secao).classList.add('active');
}

function filtrarCatalogo(cat) {
    mostrarSecao('catalogo');
    let items = document.querySelectorAll('.product-item');
    items.forEach(item => {
        if (cat === 'todos' || item.dataset.categoria === cat) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function filtrarCategoriaInterna(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtrarCatalogo(cat);
    // Função para abrir a imagem ampliada (Lightbox)
function abrirImagemAmpliada(imgSrc) {
    let modal = document.getElementById('image-zoom-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-zoom-modal';
        modal.className = 'zoom-modal-overlay';
        modal.innerHTML = `
            <div class="zoom-modal-content">
                <span class="zoom-close" onclick="fecharImagemAmpliada()">&times;</span>
                <img id="img-zoomed-target" src="" alt="Imagem Ampliada">
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharImagemAmpliada();
            }
        });
    }
    
    document.getElementById('img-zoomed-target').src = imgSrc;
    modal.style.display = 'flex';
}

function fecharImagemAmpliada() {
    const modal = document.getElementById('image-zoom-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
}
