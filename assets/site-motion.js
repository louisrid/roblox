(function () {
  var sections = document.querySelectorAll('main.phone > section:not(.hero)');
  if (!sections.length || !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('motion-ready');
  sections.forEach(function (section) { section.classList.add('motion-reveal'); });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:0, rootMargin:'0px 0px -8% 0px' });
  sections.forEach(function (section) { observer.observe(section); });
})();
