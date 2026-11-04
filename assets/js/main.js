(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(max-width: 860px)').addEventListener('change', function (e) {
    if (!e.matches) setOpen(false);
  });
})();

(function () {
  var els = document.querySelectorAll('[data-reveal="letters"]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  els.forEach(function (el) {
    var textNode = [].find.call(el.childNodes, function (n) {
      return n.nodeType === Node.TEXT_NODE && n.textContent.trim();
    });
    if (!textNode) return;

    var text = textNode.textContent.trim();
    var chars = text.split('');
    if (el.matches('a, button')) {
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
    } else {
      var copy = document.createElement('span');
      copy.className = 'sr-only';
      copy.textContent = text;
      el.appendChild(copy);
    }

    var mask = document.createElement('span');
    mask.className = 'reveal';
    mask.setAttribute('aria-hidden', 'true');
    chars.forEach(function (ch, i) {
      var span = document.createElement('span');
      span.textContent = ch;
      span.style.setProperty('--i', i);
      span.style.setProperty('--ri', chars.length - 1 - i);
      mask.appendChild(span);
    });
    el.style.setProperty('--n', chars.length);
    el.replaceChild(mask, textNode);
    el.classList.add('reveal-ready');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle('is-in', e.isIntersecting);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

(function () {
  var hero = document.querySelector('.hero');
  var frame = hero && hero.querySelector('.hero__frame');
  if (!frame) return;

  var BG_SPEED = 0.35;
  var SHARP_SPEED = 0.2;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var raf = 0;

  function set(name, px) {
    hero.style.setProperty(name, px.toFixed(2) + 'px');
  }

  function measure() {
    var h = hero.getBoundingClientRect();
    var f = frame.getBoundingClientRect();
    var b = parseFloat(getComputedStyle(frame).borderTopWidth) || 0;
    set('--hero-w', h.width);
    set('--hero-h', h.height);
    set('--fx', f.left - h.left + b);
    set('--fy', f.top - h.top + b);
  }

  function tick() {
    raf = 0;
    var on = !reduceMotion.matches && !document.documentElement.classList.contains('no-parallax');
    var s = on ? Math.min(Math.max(window.scrollY, 0), hero.offsetHeight) : 0;
    set('--bg-y', s * BG_SPEED);
    set('--sharp-y', s * SHARP_SPEED);
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', function () { measure(); kick(); });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(frame);

  measure();
  kick();
})();

(function () {
  var links = [].slice.call(document.querySelectorAll('.svc-progress a'));
  var fill = document.querySelector('.svc-progress__fill');
  if (!links.length || !fill) return;
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var raf = 0;

  function update() {
    raf = 0;
    var line = window.innerHeight * 0.4;
    var tops = targets.map(function (t) { return t.getBoundingClientRect().top; });

    var current = 0;
    tops.forEach(function (top, i) { if (top <= line) current = i; });

    var pos = current;
    if (current < tops.length - 1 && tops[current] <= line) {
      pos += Math.min(1, (line - tops[current]) / (tops[current + 1] - tops[current]));
    }
    fill.style.transform = 'scaleY(' + (pos / (tops.length - 1)).toFixed(4) + ')';

    links.forEach(function (a, i) {
      a.classList.toggle('is-done', i < current);
      a.classList.toggle('is-current', i === current);
      if (i === current) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
  }

  function kick() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  update();
})();
