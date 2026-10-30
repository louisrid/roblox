(() => {
  'use strict';
  const key = 'howtoblox-currency';
  const storageGet = () => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const storageSet = v => { try { localStorage.setItem(key, v); } catch (_) {} };
  const currencyGuess = /^en-GB$/i.test(navigator.language || '') ? 'GBP' : 'USD';
  let currency = storageGet() === 'GBP' ? 'GBP' : storageGet() === 'USD' ? 'USD' : currencyGuess;
  const config = window.HOWTOBLOX_CONFIG || {};
  const validUrl = url => {
    if (typeof url !== 'string' || !url.trim()) return false;
    try { return new URL(url).protocol === 'https:'; } catch (_) { return false; }
  };
  function update() {
    document.documentElement.dataset.currency = currency;
    document.querySelectorAll('[data-price]').forEach(el => { el.textContent = currency === 'GBP' ? '£30' : '$40'; });
    document.querySelectorAll('[data-currency-toggle]').forEach(btn => { btn.textContent = currency === 'GBP' ? 'Show price in USD ($)' : 'Show price in GBP (£)'; });
    const paymentUrl = currency === 'GBP' ? config.gbpPaymentUrl : config.usdPaymentUrl;
    document.querySelectorAll('[data-payment-link]').forEach(link => {
      if (validUrl(paymentUrl)) { link.href = paymentUrl; link.hidden = false; link.rel = 'noopener noreferrer'; }
      else { link.removeAttribute('href'); link.hidden = true; }
    });
    document.querySelectorAll('[data-payment-unconfigured]').forEach(el => { el.hidden = validUrl(paymentUrl); });
  }
  document.querySelectorAll('[data-currency-toggle]').forEach(btn => btn.addEventListener('click', () => {currency = currency === 'GBP' ? 'USD' : 'GBP'; storageSet(currency); update();}));
  update();
  const sticky = document.getElementById('sticky-cta');
  const heroAction = document.querySelector('.hero-actions');
  if (sticky && heroAction && 'IntersectionObserver' in window) {
    const ob = new IntersectionObserver(entries => { sticky.classList.toggle('is-visible', !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0); }, { threshold: 0 });
    ob.observe(heroAction);
  }
  document.querySelectorAll('.faq-items details').forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-items details').forEach(other => { if (other !== detail) other.open = false; });
  }));
})();
