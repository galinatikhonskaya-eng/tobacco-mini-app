const tg = window.Telegram.WebApp;
tg.ready();

let cart = [];

function addToCart() {
  cart.push("Darkside Cola");
  tg.showAlert("Товар добавлен в корзину");
}

function pay() {
  if (cart.length === 0) {
    tg.showAlert("Корзина пуста");
    return;
  }

  tg.sendData(JSON.stringify({
    action: "pay",
    items: cart
  }));
}
