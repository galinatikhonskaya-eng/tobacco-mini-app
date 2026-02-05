import os
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

# Токен бота Telegram
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

# Настройки базы данных
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///shop.db')

# Настройки магазина
SHOP_CONFIG = {
    'name': 'Аидаба',
    'city': 'Владивосток',
    'consultants': 89,
    'hookahs_count': 500,
    'phone': '+7 (423) 222-33-44',
    'email': 'info@alibaba-market.ru',
    'website': 'alibaba-market.ru'
}

# Категории товаров (можно заменить на загрузку из БД)
CATEGORIES = [
    {'id': 1, 'name': 'Кальяны', 'slug': 'hookahs'},
    {'id': 2, 'name': 'Электронные кальяны', 'slug': 'e-hookahs'},
    {'id': 3, 'name': 'Табак для кальяна', 'slug': 'tobacco'},
    {'id': 4, 'name': 'Аксессуары для кальяна', 'slug': 'accessories'},
    {'id': 5, 'name': 'Уголь для кальяна', 'slug': 'coal'},
]