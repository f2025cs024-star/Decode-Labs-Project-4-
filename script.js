/* ═══════════════════════════════════════════════════════════════
   NIIT Course Registration & Feedback — script.js
   DecodeLabs Project 4 · Enterprise Architecture & Validation Engine
   
   Architecture (IPO Pipeline):
   ┌─────────┐    ┌───────────┐    ┌──────────┐
   │  INPUT  │───▸│  PROCESS  │───▸│  OUTPUT  │
   │  (HTML) │    │ (JS/Regex)│    │(DOM/ARIA)│
   └─────────┘    └───────────┘    └──────────┘

   Features:
   - Password strength & entropy progress calculation
   - Live Security & Regex Audit telemetry terminal
   - Export to CSV & Export to JSON data suite
   - Floating glassmorphism Toast notifications system
   - Navigation Tab module switching
   - Dark/Light mode theme engine with persistence
   - Keyboard shortcuts ('/' to search)
   - Strict adherence to const/let, textContent, ARIA standards
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── DOM REFERENCES (const — immutable) ─────────────────────────

// Registration form elements
const registrationForm = document.querySelector('.js-registration-form');
const regNameInput      = document.querySelector('.js-reg-name');
const regEmailInput     = document.querySelector('.js-reg-email');
const regRollInput      = document.querySelector('.js-reg-roll');
const regSemesterInput  = document.querySelector('.js-reg-semester');
const regCourseInput    = document.querySelector('.js-reg-course');
const regPasswordInput  = document.querySelector('.js-reg-password');
const regConfirmInput   = document.querySelector('.js-reg-confirm-password');
const regStatus         = document.querySelector('.js-registration-status');

// Password strength meter elements
const passwordBar          = document.querySelector('.js-password-bar');
const passwordStrengthText = document.querySelector('.js-password-strength-text');

// Feedback form elements
const feedbackForm     = document.querySelector('.js-feedback-form');
const fbNameInput      = document.querySelector('.js-fb-name');
const fbEmailInput     = document.querySelector('.js-fb-email');
const fbSubjectInput   = document.querySelector('.js-fb-subject');
const fbMessageInput   = document.querySelector('.js-fb-message');
const fbCharCount      = document.querySelector('.js-fb-char-count');
const fbStatus         = document.querySelector('.js-feedback-status');

// Password checklist items
const checkUpper   = document.querySelector('.js-check-upper');
const checkLower   = document.querySelector('.js-check-lower');
const checkDigit   = document.querySelector('.js-check-digit');
const checkSpecial = document.querySelector('.js-check-special');
const checkLength  = document.querySelector('.js-check-length');

// Toggle & Action elements
const toggleButtons   = document.querySelectorAll('.js-toggle-password');
const themeToggleBtn  = document.querySelector('.js-theme-toggle');
const navTabs         = document.querySelectorAll('.js-nav-tab');
const toastContainer  = document.querySelector('.js-toast-container');
const metricTotal     = document.querySelector('.js-metric-total');
const navRegCount     = document.querySelector('.js-nav-reg-count');

// Registered Courses Viewer DOM references
const recordsFilterCourse = document.querySelector('.js-records-filter-course');
const recordsSearchInput  = document.querySelector('.js-records-search');
const recordsCountBadge   = document.querySelector('.js-records-count');
const recordsListGrid     = document.querySelector('.js-records-list');
const btnExportCSV        = document.querySelector('.js-btn-export-csv');
const btnExportJSON       = document.querySelector('.js-btn-export-json');
const btnClearAll         = document.querySelector('.js-btn-clear-all');

// Audit Console elements
const auditLogContainer  = document.querySelector('.js-audit-log-container');
const btnAuditClear      = document.querySelector('.js-audit-clear');

// Modal DOM references
const detailsModal   = document.querySelector('.js-modal');
const modalBody      = document.querySelector('.js-modal-body');
const modalCloseBtns = document.querySelectorAll('.js-modal-close');
const modalOverlay   = document.querySelector('.js-modal-overlay');


// ─── REGEX PATTERNS & CONSTANTS ───────────────────────────────

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_LOWERCASE = /[a-z]/;
const HAS_DIGIT     = /[0-9]/;
const HAS_SPECIAL   = /[#?!@$%^&*-]/;
const MIN_LENGTH    = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLL_REGEX  = /^F20[0-9]{2}-CS-[0-9]{3}$/;
const MESSAGE_MIN_LENGTH = 20;

const STORAGE_KEY = 'niit_registered_courses_v1';
const THEME_KEY   = 'niit_theme_pref';


// ─── INITIAL SAMPLE REGISTRATIONS ─────────────────────────────

const INITIAL_SAMPLE_REGISTRATIONS = [
  {
    id: 'reg_1700000001',
    fullName: 'Muhammad Ali',
    studentEmail: 'ali.f2023@niit.edu.pk',
    rollNumber: 'F2023-CS-014',
    semester: '6',
    electiveCourse: 'Artificial Intelligence',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'reg_1700000002',
    fullName: 'Fatima Zahra',
    studentEmail: 'fatima.f2024@niit.edu.pk',
    rollNumber: 'F2024-CS-089',
    semester: '4',
    electiveCourse: 'Web Engineering',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'reg_1700000003',
    fullName: 'Zain Ahmed',
    studentEmail: 'zain.f2022@niit.edu.pk',
    rollNumber: 'F2022-CS-005',
    semester: '8',
    electiveCourse: 'Cloud Computing',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];


// ═══════════════════════════════════════════════════════════════
// UTILITY ENGINE: Audit Console & Toast Notifications
// ═══════════════════════════════════════════════════════════════

/**
 * Appends a log entry to the security audit console.
 * @param {string} message 
 * @param {'info'|'success'|'warn'|'error'} level 
 */
function logAudit(message, level = 'info') {
  if (!auditLogContainer) return;
  const line = document.createElement('div');
  line.className = `audit-line audit-line--${level}`;
  const timestamp = new Date().toLocaleTimeString();
  line.textContent = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  auditLogContainer.appendChild(line);
  auditLogContainer.scrollTop = auditLogContainer.scrollHeight;
}

/**
 * Displays a floating glassmorphism toast message.
 * @param {string} message 
 * @param {'success'|'error'|'info'} type 
 */
function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  const iconSpan = document.createElement('span');
  iconSpan.textContent = type === 'success' ? '✅' : type === 'error' ? '⚠' : 'ℹ';
  
  const textSpan = document.createElement('span');
  textSpan.textContent = message;
  
  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// ═══════════════════════════════════════════════════════════════
// PROCESS PHASE — Validation Functions
// ═══════════════════════════════════════════════════════════════

function validateRequired(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'This field is required.' };
  }
  return { valid: true, message: '' };
}

function validateEmail(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Email address is required.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address (e.g. name@domain.com).' };
  }
  return { valid: true, message: '' };
}

function validateRollNumber(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Roll number is required.' };
  }
  if (!ROLL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Roll number must follow format F20XX-CS-XXX (e.g. F2025-CS-042).' };
  }
  return { valid: true, message: '' };
}

function validateSelect(value, fieldName) {
  if (!value || value === '') {
    return { valid: false, message: `Please select a ${fieldName}.` };
  }
  return { valid: true, message: '' };
}

function validatePassword(value) {
  const rules = {
    upper:   HAS_UPPERCASE.test(value),
    lower:   HAS_LOWERCASE.test(value),
    digit:   HAS_DIGIT.test(value),
    special: HAS_SPECIAL.test(value),
    length:  value.length >= MIN_LENGTH
  };

  const failures = [];
  if (!rules.upper)   failures.push('one uppercase letter (A–Z)');
  if (!rules.lower)   failures.push('one lowercase letter (a–z)');
  if (!rules.digit)   failures.push('one digit (0–9)');
  if (!rules.special) failures.push('one special character (#?!@$%^&*-)');
  if (!rules.length)  failures.push('at least 8 characters total');

  if (value.length === 0) {
    return { valid: false, message: 'Password is required.', rules };
  }

  const valid = PASSWORD_REGEX.test(value);
  let message = '';
  if (!valid) {
    message = `Password must contain: ${failures.join(', ')}.`;
  }

  return { valid, message, rules };
}

function validateConfirmPassword(confirmValue, passwordValue) {
  if (confirmValue.length === 0) {
    return { valid: false, message: 'Please confirm your password.' };
  }
  if (confirmValue !== passwordValue) {
    return { valid: false, message: 'Passwords do not match. Please re-enter.' };
  }
  return { valid: true, message: '' };
}

function validateMessage(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Message is required.' };
  }
  if (trimmed.length < MESSAGE_MIN_LENGTH) {
    const remaining = MESSAGE_MIN_LENGTH - trimmed.length;
    return {
      valid: false,
      message: `Message must be at least ${MESSAGE_MIN_LENGTH} characters. ${remaining} more character${remaining === 1 ? '' : 's'} needed.`
    };
  }
  return { valid: true, message: '' };
}


// ═══════════════════════════════════════════════════════════════
// OUTPUT PHASE — DOM / ARIA Feedback Functions
// ═══════════════════════════════════════════════════════════════

function showError(inputEl, errorEl, message) {
  inputEl.setAttribute('aria-invalid', 'true');
  inputEl.classList.add('is-invalid');
  inputEl.classList.remove('is-valid');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }
  inputEl.classList.remove('is-shake');
  void inputEl.offsetWidth;
  inputEl.classList.add('is-shake');
}

function clearError(inputEl, errorEl, markValid = false) {
  inputEl.setAttribute('aria-invalid', 'false');
  inputEl.classList.remove('is-invalid', 'is-shake');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
  }
  if (markValid) {
    inputEl.classList.add('is-valid');
  } else {
    inputEl.classList.remove('is-valid');
  }
}

function showStatus(statusEl, message, type) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove('form__status--success', 'form__status--error');
  statusEl.classList.add(`form__status--${type}`, 'is-visible');
}

function clearStatus(statusEl) {
  if (!statusEl) return;
  statusEl.textContent = '';
  statusEl.classList.remove('form__status--success', 'form__status--error', 'is-visible');
}

function updatePasswordChecklist(rules, showErrors) {
  const ruleMap = {
    upper:   checkUpper,
    lower:   checkLower,
    digit:   checkDigit,
    special: checkSpecial,
    length:  checkLength
  };

  for (const [key, element] of Object.entries(ruleMap)) {
    if (!element) continue;
    if (rules[key]) {
      element.classList.add('is-valid');
      element.classList.remove('is-invalid');
    } else if (showErrors) {
      element.classList.add('is-invalid');
      element.classList.remove('is-valid');
    } else {
      element.classList.remove('is-valid', 'is-invalid');
    }
  }

  // Calculate entropy score percentage for progress bar
  let scoreCount = 0;
  if (rules.upper) scoreCount++;
  if (rules.lower) scoreCount++;
  if (rules.digit) scoreCount++;
  if (rules.special) scoreCount++;
  if (rules.length) scoreCount++;

  const pct = (scoreCount / 5) * 100;
  if (passwordBar) {
    passwordBar.style.width = `${pct}%`;
    if (pct <= 40) {
      passwordBar.style.backgroundColor = 'var(--color-error)';
      if (passwordStrengthText) passwordStrengthText.textContent = 'Entropy Rating: Weak Password';
    } else if (pct <= 80) {
      passwordBar.style.backgroundColor = 'var(--color-warning)';
      if (passwordStrengthText) passwordStrengthText.textContent = 'Entropy Rating: Moderate Strength';
    } else {
      passwordBar.style.backgroundColor = 'var(--color-success)';
      if (passwordStrengthText) passwordStrengthText.textContent = 'Entropy Rating: Enterprise Grade (Bulletproof)';
    }
  }
}

function resetPasswordChecklist() {
  const items = [checkUpper, checkLower, checkDigit, checkSpecial, checkLength];
  for (const item of items) {
    if (item) item.classList.remove('is-valid', 'is-invalid');
  }
  if (passwordBar) passwordBar.style.width = '0%';
  if (passwordStrengthText) passwordStrengthText.textContent = 'Entropy Rating: Unchecked';
}

function clearAllFieldStates(formEl) {
  const inputs = formEl.querySelectorAll('.form__input');
  const errors = formEl.querySelectorAll('.form__error');

  for (const input of inputs) {
    input.classList.remove('is-invalid', 'is-valid', 'is-shake');
    input.setAttribute('aria-invalid', 'false');
  }

  for (const error of errors) {
    error.textContent = '';
    error.classList.remove('is-visible');
  }
}

function getErrorElement(inputEl) {
  const describedBy = inputEl.getAttribute('aria-describedby');
  if (!describedBy) return null;
  const ids = describedBy.split(' ');
  for (const id of ids) {
    if (id.endsWith('-error')) {
      return document.getElementById(id);
    }
  }
  return null;
}


// ═══════════════════════════════════════════════════════════════
// FIELD-LEVEL BLUR HANDLERS
// ═══════════════════════════════════════════════════════════════

function handleRegNameBlur() {
  const result = validateRequired(regNameInput.value);
  const errorEl = getErrorElement(regNameInput);
  if (!result.valid) {
    showError(regNameInput, errorEl, 'Full name is required.');
    logAudit(`Validation failed: Name empty`, 'warn');
  } else {
    clearError(regNameInput, errorEl, true);
  }
}

function handleRegEmailBlur() {
  const result = validateEmail(regEmailInput.value);
  const errorEl = getErrorElement(regEmailInput);
  if (!result.valid) {
    showError(regEmailInput, errorEl, result.message);
    logAudit(`Validation failed: Email format '${regEmailInput.value}'`, 'warn');
  } else {
    clearError(regEmailInput, errorEl, true);
  }
}

function handleRegRollBlur() {
  const result = validateRollNumber(regRollInput.value);
  const errorEl = getErrorElement(regRollInput);
  if (!result.valid) {
    showError(regRollInput, errorEl, result.message);
    logAudit(`Validation failed: Roll pattern '${regRollInput.value}'`, 'warn');
  } else {
    clearError(regRollInput, errorEl, true);
  }
}

function handleRegSemesterBlur() {
  const result = validateSelect(regSemesterInput.value, 'semester');
  const errorEl = getErrorElement(regSemesterInput);
  if (!result.valid) {
    showError(regSemesterInput, errorEl, result.message);
  } else {
    clearError(regSemesterInput, errorEl, true);
  }
}

function handleRegCourseBlur() {
  const result = validateSelect(regCourseInput.value, 'course');
  const errorEl = getErrorElement(regCourseInput);
  if (!result.valid) {
    showError(regCourseInput, errorEl, result.message);
  } else {
    clearError(regCourseInput, errorEl, true);
  }
}

function handleRegPasswordBlur() {
  const result = validatePassword(regPasswordInput.value);
  const errorEl = getErrorElement(regPasswordInput);
  updatePasswordChecklist(result.rules, true);

  if (!result.valid) {
    showError(regPasswordInput, errorEl, result.message);
    logAudit(`Password regex scanner rejected input`, 'warn');
  } else {
    clearError(regPasswordInput, errorEl, true);
    logAudit(`Password regex policy passed 100%`, 'success');
  }

  if (regConfirmInput.value.length > 0) {
    handleRegConfirmBlur();
  }
}

function handleRegConfirmBlur() {
  const result = validateConfirmPassword(regConfirmInput.value, regPasswordInput.value);
  const errorEl = getErrorElement(regConfirmInput);
  if (!result.valid) {
    showError(regConfirmInput, errorEl, result.message);
    logAudit(`Cross-field Password match failed`, 'warn');
  } else {
    clearError(regConfirmInput, errorEl, true);
  }
}

function handleFbNameBlur() {
  const result = validateRequired(fbNameInput.value);
  const errorEl = getErrorElement(fbNameInput);
  if (!result.valid) showError(fbNameInput, errorEl, 'Name is required.');
  else clearError(fbNameInput, errorEl, true);
}

function handleFbEmailBlur() {
  const result = validateEmail(fbEmailInput.value);
  const errorEl = getErrorElement(fbEmailInput);
  if (!result.valid) showError(fbEmailInput, errorEl, result.message);
  else clearError(fbEmailInput, errorEl, true);
}

function handleFbSubjectBlur() {
  const result = validateRequired(fbSubjectInput.value);
  const errorEl = getErrorElement(fbSubjectInput);
  if (!result.valid) showError(fbSubjectInput, errorEl, 'Subject is required.');
  else clearError(fbSubjectInput, errorEl, true);
}

function handleFbMessageBlur() {
  const result = validateMessage(fbMessageInput.value);
  const errorEl = getErrorElement(fbMessageInput);
  if (!result.valid) showError(fbMessageInput, errorEl, result.message);
  else clearError(fbMessageInput, errorEl, true);
}


// ═══════════════════════════════════════════════════════════════
// EVENT LISTENERS — Field Events
// ═══════════════════════════════════════════════════════════════

regNameInput.addEventListener('blur', handleRegNameBlur);
regEmailInput.addEventListener('blur', handleRegEmailBlur);
regRollInput.addEventListener('blur', handleRegRollBlur);
regSemesterInput.addEventListener('blur', handleRegSemesterBlur);
regSemesterInput.addEventListener('change', handleRegSemesterBlur);
regCourseInput.addEventListener('blur', handleRegCourseBlur);
regCourseInput.addEventListener('change', handleRegCourseBlur);
regPasswordInput.addEventListener('blur', handleRegPasswordBlur);
regConfirmInput.addEventListener('blur', handleRegConfirmBlur);

fbNameInput.addEventListener('blur', handleFbNameBlur);
fbEmailInput.addEventListener('blur', handleFbEmailBlur);
fbSubjectInput.addEventListener('blur', handleFbSubjectBlur);
fbMessageInput.addEventListener('blur', handleFbMessageBlur);

regPasswordInput.addEventListener('input', function () {
  const result = validatePassword(regPasswordInput.value);
  updatePasswordChecklist(result.rules, false);
});

fbMessageInput.addEventListener('input', function () {
  const currentLength = fbMessageInput.value.trim().length;
  fbCharCount.textContent = currentLength;
});

for (const btn of toggleButtons) {
  btn.addEventListener('click', function () {
    const targetId = btn.getAttribute('data-target');
    const targetInput = document.getElementById(targetId);
    if (!targetInput) return;

    const isPassword = targetInput.type === 'password';
    targetInput.type = isPassword ? 'text' : 'password';

    const icon = btn.querySelector('.form__eye-icon');
    if (icon) icon.textContent = isPassword ? '🙈' : '👁';

    btn.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    );
  });
}


// ═══════════════════════════════════════════════════════════════
// SUBMIT HANDLERS — IPO Pipeline Execution
// ═══════════════════════════════════════════════════════════════

function handleRegistrationSubmit(event) {
  // ★ PREVENT THE DEFAULT REFRESH — line 1 requirement
  event.preventDefault();

  clearStatus(regStatus);
  let isFormValid = true;

  const nameResult = validateRequired(regNameInput.value);
  const nameError = getErrorElement(regNameInput);
  if (!nameResult.valid) { showError(regNameInput, nameError, 'Full name is required.'); isFormValid = false; }
  else { clearError(regNameInput, nameError, true); }

  const emailResult = validateEmail(regEmailInput.value);
  const emailError = getErrorElement(regEmailInput);
  if (!emailResult.valid) { showError(regEmailInput, emailError, emailResult.message); isFormValid = false; }
  else { clearError(regEmailInput, emailError, true); }

  const rollResult = validateRollNumber(regRollInput.value);
  const rollError = getErrorElement(regRollInput);
  if (!rollResult.valid) { showError(regRollInput, rollError, rollResult.message); isFormValid = false; }
  else { clearError(regRollInput, rollError, true); }

  const semesterResult = validateSelect(regSemesterInput.value, 'semester');
  const semesterError = getErrorElement(regSemesterInput);
  if (!semesterResult.valid) { showError(regSemesterInput, semesterError, semesterResult.message); isFormValid = false; }
  else { clearError(regSemesterInput, semesterError, true); }

  const courseResult = validateSelect(regCourseInput.value, 'course');
  const courseError = getErrorElement(regCourseInput);
  if (!courseResult.valid) { showError(regCourseInput, courseError, courseResult.message); isFormValid = false; }
  else { clearError(regCourseInput, courseError, true); }

  const passwordResult = validatePassword(regPasswordInput.value);
  const passwordError = getErrorElement(regPasswordInput);
  updatePasswordChecklist(passwordResult.rules, true);
  if (!passwordResult.valid) { showError(regPasswordInput, passwordError, passwordResult.message); isFormValid = false; }
  else { clearError(regPasswordInput, passwordError, true); }

  const confirmResult = validateConfirmPassword(regConfirmInput.value, regPasswordInput.value);
  const confirmError = getErrorElement(regConfirmInput);
  if (!confirmResult.valid) { showError(regConfirmInput, confirmError, confirmResult.message); isFormValid = false; }
  else { clearError(regConfirmInput, confirmError, true); }

  if (!isFormValid) {
    const firstInvalid = registrationForm.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();

    showStatus(regStatus, 'Please fix the errors above before submitting.', 'error');
    showToast('Registration form contains validation errors.', 'error');
    logAudit('Submit rejected: Form payload contains invalid fields', 'error');
    return;
  }

  const formData = {
    fullName: regNameInput.value.trim(),
    studentEmail: regEmailInput.value.trim(),
    rollNumber: regRollInput.value.trim(),
    semester: regSemesterInput.value,
    electiveCourse: regCourseInput.value,
    passwordHash: '[REDACTED — SHA-256 salted server-side]',
    submittedAt: new Date().toISOString()
  };

  console.log('📋 Registration Payload:', JSON.stringify(formData, null, 2));

  addRegistration(formData);

  showStatus(
    regStatus,
    '✅ Registration submitted successfully! We\'ll email you a confirmation at ' + formData.studentEmail + '. Enrollment added to registry.',
    'success'
  );

  showToast(`Enrolled ${formData.fullName} in ${formData.electiveCourse}!`, 'success');
  logAudit(`Registration payload transmitted for ${formData.rollNumber}`, 'success');

  registrationForm.reset();
  clearAllFieldStates(registrationForm);
  resetPasswordChecklist();
}

function handleFeedbackSubmit(event) {
  // ★ PREVENT THE DEFAULT REFRESH — line 1 requirement
  event.preventDefault();

  clearStatus(fbStatus);
  let isFormValid = true;

  const nameResult = validateRequired(fbNameInput.value);
  const nameError = getErrorElement(fbNameInput);
  if (!nameResult.valid) { showError(fbNameInput, nameError, 'Name is required.'); isFormValid = false; }
  else { clearError(fbNameInput, nameError, true); }

  const emailResult = validateEmail(fbEmailInput.value);
  const emailError = getErrorElement(fbEmailInput);
  if (!emailResult.valid) { showError(fbEmailInput, emailError, emailResult.message); isFormValid = false; }
  else { clearError(fbEmailInput, emailError, true); }

  const subjectResult = validateRequired(fbSubjectInput.value);
  const subjectError = getErrorElement(fbSubjectInput);
  if (!subjectResult.valid) { showError(fbSubjectInput, subjectError, 'Subject is required.'); isFormValid = false; }
  else { clearError(fbSubjectInput, subjectError, true); }

  const messageResult = validateMessage(fbMessageInput.value);
  const messageError = getErrorElement(fbMessageInput);
  if (!messageResult.valid) { showError(fbMessageInput, messageError, messageResult.message); isFormValid = false; }
  else { clearError(fbMessageInput, messageError, true); }

  if (!isFormValid) {
    const firstInvalid = feedbackForm.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();

    showStatus(fbStatus, 'Please fix the errors above before submitting.', 'error');
    showToast('Feedback form contains validation errors.', 'error');
    return;
  }

  const formData = {
    name: fbNameInput.value.trim(),
    email: fbEmailInput.value.trim(),
    subject: fbSubjectInput.value.trim(),
    message: fbMessageInput.value.trim(),
    submittedAt: new Date().toISOString()
  };

  console.log('💬 Feedback Payload:', JSON.stringify(formData, null, 2));

  showStatus(
    fbStatus,
    '✅ Feedback submitted successfully! Thank you — we\'ll respond to ' + formData.email + ' within 24 hours.',
    'success'
  );

  showToast('Feedback submitted successfully!', 'success');
  logAudit(`Feedback ticket generated for ${formData.email}`, 'success');

  feedbackForm.reset();
  clearAllFieldStates(feedbackForm);
  fbCharCount.textContent = '0';
}

registrationForm.addEventListener('submit', handleRegistrationSubmit);
feedbackForm.addEventListener('submit', handleFeedbackSubmit);


// ═══════════════════════════════════════════════════════════════
// REGISTERED COURSES VIEWER & DATA EXPORT ENGINE
// ═══════════════════════════════════════════════════════════════

function getRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_REGISTRATIONS));
      return INITIAL_SAMPLE_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SAMPLE_REGISTRATIONS;
  }
}

function saveRegistrations(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    updateMetrics();
  } catch (e) {
    console.error('Failed to save registrations to localStorage:', e);
  }
}

function addRegistration(formData) {
  const list = getRegistrations();
  const newRecord = {
    id: 'reg_' + Date.now(),
    fullName: formData.fullName,
    studentEmail: formData.studentEmail,
    rollNumber: formData.rollNumber,
    semester: formData.semester,
    electiveCourse: formData.electiveCourse,
    submittedAt: formData.submittedAt
  };
  list.unshift(newRecord);
  saveRegistrations(list);
  renderRegisteredCourses();
}

function removeRegistration(id) {
  let list = getRegistrations();
  list = list.filter(item => item.id !== id);
  saveRegistrations(list);
  renderRegisteredCourses();
  showToast('Enrollment removed from registry.', 'info');
  logAudit(`Record ${id} removed from storage`, 'warn');
}

function renderRegisteredCourses() {
  if (!recordsListGrid) return;

  const allRecords = getRegistrations();
  const selectedCourse = recordsFilterCourse ? recordsFilterCourse.value : 'ALL';
  const searchTerm = recordsSearchInput ? recordsSearchInput.value.trim().toLowerCase() : '';

  const filtered = allRecords.filter(item => {
    const matchesCourse = selectedCourse === 'ALL' || item.electiveCourse === selectedCourse;
    const matchesSearch = searchTerm === '' ||
      item.fullName.toLowerCase().includes(searchTerm) ||
      item.rollNumber.toLowerCase().includes(searchTerm) ||
      item.studentEmail.toLowerCase().includes(searchTerm);
    return matchesCourse && matchesSearch;
  });

  if (recordsCountBadge) {
    recordsCountBadge.textContent = `Showing ${filtered.length} enrollment${filtered.length === 1 ? '' : 's'}`;
  }

  recordsListGrid.textContent = '';

  if (filtered.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'records__empty';
    emptyMsg.textContent = 'No course registrations match your current filter or search criteria.';
    recordsListGrid.appendChild(emptyMsg);
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'record-card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'record-card__header';

    const titleBox = document.createElement('div');
    const nameEl = document.createElement('h3');
    nameEl.className = 'record-card__title';
    nameEl.textContent = item.fullName;

    const rollEl = document.createElement('span');
    rollEl.className = 'record-card__roll';
    rollEl.textContent = item.rollNumber;

    titleBox.appendChild(nameEl);
    titleBox.appendChild(rollEl);

    const courseBadge = document.createElement('span');
    courseBadge.className = 'record-card__course-badge';
    courseBadge.textContent = item.electiveCourse;

    cardHeader.appendChild(titleBox);
    cardHeader.appendChild(courseBadge);

    const cardInfo = document.createElement('div');
    cardInfo.className = 'record-card__info';

    const semLine = document.createElement('div');
    semLine.textContent = `Semester ${item.semester}`;

    const emailLine = document.createElement('div');
    emailLine.textContent = item.studentEmail;

    const dateLine = document.createElement('div');
    const dateFormatted = new Date(item.submittedAt).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    dateLine.textContent = `Enrolled: ${dateFormatted}`;

    cardInfo.appendChild(semLine);
    cardInfo.appendChild(emailLine);
    cardInfo.appendChild(dateLine);

    const cardActions = document.createElement('div');
    cardActions.className = 'record-card__actions';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'record-card__btn record-card__btn--view';
    viewBtn.type = 'button';
    viewBtn.textContent = 'View Details';
    viewBtn.addEventListener('click', () => openModal(item));

    const removeBtn = document.createElement('button');
    removeBtn.className = 'record-card__btn record-card__btn--remove';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Cancel';
    removeBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to cancel ${item.fullName}'s registration for ${item.electiveCourse}?`)) {
        removeRegistration(item.id);
      }
    });

    cardActions.appendChild(viewBtn);
    cardActions.appendChild(removeBtn);

    card.appendChild(cardHeader);
    card.appendChild(cardInfo);
    card.appendChild(cardActions);

    recordsListGrid.appendChild(card);
  });
}

function updateMetrics() {
  const records = getRegistrations();
  if (metricTotal) metricTotal.textContent = records.length;
  if (navRegCount) navRegCount.textContent = records.length;
}

/**
 * Exports stored registrations to CSV format.
 */
function exportToCSV() {
  const records = getRegistrations();
  if (records.length === 0) {
    showToast('No records available to export.', 'error');
    return;
  }

  const headers = ['ID', 'Full Name', 'Roll Number', 'Email', 'Semester', 'Elective Course', 'Registration Date'];
  const rows = records.map(r => [
    `"${r.id}"`,
    `"${r.fullName.replace(/"/g, '""')}"`,
    `"${r.rollNumber}"`,
    `"${r.studentEmail}"`,
    `"${r.semester}"`,
    `"${r.electiveCourse}"`,
    `"${new Date(r.submittedAt).toLocaleString()}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `niit_bscs_registrations_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Registrations exported to CSV file!', 'success');
  logAudit('Exported registry database to CSV file', 'info');
}

/**
 * Exports stored registrations to JSON format.
 */
function exportToJSON() {
  const records = getRegistrations();
  if (records.length === 0) {
    showToast('No records available to export.', 'error');
    return;
  }

  const jsonString = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `niit_bscs_registrations_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Registrations exported to JSON format!', 'success');
  logAudit('Exported registry database to JSON format', 'info');
}


// ═══════════════════════════════════════════════════════════════
// MODAL & NAVIGATION ENGINE
// ═══════════════════════════════════════════════════════════════

function openModal(item) {
  if (!detailsModal || !modalBody) return;

  modalBody.textContent = '';

  const details = [
    { label: 'Student Name', value: item.fullName },
    { label: 'Roll Number', value: item.rollNumber },
    { label: 'Student Email', value: item.studentEmail },
    { label: 'Semester', value: `Semester ${item.semester}` },
    { label: 'Elective Course', value: item.electiveCourse },
    { label: 'Security Policy', value: 'Verified (Regex Gate Passed 100%)' },
    { label: 'Submitted Timestamp', value: new Date(item.submittedAt).toLocaleString() }
  ];

  details.forEach(d => {
    const row = document.createElement('div');
    row.className = 'modal__detail-row';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'modal__detail-label';
    labelSpan.textContent = d.label;

    const valSpan = document.createElement('span');
    valSpan.className = 'modal__detail-value';
    valSpan.textContent = d.value;

    row.appendChild(labelSpan);
    row.appendChild(valSpan);
    modalBody.appendChild(row);
  });

  detailsModal.classList.add('is-open');
  detailsModal.setAttribute('aria-hidden', 'false');
  logAudit(`Opened detail inspection modal for ${item.rollNumber}`, 'info');
}

function closeModal() {
  if (!detailsModal) return;
  detailsModal.classList.remove('is-open');
  detailsModal.setAttribute('aria-hidden', 'true');
}

modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && detailsModal && detailsModal.classList.contains('is-open')) {
    closeModal();
  }
});


// ═══════════════════════════════════════════════════════════════
// TAB MODULE SWITCHER & THEME TOGGLE
// ═══════════════════════════════════════════════════════════════

navTabs.forEach(tab => {
  tab.addEventListener('click', function () {
    const target = tab.getAttribute('data-target');

    navTabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    const sections = document.querySelectorAll('.form-section');
    if (target === 'all-sections') {
      sections.forEach(s => s.style.display = 'block');
    } else {
      sections.forEach(s => {
        if (s.id === target) s.style.display = 'block';
        else s.style.display = 'none';
      });
    }
  });
});

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', function () {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    const icon = themeToggleBtn.querySelector('.theme-toggle-btn__icon');
    const text = themeToggleBtn.querySelector('.theme-toggle-btn__text');

    if (icon) icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    if (text) text.textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';

    showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
  });
}

// Restore saved theme on load
(function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector('.theme-toggle-btn__icon');
      const text = themeToggleBtn.querySelector('.theme-toggle-btn__text');
      if (icon) icon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
      if (text) text.textContent = savedTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
  }
})();

// Keyboard shortcut: '/' to focus search input
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== recordsSearchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    if (recordsSearchInput) recordsSearchInput.focus();
  }
});


// ═══════════════════════════════════════════════════════════════
// EXPORT & CLEAR ACTION LISTENERS
// ═══════════════════════════════════════════════════════════════

if (btnExportCSV) btnExportCSV.addEventListener('click', exportToCSV);
if (btnExportJSON) btnExportJSON.addEventListener('click', exportToJSON);

if (btnClearAll) {
  btnClearAll.addEventListener('click', function () {
    if (confirm('Are you sure you want to reset and clear all registered courses?')) {
      saveRegistrations([]);
      renderRegisteredCourses();
      showToast('Registry cleared successfully.', 'info');
      logAudit('Registry wiped by administrator', 'warn');
    }
  });
}

if (btnAuditClear && auditLogContainer) {
  btnAuditClear.addEventListener('click', function () {
    auditLogContainer.textContent = '';
    logAudit('Audit log cleared by user', 'info');
  });
}

if (recordsFilterCourse) recordsFilterCourse.addEventListener('change', renderRegisteredCourses);
if (recordsSearchInput) recordsSearchInput.addEventListener('input', renderRegisteredCourses);

// Initial Telemetry & Rendering
updateMetrics();
renderRegisteredCourses();
logAudit('NIIT Academic Portal Engine initialized', 'info');
logAudit('Validation Security Gate loaded (Strict Regex Tier 1)', 'success');
