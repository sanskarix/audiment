import Lenis from 'lenis';

export function setupHashScroll(lenis?: Lenis) {
  const scrollToHash = (hash: string, smooth = true) => {
    if (!hash || hash === '#' || hash === '#top') {
      if (lenis) {
        lenis.scrollTo(0, { duration: smooth ? 1.2 : 0 });
      } else {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      }
      return;
    }

    const targetId = hash.startsWith('#') ? hash.slice(1) : hash;
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      const headerOffset = 80;
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -headerOffset, duration: smooth ? 1.2 : 0 });
      } else {
        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }
  };

  // 1. Initial page load auto-scroll if URL has hash
  const handleInitialHash = () => {
    if (window.location.hash) {
      // Small delays to ensure React component mounting & layout settlement
      setTimeout(() => {
        scrollToHash(window.location.hash, true);
      }, 100);
      setTimeout(() => {
        scrollToHash(window.location.hash, true);
      }, 450);
    }
  };

  if (document.readyState === 'complete') {
    handleInitialHash();
  } else {
    window.addEventListener('load', handleInitialHash);
    setTimeout(handleInitialHash, 150);
  }

  // 2. Intercept click events on links with hashes
  document.addEventListener('click', (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const linkPath = href.substring(0, hashIndex);
    const hash = href.substring(hashIndex);

    // Normalize paths by stripping .html and trailing slash
    const normalize = (p: string) => {
      let s = p.replace(/\.html$/, '');
      if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
      return s;
    };
    const normCurrent = normalize(window.location.pathname);
    const normLink = normalize(linkPath);

    const isSamePage =
      linkPath === '' ||
      linkPath === '#' ||
      normLink === normCurrent ||
      ((normCurrent === '' || normCurrent === '/' || normCurrent === '/index') &&
        (normLink === '' || normLink === '/' || normLink === '/index'));

    if (isSamePage && hash) {
      const targetId = hash.slice(1);
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (targetEl || hash === '#top' || hash === '#') {
        e.preventDefault();
        window.history.pushState(null, '', hash);
        scrollToHash(hash, true);
      }
    }
  });

  // 3. Handle hashchange (browser back/forward)
  window.addEventListener('hashchange', () => {
    if (window.location.hash) {
      scrollToHash(window.location.hash, true);
    }
  });
}
