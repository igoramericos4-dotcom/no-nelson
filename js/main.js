/* Nonelsonbarbershoppmz — Main JS */

(function () {
  'use strict';

  // ---------- i18n PT / EN ----------
  const I18N = {
    lang: localStorage.getItem('nelson_lang') || 'pt',
    dict: {
      pt: {
        nav_home: 'Início',
        nav_services: 'Serviços',
        nav_book: 'Agendamento',
        nav_location: 'Localização',
        nav_contact: 'Contacto',
        btn_book_now: 'Agendar Agora',
        btn_send_booking: 'Enviar após pagamento (WhatsApp)',
        pay_title: 'Pagamento de confirmação — 200 Mts',
        pay_intro: 'As marcações de quarta-feira só são enviadas após o pagamento de 200 Mts. Pague e indique a referência.',
        pay_ref_label: 'Referência / ID da transação *',
        pay_ref_hint: 'Obrigatório. O Nelson confirma a marcação após verificar o pagamento.',
        pay_check: 'Confirmo que já paguei 200 Mts e que, em caso de falta, o valor não será reembolsado.',
        alert_required: 'Por favor, preencha todos os campos obrigatórios.',
        alert_wednesday: 'As marcações são apenas às quartas-feiras. Selecione uma quarta-feira.',
        alert_ref: 'Indique a referência / ID do pagamento de 200 Mts.',
        alert_paid: 'Confirme o pagamento de 200 Mts antes de enviar.',
        footer_nav: 'Navegação',
        footer_hours: 'Horário',
        footer_contact: 'Contacto'
      },
      en: {
        nav_home: 'Home',
        nav_services: 'Services',
        nav_book: 'Booking',
        nav_location: 'Location',
        nav_contact: 'Contact',
        btn_book_now: 'Book Now',
        btn_send_booking: 'Send after payment (WhatsApp)',
        pay_title: 'Confirmation payment — 200 Mts',
        pay_intro: 'Wednesday bookings are only sent after the 200 Mts payment. Pay and enter the reference.',
        pay_ref_label: 'Transaction reference / ID *',
        pay_ref_hint: 'Required. Nelson confirms the booking after verifying payment.',
        pay_check: 'I confirm I have paid 200 Mts and that no-shows are non-refundable.',
        alert_required: 'Please fill in all required fields.',
        alert_wednesday: 'Bookings are only on Wednesdays. Please select a Wednesday.',
        alert_ref: 'Enter the 200 Mts payment reference / ID.',
        alert_paid: 'Confirm the 200 Mts payment before sending.',
        footer_nav: 'Navigation',
        footer_hours: 'Hours',
        footer_contact: 'Contact'
      }
    },
    t(key) {
      const pack = this.dict[this.lang] || this.dict.pt;
      return pack[key] || this.dict.pt[key] || key;
    },
    apply() {
      document.documentElement.lang = this.lang === 'en' ? 'en' : 'pt';
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = this.t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      });
      // Nav links by href when data-i18n missing
      const map = {
        'index.html': 'nav_home',
        'servicos.html': 'nav_services',
        'agendamento.html': 'nav_book',
        'localizacao.html': 'nav_location',
        'contacto.html': 'nav_contact'
      };
      document.querySelectorAll('.nav a, .mobile-nav a, .footer-nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').split('#')[0];
        if (map[href] && !a.classList.contains('btn')) {
          a.textContent = this.t(map[href]);
        }
        if (a.classList.contains('btn') || a.classList.contains('btn-sm')) {
          if (/agendamento/i.test(href) || /book|agendar/i.test(a.textContent)) {
            a.textContent = this.t('btn_book_now');
          }
        }
      });
      document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === this.lang);
      });
    },
    set(lang) {
      this.lang = lang === 'en' ? 'en' : 'pt';
      localStorage.setItem('nelson_lang', this.lang);
      this.apply();
    },
    initSwitcher() {
      if (document.querySelector('.lang-switch')) return;
      const box = document.createElement('div');
      box.className = 'lang-switch';
      box.setAttribute('role', 'group');
      box.setAttribute('aria-label', 'Language');
      box.innerHTML = '<button type="button" data-lang="pt" aria-label="Português">PT</button><button type="button" data-lang="en" aria-label="English">EN</button>';
      document.body.appendChild(box);
      box.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => this.set(btn.getAttribute('data-lang')));
      });
      this.apply();
    }
  };
  // Language switcher removed
  // I18N.initSwitcher();


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


  // ---------- Wednesday-only dates (next 2 years) ----------
  const dataSelect = document.getElementById('data');
  if (dataSelect && dataSelect.tagName === 'SELECT') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from next Wednesday (or today if Wednesday and still early — use today if Wed)
    let d = new Date(today);
    const day = d.getDay(); // 0 Sun ... 3 Wed
    const daysUntilWed = (3 - day + 7) % 7;
    if (daysUntilWed === 0) {
      // today is Wednesday — keep today
    } else {
      d.setDate(d.getDate() + daysUntilWed);
    }

    const end = new Date(today);
    end.setFullYear(end.getFullYear() + 2);

    const formatter = new Intl.DateTimeFormat('pt-MZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    while (d <= end) {
      if (d.getDay() === 3) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const value = `${yyyy}-${mm}-${dd}`;
        const opt = document.createElement('option');
        opt.value = value;
        let label = formatter.format(d);
        label = label.charAt(0).toUpperCase() + label.slice(1);
        opt.textContent = label;
        dataSelect.appendChild(opt);
      }
      d.setDate(d.getDate() + 7);
    }
  }


  // ---------- Payment platform + reference rules ----------
  const plataformaEl = document.getElementById('plataforma');
  const refPagEl = document.getElementById('ref_pagamento');
  const refHint = document.getElementById('ref-hint');
  const refErrorEl = document.getElementById('ref-error');

  const payRules = {
    mpesa: {
      min: 8, max: 20,
      placeholder: 'Ex: 123456789012 (código M-Pesa)',
      hint: 'M-Pesa: cole só os números do SMS de confirmação (8 a 20 dígitos).'
    },
    emola: {
      min: 8, max: 20,
      placeholder: 'Ex: 123456789012 (código e-Mola)',
      hint: 'e-Mola: cole só os números do SMS de confirmação (8 a 20 dígitos).'
    },
    bim: {
      min: 6, max: 20,
      placeholder: 'Ex: número da transferência BIM',
      hint: 'BIM: cole o código/nº da transferência (6 a 20 dígitos).'
    }
  };

  function applyPayPlatform() {
    if (!plataformaEl || !refPagEl) return;
    const key = plataformaEl.value;
    const rule = payRules[key];
    if (!rule) {
      refPagEl.disabled = true;
      refPagEl.value = '';
      refPagEl.placeholder = 'Selecione primeiro a plataforma';
      if (refHint) refHint.textContent = 'Primeiro selecione a plataforma. Depois cole só o código numérico da confirmação.';
      if (refErrorEl) refErrorEl.classList.remove('visible');
      return;
    }
    refPagEl.disabled = false;
    refPagEl.placeholder = rule.placeholder;
    refPagEl.maxLength = rule.max;
    if (refHint) refHint.textContent = rule.hint;
    if (refErrorEl) refErrorEl.classList.remove('visible');
  }

  if (plataformaEl) {
    plataformaEl.addEventListener('change', applyPayPlatform);
    applyPayPlatform();
  }

  if (refPagEl) {
    refPagEl.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
      if (refErrorEl) refErrorEl.classList.remove('visible');
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
        alert(I18N.t('alert_required'));
        return;
      }

      // Ensure selected date is a Wednesday
      try {
        const check = new Date(data + 'T12:00:00');
        if (check.getDay() !== 3) {
          alert(I18N.t('alert_wednesday'));
          return;
        }
      } catch (_) {}

      const plataforma = (form.plataforma && form.plataforma.value) ? form.plataforma.value : '';
      const refPag = (form.ref_pagamento && form.ref_pagamento.value) ? form.ref_pagamento.value.trim().replace(/\s+/g, '') : '';
      const pagou = form.pagou && form.pagou.checked;
      const refError = document.getElementById('ref-error');

      if (!plataforma) {
        alert('Selecione a plataforma de pagamento (M-Pesa, e-Mola ou BIM).');
        if (form.plataforma) form.plataforma.focus();
        return;
      }

      // Regras por plataforma: só números (código da confirmação)
      // M-Pesa / e-Mola: 8–20 dígitos | BIM: 6–20 dígitos
      const rules = {
        mpesa: { min: 8, max: 20, label: 'M-Pesa' },
        emola: { min: 8, max: 20, label: 'e-Mola' },
        bim:   { min: 6, max: 20, label: 'Millennium BIM' }
      };
      const rule = rules[plataforma];
      const digitsOnly = /^[0-9]+$/.test(refPag);

      if (!rule || !digitsOnly || refPag.length < rule.min || refPag.length > rule.max) {
        if (refError) refError.classList.add('visible');
        alert('Cole o código numérico da confirmação ' + (rule ? rule.label : '') + ' (' + (rule ? rule.min + '–' + rule.max + ' dígitos' : 'inválido') + ').');
        if (form.ref_pagamento) form.ref_pagamento.focus();
        return;
      }
      if (refError) refError.classList.remove('visible');

      if (!pagou) {
        alert(I18N.t('alert_paid'));
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
      const platLabel = { mpesa: 'M-Pesa', emola: 'e-Mola', bim: 'Millennium BIM' }[plataforma] || plataforma;
      mensagem += `*Pagamento confirmação:* 200 Mts%0A`;
      mensagem += `*Plataforma:* ${encodeURIComponent(platLabel)}%0A`;
      mensagem += `*Código confirmação:* ${encodeURIComponent(refPag)}%0A`;
      mensagem += `*Cliente declara:* pagamento efetuado (não reembolsável se faltar)%0A`;
      mensagem += `%0A_Atendimento exclusivo com o Barbeiro Nelson. Confirmar pagamento antes de reservar._`;

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
