(() => {
  'use strict';
  const cfg = window.CEOBLOX_CONFIG || { checkoutUrl:'', previewOnly:true };
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('scroll-progress-bar');
  const sticky = document.getElementById('mobile-cta');
  const dialog = document.getElementById('checkout-dialog');
  const closeButton = dialog?.querySelector('.dialog-close');
  const backButton = dialog?.querySelector('.dialog-done');
  let lastFocused = null;

  // Only a verified external checkout URL may allow a redirect.
  function verifiedCheckoutURL() {
    if (cfg.previewOnly || typeof cfg.checkoutUrl !== 'string') return null;
    try {
      const url = new URL(cfg.checkoutUrl);
      if (url.protocol !== 'https:') return null;
      // Preserve campaign attribution where the checkout provider accepts these fields.
      const current = new URLSearchParams(location.search);
      for (const [key, val] of current.entries()) {
        if (/^(utm_[a-z_]+|fbclid|gclid|ttclid)$/i.test(key) && !url.searchParams.has(key)) {
          url.searchParams.set(key, val);
        }
      }
      return url.href;
    } catch { return null; }
  }
  function closeDialog() {
    if (dialog?.open) dialog.close();
    document.body.classList.remove('modal-open');
    lastFocused?.focus({preventScroll:true});
  }
  for (const button of document.querySelectorAll('.buy-button')) {
    button.addEventListener('click', () => {
      const checkout = verifiedCheckoutURL();
      if (checkout) { window.location.assign(checkout); return; }
      lastFocused = document.activeElement;
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
        document.body.classList.add('modal-open');
        closeButton?.focus();
      }
    });
  }
  closeButton?.addEventListener('click',closeDialog);
  backButton?.addEventListener('click',closeDialog);
  dialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');});
  dialog?.addEventListener('click',(e)=>{if(e.target===dialog)closeDialog();});

  const heroButton = document.querySelector('.hero-actions .buy-button');
  const offerButton = document.querySelector('.offer-details .buy-button');
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = max>0 ? (window.scrollY/max*100).toFixed(2)+'%': '0%';
    // Show the mobile purchase shortcut between the first hero CTA and the final offer CTA.
    if (sticky && heroButton && offerButton) {
      const heroPassed = heroButton.getBoundingClientRect().bottom < 0;
      const offerReached = offerButton.getBoundingClientRect().top < window.innerHeight;
      sticky.classList.toggle('is-shown', heroPassed && !offerReached && !dialog?.open);
    }
  };
  let ticking = false;
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{update();ticking=false;});ticking=true;}},{passive:true});
  addEventListener('resize',update,{passive:true});
  update();

  const revealItems = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries)=>{
      for (const e of entries) if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}
    },{threshold:.1,rootMargin:'0px 0px -28px 0px'});
    revealItems.forEach(el=>observer.observe(el));
  } else {revealItems.forEach(el=>el.classList.add('is-visible'));}

  // Focused and low-cost pointer depth, disabled on touch and reduced-motion devices.
  if (!prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const visual=document.querySelector('.hero-visual');
    const img=document.querySelector('.hero-character');
    if(visual && img){
      let raf=0;
      visual.addEventListener('pointermove',(e)=>{
        if(raf) cancelAnimationFrame(raf);
        const r=visual.getBoundingClientRect();
        const dx=((e.clientX-r.left)/r.width-.5)*10;
        const dy=((e.clientY-r.top)/r.height-.5)*7;
        raf=requestAnimationFrame(()=>{img.style.setProperty('--tiltX',dx.toFixed(1)+'px');img.style.setProperty('--tiltY',dy.toFixed(1)+'px');});
      },{passive:true});
      visual.addEventListener('pointerleave',()=>{img.style.removeProperty('--tiltX');img.style.removeProperty('--tiltY');},{passive:true});
    }
  }

  // Keep FAQ concise by opening one answer at a time. Native details remain keyboard accessible.
  const faqs=[...document.querySelectorAll('.faq-item')];
  for (const current of faqs) {
    const summary = current.querySelector('summary');
    summary?.addEventListener('click', (event) => {
      event.preventDefault();
      const shouldOpen = !current.open;
      for (const item of faqs) item.open = false;
      current.open = shouldOpen;
    });
  }
})();
