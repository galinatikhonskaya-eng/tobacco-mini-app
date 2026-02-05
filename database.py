import sqlite3
from contextlib import contextmanager
from config import DATABASE_URL

@contextmanager
def get_db_connection():
    """Контекстный менеджер для подключения к БД"""
    conn = sqlite3.connect('shop.db')
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Инициализация базы данных"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Создание таблицы категорий
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT
        )
        ''')
        
        # Создание таблицы товаров
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price INTEGER NOT NULL,
            discount INTEGER DEFAULT 0,
            category_id INTEGER,
            is_hit BOOLEAN DEFAULT 0,
            is_last BOOLEAN DEFAULT 0,
            weight TEXT,
            manufacturer TEXT,
            image_url TEXT,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )
        ''')
        
        # Создание таблицы корзины
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
        ''')
        
        # Создание таблицы заказов
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_price INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            phone TEXT,
            address TEXT
        )
        ''')
        
        # Добавление категорий по умолчанию
        from config import CATEGORIES
        for category in CATEGORIES:
            cursor.execute('''
            INSERT OR IGNORE INTO categories (id, name, slug) 
            VALUES (?, ?, ?)
            ''', (category['id'], category['name'], category['slug']))
        
        # Добавление тестовых товаров
        sample_products = [
            (1, 'Табак для трубки Eastwood Vanilla 20 г', 'Ароматный табак с ванильным вкусом', 450, 36, 3, 1, 0, '20 г', 'Eastwood', None),
            (2, 'Устройство Starline Midi Арбуз-яблоко 7000 затяжек', 'Электронный кальян с фруктовым вкусом', 3200, 0, 2, 1, 1, None, 'Starline', None),
            (3, 'Кальян Khalil Mamoon Classic', 'Классический кальян из Египта', 5500, 15, 1, 1, 0, '1.2 кг', 'Khalil Mamoon', None),
            (4, 'Кокосовый уголь CocoBrico 1 кг', 'Премиальный кокосовый уголь', 800, 0, 5, 0, 0, '1 кг', 'CocoBrico', None),
            (5, 'Чаша для кальяна HJ Harmony', 'Фаянсовая чаша премиум-класса', 1200, 20, 4, 1, 0, '300 г', 'HJ', None),
        ]
        
        for product in sample_products:
            cursor.execute('''
            INSERT OR IGNORE INTO products (id, name, description, price, discount, category_id, is_hit, is_last, weight, manufacturer, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', product)
        
        conn.commit()

def get_categories():
    """Получить все категории"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM categories ORDER BY id')
        return [dict(row) for row in cursor.fetchall()]

def get_products(category_id=None, hits_only=False):
    """Получить товары"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = 'SELECT * FROM products WHERE 1=1'
        params = []
        
        if category_id:
            query += ' AND category_id = ?'
            params.append(category_id)
        
        if hits_only:
            query += ' AND is_hit = 1'
        
        query += ' ORDER BY id'
        
        cursor.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]

def get_product_by_id(product_id):
    """Получить товар по ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def add_to_cart_db(user_id, product_id, quantity=1):
    """Добавить товар в корзину"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Проверяем, есть ли уже товар в корзине
            cursor.execute('''
            SELECT quantity FROM cart 
            WHERE user_id = ? AND product_id = ?
            ''', (user_id, product_id))
            
            existing = cursor.fetchone()
            
            if existing:
                # Обновляем количество
                new_quantity = existing['quantity'] + quantity
                cursor.execute('''
                UPDATE cart SET quantity = ? 
                WHERE user_id = ? AND product_id = ?
                ''', (new_quantity, user_id, product_id))
            else:
                # Добавляем новый товар
                cursor.execute('''
                INSERT INTO cart (user_id, product_id, quantity)
                VALUES (?, ?, ?)
                ''', (user_id, product_id, quantity))
            
            conn.commit()
            return True
    except Exception as e:
        print(f"Ошибка при добавлении в корзину: {e}")
        return False

def get_cart(user_id):
    """Получить корзину пользователя"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
        SELECT c.product_id, c.quantity, p.* 
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ''', (user_id,))
        
        cart_items = []
        for row in cursor.fetchall():
            item = dict(row)
            cart_items.append({
                'product': {
                    'id': item['product_id'],
                    'name': item['name'],
                    'price': item['price'],
                    'discount': item['discount']
                },
                'quantity': item['quantity']
            })
        
        return cart_items

def clear_cart_db(user_id):
    """Очистить корзину пользователя"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM cart WHERE user_id = ?', (user_id,))
        conn.commit()
        return cursor.rowcount