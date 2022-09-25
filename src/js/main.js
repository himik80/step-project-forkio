const menu = document.querySelector(".toggle-btn");
const menuLinks = document.querySelector(".nav-menu");
const slide = document.querySelector(".main-hide");
console.log(slide);
menu.addEventListener("click", function () {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
  slide.classList.toggle("slider-noActiv");
});

document.addEventListener("click", function (e) {
  if (!menu.contains(e.target) && !menuLinks.contains(e.target)) {
    menu.classList.remove("is-active");
    menuLinks.classList.remove("active");
    slide.classList.remove("slider-noActiv");
  }
});
