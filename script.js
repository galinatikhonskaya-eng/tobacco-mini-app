const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

function openMenu() {
  document.getElementById("sideMenu").classList.add("active");
  document.querySelector(".overlay").classList.add("active");
}

function closeMenu() {
  document.getElementById("sideMenu").classList.remove("active");
  document.querySelector(".overlay").classList.remove("active");
}
