/* REX Squirrel Scripting — shared navigation bar
   - Injected on every page except index.html.
   - Marks the current page as "active".
   - Slides out of view when scrolling down, back in when scrolling up.
*/
(function () {
  'use strict';

  var currentPage = location.pathname.split('/').pop() || 'index.html';

  // No navbar on the home page.
  if (currentPage === 'index.html') return;

  // Reserve space before the body renders (avoids a layout jump).
  document.documentElement.classList.add('has-navbar');

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

    nav.appendChild(links);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNavbar);
  } else {
    buildNavbar();
  }
})();