(function () {
  // --- Desktop year dropdowns ---
  var dropdowns = document.querySelectorAll('[data-dropdown]');

  function closeAllDropdowns() {
    dropdowns.forEach(function (dd) {
      var panel = dd.querySelector('[data-dropdown-panel]');
      var trigger = dd.querySelector('[data-dropdown-trigger]');
      if (panel) panel.hidden = true;
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(function (dd) {
    var trigger = dd.querySelector('[data-dropdown-trigger]');
    var panel = dd.querySelector('[data-dropdown-panel]');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', function () {
      var isOpen = !panel.hidden;
      closeAllDropdowns();
      if (!isOpen) {
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('mousedown', function (e) {
    var inside = false;
    dropdowns.forEach(function (dd) {
      if (dd.contains(e.target)) inside = true;
    });
    if (!inside) closeAllDropdowns();
  });

  // --- Mobile sheet ---
  var mobileTrigger = document.querySelector('[data-mobile-trigger]');
  var mobileSheet = document.querySelector('[data-mobile-sheet]');
  var mobileClose = document.querySelector('[data-mobile-close]');

  function openSheet() {
    if (!mobileSheet) return;
    mobileSheet.hidden = false;
    document.body.style.overflow = 'hidden';
    if (mobileTrigger) mobileTrigger.setAttribute('aria-expanded', 'true');
    var firstLink = mobileSheet.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeSheet() {
    if (!mobileSheet) return;
    mobileSheet.hidden = true;
    document.body.style.overflow = '';
    if (mobileTrigger) {
      mobileTrigger.setAttribute('aria-expanded', 'false');
      mobileTrigger.focus();
    }
  }

  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', function () {
      if (mobileSheet && mobileSheet.hidden) {
        openSheet();
      } else {
        closeSheet();
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeSheet);
  }

  // --- Keyboard: Esc closes dropdowns and sheet ---
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeSheet();
    }
  });

  // --- Focus trap in mobile sheet ---
  if (mobileSheet) {
    mobileSheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = mobileSheet.querySelectorAll('a, button');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
})();
