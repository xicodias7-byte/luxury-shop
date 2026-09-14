// CONTROLO DO MENU LATERAL
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}

// CONTROLO DA BARRA DE PESQUISA
function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar.style.display === 'block') {
        searchBar.style.display = 'none';
    } else {
        searchBar.style.display = 'block';
    }
}

// CONTROLO DO CARRINHO
function toggleCart() {
    const cart = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    cart.classList.toggle('active');
    overlay.classList.toggle('active');
}

// NAVEGAÇÃO ENTRE PÁGINAS (HOME / CATÁLOGO / SOBRE)
function mostrarSecao(secaoId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    if (secaoId === 'home') {
        document.getElementById('secao-home').classList.add('active');
    } else if (secaoId === 'sobre') {
        document.getElementById('secao-sobre').classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FILTRAR CATÁLOGO A PARTIR DO LOOKBOOK
function filtrarCatalogo(categoria) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById('secao-catalogo').classList.add('active');
    
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(categoria) || (categoria === 'todos' && btn.textContent === 'TODOS')) {
            btn.classList.add('active');
        }
    });

    const produtos = document.querySelectorAll('.product-item');
    produtos.forEach(prod => {
        if (categoria === 'todos' || prod.getAttribute('data-categoria') === categoria) {
            prod.style.display = 'flex';
        } else {
            prod.style.display = 'none';
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FILTRAR CATEGORIA INTERNA NO CATÁLOGO
function filtrarCategoriaInterna(categoria, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const produtos = document.querySelectorAll('.product-item');
    produtos.forEach(prod => {
        if (categoria === 'todos' || prod.getAttribute('data-categoria') === categoria) {
            prod.style.display = 'flex';
        } else {
            prod.style.display = 'none';
        }
    });
}

// PESQUISA DE PRODUTOS EM TEMPO REAL
function pesquisarProdutos(termo) {
    const filtro = termo.toLowerCase().trim();
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('secao-catalogo').classList.add('active');

    const produtos = document.querySelectorAll('.product-item');
    produtos.forEach(prod => {
        const nomeProduto = prod.getAttribute('data-nome') || '';
        if (nomeProduto.includes(filtro)) {
            prod.style.display = 'flex';
        } else {
            prod.style.display = 'none';
        }
    });
}

// TROCAR FOTO PRINCIPAL AO CLICAR NAS MINIATURAS
function trocarFoto(imgId, novaSrc, thumbElement) {
    const imgPrincipal = document.getElementById(imgId);
    if (imgPrincipal) {
        imgPrincipal.src = novaSrc;
    }
    
    const containerThumbnails = thumbElement.parentElement;
    containerThumbnails.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
}

// GESTÃO DO CARRINHO DE COMPRAS
let carrinho = [];

function adicionarAoCarrinho(nomeProduto, preco, selectId) {
    const selectTamanho = document.getElementById(selectId);
    const tamanho = selectTamanho ? selectTamanho.value : 'M';
    
    const itemExistente = carrinho.find(item => item.nome === nomeProduto && item.tamanho === tamanho);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: nomeProduto,
            preco: preco,
            tamanho: tamanho,
            quantidade: 1
        });
    }
    
    atualizarCarrinhoUI();
    toggleCart();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    let totalItens = 0;
    let precoTotal = 0;
    
    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">O teu carrinho está vazio.</p>';
    } else {
        cartItemsContainer.innerHTML = '';
        carrinho.forEach((item, index) => {
            totalItens += item.quantidade;
            precoTotal += item.preco * item.quantidade;
            
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.nome}</h4>
                        <p>Tam: <strong>${item.tamanho}</strong> | Qtd: ${item.quantidade}</p>
                    </div>
                    <div class="cart-item-right">
                        <span class="cart-item-price">${(item.preco * item.quantidade).toFixed(2)} €</span>
                        <button class="remove-btn" onclick="removerDoCarrinho(${index})">Remover</button>
                    </div>
                </div>
            `;
        });
    }
    
    cartCount.textContent = totalItens;
    cartTotalPrice.textContent = precoTotal.toFixed(2) + ' €';
}

// GUIA DE TAMANHOS MODAL
function abrirGuiaTamanhos() {
    document.getElementById('size-guide-modal').classList.add('active');
}

function fecharGuiaTamanhos() {
    document.getElementById('size-guide-modal').classList.remove('active');
}

// CHECKOUT E FINALIZAÇÃO DE ENCOMENDA
function abrirCheckout() {
    if (carrinho.length === 0) {
        alert('O teu carrinho está vazio!');
        return;
    }
    
    let precoTotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    document.getElementById('checkout-total-val').textContent = precoTotal.toFixed(2) + ' €';
    
    toggleCart();
    document.getElementById('checkout-modal').classList.add('active');
}

function fecharCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
}

function processarEncomenda(event) {
    event.preventDefault();
    
    const nome = document.getElementById('cust-nome').value;
    const rua = document.getElementById('cust-rua').value;
    const porta = document.getElementById('cust-porta').value;
    const cp = document.getElementById('cust-cp').value;
    const cidade = document.getElementById('cust-cidade').value;
    const estado = document.getElementById('cust-estado').value;
    const pais = document.getElementById('cust-pais').value;
    const telefone = document.getElementById('cust-telefone').value;
    
    let resumoItens = carrinho.map(item => `• ${item.quantidade}x ${item.nome} (Tamanho: ${item.tamanho}) - ${(item.preco * item.quantidade)}€`).join('\n');
    let totalGeral = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    const mensagem = `Nova Encomenda - LUXURY STORE:\n\nCliente: ${nome}\nTelemóvel: ${telefone}\nMorada: ${rua}, ${porta}, ${cp} ${cidade}, ${estado}, ${pais}\n\nItens:\n${resumoItens}\n\nTotal: ${totalGeral.toFixed(2)}€`;
    
    alert('Encomenda registada com sucesso! Obrigado pela preferência.');
    carrinho = [];
    atualizarCarrinhoUI();
    fecharCheckout();
    document.getElementById('checkout-form').reset();
}

// ACCORDION DO SUPORTE
function toggleAccordion(btn) {
    const body = btn.nextElementSibling;
    const sign = btn.querySelector('.sign');
    
    if (body.style.display === 'block') {
        body.style.display = 'none';
        sign.textContent = '+';
    } else {
        body.style.display = 'block';
        sign.textContent = '-';
    }
}

// FUNÇÕES DE ZOOM DE IMAGEM (LIGHTBOX)
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
