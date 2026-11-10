/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .about-card, .project-card, .tech-pill').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActive();
});

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

function updateActive() {
  const y = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
  });
}

/* ===== TYPEWRITER ===== */
const roles = ['Développeur Web 💻', 'Développeur Mobile 📱', 'Laravel · React · Flutter ⚡', 'Admin Réseau 🌐'];
let ri = 0, ci = 0, del = false;
const tw = document.getElementById('typewriter');

function type() {
  const w = roles[ri];
  tw.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
  if (!del && ci === w.length)  { del = true; setTimeout(type, 2000); return; }
  if (del && ci === 0)          { del = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, del ? 55 : 90);
}
type();

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('revealed');
    // Skill bars
    e.target.querySelectorAll('.skill-bar').forEach(b => { b.style.width = b.dataset.width + '%'; });
    // Counters
    e.target.querySelectorAll('.stat-num[data-target]').forEach(n => {
      const target = +n.dataset.target;
      let cur = 0;
      const tick = setInterval(() => {
        cur = Math.min(cur + 1, target);
        n.textContent = cur;
        if (cur >= target) clearInterval(tick);
      }, 60);
    });
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.08}s`;
  revealObs.observe(el);
});

// ===== Formulaire de contact : envoi via Formspree =====
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    // Empêche le rechargement/la redirection par défaut du navigateur
    e.preventDefault();

    const button = form.querySelector('.btn-submit');
    const originalHTML = button.innerHTML;   // on garde le contenu pour le remettre après

    // État "envoi en cours" : on bloque le bouton pour éviter les doubles clics
    button.disabled = true;
    button.textContent = 'Envoi en cours...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      // FormData lit automatiquement tous les champs qui ont un attribut name
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        // Demande à Formspree de répondre en JSON (au lieu d'une page HTML)
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent = '✅ Message envoyé ! Je vous répondrai très vite.';
        statusEl.classList.add('success');
        form.reset();                         // vide le formulaire
      } else {
        // Le serveur a répondu avec une erreur (formulaire mal configuré, limite atteinte...)
        throw new Error('Réponse du serveur : ' + response.status);
      }
    } catch (error) {
      // Erreur réseau ou erreur du serveur
      console.error(error);
      statusEl.textContent = '❌ Échec de l\'envoi. Réessayez ou contactez-moi sur WhatsApp.';
      statusEl.classList.add('error');
    } finally {
      // Dans tous les cas, on remet le bouton dans son état normal
      button.disabled = false;
      button.innerHTML = originalHTML;
    }
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});