(() => {
 'use strict';
 const config = window.CEOBLOX_CONFIG || {checkoutUrl:'',previewOnly:true};
 const attributionKeys = /^(utm_[a-z_]+|fbclid|gclid|ttclid)$/i;
 const current = new URLSearchParams(window.location.search);
 function appendAttribution(url) {
   for (const [key,value] of current.entries()) {
     if (attributionKeys.test(key) && !url.searchParams.has(key)) url.searchParams.set(key,value);
   }
   return url;
 }
 // Preserve incoming campaign attribution from home to join and on to checkout.
 document.querySelectorAll('a[data-preserve-attribution]').forEach(link => {
   try {const dest=appendAttribution(new URL(link.href,location.href));
     if(dest.origin===location.origin) link.href=dest.pathname+dest.search+dest.hash;
   } catch(e) {}
 });
 const checkout=document.getElementById('checkout-cta');
 if(checkout){
   let url=null;
   if(config.previewOnly===false && typeof config.checkoutUrl==='string' && config.checkoutUrl.trim()){
     try {const candidate=new URL(config.checkoutUrl);
       if(candidate.protocol==='https:') url=appendAttribution(candidate);
     } catch(e) {}
   }
   if(url){
     checkout.disabled=false;
     checkout.textContent='GET ACCESS FOR $40';
     checkout.addEventListener('click', () => {
       if(typeof window.fbq==='function')window.fbq('track','InitiateCheckout');
       location.assign(url.href);
     });
     const status=document.getElementById('checkout-status');
     if(status)status.textContent='ONE PAYMENT. NO SUBSCRIPTION.';
   }else{
     checkout.disabled=true;
     checkout.textContent='CHECKOUT OPENING SOON';
     const status=document.getElementById('checkout-status');
     if(status)status.textContent='PAYMENTS ARE NOT AVAILABLE YET. NO CHARGE WILL BE MADE.';
   }
 }
 const float=document.getElementById('mobile-cta');
 const hero=document.querySelector('.hero');
 const offer=document.getElementById('course-cta');
 if(float && hero && offer){
   let ticking=false;
   function update(){
     const past=hero.getBoundingClientRect().bottom<0;
     const nearOffer=offer.getBoundingClientRect().top<innerHeight;
     float.classList.toggle('is-shown',past&&!nearOffer);
     ticking=false;
   }
   addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
   addEventListener('resize',update,{passive:true});update();
 }
 const faqs=[...document.querySelectorAll('.faq details')];
 for(const item of faqs){item.addEventListener('toggle',()=>{if(item.open)for(const other of faqs)if(other!==item)other.open=false;});}
})();
