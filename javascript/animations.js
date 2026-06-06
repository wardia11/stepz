(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("anim-ready");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  function scan() {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      io.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    scan();

    var mo = new MutationObserver(scan);
    ["featured-grid", "product-grid", "cart-items"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) mo.observe(el, { childList: true });
    });
  });
})();
