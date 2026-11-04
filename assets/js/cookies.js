(function () {
  var KEY = 'og-cookie-consent';
  // GA4 measurement ID
  var GA_ID = 'G-0JPN3FLJMF';
  var gaLoaded = false;
  var banner = null;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function gaReady() {
    return GA_ID && GA_ID.indexOf('REPLACE') !== 0;
  }

  function loadGA() {
    if (gaLoaded || !gaReady()) return;
    gaLoaded = true;
    window['ga-disable-' + GA_ID] = false;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function hide() {
    if (!banner) return;
    var el = banner;
    banner = null;
    el.classList.remove('is-in');
    setTimeout(function () { el.remove(); }, 400);
  }

  function choose(value) {
    save(value);
    if (value === 'accept') loadGA();
    else if (gaReady()) window['ga-disable-' + GA_ID] = true;
    hide();
  }

  function show() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p class="cookie-banner__text"> We use cookies to improve your experience on our site. By using our site, you consent to cookies. ' +
      '<a href="/privacy">Privacy policy</a></p>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="cookie-banner__btn" data-consent="accept">Accept</button>' +
        '<button type="button" class="cookie-banner__btn" data-consent="reject">Decline</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (btn) choose(btn.getAttribute('data-consent'));
    });
    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (banner) banner.classList.add('is-in'); });
    });
  }

  window.ogCookiePreferences = show;
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-preferences]')) show();
  });

  var stored = read();
  if (stored === 'accept') loadGA();
  else if (stored !== 'reject') show();
})();
