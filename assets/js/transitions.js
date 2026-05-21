(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // --- Article augmentation ---
  function augmentArticle(root) {
    if (root.dataset.augmented) return;
    root.dataset.augmented = 'true';

    var headings = root.querySelectorAll('.body > h2');
    headings.forEach(function (h2, i) {
      var wrap = document.createElement('div');
      wrap.className = 'section-opener';
      wrap.dataset.fade = '';
      var num = String(i + 1).padStart(2, '0');
      wrap.innerHTML =
        '<span class="numeral" aria-hidden="true">' + num + '</span>' +
        '<span class="chapter-label">chapter ' + num + '</span>';
      h2.parentNode.insertBefore(wrap, h2);
      wrap.appendChild(h2);
    });

    root.querySelectorAll('.body > p, .body blockquote').forEach(function (el, i) {
      el.dataset.fade = '';
      var delay = Math.min(Math.floor(i / 1), 4);
      if (delay > 0) el.dataset.delay = delay;
    });
  }

  // --- Scroll fade-ins ---
  function initScrollFades(root) {
    var els = (root || document).querySelectorAll('[data-fade]');
    if (reducedMotion.matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  // --- Page transitions ---
  function updateNavActive(url) {
    document.querySelectorAll('[data-month-link]').forEach(function (link) {
      if (link.getAttribute('href') === url || link.pathname === url) {
        link.setAttribute('data-active', '');
      } else {
        link.removeAttribute('data-active');
      }
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-month-link]');
    if (!link) return;
    e.preventDefault();

    var href = link.href;
    var article = document.querySelector('article.post');
    if (!article) { window.location = href; return; }

    if (reducedMotion.matches) {
      window.location = href;
      return;
    }

    article.style.transition = 'opacity 280ms ease, transform 280ms ease';
    article.style.opacity = '0';
    article.style.transform = 'translateY(8px)';

    setTimeout(function () {
      fetch(href)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var newArticle = doc.querySelector('article.post');
          if (!newArticle) { window.location = href; return; }

          article.replaceWith(newArticle);
          history.pushState(null, '', href);

          var newTitle = doc.querySelector('title');
          if (newTitle) document.title = newTitle.textContent;

          augmentArticle(newArticle);

          newArticle.style.opacity = '0';
          newArticle.style.transform = 'translateY(8px)';
          newArticle.style.transition = 'opacity 320ms ease, transform 320ms ease';
          requestAnimationFrame(function () {
            newArticle.style.opacity = '1';
            newArticle.style.transform = 'translateY(0)';
          });

          window.scrollTo(0, 0);
          initScrollFades(newArticle);
          updateNavActive(link.pathname);
          if (window.updateProgress) window.updateProgress();

          // Close mobile sheet if open
          var sheet = document.querySelector('[data-mobile-sheet]');
          if (sheet && !sheet.hidden) {
            sheet.hidden = true;
            document.body.style.overflow = '';
            var trigger = document.querySelector('[data-mobile-trigger]');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
          }
        })
        .catch(function () { window.location = href; });
    }, 280);
  });

  window.addEventListener('popstate', function () { location.reload(); });

  // --- Init on load ---
  var article = document.querySelector('article.post');
  if (article) {
    augmentArticle(article);
    initScrollFades();
  }

  window.augmentArticle = augmentArticle;
  window.initScrollFades = initScrollFades;
})();
