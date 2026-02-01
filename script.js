// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
let currentCategory = '';

// ========== РЕАЛЬНЫЕ ПРОДУКТЫ С НОРМАЛЬНЫМИ ФОТО ==========
const products = [
    // КАЛЬЯННЫЙ ТАБАК (фото чая, кофе, специй)
    {
        id: 1,
        name: 'Tangiers Birquq',
        brand: 'Tangiers',
        flavor: 'Яблоко + Корица',
        strength: 'Средняя',
        price: 1200,
        description: 'Премиальный табак с насыщенным вкусом яблока и мягкими нотами корицы.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&auto=format&fit=crop&q=80',
        badge: 'Хит'
    },
    {
        id: 2,
        name: 'Al Fakher Mint',
        brand: 'Al Fakher',
        flavor: 'Мята',
        strength: 'Легкая',
        price: 850,
        description: 'Освежающий мятный вкус с чистым дымом.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        name: 'Darkside Supernova',
        brand: 'Darkside',
        flavor: 'Цитрусовый микс',
        strength: 'Крепкая',
        price: 1500,
        description: 'Мощная крепость с ярким цитрусовым букетом.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1566631222402-26b8b5d0beb5?w=800&auto=format&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 5,
        name: 'Serbetli Lemon Cake',
        brand: 'Serbetli',
        flavor: 'Лимонный торт',
        strength: 'Легкая',
        price: 950,
        description: 'Нежный вкус лимонного торта.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1566631222402-26b8b5d0beb5?w=800&auto=format&fit=crop&q=80'
    },
    
    // СИГАРЕТЫ (нейтральные фото)
    {
        id: 6,
        name: 'Marlboro Red',
        brand: 'Marlboro',
        flavor: 'Классический',
        strength: 'Крепкие',
        price: 220,
        description: 'Классические крепкие сигареты.',
        category: 'cigarettes',
        image: 'https://images.unsplash.com/photo-1561708647-9decb66dce92?w=800&auto=format&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1561708647-9decb66dce92?w=800&auto=format&fit=crop&q=80'
    },
    
    // СТИКИ (нейтральные фото упаковок)
    {
        id: 8,
        name: 'IQOS Terea Amber',
        brand: 'IQOS',
        flavor: 'Ореховый',
        strength: 'Средние',
        price: 380,
        description: 'Стики для систем нагревания табака.',
        category: 'sticks',
        image: 'https://images.unsplash.com/photo-1576568684255-6c3d5c6b68ee?w=800&auto=format&fit=crop&q=80',
        badge: 'Для IQOS'
    },
    
    // АКСЕССУАРЫ (фото самих аксессуаров)
    {
        id: 9,
        name: 'Кальян Amy Deluxe',
        brand: 'Amy',
        flavor: '—',
        strength: '—',
        price: 4500,
        description: 'Премиальный кальян из нержавеющей стали.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1572635149518-d8b9c3575e0f?w=800&auto=format&fit=crop&q=80',
        badge: 'Премиум'
    },
    {
        id: 10,
        name: 'Уголь кокосовый',
        brand: 'CocoBrico',
        flavor: '—',
        strength: '—',
        price: 300,
        description: 'Кокосовый уголь для кальяна.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 11,
        name: 'Зажигалка турbo',
        brand: 'Zippo',
        flavor: '—',
        strength: '—',
        price: 1200,
        description: 'Турбозажигалка с ветрозащитой.',
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1576568684255-6c3d5c6b68ee?w=800&auto=format&fit=crop&q=80'
    }
];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        createToastContainer();
        return showToast(message, type);
    }
    
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
        document.getElementById('app').style.display = 'flex';
        return;
    }
    
    const confirmBtn = document.getElementById('ageConfirm');
    const denyBtn = document.getElementById('ageDeny');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            localStorage.setItem('ageVerified', 'true');
            localStorage.setItem('birthDate', new Date().toISOString().split('T')[0]);
            
            document.getElementById('ageModal').style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            
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
        // Прокручиваем вверх
        screen.scrollTop = 0;
    }
    
    updateCartCount();
}

// ========== КАТАЛОГ И ТОВАРЫ ==========
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let filteredProducts = products;
    
    if (currentCategory) {
        filteredProducts = products.filter(p => p.category === currentCategory);
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
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search fa-3x" style="color: rgba(255, 255, 255, 0.1); margin-bottom: 20px;"></i>
                <h3 style="color: #FFD700; margin-bottom: 10px;">Товары не найдены</h3>
                <p style="color: rgba(255, 255, 255, 0.6);">Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image loading" data-src="${product.image}"></div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-flavor">${product.flavor}</p>
                <div class="product-meta">
                    <span class="product-brand">${product.brand}</span>
                    <span class="product-strength">${product.strength}</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">${product.price} ₽</div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Клик по карточке для просмотра деталей
        productCard.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart-btn')) {
                showProductDetail(product.id);
            }
        });
        
        // Кнопка добавления в корзину
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id, 1);
            
            // Анимация кнопки
            addToCartBtn.classList.add('adding');
            setTimeout(() => addToCartBtn.classList.remove('adding'), 300);
            
            showToast(`${product.name} добавлен в корзину!`, 'success');
        });
        
        productsGrid.appendChild(productCard);
    });
    
    // Загружаем изображения
    loadProductImages();
}

function loadProductImages() {
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(img => {
        if (img.classList.contains('loading') && img.dataset.src) {
            const src = img.dataset.src;
            const image = new Image();
            image.src = src;
            image.onload = () => {
                img.classList.remove('loading');
                img.style.backgroundImage = `url('${src}')`;
                img.innerHTML = '';
            };
            image.onerror = () => {
                img.classList.remove('loading');
                img.innerHTML = '<i class="fas fa-image" style="color: rgba(255, 215, 0, 0.3); font-size: 48px;"></i>';
            };
        }
    });
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Обновляем данные на странице товара
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productStrength').textContent = product.strength;
    document.getElementById('productFlavor').textContent = product.flavor;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = product.price;
    
    // Загружаем изображение товара
    const productImage = document.getElementById('productImage');
    if (productImage && product.image) {
        productImage.querySelector('.product-image').classList.add('loading');
        const img = new Image();
        img.src = product.image;
        img.onload = () => {
            productImage.querySelector('.product-image').classList.remove('loading');
            productImage.querySelector('.product-image').style.backgroundImage = `url('${product.image}')`;
        };
        img.onerror = () => {
            productImage.querySelector('.product-image').classList.remove('loading');
            productImage.querySelector('.product-image').innerHTML = '<i class="fas fa-image" style="color: rgba(255, 215, 0, 0.3); font-size: 48px;"></i>';
        };
    }
    
    // Сбрасываем количество
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
    
    // Анимация иконки корзины
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.classList.add('pulse');
        setTimeout(() => cartBtn.classList.remove('pulse'), 300);
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
            <div class="empty-cart" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-shopping-cart fa-3x" style="color: rgba(255, 255, 255, 0.1); margin-bottom: 20px;"></i>
                <h3 style="color: #FFD700; margin-bottom: 10px;">Корзина пуста</h3>
                <p style="color: rgba(255, 255, 255, 0.6); margin-bottom: 30px;">Добавьте товары из каталога</p>
                <button class="btn btn-primary to-catalog" style="padding: 14px 28px;">
                    <i class="fas fa-store"></i>
                    Перейти в каталог
                </button>
            </div>
        `;
        
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
            <div class="cart-item" style="display: flex; align-items: center; background: rgba(30, 30, 30, 0.6); border-radius: 12px; padding: 15px; margin-bottom: 10px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <div class="cart-item-image" style="width: 80px; height: 80px; background-image: url('${item.image}'); background-size: cover; background-position: center; border-radius: 8px; margin-right: 15px;"></div>
                <div style="flex: 1;">
                    <h3 style="font-size: 16px; margin-bottom: 5px; color: white;">${item.name}</h3>
                    <p style="font-size: 13px; color: #FFD700; margin-bottom: 10px;">${item.brand} • ${item.flavor}</p>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button class="back-btn minus" style="width: 30px; height: 30px;" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span style="font-weight: 600;">${item.quantity}</span>
                            <button class="back-btn plus" style="width: 30px; height: 30px;" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <span style="font-weight: 700; color: #FFD700; font-size: 18px;">${itemTotal} ₽</span>
                    </div>
                </div>
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
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
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
    const modal = document.getElementById('orderConfirmModal');
    const orderNumber = document.getElementById('orderNumber');
    
    if (orderNumber) orderNumber.textContent = `#${orderId}`;
    if (modal) {
        modal.style.display = 'flex';
        
        const closeBtn = document.getElementById('closeOrderConfirm');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
                showScreen('homeScreen');
            };
        }
        
        setTimeout(() => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
                showScreen('homeScreen');
            }
        }, 5000);
    }
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
    
    // Симуляция отправки в Telegram бот
    sendOrderToTelegram(order);
}

function sendOrderToTelegram(order) {
    console.log('Telegram notification sent:', order);
    // Здесь будет код для отправки заказа в Telegram бот
    // fetch('URL_ВАШЕГО_БОТА', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(order)
    // });
}

// ========== АНИМАЦИИ КНОПОК ==========
function addButtonPressEffect() {
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-primary, #checkoutBtn, #confirmOrderBtn, .add-to-cart-btn');
        if (btn && !btn.disabled) {
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 150);
        }
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
function initApp() {
    initAgeVerification();
    
    // Навигация по категориям
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            currentCategory = category;
            showScreen('catalogScreen');
            renderProducts();
        });
    });
    
    // Кнопка "Смотреть" на баннере
    document.querySelectorAll('.to-catalog').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = '';
            showScreen('catalogScreen');
            renderProducts();
        });
    });
    
    // Корзина
    document.getElementById('cartBtn').addEventListener('click', () => {
        showScreen('cartScreen');
        renderCart();
    });
    
    // Кнопки "Назад"
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (document.getElementById('productScreen').classList.contains('active')) {
                showScreen('catalogScreen');
            } else {
                showScreen('homeScreen');
            }
        });
    });
    
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderProducts();
        });
    }
    
    // Управление количеством товара
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
    
    // Добавление товара в корзину со страницы товара
    const addToCartBtnFull = document.querySelector('.add-to-cart-btn-full');
    if (addToCartBtnFull) {
        addToCartBtnFull.addEventListener('click', () => {
            if (!currentProduct) return;
            
            const quantity = parseInt(document.getElementById('productQty').textContent);
            addToCart(currentProduct.id, quantity);
            showToast(`${currentProduct.name} добавлен в корзину!`, 'success');
            
            setTimeout(() => {
                showScreen('cartScreen');
                renderCart();
            }, 800);
        });
    }
    
    // Оформление заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                showScreen('checkoutScreen');
            }
        });
    }
    
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', processOrder);
    }
    
    // Выбор способа оплаты
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            option.querySelector('input').checked = true;
        });
    });
    
    updateCartCount();
    addButtonPressEffect();
}

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', initApp);

// Добавляем глобальные функции для вызова из HTML
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;