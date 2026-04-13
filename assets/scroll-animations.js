/* ============================================
   SCROLL ANIMATIONS - Main JS Controller
   ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Set ScrollTrigger defaults
ScrollTrigger.defaults({ markers: false });

/* --- Animation Init Functions --- */

function initHeroAnimation() {
  console.log('[ScrollAnim] initHeroAnimation loaded');

  const banner = document.querySelector('.rf-hero__banner');
  const headline = document.querySelector('.rf-hero__headline');
  const subtext = document.querySelector('.rf-hero__subtext');

  if (!headline) return;

  // Red banner fade in
  if (banner) {
    gsap.to(banner, {
      opacity: 1,
      duration: 0.5,
      delay: 0,
      ease: 'power2.out'
    });
  }

  // Headline entrance
  gsap.to(headline, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.1,
    delay: 0.1,
    ease: 'power3.out'
  });

  // Paragraph entrance
  if (subtext) {
    gsap.to(subtext, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.55,
      ease: 'power2.out'
    });
  }
}

function initStatsCounters() {
  console.log('[ScrollAnim] initStatsCounters loaded');

  const grid = document.querySelector('.rf-stats__grid');
  if (!grid) return;

  const valueEls = grid.querySelectorAll('.rf-stats__value');

  // Slide-up the entire grid
  gsap.to(grid, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: grid,
      start: 'top 70%',
      once: true
    }
  });

  // Count-up each number with stagger
  valueEls.forEach(function (el, i) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2,
      delay: i * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 70%',
        once: true
      },
      onUpdate: function () {
        el.textContent = Math.round(obj.val);
      }
    });
  });
}

function initVideoExpand() {
  console.log('[ScrollAnim] initVideoExpand loaded');

  var wrapper = document.querySelector('.video-expand__wrapper');
  if (!wrapper) return;

  // Skip animation on mobile — show static layout instead
  if (window.innerWidth < 768) return;

  var section = document.querySelector('.video-expand-section');
  var startWidth = getComputedStyle(section).getPropertyValue('--start-w').trim() || '80vw';

  gsap.fromTo(wrapper,
    { width: startWidth, borderRadius: 'var(--start-r, 16px)' },
    {
      width: '100vw',
      borderRadius: '0px',
      ease: 'none',
      scrollTrigger: {
        trigger: '.video-expand-section',
        start: 'top bottom-=100',
        end: 'top 25%',
        scrub: 1
      }
    }
  );
}

function initTextReveal() {
  console.log('[ScrollAnim] initTextReveal loaded');
}

function initPyramidSection() {
  console.log('[ScrollAnim] initPyramidSection loaded');
}

function initWinningSection() {
  console.log('[ScrollAnim] initWinningSection loaded');
}

/* --- Bootstrap all animations on DOM ready --- */

document.addEventListener('DOMContentLoaded', function () {
  console.log('[ScrollAnim] Initializing all scroll animations...');

  initHeroAnimation();
  initVideoExpand();
  initStatsCounters();
  initTextReveal();
  initPyramidSection();
  initWinningSection();

  console.log('[ScrollAnim] All animations initialized.');
});
