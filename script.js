/* ═══════════════════════════════════════════════════════════════
   CampusForge — Universal Course Registration Portal
   Validation Engine  |  IPO Pipeline  |  ARIA-First
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── DOM CACHE ───────────────────────────────────────────── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // Registration Form
  const regForm     = $('.js-registration-form');
  const regName     = $('.js-reg-name');
  const regEmail    = $('.js-reg-email');
  const regRoll     = $('.js-reg-roll');
  const regSemester = $('.js-reg-semester');
  const regCourse   = $('.js-reg-course');
  const regPassword = $('.js-reg-password');
  const regConfirm  = $('.js-reg-confirm-password');
  const regStatus   = $('.js-registration-status');

  // Feedback Form
  const fbForm      = $('.js-feedback-form');
  const fbName      = $('.js-fb-name');
  const fbEmail     = $('.js-fb-email');
  const fbSubject   = $('.js-fb-subject');
  const fbMessage   = $('.js-fb-message');
  const fbCharCount = $('.js-fb-char-count');
  const fbStatus    = $('.js-feedback-status');

  // Password checklist
  const chkUpper   = $('.js-check-upper');
  const chkLower   = $('.js-check-lower');
  const chkDigit   = $('.js-check-digit');
  const chkSpecial = $('.js-check-special');
  const chkLength  = $('.js-check-length');
  const pwBar      = $('.js-password-bar');
  const pwText     = $('.js-password-strength-text');

  // Records & Audit
  const recordsList     = $('.js-records-list');
  const recordsFilter   = $('.js-records-filter-course');
  const recordsSearch   = $('.js-records-search');
  const recordsCount    = $('.js-records-count');
  const navRegCount     = $('.js-nav-reg-count');
  const metricTotal     = $('.js-metric-total');
  const btnExportCSV    = $('.js-btn-export-csv');
  const btnExportJSON   = $('.js-btn-export-json');
  const btnClearAll     = $('.js-btn-clear-all');
  const auditContainer  = $('.js-audit-log-container');
  const auditClear      = $('.js-audit-clear');

  // Navigation
  const navTabs         = $$('.js-nav-tab');
  const allSections     = $$('.form-section');

  // Modal
  const modal          = $('.js-modal');
  const modalBody      = $('.js-modal-body');
  const modalCloseAll  = $$('.js-modal-close');
  const modalOverlay   = $('.js-modal-overlay');

  // Theme
  const themeToggle    = $('.js-theme-toggle');

  // Toast
  const toastContainer = $('.js-toast-container');


  /* ═══════════════════════════════════════════════════════════
     VALIDATION RULES (PROCESS PHASE)
     ═══════════════════════════════════════════════════════════ */
  const REGEX = {
    email:    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    roll:     /^F20\d{2}-CS-\d{3}$/,
    upper:    /[A-Z]/,
    lower:    /[a-z]/,
    digit:    /\d/,
    special:  /[#?!@$%^&*\-]/,
  };

  /* ─── Single-purpose validators ──────────────────────────── */
  function validateRequired(value) {
    return value.trim().length > 0;
  }

  function validateMinLength(value, min) {
    return value.trim().length >= min;
  }

  function validateEmail(value) {
    return REGEX.email.test(value.trim());
  }

  function validateRollNumber(value) {
    return REGEX.roll.test(value.trim());
  }

  function validatePasswordRules(value) {
    return {
      upper:   REGEX.upper.test(value),
      lower:   REGEX.lower.test(value),
      digit:   REGEX.digit.test(value),
      special: REGEX.special.test(value),
      length:  value.length >= 8,
    };
  }

  function validatePasswordsMatch(password, confirm) {
    return password === confirm && password.length > 0;
  }

  function validateSelect(value) {
    return value !== '' && value !== null;
  }


  /* ═══════════════════════════════════════════════════════════
     OUTPUT PHASE — ARIA-First Feedback
     ═══════════════════════════════════════════════════════════ */
  function showError(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
    auditLog(`FAIL  ⟫ #${input.id}: "${message}"`, 'fail');
  }

  function showSuccess(input, errorId) {
    const errorEl = document.getElementById(errorId);
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
    auditLog(`PASS  ⟫ #${input.id}: validated`, 'pass');
  }

  function clearFieldState(input, errorId) {
    const errorEl = document.getElementById(errorId);
    input.classList.remove('is-valid', 'is-invalid');
    input.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
  }


  /* ═══════════════════════════════════════════════════════════
     FIELD-LEVEL VALIDATORS (IPO PIPELINE)
     ═══════════════════════════════════════════════════════════ */

  // -- Registration Form --
  function validateRegName() {
    const val = regName.value;
    if (!validateRequired(val)) {
      showError(regName, 'reg-name-error', 'Full name is required.');
      return false;
    }
    if (!validateMinLength(val, 2)) {
      showError(regName, 'reg-name-error', 'Name must be at least 2 characters.');
      return false;
    }
    showSuccess(regName, 'reg-name-error');
    return true;
  }

  function validateRegEmail() {
    const val = regEmail.value;
    if (!validateRequired(val)) {
      showError(regEmail, 'reg-email-error', 'Student email is required.');
      return false;
    }
    if (!validateEmail(val)) {
      showError(regEmail, 'reg-email-error', 'Enter a valid email address.');
      return false;
    }
    showSuccess(regEmail, 'reg-email-error');
    return true;
  }

  function validateRegRoll() {
    const val = regRoll.value;
    if (!validateRequired(val)) {
      showError(regRoll, 'reg-roll-error', 'Roll number is required.');
      return false;
    }
    if (!validateRollNumber(val)) {
      showError(regRoll, 'reg-roll-error', 'Format: F20XX-CS-XXX (e.g. F2025-CS-042).');
      return false;
    }
    showSuccess(regRoll, 'reg-roll-error');
    return true;
  }

  function validateRegSemester() {
    if (!validateSelect(regSemester.value)) {
      showError(regSemester, 'reg-semester-error', 'Please select your semester.');
      return false;
    }
    showSuccess(regSemester, 'reg-semester-error');
    return true;
  }

  function validateRegCourse() {
    if (!validateSelect(regCourse.value)) {
      showError(regCourse, 'reg-course-error', 'Please choose an elective course.');
      return false;
    }
    showSuccess(regCourse, 'reg-course-error');
    return true;
  }

  function validateRegPassword() {
    const val = regPassword.value;
    const rules = validatePasswordRules(val);

    // Update checklist
    chkUpper.classList.toggle('is-met', rules.upper);
    chkLower.classList.toggle('is-met', rules.lower);
    chkDigit.classList.toggle('is-met', rules.digit);
    chkSpecial.classList.toggle('is-met', rules.special);
    chkLength.classList.toggle('is-met', rules.length);

    // Strength bar
    const met = Object.values(rules).filter(Boolean).length;
    const pct = (met / 5) * 100;
    pwBar.style.width = `${pct}%`;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    pwText.textContent = `Strength: ${val.length === 0 ? 'Not evaluated' : labels[met - 1] || 'Very Weak'}`;

    if (!validateRequired(val)) {
      showError(regPassword, 'reg-password-error', 'Password is required.');
      return false;
    }

    const allMet = Object.values(rules).every(Boolean);
    if (!allMet) {
      showError(regPassword, 'reg-password-error', 'Password must meet all requirements above.');
      return false;
    }
    showSuccess(regPassword, 'reg-password-error');
    return true;
  }

  function validateRegConfirm() {
    const val = regConfirm.value;
    if (!validateRequired(val)) {
      showError(regConfirm, 'reg-confirm-password-error', 'Please confirm your password.');
      return false;
    }
    if (!validatePasswordsMatch(regPassword.value, val)) {
      showError(regConfirm, 'reg-confirm-password-error', 'Passwords do not match.');
      return false;
    }
    showSuccess(regConfirm, 'reg-confirm-password-error');
    return true;
  }

  // -- Feedback Form --
  function validateFbName() {
    if (!validateRequired(fbName.value)) {
      showError(fbName, 'fb-name-error', 'Name is required.');
      return false;
    }
    showSuccess(fbName, 'fb-name-error');
    return true;
  }

  function validateFbEmail() {
    const val = fbEmail.value;
    if (!validateRequired(val)) {
      showError(fbEmail, 'fb-email-error', 'Email is required.');
      return false;
    }
    if (!validateEmail(val)) {
      showError(fbEmail, 'fb-email-error', 'Enter a valid email address.');
      return false;
    }
    showSuccess(fbEmail, 'fb-email-error');
    return true;
  }

  function validateFbSubject() {
    if (!validateRequired(fbSubject.value)) {
      showError(fbSubject, 'fb-subject-error', 'Subject is required.');
      return false;
    }
    showSuccess(fbSubject, 'fb-subject-error');
    return true;
  }

  function validateFbMessage() {
    const val = fbMessage.value;
    if (!validateRequired(val)) {
      showError(fbMessage, 'fb-message-error', 'Message is required.');
      return false;
    }
    if (!validateMinLength(val, 20)) {
      showError(fbMessage, 'fb-message-error', `Need at least 20 characters (currently ${val.trim().length}).`);
      return false;
    }
    showSuccess(fbMessage, 'fb-message-error');
    return true;
  }


  /* ═══════════════════════════════════════════════════════════
     EVENT LISTENERS — Blur/Change Validation
     ═══════════════════════════════════════════════════════════ */
  regName.addEventListener('blur', validateRegName);
  regEmail.addEventListener('blur', validateRegEmail);
  regRoll.addEventListener('blur', validateRegRoll);
  regSemester.addEventListener('blur', validateRegSemester);
  regSemester.addEventListener('change', validateRegSemester);
  regCourse.addEventListener('blur', validateRegCourse);
  regCourse.addEventListener('change', validateRegCourse);
  regPassword.addEventListener('blur', validateRegPassword);
  regPassword.addEventListener('input', () => {
    // Live checklist update
    const rules = validatePasswordRules(regPassword.value);
    chkUpper.classList.toggle('is-met', rules.upper);
    chkLower.classList.toggle('is-met', rules.lower);
    chkDigit.classList.toggle('is-met', rules.digit);
    chkSpecial.classList.toggle('is-met', rules.special);
    chkLength.classList.toggle('is-met', rules.length);
    const met = Object.values(rules).filter(Boolean).length;
    pwBar.style.width = `${(met / 5) * 100}%`;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    pwText.textContent = `Strength: ${regPassword.value.length === 0 ? 'Not evaluated' : labels[met - 1] || 'Very Weak'}`;
  });
  regConfirm.addEventListener('blur', validateRegConfirm);

  fbName.addEventListener('blur', validateFbName);
  fbEmail.addEventListener('blur', validateFbEmail);
  fbSubject.addEventListener('blur', validateFbSubject);
  fbMessage.addEventListener('blur', validateFbMessage);
  fbMessage.addEventListener('input', () => {
    fbCharCount.textContent = fbMessage.value.trim().length;
  });


  /* ═══════════════════════════════════════════════════════════
     FORM SUBMISSIONS
     ═══════════════════════════════════════════════════════════ */
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    auditLog('─── REGISTRATION SUBMIT TRIGGERED ───', 'info');

    const results = [
      validateRegName(),
      validateRegEmail(),
      validateRegRoll(),
      validateRegSemester(),
      validateRegCourse(),
      validateRegPassword(),
      validateRegConfirm(),
    ];

    const allValid = results.every(Boolean);

    if (allValid) {
      const entry = {
        id: Date.now(),
        name: regName.value.trim(),
        email: regEmail.value.trim(),
        roll: regRoll.value.trim(),
        semester: regSemester.value,
        course: regCourse.value,
        timestamp: new Date().toISOString(),
      };

      saveRegistration(entry);
      regForm.reset();

      // Reset checklist
      [chkUpper, chkLower, chkDigit, chkSpecial, chkLength].forEach(el => el.classList.remove('is-met'));
      pwBar.style.width = '0%';
      pwText.textContent = 'Strength: Not evaluated';

      // Clear all field states
      [regName, regEmail, regRoll, regSemester, regCourse, regPassword, regConfirm].forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('aria-invalid');
      });

      regStatus.textContent = '✅ Registration submitted successfully!';
      regStatus.style.color = 'var(--color-success)';
      showToast('Registration submitted successfully!', 'success');
      auditLog('SUBMIT ⟫ Registration ACCEPTED — all 7 fields passed', 'pass');

      setTimeout(() => { regStatus.textContent = ''; }, 5000);
    } else {
      regStatus.textContent = '⚠ Please fix the errors above before submitting.';
      regStatus.style.color = 'var(--color-danger)';
      showToast('Validation failed — check highlighted fields', 'error');
      auditLog('SUBMIT ⟫ Registration REJECTED — validation failures detected', 'fail');

      // Focus first invalid
      const firstInvalid = regForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();

      setTimeout(() => { regStatus.textContent = ''; }, 5000);
    }
  });

  fbForm.addEventListener('submit', (e) => {
    e.preventDefault();
    auditLog('─── FEEDBACK SUBMIT TRIGGERED ───', 'info');

    const results = [
      validateFbName(),
      validateFbEmail(),
      validateFbSubject(),
      validateFbMessage(),
    ];

    const allValid = results.every(Boolean);

    if (allValid) {
      fbForm.reset();
      fbCharCount.textContent = '0';

      [fbName, fbEmail, fbSubject, fbMessage].forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('aria-invalid');
      });

      fbStatus.textContent = '✅ Feedback sent successfully! Thank you.';
      fbStatus.style.color = 'var(--color-success)';
      showToast('Feedback submitted — thank you!', 'success');
      auditLog('SUBMIT ⟫ Feedback ACCEPTED — all 4 fields passed', 'pass');

      setTimeout(() => { fbStatus.textContent = ''; }, 5000);
    } else {
      fbStatus.textContent = '⚠ Please fix the errors above.';
      fbStatus.style.color = 'var(--color-danger)';
      showToast('Feedback validation failed', 'error');
      auditLog('SUBMIT ⟫ Feedback REJECTED — validation failures detected', 'fail');

      const firstInvalid = fbForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();

      setTimeout(() => { fbStatus.textContent = ''; }, 5000);
    }
  });


  /* ═══════════════════════════════════════════════════════════
     DATA PERSISTENCE (localStorage)
     ═══════════════════════════════════════════════════════════ */
  const STORAGE_KEY = 'campusforge_registrations';

  function getRegistrations() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveRegistration(entry) {
    const data = getRegistrations();
    data.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderRecords();
  }

  function deleteRegistration(id) {
    const data = getRegistrations().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderRecords();
    showToast('Record deleted', 'info');
  }


  /* ═══════════════════════════════════════════════════════════
     RECORDS RENDERING
     ═══════════════════════════════════════════════════════════ */
  function renderRecords() {
    const data = getRegistrations();
    const filterVal = recordsFilter.value;
    const searchVal = recordsSearch.value.trim().toLowerCase();

    let filtered = data;

    if (filterVal !== 'ALL') {
      filtered = filtered.filter(r => r.course === filterVal);
    }

    if (searchVal) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchVal) ||
        r.roll.toLowerCase().includes(searchVal) ||
        r.email.toLowerCase().includes(searchVal)
      );
    }

    recordsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
    navRegCount.textContent = data.length;
    metricTotal.textContent = data.length;

    if (filtered.length === 0) {
      recordsList.innerHTML = '<div class="records__empty">No enrollment records found. Submit a registration to see data here.</div>';
      return;
    }

    recordsList.innerHTML = filtered.map(r => `
      <div class="record-card" data-id="${r.id}" tabindex="0" role="button" aria-label="View details for ${r.name}">
        <div class="record-card__name">${escapeHTML(r.name)}</div>
        <div class="record-card__roll">${escapeHTML(r.roll)}</div>
        <div class="record-card__course">${escapeHTML(r.course)}</div>
        <div class="record-card__email">${escapeHTML(r.email)}</div>
      </div>
    `).join('');

    // Card click → modal
    recordsList.querySelectorAll('.record-card').forEach(card => {
      const handler = () => {
        const id = Number(card.dataset.id);
        const record = data.find(r => r.id === id);
        if (record) openModal(record);
      };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  recordsFilter.addEventListener('change', renderRecords);
  recordsSearch.addEventListener('input', renderRecords);

  // Keyboard shortcut: / to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      recordsSearch.focus();
    }
  });


  /* ═══════════════════════════════════════════════════════════
     MODAL
     ═══════════════════════════════════════════════════════════ */
  function openModal(record) {
    modalBody.innerHTML = `
      <div class="detail-row"><span class="detail-key">Full Name</span><span class="detail-value">${escapeHTML(record.name)}</span></div>
      <div class="detail-row"><span class="detail-key">Email</span><span class="detail-value">${escapeHTML(record.email)}</span></div>
      <div class="detail-row"><span class="detail-key">Roll Number</span><span class="detail-value">${escapeHTML(record.roll)}</span></div>
      <div class="detail-row"><span class="detail-key">Semester</span><span class="detail-value">${record.semester}</span></div>
      <div class="detail-row"><span class="detail-key">Elective</span><span class="detail-value">${escapeHTML(record.course)}</span></div>
      <div class="detail-row"><span class="detail-key">Registered</span><span class="detail-value">${new Date(record.timestamp).toLocaleString()}</span></div>
    `;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalCloseAll.forEach(btn => btn.addEventListener('click', closeModal));
  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });


  /* ═══════════════════════════════════════════════════════════
     EXPORT (CSV / JSON)
     ═══════════════════════════════════════════════════════════ */
  btnExportCSV.addEventListener('click', () => {
    const data = getRegistrations();
    if (data.length === 0) { showToast('No data to export', 'error'); return; }

    const header = 'Name,Email,Roll Number,Semester,Course,Timestamp';
    const rows = data.map(r => `"${r.name}","${r.email}","${r.roll}",${r.semester},"${r.course}","${r.timestamp}"`);
    downloadFile(`${header}\n${rows.join('\n')}`, 'campusforge-enrollments.csv', 'text/csv');
    showToast('CSV exported successfully', 'success');
    auditLog('EXPORT ⟫ CSV download initiated', 'info');
  });

  btnExportJSON.addEventListener('click', () => {
    const data = getRegistrations();
    if (data.length === 0) { showToast('No data to export', 'error'); return; }

    downloadFile(JSON.stringify(data, null, 2), 'campusforge-enrollments.json', 'application/json');
    showToast('JSON exported successfully', 'success');
    auditLog('EXPORT ⟫ JSON download initiated', 'info');
  });

  btnClearAll.addEventListener('click', () => {
    if (confirm('⚠ This will permanently delete all enrollment records. Continue?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderRecords();
      showToast('All records cleared', 'info');
      auditLog('PURGE ⟫ All enrollment records deleted', 'warn');
    }
  });

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }


  /* ═══════════════════════════════════════════════════════════
     NAVIGATION TABS
     ═══════════════════════════════════════════════════════════ */
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const target = tab.dataset.target;

      if (target === 'all-sections') {
        allSections.forEach(s => { s.style.display = ''; });
      } else {
        allSections.forEach(s => {
          s.style.display = s.id === target ? '' : 'none';
        });
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════
     THEME TOGGLE
     ═══════════════════════════════════════════════════════════ */
  const savedTheme = localStorage.getItem('campusforge_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('campusforge_theme', next);
    updateThemeButton(next);
    auditLog(`THEME ⟫ Switched to ${next.toUpperCase()} mode`, 'info');
  });

  function updateThemeButton(theme) {
    const icon = themeToggle.querySelector('.theme-toggle-btn__icon');
    const text = themeToggle.querySelector('.theme-toggle-btn__text');
    if (theme === 'dark') {
      icon.textContent = '🌙';
      text.textContent = 'Dark';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Light';
    }
  }


  /* ═══════════════════════════════════════════════════════════
     PASSWORD VISIBILITY TOGGLE
     ═══════════════════════════════════════════════════════════ */
  $$('.js-toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.querySelector('.form__eye-icon').textContent = isPassword ? '🔒' : '👁';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });


  /* ═══════════════════════════════════════════════════════════
     AUDIT LOG
     ═══════════════════════════════════════════════════════════ */
  function auditLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const line = document.createElement('span');
    line.className = `audit-line audit-line--${type}`;
    line.textContent = `[${timestamp}] ${message}`;
    auditContainer.appendChild(line);
    auditContainer.scrollTop = auditContainer.scrollHeight;
  }

  auditClear.addEventListener('click', () => {
    auditContainer.innerHTML = '';
    auditLog('Audit log cleared', 'info');
  });


  /* ═══════════════════════════════════════════════════════════
     TOAST NOTIFICATIONS
     ═══════════════════════════════════════════════════════════ */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }


  /* ═══════════════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════════════ */
  renderRecords();
  auditLog('CampusForge Portal initialized — ARIA gates armed', 'info');
  auditLog(`Theme: ${savedTheme.toUpperCase()} | Registrations: ${getRegistrations().length}`, 'info');

})();
