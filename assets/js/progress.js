(function () {
  var fill = document.querySelector('.progress-fill');
  if (!fill) return;

  function update() {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var pct = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
    fill.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  window.updateProgress = update;
})();
