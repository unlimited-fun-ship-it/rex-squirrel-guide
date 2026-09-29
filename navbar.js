/* REX Squirrel Scripting — shared navigation bar + theme toggle
   - Injects the navbar on every page except index.html.
   - Injects a floating theme toggle on index.html.
   - Remembers the reader's theme choice in localStorage.
   - Slides the navbar out of view when scrolling down, back in when scrolling up.
*/
(function () {
  'use strict';

  var THEME_KEY = 'rex-theme';

  var currentPage = location.pathname.split('/').pop() || 'index.html';
  var isHome = currentPage === 'index.html' || currentPage === '';

  // ---------- Theme helpers ----------

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }

  function buildThemeButton(extraClass) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle' + (extraClass ? ' ' + extraClass : '');
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.title = 'Toggle dark mode';
    btn.innerHTML =
      '<svg class="icon-sun" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2' +
      'M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>' +
      '</svg>' +
      '<svg class="icon-moon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
      '</svg>';
    btn.addEventListener('click', toggleTheme);
    return btn;
  }

  // Reserve space for the navbar before the body renders (avoids a layout jump).
  if (!isHome) {
    document.documentElement.classList.add('has-navbar');
  }

  // ---------- Navbar ----------

  var pages = [
    { href: 'index.html',                label: 'Home' },
    { href: 'introduction.html',         label: 'Introduction' },
    { href: 'basic-tools.html',          label: 'Basic Tools' },
    { href: 'useful-algorithms.html',    label: 'Algorithms' },
    { href: 'state-machines.html',       label: 'State Machines' },
    { href: 'major-event-scripts.html',  label: 'Major Events' },
    { href: 'emergent-factions.html',    label: 'Emergent Factions' },
    { href: 'player-choice-events.html', label: 'Player Choice' }
  ];

  function buildNavbar() {
    var nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.setAttribute('aria-label', 'Site navigation');

    var brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = 'index.html';
    brand.textContent = 'REX Squirrel Scripting';
    nav.appendChild(brand);

    var right = document.createElement('div');
    right.className = 'nav-right';

    var links = document.createElement('div');
    links.className = 'links';

    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      var a = document.createElement('a');
      a.href = p.href;
      a.textContent = p.label;
      if (p.href === currentPage) a.className = 'active';
      links.appendChild(a);
    }

    right.appendChild(links);
    right.appendChild(buildThemeButton());
    nav.appendChild(right);

    document.body.insertBefore(nav, document.body.firstChild);

    // ---- Scroll-hide behaviour ----
    var lastY = window.scrollY;
    var ticking = false;
    var hideAfter = 120;   // must scroll at least this far before hiding
    var delta = 6;         // pixels of movement needed to flip state

    function onFrame() {
      var y = window.scrollY;
      var goingDown = y > lastY + delta;
      var goingUp   = y < lastY - delta;

      if (y > hideAfter && goingDown) {
        nav.classList.add('navbar-hidden');
      } else if (goingUp || y <= 40) {
        nav.classList.remove('navbar-hidden');
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onFrame);
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- Entry point ----------

  function init() {
    if (isHome) {
      document.body.appendChild(buildThemeButton('theme-toggle-floating'));
    } else {
      buildNavbar();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();