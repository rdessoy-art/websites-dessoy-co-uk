document.documentElement.classList.add('js');

// Contact dialog: opens by itself after ~20s or ~40% scroll depth (whichever is first),
// never again once dismissed. The native modal <dialog> gives Esc-to-close, a focus trap
// (the rest of the page is inert) and returns focus to the previously focused element.
(function () {
  var dialog = document.getElementById('contact-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var KEY = 'contactDismissed';
  var DELAY_MS = 20000;
  var SCROLL_DEPTH = 0.4;
  var timer = null;

  function dismissed() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function open() {
    if (!dialog.open) dialog.showModal();
  }
  function stopTriggers() {
    clearTimeout(timer);
    window.removeEventListener('scroll', onScroll);
  }
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY / max >= SCROLL_DEPTH) { stopTriggers(); open(); }
  }

  // Any close (Esc, X, Close button, backdrop click) counts as dismissal.
  dialog.addEventListener('close', function () { remember(); stopTriggers(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.querySelectorAll('[data-close-contact]').forEach(function (b) {
    b.addEventListener('click', function () { dialog.close(); });
  });

  // Manual triggers always work, even after dismissal.
  document.querySelectorAll('[data-open-contact]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); stopTriggers(); open(); });
  });

  if (dismissed()) return;
  timer = setTimeout(function () { stopTriggers(); open(); }, DELAY_MS);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Fade sections in as they scroll into view.
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
})();
