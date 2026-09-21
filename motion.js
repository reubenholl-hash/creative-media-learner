(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('motion-ready');
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.setAttribute('aria-hidden', 'true');
  loader.innerHTML = '<span class="loader-mark">CML</span><span class="loader-line"></span><span class="loader-count">00</span>';
  document.body.prepend(loader);
  if (reducedMotion) {
    loader.remove();
    document.documentElement.classList.add('page-visible');
  } else {
    const counter = loader.querySelector('.loader-count');
    const started = performance.now();
    const duration = sessionStorage.getItem('cml-intro-seen') ? 420 : 1050;
    const count = now => {
      const progress = Math.min((now - started) / duration, 1);
      counter.textContent = String(Math.round(progress * 100)).padStart(2, '0');
      if (progress < 1) requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
    window.addEventListener('load', () => {
      window.setTimeout(() => {
        loader.classList.add('is-finished');
        document.documentElement.classList.add('page-visible');
        sessionStorage.setItem('cml-intro-seen', '1');
        window.setTimeout(() => loader.remove(), 950);
      }, duration);
    }, { once: true });
  }
  const revealTargets = document.querySelectorAll('.section-head,.intro,.feature,.creative-card,.services article,.video,.project,.collection-card,.work-item,.gallery figure,.sports-piece,.about-grid,.footer-top,.contact-form');
  revealTargets.forEach((element, index) => {
    element.classList.add('motion-reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
  });
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealTargets.forEach(element => observer.observe(element));
  }
  const parallaxImages = [...document.querySelectorAll('.feature img,.collection-card img,.work-image img,.project-art,.sports-piece img')];
  let ticking = false;
  const updateParallax = () => {
    const viewport = window.innerHeight;
    parallaxImages.forEach(element => {
      const rect = element.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      element.style.setProperty('--parallax-y', `${(((rect.top + rect.height / 2) / viewport - 0.5) * -18).toFixed(2)}px`);
    });
    ticking = false;
  };
  if (!reducedMotion) {
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || reducedMotion) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.hash || !url.pathname.endsWith('.html')) return;
    event.preventDefault();
    document.documentElement.classList.add('page-leaving');
    window.setTimeout(() => { location.href = url.href; }, 440);
  });
})();
