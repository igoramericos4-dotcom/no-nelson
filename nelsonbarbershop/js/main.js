/* Nonelsonbarbershoppmz — Main JS */

(function () {
  'use strict';

  // ---------- Intro ----------
  const intro = document.getElementById('intro');
  if (intro) {
    const hasSeen = sessionStorage.getItem('nelson_intro_seen');
    if (hasSeen) {
      intro.classList.add('hidden');
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 800 : 3200;
      setTimeout(() => {
        intro.classList.add('hidden');
        document.body.style.overflow = '';
        sessionStorage.setItem('nelson_intro_seen', '1');
      }, duration);
    }
  }

  // ---------- Header scroll ----------
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Mobile menu ----------
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ---------- Custom service select ----------
  const customSelect = document.getElementById('servico-select');
  if (customSelect) {
    const trigger = customSelect.querySelector('.custom-select-trigger');
    const dropdown = customSelect.querySelector('.custom-select-dropdown');
    const label = customSelect.querySelector('.custom-select-label');
    const hidden = document.getElementById('servico');
    const options = customSelect.querySelectorAll('.custom-select-option');

    const closeSelect = () => {
      customSelect.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.hidden = true;
    };

    const openSelect = () => {
      customSelect.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      dropdown.hidden = false;
    };

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (customSelect.classList.contains('open')) {
        closeSelect();
      } else {
        openSelect();
      }
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const value = opt.getAttribute('data-value');
        const name = opt.querySelector('.opt-name').textContent;
        const price = opt.querySelector('.opt-price').textContent;

        hidden.value = value;
        label.textContent = name + ' — ' + price;
        customSelect.classList.add('has-value');

        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        closeSelect();
      });
    });

    document.addEventListener('click', (e) => {
      if (!customSelect.contains(e.target)) {
        closeSelect();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSelect();
    });
  }

  // ---------- Phone: only 9 digits ----------
  const telefoneInput = document.getElementById('telefone');
  const phoneError = document.getElementById('phone-error');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 9);
      if (phoneError) phoneError.classList.remove('visible');
    });
  }

  // ---------- Appointment form → WhatsApp ----------
  const form = document.getElementById('agendamento-form');
  const modal = document.getElementById('confirm-modal');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const pais = (form.pais && form.pais.value) ? form.pais.value : '+258';
      const telefoneDigits = form.telefone.value.trim().replace(/\D/g, '');
      const servico = form.servico.value;
      const data = form.data.value;
      const horario = form.horario.value;
      const obs = form.observacoes.value.trim();

      if (!nome || !telefoneDigits || !servico || !data || !horario) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (telefoneDigits.length !== 9) {
        if (phoneError) phoneError.classList.add('visible');
        form.telefone.focus();
        return;
      }

      const telefoneCompleto = pais + ' ' + telefoneDigits;

      // Format date
      let dataFormatada = data;
      try {
        const d = new Date(data + 'T12:00:00');
        dataFormatada = d.toLocaleDateString('pt-MZ', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (_) {}

      let mensagem = `*Agendamento — Nonelsonbarbershoppmz*%0A%0A`;
      mensagem += `*Nome:* ${encodeURIComponent(nome)}%0A`;
      mensagem += `*Telefone:* ${encodeURIComponent(telefoneCompleto)}%0A`;
      mensagem += `*Serviço:* ${encodeURIComponent(servico)}%0A`;
      mensagem += `*Data:* ${encodeURIComponent(dataFormatada)}%0A`;
      mensagem += `*Horário:* ${encodeURIComponent(horario)}%0A`;
      if (obs) {
        mensagem += `*Observações:* ${encodeURIComponent(obs)}%0A`;
      }
      mensagem += `%0A_Atendimento exclusivo com o Barbeiro Nelson._`;

      const waUrl = `https://wa.me/258845880006?text=${mensagem}`;
      window.open(waUrl, '_blank');

      // Show confirmation modal
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      form.reset();
      if (form.pais) form.pais.value = '+258';

      // Reset custom service select UI
      if (customSelect) {
        const labelEl = customSelect.querySelector('.custom-select-label');
        const hiddenEl = document.getElementById('servico');
        if (labelEl) labelEl.textContent = 'Selecione o serviço';
        if (hiddenEl) hiddenEl.value = '';
        customSelect.classList.remove('has-value');
        customSelect.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
      }
    });
  }

  // Modal close
  if (modal) {
    modal.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Current year in footer ----------
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Active nav link ----------
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
