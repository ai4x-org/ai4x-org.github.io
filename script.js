// Morphing hero title: X -> Productivity -> Science -> AI -> X ...
(function morphTitle() {
  const host = document.querySelector('#morph .morph-word');
  if (!host) return;
  const words = ['X', 'Productivity', 'Science', 'AI'];
  const holds = [1600, 2200, 2200, 2000]; // dwell time per word (ms)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  let i = 0;
  const swap = () => {
    host.classList.add('out');
    setTimeout(() => {
      i = (i + 1) % words.length;
      host.textContent = words[i];
      host.classList.remove('out');
      host.classList.add('in');
      // force reflow so the "in" starting state applies before transitioning
      void host.offsetWidth;
      host.classList.remove('in');
      setTimeout(swap, holds[i]);
    }, 450);
  };
  setTimeout(swap, holds[0]);
})();

// Nav border on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
  io.observe(el);
});

// Copy BibTeX
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const target = document.querySelector(btn.dataset.copy);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.innerText.trim());
      const prev = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = prev;
        btn.classList.remove('copied');
      }, 1800);
    } catch (err) {
      /* clipboard unavailable */
    }
  });
});
