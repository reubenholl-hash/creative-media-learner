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
  if (main && !reducedMotion) {
    const depthDecor = document.createElement('div');
    depthDecor.className = 'parallax-decor';
    depthDecor.setAttribute('aria-hidden', 'true');
    depthDecor.innerHTML = '<span class="parallax-orb orb-one"></span><span class="parallax-orb orb-two"></span><span class="parallax-ring"></span>';
    main.prepend(depthDecor);
  }
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
  const parallaxLayers = [
    ...[...document.querySelectorAll('.hero h1,.work-hero h1,.gallery-head h1')].map(element => ({ element, speed: 0.115, limit: 74 })),
    ...[...document.querySelectorAll('.hero .label,.work-hero .label,.gallery-head .label,.section-head .eyebrow')].map(element => ({ element, speed: -0.075, limit: 42 })),
    ...[...document.querySelectorAll('.intro,.work-hero>p,.work-subnav')].map(element => ({ element, speed: 0.07, limit: 44 })),
    ...[...document.querySelectorAll('.collection-card:nth-child(odd),.gallery figure:nth-child(odd),.sports-piece:nth-child(odd)')].map(element => ({ element, speed: 0.035, limit: 28 })),
    ...[...document.querySelectorAll('.collection-card:nth-child(even),.gallery figure:nth-child(even),.sports-piece:nth-child(even)')].map(element => ({ element, speed: -0.03, limit: 24 })),
    ...[...document.querySelectorAll('.parallax-orb,.parallax-ring')].map((element, index) => ({ element, speed: index === 1 ? -0.18 : 0.22, limit: 125 }))
  ];
  let ticking = false;
  const updateParallax = () => {
    const viewport = window.innerHeight;
    parallaxImages.forEach(element => {
      const rect = element.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const imageDepth = finePointer ? -42 : -16;
      element.style.setProperty('--parallax-y', `${(((rect.top + rect.height / 2) / viewport - 0.5) * imageDepth).toFixed(2)}px`);
    });
    parallaxLayers.forEach(({ element, speed, limit }) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -limit * 2 || rect.top > viewport + limit * 2) return;
      const distance = viewport / 2 - (rect.top + rect.height / 2);
      const depthScale = finePointer ? 1 : 0.35;
      const movement = Math.max(-limit, Math.min(limit, distance * speed)) * depthScale;
      element.style.setProperty('--depth-y', `${movement.toFixed(2)}px`);
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
    const canvas = document.createElement('canvas');
    canvas.className = 'motion-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const context = canvas.getContext('2d');
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00018, size: 1 + Math.random() * 2.2
    }));
    let canvasWidth = 0, canvasHeight = 0, canvasActive = true;
    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth * ratio;
      canvas.height = canvasHeight * ratio;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', () => { canvasActive = !document.hidden; });

    let particleMouseX = -1000, particleMouseY = -1000;
    const drawParticles = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      if (canvasActive) {
        particles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
          if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
          const x = particle.x * canvasWidth;
          const y = particle.y * canvasHeight;
          const distance = Math.hypot(x - particleMouseX, y - particleMouseY);
          const pull = Math.max(0, 1 - distance / 220);
          context.beginPath();
          context.arc(x, y, particle.size + pull * 2.5, 0, Math.PI * 2);
          context.fillStyle = `rgba(17,17,17,${0.12 + pull * 0.28})`;
          context.fill();
          particles.slice(index + 1).forEach(other => {
            const ox = other.x * canvasWidth;
            const oy = other.y * canvasHeight;
            const gap = Math.hypot(x - ox, y - oy);
            if (gap > 125) return;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(ox, oy);
            context.strokeStyle = `rgba(17,17,17,${(1 - gap / 125) * 0.07})`;
            context.stroke();
          });
        });
      }
      requestAnimationFrame(drawParticles);
    };
    requestAnimationFrame(drawParticles);

    const spotlight = document.createElement('span');
    spotlight.className = 'cursor-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    document.body.append(spotlight);
    const dot = document.createElement('span');
    const ring = document.createElement('span');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    window.addEventListener('pointermove', event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      particleMouseX = mouseX;
      particleMouseY = mouseY;
      dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;
      spotlight.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;
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

    document.querySelectorAll('.tabs a,.contact,.text-link,.back-link,.contact-form button').forEach(element => {
      element.classList.add('magnetic');
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--magnetic-x', `${((event.clientX - rect.left - rect.width / 2) * 0.18).toFixed(1)}px`);
        element.style.setProperty('--magnetic-y', `${((event.clientY - rect.top - rect.height / 2) * 0.22).toFixed(1)}px`);
      }, { passive: true });
      element.addEventListener('pointerleave', () => {
        element.style.setProperty('--magnetic-x', '0px');
        element.style.setProperty('--magnetic-y', '0px');
      });
    });

    document.addEventListener('pointerdown', event => {
      const ripple = document.createElement('span');
      ripple.className = 'pointer-ripple';
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });

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

  if (!reducedMotion) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    document.querySelectorAll('.label,.eyebrow').forEach(label => {
      const original = label.textContent;
      let running = false;
      const scramble = () => {
        if (running) return;
        running = true;
        let frame = 0;
        const timer = window.setInterval(() => {
          label.textContent = [...original].map((character, index) => {
            if (character === ' ' || character === '/' || character === '·' || character === '●') return character;
            if (index < frame / 2) return character;
            return characters[Math.floor(Math.random() * characters.length)];
          }).join('');
          frame += 1;
          if (frame > original.length * 2) {
            window.clearInterval(timer);
            label.textContent = original;
            running = false;
          }
        }, 28);
      };
      label.addEventListener('pointerenter', scramble);
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
