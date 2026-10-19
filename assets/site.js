(function () {
  'use strict';
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-main-nav]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const opening = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(opening));
      menu.classList.toggle('is-open', opening);
      menuButton.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        menu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const galleryTabs = Array.from(document.querySelectorAll('[data-gallery-tab]'));
  const galleryImg = document.querySelector('[data-gallery-image]');
  const galleryTitle = document.querySelector('[data-gallery-title]');
  const galleryDescription = document.querySelector('[data-gallery-description]');
  if (galleryTabs.length && galleryImg && galleryTitle && galleryDescription) {
    galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        galleryTabs.forEach(other => other.setAttribute('aria-pressed', String(other === tab)));
        galleryImg.src = tab.dataset.image;
        galleryImg.alt = tab.dataset.alt;
        galleryTitle.textContent = tab.dataset.title;
        galleryDescription.textContent = tab.dataset.description;
      });
    });

    document.querySelectorAll('[data-gallery-open]').forEach(button => {
      button.addEventListener('click', () => {
        const tab = galleryTabs.find(item => item.dataset.screen === button.dataset.galleryOpen);
        if (!tab) return;
        tab.click();
        const section = document.querySelector('#screenshots .gallery-layout');
        if (section) section.scrollIntoView({behavior: 'smooth', block: 'start'});
      });
    });
  }

  const languageButtons = Array.from(document.querySelectorAll('[data-lang-switch]'));
  if (languageButtons.length) {
    const setLanguage = (lang, shouldSyncHash) => {
      const fil = lang === 'fil';
      document.body.classList.toggle('lang-fil', fil);
      document.documentElement.lang = fil ? 'fil' : 'en';
      languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.langSwitch === lang)));
      const prefix = fil ? 'fil' : 'en';
      document.querySelectorAll('[data-guide-toc]').forEach(nav => {
        nav.hidden = nav.dataset.guideToc !== lang;
      });
      if (shouldSyncHash && /^#(?:en|fil)\d+$/.test(window.location.hash)) {
        history.replaceState(null, '', '#' + prefix + window.location.hash.replace(/^#(?:en|fil)/, ''));
      }
    };
    const originalHash = window.location.hash;
    const browserLang = (navigator.language || '').toLowerCase();
    setLanguage(originalHash.startsWith('#fil') || (!originalHash.startsWith('#en') && (browserLang.startsWith('fil') || browserLang.startsWith('tl'))) ? 'fil' : 'en', false);
    languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.langSwitch, true)));
    window.addEventListener('hashchange', () => {
      if (window.location.hash.startsWith('#fil')) setLanguage('fil', false);
      else if (window.location.hash.startsWith('#en')) setLanguage('en', false);
    });
  }

  const headingElements = Array.from(document.querySelectorAll('.doc-card h2[id]'));
  if (headingElements.length && 'IntersectionObserver' in window) {
    const tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const selector = '.toc-links a[href="#' + entry.target.id + '"]';
        document.querySelectorAll('.toc-links a').forEach(link => link.classList.toggle('active', link.matches(selector)));
      });
    }, {rootMargin:'-110px 0px -70% 0px', threshold:0});
    headingElements.forEach(heading => tocObserver.observe(heading));
  }
})();
