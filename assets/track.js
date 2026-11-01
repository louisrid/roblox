/* BloxCEO tracking: UTM persistence + Meta Pixel / analytics hooks.
   Loaded on every page, before site.js.

   META_PIXEL_ID: paste the Pixel ID here to load the Meta Pixel on every page.
   Left empty, nothing loads, and events still go to window.dataLayer so any
   tag manager added later picks them up. */
(function(){
  var META_PIXEL_ID = '';

  var KEYS=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ttclid'];
  var STORE='bx_attr';
  var w=window;
  w.dataLayer=w.dataLayer||[];

  /* Meta Pixel base code, only when an ID is configured or a pixel already exists */
  if(META_PIXEL_ID&&!w.fbq){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(w,document,
    'script','https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init',META_PIXEL_ID);
  }
  if(w.fbq)w.fbq('track','PageView');

  /* Capture attribution params. New params on the URL replace the stored set. */
  var attr={};
  try{attr=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){}
  var q=new URLSearchParams(location.search),fresh={},hit=false;
  KEYS.forEach(function(k){var v=q.get(k);if(v){fresh[k]=v;hit=true;}});
  if(hit){attr=fresh;try{localStorage.setItem(STORE,JSON.stringify(attr))}catch(e){}}

  function withAttr(href){
    var u=new URL(href,location.href);
    if(u.origin!==location.origin)return href;
    Object.keys(attr).forEach(function(k){if(!u.searchParams.has(k))u.searchParams.set(k,attr[k]);});
    return u.pathname+u.search+u.hash;
  }
  w.bxTrack=function(name,params,metaStd){
    params=params||{};
    w.dataLayer.push(Object.assign({event:name},attr,params));
    if(w.fbq)w.fbq(metaStd===false?'trackCustom':'track',name,params);
  };
  w.bxAttr=attr;

  document.addEventListener('DOMContentLoaded',function(){
    /* Carry UTMs through the funnel: every link into checkout / pay / thanks */
    if(Object.keys(attr).length){
      document.querySelectorAll('a[href^="/checkout"],a[href^="/pay"],a[href^="/thanks"],a[href^="/"][href*="#"]').forEach(function(a){a.setAttribute('href',withAttr(a.getAttribute('href')));});
      document.querySelectorAll('form[action^="/"]').forEach(function(f){
        Object.keys(attr).forEach(function(k){var i=document.createElement('input');i.type='hidden';i.name=k;i.value=attr[k];f.appendChild(i);});
      });
    }

    var cur=function(){return document.body.getAttribute('data-cur')==='uk'?'GBP':'USD';};
    var val=function(){return cur()==='GBP'?30:40;};
    var page=document.body.getAttribute('data-page');
    var once=function(k){try{if(sessionStorage.getItem(k))return false;sessionStorage.setItem(k,1)}catch(e){}return true;};
    var product={content_name:'BloxCEO course',content_type:'product',content_ids:['bloxceo-course']};

    if(page==='checkout')w.bxTrack('ViewContent',Object.assign({value:val(),currency:cur()},product));
    if(page==='pay')w.bxTrack('InitiateCheckout',Object.assign({value:val(),currency:cur(),num_items:1},product));
    if(page==='thanks'&&once('bx_purchase'))w.bxTrack('Purchase',Object.assign({value:val(),currency:cur()},product));

    /* CTA clicks (custom event, so it doesn't distort Meta's standard funnel) */
    document.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('[data-cta]');
      if(a)w.bxTrack('CTAClick',{cta:a.getAttribute('data-cta'),page:page||'other'},false);
      var x=e.target.closest&&e.target.closest('.xbtn');
      if(x)w.bxTrack('AddPaymentInfo',Object.assign({value:val(),currency:cur(),method:x.textContent.trim()},product));
    });
    var form=document.querySelector('form.card');
    if(form)form.addEventListener('submit',function(){w.bxTrack('AddPaymentInfo',Object.assign({value:val(),currency:cur(),method:'card'},product));});
  });
})();
