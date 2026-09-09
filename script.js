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
        title.innerText = categoria === 'todos' ? 'COLEÇÃO EXCLUSIVA' : categoria.toUpperCase();
    }
}

function filtrarCategoriaInterna(categoria, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    filtrarCatalogo(categoria);
}

// Guia de Tamanhos
function abrirGuiaTamanhos() {
    document.getElementById('size-guide-modal').style.display = 'flex';
}

function fecharGuiaTamanhos() {
    document.getElementById('size-guide-modal').style.display = 'none';
}
