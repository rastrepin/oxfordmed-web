function toggleNav(btn) {
  var isOpen = btn.classList.toggle('open');
  document.querySelector('.nav-menu').classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
document.addEventListener('click', function(e) {
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav-burger');
  if (burger && nav && !nav.contains(e.target) && burger.classList.contains('open')) {
    burger.classList.remove('open');
    document.querySelector('.nav-menu').classList.remove('open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.addEventListener('click', function() {
      var burger = document.querySelector('.nav-burger');
      if (burger && burger.classList.contains('open')) {
        burger.classList.remove('open');
        var menu = document.querySelector('.nav-menu');
        if (menu) menu.classList.remove('open');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
