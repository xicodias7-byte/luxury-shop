/* LÓGICA COMPLETA DA LUXURY STORE */

let carrinho = [];
let totalCarrinho = 0;
let categoriaAtual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    iniciarCronometroDrop();
    atualizarBarraPortesGratis();
});

/* 1. BARRA DE PROGRESSO DE PORTES GRÁTIS NO CARRINHO */
function atualizarBarraPortesGratis() {
    const textEl = document.getElementById('free-shipping-text');
    const barFill = document.getElementById('free-shipping-progress');
    if (!textEl || !barFill) return;

    const limitePortes = 100.0;

    if (totalCarrinho >= limitePortes) {
        textEl.innerHTML = '🎉 Parabéns! Tens <strong>PORTES GRÁTIS</strong> garantidos!';
        barFill.style.width = '100%';
        barFill.style.background = '#25d366';
    } else {
        const quantoFalta = (limitePortes - totalCarrinho).toFixed(2).replace('.', ',');
        const percentagem = Math.min((totalCarrinho / limitePortes) * 100, 100);
        textEl.innerHTML = `Faltam apenas <strong>${quantoFalta} €</strong> para ganhares <strong>PORTES GRÁTIS</strong>`;
        barFill.style.width = `${percentagem}%`;
        barFill.style.background = '#000000';
    }
}

/* 2. NAVEGAÇÃO ENTRE SECÇÕES */
function mostrarSecao(secaoId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const secaoAlvo = document.getElementById(`secao-${secaoId}`);
    if (secaoAlvo) {
        secaoAlvo.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/* 3. FILTRAGEM, PESQUISA E ORDENAÇÃO AVANÇADA NO CATÁLOGO */
function filtrarCatalogo(categoria) {
    categoriaAtual = categoria;
    mostrarSecao('catalogo');
    
    const titulo = document.getElementById('catalog-title');
    if (titulo) {
        if(categoria === 'sweats') titulo.innerText = "SWEATSHIRTS & HOODIES";
        else if(categoria === 'casacos') titulo.innerText = "CASACOS & OUTERWEAR";
        else if(categoria === 'calcas') titulo.innerText = "CALÇAS & PANTS";
        else titulo.innerText = "IN STOCK NOW";
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${categoria}'`)) {
            btn.classList.add('active');
        }
    });

    ordenarEFiltrarProdutos();
}

function filtrarCategoriaInterna(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    categoriaAtual = cat;
    ordenarEFiltrarProdutos();
}

function ordenarEFiltrarProdutos() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const produtos = Array.from(grid.querySelectorAll('.product-item'));
    const sortVal = document.getElementById('sort-select')?.value || 'padrao';
    const sizeVal = document.getElementById('size-filter-select')?.value || 'todos';

    produtos.forEach(prod => {
        const catProd = prod.getAttribute('data-categoria');
        const tamanhosProd = prod.getAttribute('data-tamanhos') || '';

        const bateCategoria = (categoriaAtual === 'todos' || catProd === categoriaAtual);
        const bateTamanho = (sizeVal === 'todos' || tamanhosProd.includes(sizeVal));

        if (bateCategoria && bateTamanho) {
            prod.style.display = 'block';
        } else {
            prod.style.display = 'none';
        }
    });

    if (sortVal === 'preco-asc') {
        produtos.sort((a, b) => parseFloat(a.getAttribute('data-preco')) - parseFloat(b.getAttribute('data-preco')));
    } else if (sortVal === 'preco-desc') {
        produtos.sort((a, b) => parseFloat(b.getAttribute('data-preco')) - parseFloat(a.getAttribute('data-preco')));
    }

    produtos.forEach(prod => grid.appendChild(prod));
}

function pesquisarProdutos(termo) {
    termo = termo.toLowerCase().trim();
    if (termo.length > 0) {
        mostrarSecao('catalogo');
    }
    const produtos = document.querySelectorAll('.product-item');
    produtos.forEach(prod => {
        const nome = prod.getAttribute('data-nome').toLowerCase();
        if (nome.includes(termo)) {
            prod.style.display = 'block';
        } else {
            prod.style.display = 'none';
        }
    });
}

/* 4. GALERIA DE MINIATURAS */
function trocarFoto(idFotoPrincipal, novaSrc, elementoThumb) {
    const imgPrincipal = document.getElementById(idFotoPrincipal);
    if (imgPrincipal) {
        imgPrincipal.src = novaSrc;
    }
    const thumbsContainer = elementoThumb.parentElement;
    thumbsContainer.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    elementoThumb.classList.add('active');
}

/* 5. GESTÃO DO CARRINHO DE COMPRAS */
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        carrinho.push({ nome: nome, preco: preco, qtd: 1 });
    }
    atualizarCarrinho();
    toggleCart();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total-price');
    
    cartItemsContainer.innerHTML = '';
    totalCarrinho = 0;
    let totalItens = 0;

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">O teu carrinho está vazio.</p>';
    } else {
        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.qtd;
            totalCarrinho += subtotal;
            totalItens += item.qtd;

            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eaeaea; padding-bottom:10px;";
            itemDiv.innerHTML = `
                <div>
                    <strong style="color:#000; font-size:0.85rem; display:block;">${item.nome}</strong>
                    <span style="color:#666; font-size:0.75rem;">${item.qtd}x ${item.preco.toFixed(2)} €</span>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <strong style="color:#000; font-size:0.9rem;">${subtotal.toFixed(2)} €</strong>
                    <span onclick="removerDoCarrinho(${index})" style="color:#ff4d4d; cursor:pointer; font-weight:bold; font-size:1.1rem;">&times;</span>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }

    cartCountEl.innerText = totalItens;
    cartTotalEl.innerText = `${totalCarrinho.toFixed(2).replace('.', ',')} €`;

    atualizarBarraPortesGratis();
}

/* 6. DRAWER & MODAIS */
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

function toggleMenu() {
    document.getElementById('side-menu').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
}

function toggleSearch() {
    document.getElementById('search-bar').classList.toggle('open');
}

function abrirGuiaTamanhos() {
    document.getElementById('size-guide-modal').classList.add('open');
}

function fecharGuiaTamanhos() {
    document.getElementById('size-guide-modal').classList.remove('open');
}

/* 7. CHECKOUT AUTOMATIZADO WHATSAPP */
function abrirCheckout() {
    if (carrinho.length === 0) {
        alert("O teu carrinho está vazio!");
        return;
    }
    
    const itemsSummary = document.getElementById('modal-order-items');
    itemsSummary.innerHTML = '';
    
    carrinho.forEach(item => {
        const p = document.createElement('p');
        p.style.cssText = "font-size:0.8rem; color:#333; margin-bottom:5px;";
        p.innerText = `• ${item.qtd}x ${item.nome} - ${(item.preco * item.qtd).toFixed(2)} €`;
        itemsSummary.appendChild(p);
    });

    document.getElementById('modal-order-price').innerText = `${totalCarrinho.toFixed(2).replace('.', ',')} €`;
    document.getElementById('checkout-modal').classList.add('open');
}

function fecharCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
}

function enviarEncomenda(event) {
    event.preventDefault();

    const nome = document.getElementById('cliente-nome').value;
    const tel = document.getElementById('cliente-tel').value;
    const morada = document.getElementById('cliente-morada').value;
    const pagamento = document.getElementById('metodo-pagamento').value;

    let mensagem = `*NOVO PEDIDO - LUXURY STORE*\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    mensagem += `*Contacto:* ${tel}\n`;
    mensagem += `*Morada de Envio:* ${morada}\n`;
    mensagem += `*Pagamento:* ${pagamento}\n\n`;
    mensagem += `*ARTIGOS ENCOMENDADOS:*\n`;

    carrinho.forEach(item => {
        mensagem += `- ${item.qtd}x ${item.nome} (${(item.preco * item.qtd).toFixed(2)} €)\n`;
    });

    mensagem += `\n*TOTAL:* ${totalCarrinho.toFixed(2).replace('.', ',')} €\n\n`;
    mensagem += `Aguardo dados para pagamento e confirmação de envio!`;

    const numeroWhatsApp = "351916097477";
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
    fecharCheckout();
}

/* 8. ACCORDION & CRONÓMETRO */
function toggleAccordion(btn) {
    const body = btn.nextElementSibling;
    const sign = btn.querySelector('.sign');
    
    if (body.style.display === "block") {
        body.style.display = "none";
        sign.innerText = "+";
    } else {
        body.style.display = "block";
        sign.innerText = "-";
    }
}

function iniciarCronometroDrop() {
    let tempoEmSegundos = (2 * 24 * 3600) + (14 * 3600) + (35 * 60) + 10;
    
    const timerElement = document.getElementById('drop-timer');
    if (!timerElement) return;

    setInterval(() => {
        if (tempoEmSegundos <= 0) return;
        tempoEmSegundos--;

        const dias = Math.floor(tempoEmSegundos / (3600 * 24));
        const horas = Math.floor((tempoEmSegundos % (3600 * 24)) / 3600);
        const minutos = Math.floor((tempoEmSegundos % 3600) / 60);
        const segundos = tempoEmSegundos % 60;

        const pad = (num) => String(num).padStart(2, '0');
        timerElement.innerText = `${pad(dias)}D : ${pad(horas)}H : ${pad(minutos)}M : ${pad(segundos)}S`;
    }, 1000);
}