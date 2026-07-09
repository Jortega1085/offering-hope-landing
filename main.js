// Mobile nav toggle. Events renderer is added in Task 2; contact form in Task 6.
function initNav() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
    var open = nav.classList.contains("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
document.addEventListener("DOMContentLoaded", function () {
  initNav();
});
