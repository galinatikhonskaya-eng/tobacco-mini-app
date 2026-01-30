// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

// ========== РЕАЛЬНЫЕ ПРОДУКТЫ С ФОТО ИЗ ИНТЕРНЕТА ==========
const products = [
    // КАЛЬЯННЫЙ ТАБАК
    {
        id: 1,
        name: 'Tangiers Birquq',
        brand: 'Tangiers',
        flavor: 'Яблоко + Корица',
        strength: 'Средняя',
        price: 1200,
        description: 'Премиальный табак с насыщенным вкусом яблока и мягкими нотами корицы. Идеален для длительных сессий.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1595245376860-1e388a0c9879?w=800&auto=format&fit=crop&q=80',
        badge: 'Хит продаж'
    },
    {
        id: 2,
        name: 'Al Fakher Mint',
        brand: 'Al Fakher',
        flavor: 'Мята',
        strength: 'Легкая',
        price: 850,
        description: 'Освежающий мятный вкус с чистым дымом. Классика для ценителей.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1517659649778-bae24b8c2e0a?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        name: 'Darkside Supernova',
        brand: 'Darkside',
        flavor: 'Цитрусовый микс',
        strength: 'Крепкая',
        price: 1500,
        description: 'Мощная крепость с ярким цитрусовым букетом. Для опытных курильщиков.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1589301772541-d7ce0d154bbc?w=800&auto=format&fit=crop&q=80',
        badge: 'Новинка'
    },
    {
        id: 4,
        name: 'MustHave Bermuda',
        brand: 'MustHave',
        flavor: 'Тропические фрукты',
        strength: 'Средняя',
        price: 1300,
        description: 'Экзотическая смесь манго, маракуйи и ананаса.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1572635149518-d8b9c3575e0f?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 5,
        name: 'Serbetli Lemon Cake',
        brand: 'Serbetli',
        flavor: 'Лимонный торт',
        strength: 'Легкая',
        price: 950,
        description: 'Нежный вкус лимонного торта с воздушным дымом.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    },
    
    // СИГАРЕТЫ
    {
        id: 6,
        name: 'Marlboro Red',
        brand: 'Marlboro',
        flavor: 'Классический',
        strength: 'Крепкие',
        price: 220,
        description: 'Классические крепкие сигареты. Легендарный вкус.',
        category: 'cigarettes',
        image: 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&auto=format&fit=crop&q=80',
        badge: 'Популярные'
    },
    {
        id: 7,
        name: 'Winston Blue',
        brand: 'Winston',
        flavor: 'Лёгкий табак',
        strength: 'Лёгкие',
        price: 200,
        description: 'Лёгкие сигареты с мягким вкусом.',
        category: 'cigarettes',
        image: 'https://images.unsplash.com/photo-1545361367-3202270671e7?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 8,
        name: 'Parliament Night Blue',
        brand: 'Parliament',
        flavor: 'Ментол',
        strength: 'Средние',
        price: 240,
        description: 'Ментоловые сигареты с угольным фильтром.',
        category: 'cigarettes',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=80'
    },
    
    // СТИКИ
    {
        id: 9,
        name: 'IQOS Terea Amber',
        brand: 'IQOS',
        flavor: 'Ореховый',
        strength: 'Средние',
        price: 380,
        description: 'Стики для систем нагревания табака с ореховым вкусом.',
        category: 'sticks',
        image: 'https://images.unsplash.com/photo-1589301772541-d7ce0d154bbc?w=800&auto=format&fit=crop&q=60',
        badge: 'Для IQOS'
    },
    {
        id: 10,
        name: 'Glo Pro Bright Tobacco',
        brand: 'Glo',
        flavor: 'Насыщенный табак',
        strength: 'Крепкие',
        price: 350,
        description: 'Стики для Glo с насыщенным табачным вкусом.',
        category: 'sticks',
        image: 'https://images.unsplash.com/photo-1545361367-3202270671e7?w=800&auto=format&fit=crop&q=60'
    },
    
    // АКСЕССУАРЫ
    {
        id: 11,
        name: 'Кальян Amy Deluxe',
        brand: 'Amy',
        flavor: '—',
        strength: '—',
        price: 4500,
        description: 'Премиальный кальян из нержавеющей стали. Высота 65 см.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1597066494923-572a1d5ee805?w=800&auto=format&fit=crop&q=80',
        badge: 'Топ'
    },
    {
        id: 12,
        name: 'Уголь кокосовый',
        brand: 'CocoBrico',
        flavor: '—',
        strength: '—',
        price: 300,
        description: 'Кокосовый уголь для кальяна, 96 кубиков.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 13,
        name: 'Зажигалка турбо',
        brand: 'Zippo',
        flavor: '—',
        strength: '—',
        price: 1200,
        description: 'Турбозажигалка с ветрозащитой. Черный матовый корпус.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 14,
        name: 'Портсигар металлический',
        brand: 'MetalCase',
        flavor: '—',
        strength: '—',
        price: 800,
        description: 'Стильный металлический портсигар на 20 сигарет.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1572635149518-d8b9c3575e0f?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 15,
        name: 'Набор для чистки',
        brand: 'CleanMaster',
        flavor: '—',
        strength: '—',
        price: 600,
        description: 'Профессиональный набор для чистки кальяна.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1595245376860-1e388a0c9879?w=800&auto=format&fit=crop&q=80'
    }
];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.style.opacity = '1', 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
    `;
    document.body.appendChild(container);
    return container;
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = count === 0;
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ========== ВЕРИФИКАЦИЯ ВОЗРАСТА ==========
function initAgeVerification() {
    const isVerified = localStorage.getItem('ageVerified') === 'true';
    
    if (isVerified) {
        document.getElementById('ageModal').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        return;
    }
    
    const confirmBtn = document.getElementById('ageConfirm');
    const denyBtn = document.getElementById('ageDeny');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            localStorage.setItem('ageVerified', 'true');
            localStorage.setItem('birthDate', new Date().toISOString().split('T')[0]);
            
            document.getElementById('ageModal').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            
            setTimeout(() => {
                showToast('Добро пожаловать в Smoke Premium!', 'success');
            }, 500);
        });
    }
    
    if (denyBtn) {
        denyBtn.addEventListener('click', () => {
            alert('Доступ к приложению разрешен только лицам старше 18 лет.');
        });
    }
}

// ========== НАВИГАЦИЯ ==========
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
    
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (screenId === 'homeScreen') {
        const catalogBtn = document.getElementById('catalogBtn');
        if (catalogBtn) catalogBtn.classList.add('active');
    }
    
    updateCartCount();
}

// ========== КАТАЛОГ И ТОВАРЫ ==========
function renderProducts(filterCategory = '') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let filteredProducts = products;
    
    if (filterCategory) {
        filteredProducts = products.filter(p => p.category === filterCategory);
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.flavor.toLowerCase().includes(searchTerm)
        );
    }
    
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter && brandFilter.value) {
        filteredProducts = filteredProducts.filter(p => p.brand === brandFilter.value);
    }
    
    const strengthFilter = document.getElementById('strengthFilter');
    if (strengthFilter && strengthFilter.value) {
        filteredProducts = filteredProducts.filter(p => p.strength === strengthFilter.value);
    }
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <button class="quick-add-btn" data-id="${product.id}" title="Быстро добавить в корзину">
                <i class="fas fa-cart-plus"></i>
            </button>
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-price">${product.price} ₽</span>
                </div>
                <p class="product-brand">${product.brand}</p>
                <p class="product-flavor">${product.flavor}</p>
                <div class="product-tags">
                    <span class="tag strength">${product.strength}</span>
                    <span class="tag in-stock">В наличии</span>
                </div>
                <button class="buy-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    Купить
                </button>
            </div>
        `;
        
        productCard.querySelector('.product-image, .product-name').addEventListener('click', (e) => {
            if (!e.target.classList.contains('quick-add-btn') && !e.target.classList.contains('buy-btn')) {
                showProductDetail(product.id);
            }
        });
        
        const quickAddBtn = productCard.querySelector('.quick-add-btn');
        quickAddBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id, 1);
            quickAddBtn.classList.add('adding-to-cart');
            setTimeout(() => quickAddBtn.classList.remove('adding-to-cart'), 300);
        });
        
        const buyBtn = productCard.querySelector('.buy-btn');
        buyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id, 1);
            showToast(`${product.name} добавлен в корзину!`, 'success');
            
            setTimeout(() => {
                showScreen('cartScreen');
                renderCart();
            }, 1000);
        });
        
        productsGrid.appendChild(productCard);
    });
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productStrength').textContent = product.strength;
    document.getElementById('productFlavor').textContent = product.flavor;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = product.price;
    
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.style.backgroundImage = `url('${product.image}')`;
    }
    
    document.getElementById('productQty').textContent = '1';
    
    showScreen('productScreen');
}

// ========== КОРЗИНА ==========
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.classList.add('adding-to-cart');
        setTimeout(() => cartBtn.classList.remove('adding-to-cart'), 300);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    renderCart();
    showToast('Товар удален из корзины', 'info');
}

function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        renderCart();
        showToast('Количество обновлено', 'success');
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const totalItems = document.getElementById('totalItems');
    const totalPrice = document.getElementById('totalPrice');
    const grandTotal = document.getElementById('grandTotal');
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
                <button class="btn btn-primary to-catalog" style="margin-top: 20px;">
                    <i class="fas fa-store"></i>
                    Перейти в каталог
                </button>
            </div>
        `;
        
        setTimeout(() => {
            document.querySelector('.to-catalog')?.addEventListener('click', () => {
                showScreen('catalogScreen');
                renderProducts();
            });
        }, 100);
        
        if (totalItems) totalItems.textContent = '0';
        if (totalPrice) totalPrice.textContent = '0 ₽';
        if (grandTotal) grandTotal.textContent = '0 ₽';
        if (orderTotal) orderTotal.textContent = '0 ₽';
        
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    let itemsCount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemsCount += item.quantity;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-meta">${item.brand} • ${item.flavor}</p>
                    <div class="cart-item-controls">
                        <div class="cart-item-qty">
                            <button class="qty-btn minus" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn plus" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-price">${itemTotal} ₽</div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    
    if (totalItems) totalItems.textContent = itemsCount;
    if (totalPrice) totalPrice.textContent = `${total} ₽`;
    if (grandTotal) grandTotal.textContent = `${total} ₽`;
    
    if (orderItems) {
        let orderHTML = '';
        cart.forEach(item => {
            orderHTML += `
                <div class="order-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${item.price * item.quantity} ₽</span>
                </div>
            `;
        });
        orderItems.innerHTML = orderHTML;
    }
    
    if (orderTotal) orderTotal.textContent = `${total} ₽`;
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
function showOrderConfirmation(orderId) {
    const modal = document.createElement('div');
    modal.className = 'order-confirm-modal active';
    modal.innerHTML = `
        <div class="order-confirm-content glass">
            <div class="order-confirm-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 class="order-confirm-title">Заказ оформлен!</h2>
            <div class="order-confirm-text">
                <p>Номер вашего заказа: <strong>#${orderId}</strong></p>
                <p>Ожидайте подтверждения в Telegram боте.</p>
                <p>Менеджер свяжется с вами для уточнения деталей.</p>
            </div>
            <div class="verification-actions">
                <button class="btn btn-primary" id="closeOrderConfirm">
                    Отлично!
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeOrderConfirm').addEventListener('click', () => {
        modal.remove();
        showScreen('homeScreen');
    });
    
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
            showScreen('homeScreen');
        }
    }, 5000);
}

function processOrder() {
    const userName = document.getElementById('userName');
    const userPhone = document.getElementById('userPhone');
    const deliveryAddress = document.getElementById('deliveryAddress');
    
    if (!userName.value.trim()) {
        showToast('Введите ваше имя', 'error');
        userName.focus();
        return;
    }
    
    if (!userPhone.value.trim()) {
        showToast('Введите номер телефона', 'error');
        userPhone.focus();
        return;
    }
    
    if (!deliveryAddress.value.trim()) {
        showToast('Введите адрес доставки', 'error');
        deliveryAddress.focus();
        return;
    }
    
    const orderId = 'ORD-' + Date.now().toString().slice(-8);
    const order = {
        id: orderId,
        date: new Date().toLocaleString('ru-RU'),
        customer: {
            name: userName.value,
            phone: userPhone.value,
            address: deliveryAddress.value
        },
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        status: 'Новый'
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    saveCartToStorage();
    updateCartCount();
    
    userName.value = '';
    userPhone.value = '';
    deliveryAddress.value = '';
    
    showOrderConfirmation(orderId);
    
    simulateTelegramNotification(order);
}

function simulateTelegramNotification(order) {
    console.log('Telegram notification sent:', order);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function initApp() {
    initAgeVerification();
    
    document.getElementById('catalogBtn')?.addEventListener('click', () => {
        showScreen('catalogScreen');
        renderProducts();
    });
    
    document.getElementById('cartBtn')?.addEventListener('click', () => {
        showScreen('cartScreen');
        renderCart();
    });
    
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => showScreen('homeScreen'));
    });
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showScreen('catalogScreen');
            renderProducts(category);
        });
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('to-catalog') || 
            e.target.closest('.to-catalog')) {
            showScreen('catalogScreen');
            renderProducts();
        }
    });
    
    document.getElementById('searchInput')?.addEventListener('input', () => renderProducts());
    document.getElementById('brandFilter')?.addEventListener('change', () => renderProducts());
    document.getElementById('strengthFilter')?.addEventListener('change', () => renderProducts());
    
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyValue = document.getElementById('productQty');
    
    if (minusBtn && plusBtn && qtyValue) {
        minusBtn.addEventListener('click', () => {
            let value = parseInt(qtyValue.textContent);
            if (value > 1) {
                qtyValue.textContent = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let value = parseInt(qtyValue.textContent);
            qtyValue.textContent = value + 1;
        });
    }
    
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (!currentProduct) return;
            
            const quantity = parseInt(document.getElementById('productQty').textContent);
            addToCart(currentProduct.id, quantity);
            
            setTimeout(() => {
                showScreen('cartScreen');
                renderCart();
            }, 800);
        });
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showScreen('checkoutScreen');
        });
    }
    
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', processOrder);
    }
    
    let currentPromo = 0;
    const promoSlides = document.querySelectorAll('.promo-slide');
    const promoDots = document.querySelectorAll('.promo-dot');
    
    if (promoSlides.length > 1) {
        setInterval(() => {
            promoSlides[currentPromo].classList.remove('active');
            promoDots[currentPromo].classList.remove('active');
            
            currentPromo = (currentPromo + 1) % promoSlides.length;
            
            promoSlides[currentPromo].classList.add('active');
            promoDots[currentPromo].classList.add('active');
        }, 5000);
        
        promoDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                promoSlides[currentPromo].classList.remove('active');
                promoDots[currentPromo].classList.remove('active');
                
                currentPromo = index;
                
                promoSlides[currentPromo].classList.add('active');
                promoDots[currentPromo].classList.add('active');
            });
        });
    }
    
    updateCartCount();
}

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', initApp);