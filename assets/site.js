/* BloxCEO shared page behaviour: in-app browser notice, $/£ switch,
   sticky purchase bar and the bonus idea randomiser demo. */
(function(){
  var wv=document.getElementById('wv');
  if(wv&&/Instagram|FBAN|FBAV|TikTok|Snapchat|Twitter|musical_ly/i.test(navigator.userAgent)){
    var a=wv.querySelector('a');
    if(a)a.href='x-safari-'+location.href;
    wv.classList.add('on');
  }

  var KEY='cur';
  var links=document.querySelectorAll('.curlink');
  function set(c){
    document.body.setAttribute('data-cur',c);
    document.querySelectorAll('[data-us]').forEach(function(el){el.textContent=c==='uk'?el.getAttribute('data-uk'):el.getAttribute('data-us');});
    links.forEach(function(l){l.textContent=c==='uk'?'Need it in $? Switch here':'Need it in £? Switch here';});
    try{localStorage.setItem(KEY,c)}catch(e){}
  }
  var saved=null;try{saved=localStorage.getItem(KEY)}catch(e){}
  set(saved==='uk'?'uk':'us');
  links.forEach(function(l){l.addEventListener('click',function(e){e.preventDefault();set(document.body.getAttribute('data-cur')==='uk'?'us':'uk');});});

  /* sticky bar appears once the hero CTA has scrolled away */
  var first=document.querySelector('.hero .btn-big'),st=document.querySelector('.sticky');
  if(first&&st&&'IntersectionObserver' in window){
    new IntersectionObserver(function(en){en.forEach(function(x){st.classList.toggle('show',!x.isIntersecting&&x.boundingClientRect.top<0);});},{threshold:0}).observe(first);
  }

  /* bonus preview: a taste of the Markdown game idea randomiser */
  var md=document.getElementById('idea');
  if(md){
    var P={
      genre:['Obby','Tycoon','Simulator','Tower defence','Survival','Racing','Pet collector','Escape room','Horror story','Fighting arena'],
      setting:['a neon city at night','a floating sky island','a haunted school','an underwater base','a candy factory','a volcano kingdom','a space station','a jungle temple'],
      hook:['the map changes every round','players team up to unlock new zones','every death makes you stronger','you build your base from loot','a boss chases everyone each minute','players vote on the next level'],
      money:['Game pass for a 2x coin boost','Cosmetic trails and skins','Developer product to skip a stage','VIP area game pass','Limited-time pet eggs']
    };
    var btn=document.getElementById('shuffle');
    var pick=function(a){return a[Math.floor(Math.random()*a.length)];};
    btn&&btn.addEventListener('click',function(){
      Object.keys(P).forEach(function(k){
        var dd=md.querySelector('[data-k="'+k+'"]');
        if(!dd)return;
        dd.classList.add('swap');
        setTimeout(function(){dd.textContent=pick(P[k]);dd.classList.remove('swap');},180);
      });
    });
  }
})();
