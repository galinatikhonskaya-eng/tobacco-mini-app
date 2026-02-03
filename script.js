require('dotenv').config();
const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = Number(process.env.ADMIN_ID);

// Обязательно для wizard (сессии)
bot.use(session());

// Хранилище товаров
let products = [];
const PRODUCTS_FILE = './products.json';

// Загрузка товаров при старте
if (fs.existsSync(PRODUCTS_FILE)) {
    try {
        products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
        console.log(`Загружено ${products.length} товаров`);
    } catch (err) {
        console.error('Ошибка чтения products.json:', err.message);
    }
}

function saveProducts() {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    console.log('Товар сохранён в products.json');
}

// Wizard для добавления товара
const addProductWizard = new Scenes.WizardScene(
    'add_product',

    // Шаг 1: Категория
    async (ctx) => {
        console.log('Шаг 1: Показываем категории');
        await ctx.reply(
            'Выберите категорию товара:',
            Markup.keyboard([
                ['Кальянный табак'],
                ['Сигареты'],
                ['Стики'],
                ['Аксессуары']
            ]).oneTime().resize()
        );
        return ctx.wizard.next();
    },

    // Шаг 2: Получаем категорию
    async (ctx) => {
        console.log('Шаг 2: Получено сообщение. Текст:', ctx.message?.text);
        const category = ctx.message?.text?.trim() || '';

        if (['Назад', 'Отмена'].includes(category)) {
            console.log('Нажата Назад/Отмена на шаге 2');
            return handleBackOrCancel(ctx, category);
        }

        if (!['Кальянный табак', 'Сигареты', 'Стики', 'Аксессуары'].includes(category)) {
            console.log('Неверная категория:', category);
            await ctx.reply('Выберите категорию из предложенных кнопок!', Markup.keyboard([
                ['Кальянный табак'],
                ['Сигареты'],
                ['Стики'],
                ['Аксессуары']
            ]).oneTime().resize());
            return ctx.wizard.current(); // остаёмся на шаге 2
        }

        console.log('Категория выбрана:', category);
        ctx.wizard.state.product = { category };
        await ctx.reply('Категория сохранена! Теперь пришлите фото товара (одно фото).', backKeyboard());
        return ctx.wizard.next();
    },

    // Шаг 3: Фото
    async (ctx) => {
        console.log('Шаг 3: Получено сообщение');
        if (ctx.message?.text && ['Назад', 'Отмена'].includes(ctx.message.text.trim())) {
            return handleBackOrCancel(ctx, ctx.message.text.trim());
        }

        if (!ctx.message?.photo) {
            await ctx.reply('Пожалуйста, пришлите фото товара!', backKeyboard());
            return ctx.wizard.current();
        }

        const photoFileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        ctx.wizard.state.product.photoFileId = photoFileId;
        console.log('Фото сохранено:', photoFileId);
        await ctx.reply('Фото получено! Теперь пришлите название товара.', backKeyboard());
        return ctx.wizard.next();
    },

    // Шаг 4: Название
    async (ctx) => {
        console.log('Шаг 4: Получено сообщение');
        if (ctx.message?.text && ['Назад', 'Отмена'].includes(ctx.message.text.trim())) {
            return handleBackOrCancel(ctx, ctx.message.text.trim());
        }

        if (!ctx.message?.text) {
            await ctx.reply('Пришлите название товара!', backKeyboard());
            return ctx.wizard.current();
        }

        ctx.wizard.state.product.name = ctx.message.text.trim();
        await ctx.reply('Название сохранено. Теперь пришлите описание товара.', backKeyboard());
        return ctx.wizard.next();
    },

    // Шаг 5: Описание
    async (ctx) => {
        console.log('Шаг 5: Получено сообщение');
        if (ctx.message?.text && ['Назад', 'Отмена'].includes(ctx.message.text.trim())) {
            return handleBackOrCancel(ctx, ctx.message.text.trim());
        }

        ctx.wizard.state.product.desc = ctx.message?.text?.trim() || '';
        await ctx.reply('Описание сохранено. Теперь пришлите цену (например, 1500 руб).', backKeyboard());
        return ctx.wizard.next();
    },

    // Шаг 6: Цена и сохранение
    async (ctx) => {
        console.log('Шаг 6: Получено сообщение');
        if (ctx.message?.text && ['Назад', 'Отмена'].includes(ctx.message.text.trim())) {
            return handleBackOrCancel(ctx, ctx.message.text.trim());
        }

        if (!ctx.message?.text) {
            await ctx.reply('Пришлите цену!', backKeyboard());
            return ctx.wizard.current();
        }

        ctx.wizard.state.product.price = ctx.message.text.trim();

        products.push(ctx.wizard.state.product);
        saveProducts();

        const p = ctx.wizard.state.product;
        await ctx.replyWithPhoto(p.photoFileId, {
            caption: `Товар добавлен!\n\nКатегория: ${p.category}\nНазвание: ${p.name}\nОписание: ${p.desc}\nЦена: ${p.price}`
        });

        await ctx.scene.leave();
        await ctx.reply('Готово! Используйте /add для нового товара или /products для просмотра списка.');
    }
);

// Обработка Назад / Отмена
function handleBackOrCancel(ctx, action) {
    if (action === 'Отмена') {
        ctx.scene.leave();
        return ctx.reply('Добавление отменено.');
    }
    if (action === 'Назад') {
        ctx.wizard.back();
        return ctx.reply('Вернулись на предыдущий шаг.');
    }
}

// Клавиатура Назад / Отмена
function backKeyboard() {
    return Markup.keyboard([
        ['Назад', 'Отмена']
    ]).resize().oneTime();
}

// Регистрация wizard
const stage = new Scenes.Stage([addProductWizard]);
bot.use(stage.middleware());

// Команды
bot.start((ctx) => {
    ctx.reply('Привет! Это бот для добавления товаров в табачный Mini App.');
    if (ctx.from.id === ADMIN_ID) {
        ctx.reply('Ты админ! Используй /add для добавления товара.');
    }
});

bot.command('add', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) {
        return ctx.reply('Доступ только админу!');
    }
    ctx.scene.enter('add_product');
});

bot.command('products', (ctx) => {
    if (products.length === 0) {
        return ctx.reply('Товаров пока нет.');
    }
    let text = 'Список товаров:\n\n';
    products.forEach((p, i) => {
        text += `${i + 1}. [${p.category}] ${p.name} — ${p.price}\n${p.desc || ''}\nФото ID: ${p.photoFileId}\n\n`;
    });
    ctx.reply(text);
});

bot.command('cancel', (ctx) => {
    if (ctx.scene.current) {
        ctx.scene.leave();
        ctx.reply('Добавление отменено.');
    }
});

bot.launch();
console.log('Бот успешно запущен!');
console.log('Проверьте терминал после выбора категории — там должны появиться логи');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));