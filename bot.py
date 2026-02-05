import logging
import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from config import TOKEN, DATABASE_URL
from database import init_db, get_categories, get_products, get_product_by_id, add_to_cart_db, get_cart

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /start"""
    user = update.effective_user
    keyboard = [
        [InlineKeyboardButton("🛒 Каталог", callback_data='catalog')],
        [InlineKeyboardButton("🔥 Хиты продаж", callback_data='hits')],
        [InlineKeyboardButton("🛍️ Корзина", callback_data='cart')],
        [InlineKeyboardButton("🏪 Магазины", callback_data='shops')],
        [InlineKeyboardButton("ℹ️ О нас", callback_data='about')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f"🏙️ **Ваш город: Владивосток**\n\n"
        f"Добро пожаловать в **Аидаба** – табачный интернет-магазин!\n"
        f"У нас вы найдете кальяны, табаки и аксессуары по выгодным ценам.\n\n"
        f"👥 **Продавцы-консультанты:** 89\n"
        f"🔥 **Кальяны в наличии:** 500+",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик нажатий на кнопки"""
    query = update.callback_query
    await query.answer()
    
    data = query.data
    
    if data == 'catalog':
        await show_catalog(query)
    elif data == 'hits':
        await show_hits(query)
    elif data == 'cart':
        await show_cart(query)
    elif data == 'shops':
        await show_shops(query)
    elif data == 'about':
        await show_about(query)
    elif data.startswith('category_'):
        category_id = int(data.split('_')[1])
        await show_category_products(query, category_id)
    elif data.startswith('product_'):
        product_id = int(data.split('_')[1])
        await show_product(query, product_id)
    elif data.startswith('add_to_cart_'):
        product_id = int(data.split('_')[3])
        await add_to_cart(query, product_id)
    elif data == 'back_to_main':
        await start_callback(query)
    elif data == 'clear_cart':
        await clear_cart(query)

async def show_catalog(query):
    """Показать категории товаров"""
    categories = get_categories()
    
    keyboard = []
    for category in categories:
        keyboard.append([InlineKeyboardButton(
            category['name'], 
            callback_data=f'category_{category["id"]}'
        )])
    
    keyboard.append([InlineKeyboardButton("🔙 На главную", callback_data='back_to_main')])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        "**🏪 Каталог товаров**\n\n"
        "Выберите категорию:",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def show_hits(query):
    """Показать хиты продаж"""
    hit_products = get_products(hits_only=True)
    
    if not hit_products:
        await query.edit_message_text("Хиты продаж временно отсутствуют.")
        return
    
    message = "**🔥 Хиты продаж**\n\n"
    keyboard = []
    
    for product in hit_products:
        price_text = f"{product['price']} ₽"
        if product['discount'] > 0:
            discounted_price = int(product['price'] * (1 - product['discount']/100))
            price_text = f"~~{product['price']}~~ **{discounted_price} ₽** (-{product['discount']}%)"
        
        message += f"• **{product['name']}**\n{price_text}\n\n"
        
        keyboard.append([
            InlineKeyboardButton(
                f"🛒 {product['name'][:20]}...", 
                callback_data=f'product_{product["id"]}'
            )
        ])
    
    keyboard.append([InlineKeyboardButton("🔙 Назад", callback_data='catalog')])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def show_category_products(query, category_id):
    """Показать товары в категории"""
    products = get_products(category_id=category_id)
    categories = get_categories()
    category_name = next((c['name'] for c in categories if c['id'] == category_id), "Категория")
    
    if not products:
        message = f"**{category_name}**\n\nТовары временно отсутствуют."
    else:
        message = f"**{category_name}**\n\n"
        for product in products:
            price_text = f"{product['price']} ₽"
            if product['discount'] > 0:
                discounted_price = int(product['price'] * (1 - product['discount']/100))
                price_text = f"~~{product['price']}~~ **{discounted_price} ₽**"
            
            badges = ""
            if product['is_hit']:
                badges += "🔥 "
            if product['is_last']:
                badges += "⏳ "
            
            message += f"{badges}**{product['name']}**\n{price_text}\n\n"
    
    keyboard = []
    for product in products:
        keyboard.append([
            InlineKeyboardButton(
                product['name'][:30], 
                callback_data=f'product_{product["id"]}'
            )
        ])
    
    keyboard.append([InlineKeyboardButton("🔙 Назад", callback_data='catalog')])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def show_product(query, product_id):
    """Показать детальную информацию о товаре"""
    product = get_product_by_id(product_id)
    
    if not product:
        await query.edit_message_text("Товар не найден.")
        return
    
    categories = get_categories()
    category_name = next((c['name'] for c in categories if c['id'] == product['category_id']), "Категория")
    
    price_text = f"**{product['price']} ₽**"
    if product['discount'] > 0:
        discounted_price = int(product['price'] * (1 - product['discount']/100))
        price_text = f"~~{product['price']}~~ **{discounted_price} ₽**\nСкидка: -{product['discount']}%"
    
    badges = ""
    if product['is_hit']:
        badges += "🔥 Хит продаж\n"
    if product['is_last']:
        badges += "⏳ Последний\n"
    
    message = (
        f"{badges}\n"
        f"**{product['name']}**\n\n"
        f"Категория: {category_name}\n"
        f"Цена: {price_text}\n\n"
        f"Описание: {product.get('description', 'Описание товара...')}\n"
        f"Вес: {product.get('weight', '20 г')}\n"
        f"Производитель: {product.get('manufacturer', 'Eastwood')}"
    )
    
    keyboard = [
        [InlineKeyboardButton("🛒 Добавить в корзину", callback_data=f'add_to_cart_{product_id}')],
        [InlineKeyboardButton("🔙 Назад к категориям", callback_data='catalog')]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def add_to_cart(query, product_id):
    """Добавить товар в корзину"""
    user_id = query.from_user.id
    success = add_to_cart_db(user_id, product_id)
    
    if success:
        await query.answer("✅ Товар добавлен в корзину!")
    else:
        await query.answer("❌ Ошибка при добавлении товара")

async def show_cart(query):
    """Показать корзину пользователя"""
    user_id = query.from_user.id
    cart_items = get_cart(user_id)
    
    if not cart_items:
        message = "🛒 **Ваша корзина пуста**\n\nДобавьте товары из каталога!"
    else:
        total = 0
        message = "🛒 **Ваша корзина**\n\n"
        
        for item in cart_items:
            product = item['product']
            quantity = item['quantity']
            item_total = product['price'] * quantity
            total += item_total
            
            price_text = f"{product['price']} ₽"
            if product['discount'] > 0:
                discounted_price = int(product['price'] * (1 - product['discount']/100))
                price_text = f"{discounted_price} ₽"
            
            message += f"• **{product['name']}**\n"
            message += f"  Количество: {quantity} × {price_text} = {item_total} ₽\n\n"
        
        message += f"**Итого: {total} ₽**"
    
    keyboard = []
    
    if cart_items:
        keyboard.append([InlineKeyboardButton("✅ Оформить заказ", callback_data='checkout')])
        keyboard.append([InlineKeyboardButton("🗑️ Очистить корзину", callback_data='clear_cart')])
    
    keyboard.append([InlineKeyboardButton("🛍️ Продолжить покупки", callback_data='catalog')])
    keyboard.append([InlineKeyboardButton("🔙 На главную", callback_data='back_to_main')])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def clear_cart(query):
    """Очистить корзину"""
    user_id = query.from_user.id
    # Здесь должна быть функция для очистки корзины в БД
    await query.answer("Корзина очищена!")
    await show_cart(query)

async def show_shops(query):
    """Показать информацию о магазинах"""
    message = (
        "🏪 **Наши магазины**\n\n"
        "📍 **Владивосток:**\n"
        "- ул. Светланская, 45\n"
        "- ул. Фокина, 12\n\n"
        "🕒 **Часы работы:**\n"
        "Пн-Пт: 10:00 - 22:00\n"
        "Сб-Вс: 11:00 - 23:00\n\n"
        "📞 **Телефон:** +7 (423) 222-33-44\n"
        "✉️ **Email:** info@alibaba-market.ru"
    )
    
    keyboard = [[InlineKeyboardButton("🔙 На главную", callback_data='back_to_main')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def show_about(query):
    """Показать информацию о компании"""
    message = (
        "🏙️ **Аидаба**\n\n"
        "Табачный интернет-магазин с доставкой по России.\n\n"
        "🌟 **Наши преимущества:**\n"
        "• 89 продавцов-консультантов\n"
        "• 500+ кальянов в наличии\n"
        "• Быстрая доставка\n"
        "• Гарантия качества\n"
        "• Сертифицированная продукция\n\n"
        "🌐 **Сайт:** alibaba-market.ru\n"
        "📱 **Telegram:** @alibaba_market_bot\n"
        "📧 **Email:** order@alibaba-market.ru"
    )
    
    keyboard = [[InlineKeyboardButton("🔙 На главную", callback_data='back_to_main')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def start_callback(query):
    """Вернуться на главную (для callback)"""
    keyboard = [
        [InlineKeyboardButton("🛒 Каталог", callback_data='catalog')],
        [InlineKeyboardButton("🔥 Хиты продаж", callback_data='hits')],
        [InlineKeyboardButton("🛍️ Корзина", callback_data='cart')],
        [InlineKeyboardButton("🏪 Магазины", callback_data='shops')],
        [InlineKeyboardButton("ℹ️ О нас", callback_data='about')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        f"🏙️ **Ваш город: Владивосток**\n\n"
        f"Добро пожаловать в **Аидаба** – табачный интернет-магазин!\n"
        f"У нас вы найдете кальяны, табаки и аксессуары по выгодным ценам.\n\n"
        f"👥 **Продавцы-консультанты:** 89\n"
        f"🔥 **Кальяны в наличии:** 500+",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

def main():
    """Основная функция запуска бота"""
    # Инициализация базы данных
    init_db()
    
    application = Application.builder().token(TOKEN).build()
    
    # Регистрация обработчиков
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(button_handler))
    
    # Запуск бота
    logger.info("Бот запущен...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()