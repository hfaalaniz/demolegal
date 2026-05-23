// ===== ÁREA HOVER — Qué hacemos =====
// SVG helper — returns a thin-line icon <use> reference
function svgIcon(id, cls = '') {
  return `<svg class="ico ${cls}" aria-hidden="true"><use href="icons.svg#${id}"/></svg>`;
}

const AREA_DATA = {
  familia: {
    icon:  svgIcon('ico-family', 'ico-xl'),
    title: 'Derecho de Familia',
    desc:  'Acompañamos a nuestros clientes en los procesos más sensibles de la vida familiar, garantizando soluciones justas con discreción y profesionalismo.',
    tags:  ['Divorcio','Alimentos','Custodia','Visitas','Violencia familiar','Adopción'],
  },
  sucesorio: {
    icon:  svgIcon('ico-document', 'ico-xl'),
    title: 'Derecho Sucesorio',
    desc:  'Asesoramos en la organización y transmisión del patrimonio, evitando conflictos y garantizando que la voluntad del causante se cumpla de manera legal y ordenada.',
    tags:  ['Testamentos','Herencias','Sucesión intestada','Partición de bienes','Legados'],
  },
  laboral: {
    icon:  svgIcon('ico-scales', 'ico-xl'),
    title: 'Derecho Laboral',
    desc:  'Defendemos los derechos de trabajadores y empleadores ante despidos, accidentes laborales, discriminación y cualquier conflicto que surja en el ámbito del trabajo.',
    tags:  ['Despidos','Liquidaciones','ART','Acoso laboral','Conciliaciones','SECLO'],
  },
  penal: {
    icon:  svgIcon('ico-shield', 'ico-xl'),
    title: 'Derecho Penal',
    desc:  'Brindamos defensa técnica y estratégica en causas penales complejas, actuando con celeridad y rigor desde la primera citación hasta la resolución definitiva.',
    tags:  ['Defensa penal','Excarcelación','Querella','Apelaciones','Fiscalía','Juicio oral'],
  },
};

const areaItems  = document.querySelectorAll('.area-item');
const detailPane = document.getElementById('areaDetail');

function showAreaDetail(key) {
  const d = AREA_DATA[key];
  if (!d) return;

  detailPane.innerHTML = `
    <div class="area-detail-inner">
      <div class="detail-icon">${d.icon}</div>
      <div class="detail-title">${d.title}</div>
      <div class="detail-divider"></div>
      <p class="detail-desc">${d.desc}</p>
      <div class="detail-tags">
        ${d.tags.map(t => `<span class="detail-tag">${t}</span>`).join('')}
      </div>
    </div>
  `;
  detailPane.classList.add('visible');
}

function hideAreaDetail() {
  detailPane.classList.remove('visible');
}

areaItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    areaItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    showAreaDetail(item.dataset.area);
  });
  item.addEventListener('mouseleave', () => {
    item.classList.remove('active');
    hideAreaDetail();
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL FADE-IN =====
const fadeEls = document.querySelectorAll(
  '.section-eyebrow, .qh-intro, .areas-list, .agenda-info, .agenda-form-wrap, .valor-item, .footer-contact-item, .footer-phone-item'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id], footer[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAs.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ===== SET MIN DATE ON DATE INPUT =====
const dateInput = document.getElementById('af-fecha');
if (dateInput) {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  dateInput.min = today.toISOString().split('T')[0];
}

// ===== AGENDA FORM =====
const form      = document.getElementById('agendaForm');
const successEl = document.getElementById('afSuccess');
const submitBtn = document.getElementById('afSubmit');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nombre   = document.getElementById('af-nombre');
    const tel      = document.getElementById('af-tel');
    const email    = document.getElementById('af-email');
    const area     = document.getElementById('af-area');

    let valid = true;

    function setErr(el, errId, msg) {
      el.classList.toggle('err', !!msg);
      document.getElementById(errId).textContent = msg;
      if (msg) valid = false;
    }

    setErr(nombre, 'err-nombre',
      nombre.value.trim().length < 3 ? 'Ingresá tu nombre completo.' : '');
    setErr(tel, 'err-tel',
      !/^[\d\s\-+()]{7,}$/.test(tel.value.trim()) ? 'Ingresá un teléfono válido.' : '');
    setErr(email, 'err-email',
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? 'Ingresá un email válido.' : '');
    setErr(area, 'err-area',
      !area.value ? 'Seleccioná un área.' : '');

    if (!valid) return;

    // Simulate send
    const btnText   = submitBtn.querySelector('.af-submit-text');
    const btnLoader = submitBtn.querySelector('.af-submit-loader');
    btnText.style.display   = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    await new Promise(r => setTimeout(r, 1600));

    document.getElementById('afNombre').textContent = nombre.value.trim().split(' ')[0];
    form.style.display = 'none';
    successEl.style.display = 'block';
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Clear error on input
  ['af-nombre','af-tel','af-email','af-area'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      el.classList.remove('err');
      const errEl = document.getElementById('err-' + id.replace('af-',''));
      if (errEl) errEl.textContent = '';
    });
  });
}
