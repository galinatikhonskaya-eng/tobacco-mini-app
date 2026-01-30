// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

// ========== ПРОДУКТЫ ДЛЯ КАТАЛОГА ==========
const products = [
    {
        id: 1,
        name: 'Tangiers Birquq',
        brand: 'Tangiers',
        flavor: 'Яблоко + Корица',
        strength: 'Средняя',
        price: 1200,
        description: 'Премиальный табак с насыщенным вкусом яблока и мягкими нотами корицы. Идеален для длительных сессий.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1595245376860-1e388a0c9879?w=800&auto=format&fit=crop&crop=center'
    },
    {
        id: 2,
        name: 'Al Fakher Mint',
        brand: 'Al Fakher',
        flavor: 'Мята',
        strength: 'Легкая',
        price: 800,
        description: 'Освежающий мятный вкус с чистым дымом. Классика для ценителей.',
        category: 'hookah',
        image: 'https://images.unsplash.com/photo-1517659649778-bae24b8c2e0a?w=800&auto=format&fit=crop&crop=center'
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
        image: 'https://images.unsplash.com/photo-1589301772541-d7ce0d154bbc?w=800&auto=format&fit=crop&crop=center'
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
        image: 'https://images.unsplash.com/photo-1572635149518-d8b9c3575e0f?w=800&auto=format&fit=crop&crop=center'
    },
    {
        id: 5,
        name: 'Marlboro Red',
        brand: 'Marlboro',
        flavor: 'Классический',
        strength: 'Крепкие',
        price: 200,
        description: 'Классические крепкие сигареты.',
        category: 'cigarettes',
        image: 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&auto=format&fit=crop'
    },
    {
        id: 6,
        name: 'IQOS Terea Amber',
        brand: 'IQOS',
        flavor: 'Ореховый',
        strength: 'Средние',
        price: 350,
        description: 'Стики для систем нагревания табака.',
        category: 'sticks',
        image: 'https://images.unsplash.com/photo-1545361367-3202270671e7?w=800&auto=format&fit=crop'
    }
];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toastContainer') || createToastContainer();
    container.appendChild(toast);
    
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
        top: 20px;
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
    
    // Обновляем кнопку оплаты
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
    // Проверяем, уже ли подтвержден возраст
    const isVerified = localStorage.getItem('ageVerified') === 'true';
    
    if (isVerified) {
        // Если уже подтвержден, сразу показываем приложение
        document.getElementById('ageModal').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        return;
    }
    
    // Находим кнопки по их ID
    const confirmBtn = document.getElementById('ageConfirm');
    const denyBtn = document.getElementById('ageDeny');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            localStorage.setItem('ageVerified', 'true');
            localStorage.setItem('birthDate', new Date().toISOString().split('T')[0]);
            
            document.getElementById('ageModal').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            
            // Показываем приветственное сообщение
            setTimeout(() => {
                showToast('Добро пожаловать в Smoke Premium!', 'success');
            }, 500);
        });
    }
    
    if (denyBtn) {
        denyBtn.addEventListener('click', () => {
            alert('Доступ к приложению разрешен только лицам старше 18 лет.');
            // Можно добавить редирект или другое поведение
        });
    }
}

// ========== НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ ==========
function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
    
    // Обновляем активную кнопку в навигации
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Если это главный экран, активируем кнопку каталога
    if (screenId === 'homeScreen') {
        const catalogBtn = document.getElementById('catalogBtn');
        if (catalogBtn) catalogBtn.classList.add('active');
    }
    
    // Обновляем счетчик корзины при каждом переходе
    updateCartCount();
}

// ========== РАБОТА С КАТАЛОГОМ ==========
function renderProducts(filterCategory = '') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let filteredProducts = products;
    
    // Фильтрация по категории
    if (filterCategory) {
        filteredProducts = products.filter(p => p.category === filterCategory);
    }
    
    // Фильтрация по поиску
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.flavor.toLowerCase().includes(searchTerm)
        );
    }
    
    // Фильтрация по бренду
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter && brandFilter.value) {
        filteredProducts = filteredProducts.filter(p => p.brand === brandFilter.value);
    }
    
    // Фильтрация по крепости
    const strengthFilter = document.getElementById('strengthFilter');
    if (strengthFilter && strengthFilter.value) {
        filteredProducts = filteredProducts.filter(p => p.strength === strengthFilter.value);
    }
    
    // Очищаем сетку
    productsGrid.innerHTML = '';
    
    // Рендерим продукты
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
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
            </div>
        `;
        
        productCard.addEventListener('click', () => showProductDetail(product.id));
        productsGrid.appendChild(productCard);
    });
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Заполняем данные продукта
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
    showToast(`${product.name} добавлен в корзину`, 'success');
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
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Ваша корзина пуста</p>
                <button class="btn btn-primary to-catalog">В каталог</button>
            </div>
        `;
        
        // Добавляем обработчик для кнопки "В каталог"
        setTimeout(() => {
            const toCatalogBtn = cartItems.querySelector('.to-catalog');
            if (toCatalogBtn) {
                toCatalogBtn.addEventListener('click', () => showScreen('catalogScreen'));
            }
        }, 100);
    } else {
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
                            <button class="remove-item" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-price">${itemTotal} ₽</div>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        
        // Обновляем итоговые суммы
        if (totalItems) totalItems.textContent = itemsCount;
        if (totalPrice) totalPrice.textContent = `${total} ₽`;
        if (grandTotal) grandTotal.textContent = `${total} ₽`;
        
        // Обновляем заказ на экране оплаты
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
}

// ========== ОПЛАТА ==========
function processOrder() {
    const userName = document.getElementById('userName').value;
    const userPhone = document.getElementById('userPhone').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (!userName || !userPhone || !deliveryAddress) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }
    
    // Создаем объект заказа
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        customer: { userName, userPhone, deliveryAddress },
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod,
        status: 'processing'
    };
    
    // Сохраняем заказ в localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Очищаем корзину
    cart = [];
    saveCartToStorage();
    updateCartCount();
    
    // Показываем подтверждение
    showToast('Заказ успешно оформлен!', 'success');
    
    // Имитируем отправку в Telegram бота
    setTimeout(() => {
        const orderDetails = `
✅ Заказ #${order.id} успешно оплачен!
👤 Клиент: ${userName}
📞 Телефон: ${userPhone}
📍 Адрес: ${deliveryAddress}
💰 Способ оплаты: ${getPaymentMethodName(paymentMethod)}
📦 Сумма: ${order.total} ₽

Статус заказа можно отслеживать в боте.
        `;
        
        alert(orderDetails);
        
        // Возвращаем на главный экран
        showScreen('homeScreen');
        
        // Очищаем форму
        document.getElementById('userName').value = '';
        document.getElementById('userPhone').value = '';
        document.getElementById('deliveryAddress').value = '';
    }, 1500);
}

function getPaymentMethodName(method) {
    const methods = {
        'card': 'Карта онлайн',
        'sbp': 'СБП',
        'cash': 'Наличными'
    };
    return methods[method] || method;
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
function initApp() {
    // 1. Инициализируем проверку возраста
    initAgeVerification();
    
    // 2. Настраиваем навигацию
    const catalogBtn = document.getElementById('catalogBtn');
    const cartBtn = document.getElementById('cartBtn');
    
    if (catalogBtn) {
        catalogBtn.addEventListener('click', () => {
            showScreen('catalogScreen');
            renderProducts();
        });
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            showScreen('cartScreen');
            renderCart();
        });
    }
    
    // 3. Кнопки "Назад"
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('homeScreen');
        });
    });
    
    // 4. Категории на главной
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showScreen('catalogScreen');
            renderProducts(category);
        });
    });
    
    // 5. Кнопки "В каталог"
    document.querySelectorAll('.to-catalog').forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen('catalogScreen');
            renderProducts();
        });
    });
    
    // 6. Поиск и фильтры
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderProducts());
    }
    
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter) {
        brandFilter.addEventListener('change', () => renderProducts());
    }
    
    const strengthFilter = document.getElementById('strengthFilter');
    if (strengthFilter) {
        strengthFilter.addEventListener('change', () => renderProducts());
    }
    
    // 7. Управление количеством на странице товара
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
    
    // 8. Кнопка "Добавить в корзину"
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (!currentProduct) return;
            
            const quantity = parseInt(document.getElementById('productQty').textContent);
            addToCart(currentProduct.id, quantity);
            
            // Возвращаемся в корзину
            setTimeout(() => {
                showScreen('cartScreen');
                renderCart();
            }, 800);
        });
    }
    
    // 9. Кнопка оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showScreen('checkoutScreen');
        });
    }
    
    // 10. Кнопка подтверждения заказа
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', processOrder);
    }
    
    // 11. Автоматическое переключение промо-баннера
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
        
        // Клик по точкам
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
    
    // 12. Инициализируем счетчик корзины
    updateCartCount();
}

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', initApp);
// Срочный фикс для кнопки возрастной проверки
function emergencyFix() {
    const confirmBtn = document.getElementById('ageConfirm');
    const denyBtn = document.getElementById('ageDeny');
    
    if (confirmBtn) {
        confirmBtn.onclick = function() {
            localStorage.setItem('ageVerified', 'true');
            document.getElementById('ageModal').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            alert('Возраст подтвержден! Добро пожаловать.');
        };
    }
    
    if (denyBtn) {
        denyBtn.onclick = function() {
            alert('Доступ разрешен только с 18 лет.');
        };
    }
}

// Вызываем срочный фикс после загрузки страницы
setTimeout(emergencyFix, 100);
