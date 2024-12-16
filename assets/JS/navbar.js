const menu = document.querySelector('.hamberger input');
const nav = document.querySelector('.left-navbar ul');
menu.addEventListener('click', function () {
    nav.classList.toggle("slide");
})