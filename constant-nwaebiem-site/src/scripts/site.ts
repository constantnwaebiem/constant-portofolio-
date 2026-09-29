// Interactions for the site. Content is rendered at build time; this only adds behaviour.
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- toast ---------- */
const toastEl = $('#toast');
let toastTimer: number | undefined;
function toast(msg: string) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* ---------- menu ---------- */
const menu = $('#menu');
const burger = $('#burger');
function openMenu() {
  menu?.classList.add('open');
  document.body.classList.add('lock');
  burger?.setAttribute('aria-expanded', 'true');
  window.setTimeout(() => $('#menuClose')?.focus(), 50);
}
function closeMenu() {
  if (!menu?.classList.contains('open')) return;
  menu.classList.remove('open');
  document.body.classList.remove('lock');
  burger?.setAttribute('aria-expanded', 'false');
}
burger?.addEventListener('click', openMenu);
$('#menuClose')?.addEventListener('click', () => { closeMenu(); burger?.focus(); });
$$('#menu a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ---------- experience accordion ---------- */
$$('.xp-btn').forEach((b) =>
  b.addEventListener('click', () => {
    const li = b.closest('.xp-item');
    if (!li) return;
    const open = !li.classList.contains('open');
    li.classList.toggle('open', open);
    b.setAttribute('aria-expanded', String(open));
  }),
);

/* ---------- map ---------- */
const map = $('#map');
function focusCity(code?: string) {
  $$('.m-lived').forEach((g) => g.classList.toggle('focus', (g as HTMLElement).dataset.code === code));
  $$('.city').forEach((b) => b.classList.toggle('focus', b.dataset.code === code));
}
$$('.city').forEach((b) =>
  b.addEventListener('click', () => {
    focusCity(b.dataset.code);
    if (!map) return;
    const r = map.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) map.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }),
);
$$<SVGGElement>('.m-lived').forEach((g) => {
  g.addEventListener('click', () => focusCity(g.dataset.code));
  g.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusCity(g.dataset.code); }
  });
});
const togNet = $('#togNet');
const togLived = $('#togLived');
togNet?.addEventListener('click', () => {
  const on = togNet.getAttribute('aria-pressed') !== 'true';
  togNet.setAttribute('aria-pressed', String(on));
  map?.classList.toggle('show-net', on);
});
togLived?.addEventListener('click', () => {
  const on = togLived.getAttribute('aria-pressed') !== 'true';
  togLived.setAttribute('aria-pressed', String(on));
  const g = $<SVGGElement>('#livedMarks');
  if (g) g.style.opacity = on ? '1' : '.15';
});

/* ---------- copy buttons ---------- */
$$<HTMLButtonElement>('[data-copy]').forEach((b) =>
  b.addEventListener('click', async () => {
    const value = b.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(value);
      b.textContent = 'Copied';
      toast('Copied to clipboard');
      window.setTimeout(() => (b.textContent = 'Copy'), 1800);
    } catch {
      const dd = b.parentElement?.querySelector('dd');
      if (dd) {
        const range = document.createRange();
        range.selectNodeContents(dd);
        const sel = getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      toast('Selected. Press Ctrl+C or ⌘C to copy.');
    }
  }),
);

/* ---------- scroll progress ---------- */
const bar = $('#progress');
let ticking = false;
function onScroll() {
  if (ticking || !bar) return;
  ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- active nav, reveals, counters ---------- */
const navLinks = $$<HTMLAnchorElement>('#navLinks a');
if ('IntersectionObserver' in window) {
  const secObs = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('on', a.dataset.sec === en.target.id));
    }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  $$('main section[id], #contact').forEach((s) => secObs.observe(s));

  const count = (el: HTMLElement) => {
    const end = Number(el.dataset.count), pre = el.dataset.prefix ?? '', suf = el.dataset.suffix ?? '';
    if (!Number.isFinite(end)) return;
    const t0 = performance.now(), dur = 1300;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + Math.round(end * e) + (k === 1 ? suf : '');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const inView = (el: Element) => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
  const revObs = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target as HTMLElement;
      el.classList.add('in');
      revObs.unobserve(el);
      if (!reduced) {
        const nums = $$<HTMLElement>('[data-count]', el);
        if (el.matches('[data-count]')) nums.push(el);
        nums.forEach(count);
      }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  $$('.rv, .lang-card, #stats').forEach((el) => (inView(el) ? el.classList.add('in') : revObs.observe(el)));
} else {
  $$('.rv, .lang-card').forEach((el) => el.classList.add('in'));
}
