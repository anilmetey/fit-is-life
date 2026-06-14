/* js/app.js */
'use strict';

// 1. CURSOR GLOW
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

// 2. NAVBAR SCROLL & BURGER
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const burger = document.getElementById('navBurger');
const navLinks = document.querySelector('.navbar__links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// 3. HERO PARTICLES
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 20;
      this.size = 0.5 + Math.random() * 2;
      this.speedY = -(0.4 + Math.random() * 1.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.life = 0;
      this.maxLife = 150 + Math.random() * 200;
      const r = Math.random();
      this.color = r > 0.6 ? '200,255,0' : (r > 0.3 ? '255,85,0' : '255,255,255');
    }
    update() {
      this.life++;
      this.x += this.speedX + Math.sin(this.life * 0.015) * 0.2;
      this.y += this.speedY;
      if (this.life >= this.maxLife || this.y < -20) this.reset();
    }
    draw() {
      const t = this.life / this.maxLife;
      const alpha = t < 0.2 ? (t/0.2) * 0.4 : t > 0.8 ? ((1-t)/0.2) * 0.4 : 0.4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${alpha})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 100; i++) particles.push(new Particle());
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// 4. HERO TITLE WORD REVEAL + SCRAMBLE
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
function scrambleText(el, finalText, duration = 800) {
  let frame = 0;
  const totalFrames = Math.round(duration / 16);
  const orig = finalText.toUpperCase();
  const id = setInterval(() => {
    const progress = frame / totalFrames;
    let result = '';
    for (let i = 0; i < orig.length; i++) {
      if (orig[i] === ' ') { result += ' '; continue; }
      if (i / orig.length < progress * 1.2) result += orig[i];
      else result += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = result;
    frame++;
    if (frame >= totalFrames) { el.textContent = orig; clearInterval(id); }
  }, 16);
}

setTimeout(() => {
  document.querySelectorAll('.hero__word').forEach((word, i) => {
    setTimeout(() => {
      word.classList.add('revealed');
      scrambleText(word, word.getAttribute('data-text') || word.textContent, 600);
    }, i * 150 + 100);
  });
}, 300);

// 5. CIRCULAR TEXT PARALLAX
const circle = document.getElementById('heroCircle');
if (circle) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    circle.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// 6. REVEAL OBSERVER
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
  if (el.closest('.hero')) {
    el.classList.add('visible');
  } else {
    observer.observe(el);
  }
});

// 7. 3D CARD TILT
document.querySelectorAll('.class-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

// 8. MAGNETIC BUTTONS
document.querySelectorAll('.btn--magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });
});

// 9. PARALLAX
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
});

// 10. CLASS FILTER
const filterTabs = document.querySelectorAll('.filter-tab');
const classCards = document.querySelectorAll('.class-card');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    classCards.forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.style.display = 'flex';
        setTimeout(() => card.style.opacity = '1', 10);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  });
});

// 11. LIVE TIMER
const timerBtn = document.getElementById('timerPlayPause');
if (timerBtn) {
  let isRunning = false, timeElapsed = 0, currentRound = 1, totalRounds = 8;
  let timerInterval;
  const timerNum = document.getElementById('timerNum');
  const timerPhase = document.getElementById('timerPhase');
  const ringFill = document.getElementById('timerRingFill');
  const timerSection = document.getElementById('timer');
  const iconPlay = timerBtn.querySelector('.icon-play');
  const iconPause = timerBtn.querySelector('.icon-pause');
  
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function beep(freq, duration) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  let phase = 'work'; // work, rest
  let timeLeft = 30; // seconds
  const workTime = 30, restTime = 10;
  
  function updateDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timerNum.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    
    const total = phase === 'work' ? workTime : restTime;
    const progress = timeLeft / total;
    const offset = 678.58 * (1 - progress);
    if(ringFill) ringFill.style.strokeDashoffset = offset;
    
    document.getElementById('timerRound').textContent = `${currentRound}/${totalRounds}`;
    document.getElementById('timerElapsed').textContent = `${Math.floor(timeElapsed/60)}:${(timeElapsed%60).toString().padStart(2,'0')}`;
    document.getElementById('timerKcal').textContent = Math.floor(timeElapsed * 0.25);
  }
  
  function tick() {
    timeElapsed++;
    timeLeft--;
    if(timeLeft <= 3 && timeLeft > 0) beep(600, 0.2);
    if(timeLeft === 0) {
      beep(1000, 0.5);
      if(phase === 'work') {
        phase = 'rest';
        timeLeft = restTime;
        timerPhase.textContent = 'DİNLENME';
        timerSection.classList.remove('work-mode');
        timerSection.classList.add('rest-mode');
      } else {
        phase = 'work';
        timeLeft = workTime;
        currentRound++;
        timerPhase.textContent = 'ÇALIŞMA';
        timerSection.classList.remove('rest-mode');
        timerSection.classList.add('work-mode');
        if(currentRound > totalRounds) {
          clearInterval(timerInterval);
          timerPhase.textContent = 'BİTTİ';
          isRunning = false;
        }
      }
    }
    updateDisplay();
  }

  timerBtn.addEventListener('click', () => {
    if(isRunning) {
      clearInterval(timerInterval);
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    } else {
      timerSection.classList.add(phase === 'work' ? 'work-mode' : 'rest-mode');
      timerInterval = setInterval(tick, 1000);
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    }
    isRunning = !isRunning;
  });

  document.querySelectorAll('.workout-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.workout-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Space to toggle
  window.addEventListener('keydown', e => {
    if(e.code === 'Space' && timerSection.getBoundingClientRect().top < window.innerHeight) {
      e.preventDefault();
      timerBtn.click();
    }
  });
}

// 12. DYNAMIC SCHEDULE TABS
const scheduleData = {
  'pzt': [
    { time: '07:00', name: 'Spinning', instructor: 'Berk Koçak', img: 'berk.jpg', level: 'Orta', type: 'Kardiyo' },
    { time: '18:00', name: 'Vücut Geliştirme', instructor: 'Can Aydın', img: 'can.jpg', level: 'İleri', type: 'Güç' },
    { time: '19:30', name: 'Zumba', instructor: 'Elif Sarıkaya', img: 'elif.jpg', level: 'Tüm Seviyeler', type: 'Dans' }
  ],
  'sal': [
    { time: '08:00', name: 'Pilates', instructor: 'Berk Koçak', img: 'berk.jpg', level: 'Orta', type: 'Zihin & Vücut' },
    { time: '18:30', name: 'HIIT', instructor: 'Melike Arslan', img: 'melike.jpg', level: 'İleri', type: 'Kardiyo / Güç' }
  ],
  'car': [
    { time: '07:00', name: 'Yoga', instructor: 'Elif Sarıkaya', img: 'elif.jpg', level: 'Tüm Seviyeler', type: 'Zihin & Vücut' },
    { time: '12:00', name: 'Spinning', instructor: 'Melike Arslan', img: 'melike.jpg', level: 'İleri', type: 'Kardiyo' },
    { time: '19:00', name: 'Vücut Geliştirme', instructor: 'Can Aydın', img: 'can.jpg', level: 'Tüm Seviyeler', type: 'Güç' }
  ],
  'per': [
    { time: '09:00', name: 'Pilates', instructor: 'Berk Koçak', img: 'berk.jpg', level: 'Başlangıç', type: 'Zihin & Vücut' },
    { time: '18:00', name: 'HIIT', instructor: 'Melike Arslan', img: 'melike.jpg', level: 'İleri', type: 'Kardiyo / Güç' },
    { time: '20:00', name: 'Zumba', instructor: 'Elif Sarıkaya', img: 'elif.jpg', level: 'Tüm Seviyeler', type: 'Dans' }
  ],
  'cum': [
    { time: '07:00', name: 'Spinning', instructor: 'Berk Koçak', img: 'berk.jpg', level: 'İleri', type: 'Kardiyo' },
    { time: '19:00', name: 'Vücut Geliştirme', instructor: 'Can Aydın', img: 'can.jpg', level: 'İleri', type: 'Güç' }
  ],
  'cmt': [
    { time: '10:00', name: 'Yoga', instructor: 'Elif Sarıkaya', img: 'elif.jpg', level: 'Tüm Seviyeler', type: 'Zihin & Vücut' },
    { time: '12:00', name: 'HIIT', instructor: 'Melike Arslan', img: 'melike.jpg', level: 'Orta', type: 'Kardiyo / Güç' }
  ],
  'paz': [
    { time: '11:00', name: 'Pilates', instructor: 'Berk Koçak', img: 'berk.jpg', level: 'Tüm Seviyeler', type: 'Zihin & Vücut' },
    { time: '14:00', name: 'Serbest Ağırlık', instructor: 'Can Aydın', img: 'can.jpg', level: 'İleri', type: 'Güç' }
  ]
};

const scheduleGrid = document.getElementById('scheduleGrid');

function renderSchedule(day) {
  if (!scheduleGrid) return;
  scheduleGrid.innerHTML = '';
  const slots = scheduleData[day] || scheduleData['pzt'];
  
  slots.forEach((slot, index) => {
    const slotEl = document.createElement('div');
    slotEl.className = 'schedule-slot';
    slotEl.style.transitionDelay = `${index * 100}ms`;
    slotEl.innerHTML = `
      <div class="slot-time">${slot.time}</div>
      <div class="slot-info">
        <strong>${slot.name}</strong>
        <span>${slot.type} • ${slot.level}</span>
      </div>
      <div class="slot-instructor">
        <div class="instructor-avatar">
          <img src="img/${slot.img}" alt="${slot.instructor}">
        </div>
        <span>${slot.instructor}</span>
      </div>
      <div class="slot-action">
        <button class="btn btn--outline">Katıl</button>
      </div>
    `;
    scheduleGrid.appendChild(slotEl);
    
    // Trigger animation
    requestAnimationFrame(() => {
      setTimeout(() => slotEl.classList.add('in-view'), 50);
    });
  });
}

const dayTabs = document.querySelectorAll('.day-tab');
dayTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    dayTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderSchedule(tab.dataset.day);
  });
});

// Init Schedule
if (dayTabs.length > 0) {
  renderSchedule('pzt');
}

// 13. SECTION TITLE FLICKER
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      const em = entry.target.querySelector('.flicker-em');
      if(em) {
        let flickers = 0;
        const flick = setInterval(() => {
          em.style.opacity = flickers % 2 === 0 ? '0' : '1';
          flickers++;
          if (flickers >= 6) { clearInterval(flick); em.style.opacity = '1'; }
        }, 80);
      }
      titleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section-header').forEach(h => titleObserver.observe(h));

// 14. SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const t = document.querySelector(link.getAttribute('href'));
    if(t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});


console.log('%c🔥 FIT IS LIFE — Her Gün Seçimini Yapıyorsun', 'background:#C8FF00;color:#080808;font-size:14px;padding:8px 18px;font-weight:900;font-family:monospace;letter-spacing:2px;');
