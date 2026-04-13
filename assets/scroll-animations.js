/* ============================================
   SCROLL ANIMATIONS - Main JS Controller
   ============================================ */

// Register GSAP plugins FIRST
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ markers: false });

// Initialize Lenis smooth scroll
var lenis = new Lenis({
  duration: 1.2,
  easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
  smoothWheel: true,
  touchMultiplier: 1.5
});

// Connect Lenis to GSAP ScrollTrigger (must be after plugin registration)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (time) {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

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

  var section = document.querySelector('.rf-stats');
  if (!section) return;

  var bars = section.querySelectorAll('.rf-stats__bar');
  var valueEls = section.querySelectorAll('.rf-stats__value');

  // Collect all target values to rank them
  var targets = [];
  bars.forEach(function (bar) {
    targets.push(parseInt(bar.getAttribute('data-bar-target'), 10) || 0);
  });
  // Set bar opacity based on rank: highest = full, others dimmer
  var sorted = targets.slice().sort(function (a, b) { return b - a; });
  bars.forEach(function (bar, i) {
    var val = targets[i];
    var rank = sorted.indexOf(val);
    var opacityMap = [1, 0.7, 0.45];
    bar.style.backgroundColor = 'rgba(204, 0, 0, ' + (opacityMap[rank] || 0.45) + ')';
  });

  // Animate: count numbers + grow bar heights
  valueEls.forEach(function (el, i) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var obj = { val: 0 };
    var item = el.closest('.rf-stats__item');
    var bar = item ? item.querySelector('.rf-stats__bar') : null;
    // Max bar height 300px, scale proportionally
    var maxBarHeight = 300;
    var barHeight = (target / 100) * maxBarHeight;

    gsap.to(obj, {
      val: target,
      duration: 2,
      delay: i * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true
      },
      onUpdate: function () {
        var current = Math.round(obj.val);
        el.textContent = current;
        if (bar) {
          bar.style.height = Math.round((current / target) * barHeight) + 'px';
        }
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

  // Play button: click = fullscreen, double-click = exit
  var playBtn = document.querySelector('.video-expand__play-btn');
  if (playBtn) {
    var clickTimer = null;

    playBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        // Double click — exit fullscreen
        wrapper.classList.remove('is-fullscreen');
        document.body.style.overflow = '';
        var video = wrapper.querySelector('video');
        if (video) {
          video.muted = true;
          video.controls = false;
        }
      } else {
        clickTimer = setTimeout(function () {
          clickTimer = null;
          // Single click — enter fullscreen
          wrapper.classList.add('is-fullscreen');
          document.body.style.overflow = 'hidden';
          var video = wrapper.querySelector('video');
          if (video) {
            video.muted = false;
            video.controls = true;
          }
        }, 250);
      }
    });
  }

  gsap.fromTo(wrapper,
    { width: startWidth, borderRadius: 'var(--start-r, 24px)' },
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

function initBrokenSystem() {
  console.log('[ScrollAnim] initBrokenSystem loaded');

  var section = document.querySelector('.rf-broken');
  if (!section) return;

  var left = section.querySelector('.rf-broken__left');
  var right = section.querySelector('.rf-broken__right');
  var headline = section.querySelector('.rf-broken__headline');

  // Split headline into words and wrap each in a span
  if (headline) {
    var text = headline.textContent.trim();
    headline.innerHTML = text.split(/\s+/).map(function (word) {
      return '<span class="word">' + word + '</span>';
    }).join(' ');
  }

  // Left column slide in
  if (left) {
    gsap.to(left, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true
      }
    });
  }

  // Word-by-word stagger on headline
  var words = section.querySelectorAll('.rf-broken__headline .word');
  if (words.length) {
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true
      }
    });
  }

  // Right column slide in
  if (right) {
    gsap.to(right, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true
      }
    });
  }
}

function initFoodPyramid() {
  console.log('[ScrollAnim] initFoodPyramid loaded');

  var section = document.querySelector('.rf-pyramid');
  if (!section) return;

  var panels = section.querySelectorAll('.rf-pyramid__panel');
  var dots = section.querySelectorAll('.rf-pyramid__dot');
  if (panels.length < 2) return;

  // Skip pinned animation on mobile
  if (window.innerWidth < 750) {
    // Just reveal everything statically on mobile
    panels.forEach(function (panel) {
      panel.style.opacity = 1;
      panel.style.position = 'relative';
      var text = panel.querySelector('.rf-pyramid__panel-text');
      if (text) { text.style.opacity = 1; text.style.transform = 'none'; }
      var imgs = panel.querySelectorAll('.rf-pyramid__img');
      imgs.forEach(function (img) { img.style.opacity = 1; });
    });
    return;
  }

  // Set section height for scroll distance
  var totalPanels = panels.length;
  section.style.height = (totalPanels * 100) + 'vh';

  // Pin the panels container
  ScrollTrigger.create({
    trigger: '.rf-pyramid__panels',
    start: 'top top',
    end: function () { return '+=' + ((totalPanels - 1) * window.innerHeight); },
    pin: true,
    pinSpacing: false
  });

  // Animate each panel transition
  panels.forEach(function (panel, index) {
    var text = panel.querySelector('.rf-pyramid__panel-text');
    var imgs = panel.querySelectorAll('.rf-pyramid__img');

    if (index === 0) {
      // First panel: animate in on load
      gsap.to(panel, { opacity: 1, duration: 0.5 });
      if (text) {
        gsap.to(text, {
          opacity: 1, x: 0, duration: 0.9, delay: 0.2, ease: 'power3.out'
        });
      }
      imgs.forEach(function (img, j) {
        gsap.fromTo(img,
          {
            opacity: 0,
            x: (Math.random() - 0.5) * 120,
            y: (Math.random() - 0.5) * 120,
            rotation: (Math.random() - 0.5) * 16
          },
          {
            opacity: 1, x: 0, y: 0, rotation: 0,
            duration: 0.8, delay: 0.3 + j * 0.05, ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true
            }
          }
        );
      });
    } else {
      // Subsequent panels: crossfade on scroll
      var startScroll = (index - 0.5) / totalPanels;
      var endScroll = index / totalPanels;

      // Fade out previous panel
      gsap.to(panels[index - 1], {
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: section,
          start: function () { return (startScroll * 100) + '% top'; },
          end: function () { return (endScroll * 100) + '% top'; },
          scrub: 1,
          onEnter: function () {
            dots.forEach(function (d, di) {
              d.classList.toggle('is-active', di === index);
            });
          },
          onLeaveBack: function () {
            dots.forEach(function (d, di) {
              d.classList.toggle('is-active', di === index - 1);
            });
          }
        }
      });

      // Fade in current panel
      gsap.fromTo(panel,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: function () { return (startScroll * 100) + '% top'; },
            end: function () { return (endScroll * 100) + '% top'; },
            scrub: 1
          }
        }
      );

      // Text slide in
      if (text) {
        gsap.fromTo(text,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: function () { return (endScroll * 100) + '% top'; },
              once: true
            }
          }
        );
      }

      // Food images scatter in
      imgs.forEach(function (img, j) {
        gsap.fromTo(img,
          {
            opacity: 0,
            x: (Math.random() - 0.5) * 120,
            y: (Math.random() - 0.5) * 120,
            rotation: (Math.random() - 0.5) * 16
          },
          {
            opacity: 1, x: 0, y: 0, rotation: 0,
            duration: 0.8, delay: j * 0.05, ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: function () { return (endScroll * 100) + '% top'; },
              once: true
            }
          }
        );
      });
    }
  });
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
  initBrokenSystem();
  initFoodPyramid();
  initWinningSection();

  console.log('[ScrollAnim] All animations initialized.');
});
