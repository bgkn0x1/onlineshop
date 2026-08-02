let productsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    await fetchProducts();
});

async function loadComponents() {
    try {
        const headerRes = await fetch('components/header.html');
        if (headerRes.ok) document.getElementById('header-container').innerHTML = await headerRes.text();
        
        const homeRes = await fetch('components/home.html');
        if (homeRes.ok) document.getElementById('home-view-container').innerHTML = await homeRes.text();

        const catalogRes = await fetch('components/catalog.html');
        if (catalogRes.ok) document.getElementById('catalog-view-container').innerHTML = await catalogRes.text();
    } catch (e) {
        console.error('Error loading components:', e);
    }
}

async function fetchProducts() {
    try {
        const res = await fetch('data/products.json');
        const data = await res.json();
        productsData = data.products;
        renderProducts(productsData);
    } catch (e) {
        console.error('Error loading products:', e);
    }
}

function switchView(view) {
    const homeEl = document.getElementById('homeView');
    const catalogEl = document.getElementById('catalogView');
    if (!homeEl || !catalogEl) return;

    if (view === 'home') {
        homeEl.classList.remove('hidden');
        catalogEl.classList.add('hidden');
    } else {
        homeEl.classList.add('hidden');
        catalogEl.classList.remove('hidden');
    }
}

function filterByCategory(category) {
    switchView('catalog');
    const titleEl = document.getElementById('catalogTitle');
    if (titleEl) titleEl.innerText = category === 'Всички' ? 'Всички продукти' : category;

    const filtered = category === 'Всички' 
        ? productsData 
        : productsData.filter(p => p.category === category);
    renderProducts(filtered);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('catalogCount');
    if (!grid) return;

    if (countEl) countEl.innerText = `Показани ${products.length} артикула`;

    grid.innerHTML = products.map(p => `
        <div onclick="openProductModal(${p.id})" class="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-3 sm:p-4 flex flex-col justify-between relative border border-gray-100 group cursor-pointer">
            <div class="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 pointer-events-none">
                <span class="bg-orange-500 text-white text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">${p.discount}</span>
                <span class="bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">${p.status}</span>
            </div>
            <div class="w-full h-36 sm:h-48 mb-3 sm:mb-4 overflow-hidden rounded flex items-center justify-center bg-gray-50">
                <img src="${p.image}" alt="${p.title}" class="object-cover h-full w-full group-hover:scale-105 transition duration-300">
            </div>
            <div class="space-y-1 mb-3 sm:mb-4 flex-grow">
                <div class="text-[10px] sm:text-xs text-gray-500">Размер: <span class="font-semibold text-gray-700">${p.size}</span></div>
                <h3 class="font-bold text-gray-800 text-xs sm:text-sm line-clamp-2">${p.title}</h3>
                <p class="text-[11px] text-gray-500 line-clamp-2 hidden sm:block">${p.description}</p>
            </div>
            <div class="border-t pt-2 sm:pt-3 mt-auto">
                <div class="flex items-baseline justify-between">
                   <div>
                        <div class="text-[10px] sm:text-xs text-gray-400 line-through">${p.oldPrice.toFixed(2)} лв.</div>
                        <div class="text-base sm:text-xl font-black text-gray-900">${p.price.toFixed(2)} лв.</div>
                    </div>
                    <div class="bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg pointer-events-none text-xs sm:text-sm">
                        <i class="fa-solid fa-eye"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function handleSearch(query) {
    const q = query.toLowerCase();
    const filtered = productsData.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
    );
    switchView('catalog');
    renderProducts(filtered);
}

function toggleCategoryDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('categoryDropdownMenu');
    if (menu) menu.classList.toggle('hidden');
}

function closeCategoryDropdown() {
    const menu = document.getElementById('categoryDropdownMenu');
    if (menu) menu.classList.add('hidden');
}

function sortProducts(criteria) {
    let sorted = [...productsData];
    if (criteria === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (criteria === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    renderProducts(sorted);
}

function openProductModal(id) {
    const product = productsData.find(p => p.id === id);
    if (product) {
        alert(`Преглед на продукт: ${product.title}\nЦена: ${product.price} лв.\n${product.description}`);
    }
}
