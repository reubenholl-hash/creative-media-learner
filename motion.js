(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('motion-ready');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const progress = document.createElement('span');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  const main = document.querySelector('main');
  const footer = document.querySelector('.footer');
  if (main && footer) {
    const marquee = document.createElement('div');
    marquee.className = 'motion-marquee';
    marquee.setAttribute('aria-hidden', 'true');
    marquee.innerHTML = '<div><span>VIDEO EDITING</span><i>✦</i><span>SPORTS MEDIA</span><i>✦</i><span>WEBSITES</span><i>✦</i><span>GRAPHIC DESIGN</span><i>✦</i><span>VIDEO EDITING</span><i>✦</i><span>SPORTS MEDIA</span><i>✦</i><span>WEBSITES</span><i>✦</i><span>GRAPHIC DESIGN</span><i>✦</i></div>';
    footer.before(marquee);
  }
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
    let lastScroll = window.scrollY;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateParallax();
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
        const header = document.querySelector('.header');
        if (header) header.classList.toggle('header-hidden', window.scrollY > lastScroll && window.scrollY > 180);
        lastScroll = window.scrollY;
      });
    }, { passive: true });
    updateParallax();
  }

  if (!reducedMotion && finePointer) {
    const dot = document.createElement('span');
    const ring = document.createElement('span');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    window.addEventListener('pointermove', event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;
      const interactive = event.target.closest('a,button,input,select,textarea');
      ring.classList.toggle('is-active', Boolean(interactive));
    }, { passive: true });
    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    document.querySelectorAll('.collection-card,.sports-piece,.project,.work-image,.feature').forEach(card => {
      card.classList.add('tilt-card');
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
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
