/* ═══════════════════════════════════════════════════════════════
   NIIT Course Registration & Feedback — script.js
   DecodeLabs Project 4 · Form Design & Validation
   
   Architecture (IPO Pipeline):
   ┌─────────┐    ┌───────────┐    ┌──────────┐
   │  INPUT  │───▸│  PROCESS  │───▸│  OUTPUT  │
   │  (HTML) │    │ (JS/Regex)│    │(DOM/ARIA)│
   └─────────┘    └───────────┘    └──────────┘

   - INPUT:   Semantic HTML forms capture user data
   - PROCESS: Validation functions (regex + logic) inspect data
   - OUTPUT:  Dynamic ARIA attributes + visual feedback guide user

   Rules:
   - const by default, let only when mutation is needed
   - No var, no innerHTML, no inline handlers
   - js- prefixed classes for JS hooks (never styled)
   - is- prefixed classes for visual states (styled in CSS)
   - Small, single-purpose named functions
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── DOM REFERENCES (const — these never change) ────────────────

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

// Password toggle buttons
const toggleButtons = document.querySelectorAll('.js-toggle-password');


// ─── REGEX PATTERNS (const — immutable) ─────────────────────────

// Full password policy — all four lookaheads + length gate
// (?=.*?[A-Z]) → at least one uppercase
// (?=.*?[a-z]) → at least one lowercase
// (?=.*?[0-9]) → at least one digit
// (?=.*?[#?!@$%^&*-]) → at least one special char from that set
// .{8,} → minimum 8 chars total
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

// Individual password sub-rules (for checklist feedback)
const HAS_UPPERCASE = /[A-Z]/;
const HAS_LOWERCASE = /[a-z]/;
const HAS_DIGIT     = /[0-9]/;
const HAS_SPECIAL   = /[#?!@$%^&*-]/;
const MIN_LENGTH    = 8;

// Email format — general-purpose, not overly strict.
// Checks: non-whitespace + @ + non-whitespace + dot + non-whitespace
// NOTE: True inbox existence can only ever be verified server-side.
// Client-side regex only catches obvious typos and format errors — 
// it is NOT proof the address is real or deliverable.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Roll number — pattern: F20XX-CS-XXX (e.g. F2025-CS-042)
// F20 followed by two digits, dash, CS, dash, three digits
const ROLL_REGEX = /^F20[0-9]{2}-CS-[0-9]{3}$/;

// Minimum message length for feedback textarea
const MESSAGE_MIN_LENGTH = 20;


// ═══════════════════════════════════════════════════════════════
// PROCESS PHASE — Validation Functions
// Each function inspects a single value and returns a result.
// ═══════════════════════════════════════════════════════════════

/**
 * Validates a required text field is not empty after trimming.
 * @param {string} value - The field value
 * @returns {{ valid: boolean, message: string }}
 */
function validateRequired(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'This field is required.' };
  }
  return { valid: true, message: '' };
}


/**
 * Validates email format using a general-purpose regex.
 * NOTE: This only catches format errors — actual inbox verification 
 * requires server-side validation via SMTP or confirmation email.
 * @param {string} value - The email string
 * @returns {{ valid: boolean, message: string }}
 */
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


/**
 * Validates the roll number against the F20XX-CS-XXX format.
 * @param {string} value - The roll number string
 * @returns {{ valid: boolean, message: string }}
 */
function validateRollNumber(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Roll number is required.' };
  }
  if (!ROLL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Roll number must follow the format F20XX-CS-XXX (e.g. F2025-CS-042).' };
  }
  return { valid: true, message: '' };
}


/**
 * Validates a <select> dropdown has a non-empty value selected.
 * @param {string} value - The selected option value
 * @param {string} fieldName - Human-readable name for the error message
 * @returns {{ valid: boolean, message: string }}
 */
function validateSelect(value, fieldName) {
  if (!value || value === '') {
    return { valid: false, message: `Please select a ${fieldName}.` };
  }
  return { valid: true, message: '' };
}


/**
 * Validates the password against the full policy regex AND returns
 * per-rule results for the visual checklist.
 * @param {string} value - The password string
 * @returns {{ valid: boolean, message: string, rules: object }}
 */
function validatePassword(value) {
  const rules = {
    upper:   HAS_UPPERCASE.test(value),
    lower:   HAS_LOWERCASE.test(value),
    digit:   HAS_DIGIT.test(value),
    special: HAS_SPECIAL.test(value),
    length:  value.length >= MIN_LENGTH
  };

  // Build specific failure messages
  const failures = [];
  if (!rules.upper)   failures.push('one uppercase letter (A–Z)');
  if (!rules.lower)   failures.push('one lowercase letter (a–z)');
  if (!rules.digit)   failures.push('one digit (0–9)');
  if (!rules.special) failures.push('one special character (#?!@$%^&*-)');
  if (!rules.length)  failures.push('at least 8 characters total');

  if (value.length === 0) {
    return {
      valid: false,
      message: 'Password is required.',
      rules
    };
  }

  // Use the master regex as the single source of truth for overall pass/fail
  const valid = PASSWORD_REGEX.test(value);

  let message = '';
  if (!valid) {
    message = `Password must contain: ${failures.join(', ')}.`;
  }

  return { valid, message, rules };
}


/**
 * Validates that the confirm-password field matches the password.
 * HTML5 has no native cross-field validation — this is purely JS.
 * @param {string} confirmValue - The confirm password input value
 * @param {string} passwordValue - The original password input value
 * @returns {{ valid: boolean, message: string }}
 */
function validateConfirmPassword(confirmValue, passwordValue) {
  if (confirmValue.length === 0) {
    return { valid: false, message: 'Please confirm your password.' };
  }
  if (confirmValue !== passwordValue) {
    return { valid: false, message: 'Passwords do not match. Please re-enter.' };
  }
  return { valid: true, message: '' };
}


/**
 * Validates the message textarea has at least the minimum character count.
 * Uses trim() first so whitespace-only input doesn't pass.
 * @param {string} value - The textarea content
 * @returns {{ valid: boolean, message: string }}
 */
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
// OUTPUT PHASE — DOM/ARIA Feedback Functions
// These functions communicate validation results to users and 
// assistive technology through ARIA attributes and CSS state classes.
// ═══════════════════════════════════════════════════════════════

/**
 * Shows an error state on an input and its associated error element.
 * Sets aria-invalid="true", adds is-invalid class, displays message.
 * @param {HTMLElement} inputEl - The input/select/textarea element
 * @param {HTMLElement} errorEl - The associated error message span
 * @param {string} message - The error text to display
 */
function showError(inputEl, errorEl, message) {
  // ARIA: mark field as invalid for screen readers
  inputEl.setAttribute('aria-invalid', 'true');

  // Visual: toggle CSS state classes
  inputEl.classList.add('is-invalid');
  inputEl.classList.remove('is-valid');

  // Display error text using textContent (never innerHTML)
  errorEl.textContent = message;
  errorEl.classList.add('is-visible');

  // Trigger shake animation for visual emphasis
  inputEl.classList.remove('is-shake');
  // Force reflow to restart animation
  void inputEl.offsetWidth;
  inputEl.classList.add('is-shake');
}


/**
 * Clears the error state from an input and optionally marks it valid.
 * Sets aria-invalid="false", removes is-invalid, hides error text.
 * @param {HTMLElement} inputEl - The input/select/textarea element
 * @param {HTMLElement} errorEl - The associated error message span
 * @param {boolean} [markValid=false] - Whether to apply is-valid class
 */
function clearError(inputEl, errorEl, markValid = false) {
  // ARIA: clear invalid state
  inputEl.setAttribute('aria-invalid', 'false');

  // Visual: remove error styling
  inputEl.classList.remove('is-invalid', 'is-shake');

  // Clear the error message text
  errorEl.textContent = '';
  errorEl.classList.remove('is-visible');

  // Optionally mark as valid (green border)
  if (markValid) {
    inputEl.classList.add('is-valid');
  } else {
    inputEl.classList.remove('is-valid');
  }
}


/**
 * Shows a status message in the form's aria-live region.
 * @param {HTMLElement} statusEl - The aria-live="polite" container
 * @param {string} message - The status text
 * @param {'success'|'error'} type - Message type for styling
 */
function showStatus(statusEl, message, type) {
  statusEl.textContent = message;
  statusEl.classList.remove('form__status--success', 'form__status--error');
  statusEl.classList.add(`form__status--${type}`, 'is-visible');
}


/**
 * Clears the form status message and hides the container.
 * @param {HTMLElement} statusEl - The aria-live="polite" container
 */
function clearStatus(statusEl) {
  statusEl.textContent = '';
  statusEl.classList.remove('form__status--success', 'form__status--error', 'is-visible');
}


/**
 * Updates the password strength checklist UI.
 * Toggles is-valid / is-invalid on each checklist item based on rules.
 * @param {object} rules - Object with boolean results for each sub-rule
 * @param {boolean} showErrors - Whether to highlight failures (on blur/submit)
 */
function updatePasswordChecklist(rules, showErrors) {
  const ruleMap = {
    upper:   checkUpper,
    lower:   checkLower,
    digit:   checkDigit,
    special: checkSpecial,
    length:  checkLength
  };

  for (const [key, element] of Object.entries(ruleMap)) {
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
}


/**
 * Resets all password checklist items to neutral state.
 */
function resetPasswordChecklist() {
  const items = [checkUpper, checkLower, checkDigit, checkSpecial, checkLength];
  for (const item of items) {
    item.classList.remove('is-valid', 'is-invalid');
  }
}


/**
 * Resets all visual states from a form's fields.
 * Called after a successful submission + form.reset().
 * @param {HTMLFormElement} formEl - The form element
 */
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


// ═══════════════════════════════════════════════════════════════
// FIELD-LEVEL VALIDATION (triggered on blur, NOT on every keystroke)
// Per requirement: validate on blur and on submit — never on input/keydown
// to avoid infuriating screen reader users with constant announcements.
// ═══════════════════════════════════════════════════════════════

/**
 * Returns the error element associated with a given input.
 * Finds it by the input's aria-describedby attribute matching error IDs.
 * @param {HTMLElement} inputEl - The input element
 * @returns {HTMLElement|null}
 */
function getErrorElement(inputEl) {
  const describedBy = inputEl.getAttribute('aria-describedby');
  if (!describedBy) return null;

  // aria-describedby may list multiple IDs (e.g. "hint error");
  // find the one that ends with "-error"
  const ids = describedBy.split(' ');
  for (const id of ids) {
    if (id.endsWith('-error')) {
      return document.getElementById(id);
    }
  }
  return null;
}


// ── Registration form blur handlers ─────────────────────────────

function handleRegNameBlur() {
  const result = validateRequired(regNameInput.value);
  const errorEl = getErrorElement(regNameInput);
  if (!result.valid) {
    showError(regNameInput, errorEl, 'Full name is required.');
  } else {
    clearError(regNameInput, errorEl, true);
  }
}

function handleRegEmailBlur() {
  const result = validateEmail(regEmailInput.value);
  const errorEl = getErrorElement(regEmailInput);
  if (!result.valid) {
    showError(regEmailInput, errorEl, result.message);
  } else {
    clearError(regEmailInput, errorEl, true);
  }
}

function handleRegRollBlur() {
  const result = validateRollNumber(regRollInput.value);
  const errorEl = getErrorElement(regRollInput);
  if (!result.valid) {
    showError(regRollInput, errorEl, result.message);
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

  // Update checklist with failure highlighting on blur
  updatePasswordChecklist(result.rules, true);

  if (!result.valid) {
    showError(regPasswordInput, errorEl, result.message);
  } else {
    clearError(regPasswordInput, errorEl, true);
  }

  // Also re-validate confirm password if it has a value
  if (regConfirmInput.value.length > 0) {
    handleRegConfirmBlur();
  }
}

function handleRegConfirmBlur() {
  const result = validateConfirmPassword(regConfirmInput.value, regPasswordInput.value);
  const errorEl = getErrorElement(regConfirmInput);
  if (!result.valid) {
    showError(regConfirmInput, errorEl, result.message);
  } else {
    clearError(regConfirmInput, errorEl, true);
  }
}


// ── Feedback form blur handlers ─────────────────────────────────

function handleFbNameBlur() {
  const result = validateRequired(fbNameInput.value);
  const errorEl = getErrorElement(fbNameInput);
  if (!result.valid) {
    showError(fbNameInput, errorEl, 'Name is required.');
  } else {
    clearError(fbNameInput, errorEl, true);
  }
}

function handleFbEmailBlur() {
  const result = validateEmail(fbEmailInput.value);
  const errorEl = getErrorElement(fbEmailInput);
  if (!result.valid) {
    showError(fbEmailInput, errorEl, result.message);
  } else {
    clearError(fbEmailInput, errorEl, true);
  }
}

function handleFbSubjectBlur() {
  const result = validateRequired(fbSubjectInput.value);
  const errorEl = getErrorElement(fbSubjectInput);
  if (!result.valid) {
    showError(fbSubjectInput, errorEl, 'Subject is required.');
  } else {
    clearError(fbSubjectInput, errorEl, true);
  }
}

function handleFbMessageBlur() {
  const result = validateMessage(fbMessageInput.value);
  const errorEl = getErrorElement(fbMessageInput);
  if (!result.valid) {
    showError(fbMessageInput, errorEl, result.message);
  } else {
    clearError(fbMessageInput, errorEl, true);
  }
}


// ═══════════════════════════════════════════════════════════════
// EVENT LISTENERS — Blur validation (per-field, not per-keystroke)
// ═══════════════════════════════════════════════════════════════

// Registration form — validate each field when the user leaves it
regNameInput.addEventListener('blur', handleRegNameBlur);
regEmailInput.addEventListener('blur', handleRegEmailBlur);
regRollInput.addEventListener('blur', handleRegRollBlur);
regSemesterInput.addEventListener('blur', handleRegSemesterBlur);
regSemesterInput.addEventListener('change', handleRegSemesterBlur);
regCourseInput.addEventListener('blur', handleRegCourseBlur);
regCourseInput.addEventListener('change', handleRegCourseBlur);
regPasswordInput.addEventListener('blur', handleRegPasswordBlur);
regConfirmInput.addEventListener('blur', handleRegConfirmBlur);

// Feedback form — validate each field when the user leaves it
fbNameInput.addEventListener('blur', handleFbNameBlur);
fbEmailInput.addEventListener('blur', handleFbEmailBlur);
fbSubjectInput.addEventListener('blur', handleFbSubjectBlur);
fbMessageInput.addEventListener('blur', handleFbMessageBlur);


// ─── SPECIAL: Password live checklist update ────────────────────
// The password checklist provides real-time visual feedback (green dots)
// as the user types, but does NOT announce errors on every keystroke.
// Error announcements (aria/role="alert") only fire on blur and submit.
regPasswordInput.addEventListener('input', function () {
  const result = validatePassword(regPasswordInput.value);
  // Update visual checklist WITHOUT marking failures — just show what passes
  updatePasswordChecklist(result.rules, false);
});


// ─── SPECIAL: Feedback message character counter ────────────────
// Updates the character count display as the user types.
// Does NOT trigger error messages or ARIA announcements on input.
fbMessageInput.addEventListener('input', function () {
  const currentLength = fbMessageInput.value.trim().length;
  fbCharCount.textContent = currentLength;
});


// ─── Password toggle visibility ─────────────────────────────────
for (const btn of toggleButtons) {
  btn.addEventListener('click', function () {
    const targetId = btn.getAttribute('data-target');
    const targetInput = document.getElementById(targetId);
    if (!targetInput) return;

    const isPassword = targetInput.type === 'password';
    targetInput.type = isPassword ? 'text' : 'password';

    // Update the eye icon
    const icon = btn.querySelector('.form__eye-icon');
    icon.textContent = isPassword ? '🙈' : '👁';

    // Update aria-label for screen readers
    btn.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    );
  });
}


// ═══════════════════════════════════════════════════════════════
// SUBMIT HANDLERS — The full IPO pipeline in action
// PROCESS all fields → OUTPUT errors or success
// ═══════════════════════════════════════════════════════════════

/**
 * Handles the registration form submission.
 * Prevents default refresh, validates all fields, and either
 * shows errors or simulates a successful submission.
 * @param {Event} event - The submit event
 */
function handleRegistrationSubmit(event) {
  // ★ PREVENT THE DEFAULT REFRESH — must be the VERY FIRST line
  event.preventDefault();

  // Clear any previous status message
  clearStatus(regStatus);

  // Track overall validity
  let isFormValid = true;

  // ── Validate Full Name ──
  const nameResult = validateRequired(regNameInput.value);
  const nameError = getErrorElement(regNameInput);
  if (!nameResult.valid) {
    showError(regNameInput, nameError, 'Full name is required.');
    isFormValid = false;
  } else {
    clearError(regNameInput, nameError, true);
  }

  // ── Validate Email ──
  const emailResult = validateEmail(regEmailInput.value);
  const emailError = getErrorElement(regEmailInput);
  if (!emailResult.valid) {
    showError(regEmailInput, emailError, emailResult.message);
    isFormValid = false;
  } else {
    clearError(regEmailInput, emailError, true);
  }

  // ── Validate Roll Number ──
  const rollResult = validateRollNumber(regRollInput.value);
  const rollError = getErrorElement(regRollInput);
  if (!rollResult.valid) {
    showError(regRollInput, rollError, rollResult.message);
    isFormValid = false;
  } else {
    clearError(regRollInput, rollError, true);
  }

  // ── Validate Semester ──
  const semesterResult = validateSelect(regSemesterInput.value, 'semester');
  const semesterError = getErrorElement(regSemesterInput);
  if (!semesterResult.valid) {
    showError(regSemesterInput, semesterError, semesterResult.message);
    isFormValid = false;
  } else {
    clearError(regSemesterInput, semesterError, true);
  }

  // ── Validate Elective Course ──
  const courseResult = validateSelect(regCourseInput.value, 'course');
  const courseError = getErrorElement(regCourseInput);
  if (!courseResult.valid) {
    showError(regCourseInput, courseError, courseResult.message);
    isFormValid = false;
  } else {
    clearError(regCourseInput, courseError, true);
  }

  // ── Validate Password ──
  const passwordResult = validatePassword(regPasswordInput.value);
  const passwordError = getErrorElement(regPasswordInput);
  updatePasswordChecklist(passwordResult.rules, true);
  if (!passwordResult.valid) {
    showError(regPasswordInput, passwordError, passwordResult.message);
    isFormValid = false;
  } else {
    clearError(regPasswordInput, passwordError, true);
  }

  // ── Validate Confirm Password (cross-field — HTML5 can't do this) ──
  const confirmResult = validateConfirmPassword(
    regConfirmInput.value,
    regPasswordInput.value
  );
  const confirmError = getErrorElement(regConfirmInput);
  if (!confirmResult.valid) {
    showError(regConfirmInput, confirmError, confirmResult.message);
    isFormValid = false;
  } else {
    clearError(regConfirmInput, confirmError, true);
  }

  // ── DECISION GATE ──
  if (!isFormValid) {
    // Focus the first invalid field for keyboard users
    const firstInvalid = registrationForm.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();

    showStatus(regStatus, 'Please fix the errors above before submitting.', 'error');
    return;
  }

  // ── SUCCESS: Package data and simulate transmission ──
  const formData = {
    fullName: regNameInput.value.trim(),
    studentEmail: regEmailInput.value.trim(),
    rollNumber: regRollInput.value.trim(),
    semester: regSemesterInput.value,
    electiveCourse: regCourseInput.value,
    // Never log actual passwords in production — this is a simulation
    passwordHash: '[REDACTED — would be hashed server-side]',
    submittedAt: new Date().toISOString()
  };

  // Simulate "transmission" to backend API
  console.log('📋 Registration Payload:', JSON.stringify(formData, null, 2));

  // Save registration to local storage and update viewer live
  addRegistration(formData);

  // Show success message in the aria-live region
  showStatus(
    regStatus,
    '✅ Registration submitted successfully! We\'ll email you a confirmation at ' + formData.studentEmail + '. Your course enrollment is now visible under Registered Elective Courses below.',
    'success'
  );

  // Reset the form and clear all visual states
  registrationForm.reset();
  clearAllFieldStates(registrationForm);
  resetPasswordChecklist();
}


/**
 * Handles the feedback form submission.
 * Prevents default refresh, validates all fields, and either
 * shows errors or simulates a successful submission.
 * @param {Event} event - The submit event
 */
function handleFeedbackSubmit(event) {
  // ★ PREVENT THE DEFAULT REFRESH — must be the VERY FIRST line
  event.preventDefault();

  // Clear any previous status message
  clearStatus(fbStatus);

  // Track overall validity
  let isFormValid = true;

  // ── Validate Name ──
  const nameResult = validateRequired(fbNameInput.value);
  const nameError = getErrorElement(fbNameInput);
  if (!nameResult.valid) {
    showError(fbNameInput, nameError, 'Name is required.');
    isFormValid = false;
  } else {
    clearError(fbNameInput, nameError, true);
  }

  // ── Validate Email ──
  const emailResult = validateEmail(fbEmailInput.value);
  const emailError = getErrorElement(fbEmailInput);
  if (!emailResult.valid) {
    showError(fbEmailInput, emailError, emailResult.message);
    isFormValid = false;
  } else {
    clearError(fbEmailInput, emailError, true);
  }

  // ── Validate Subject ──
  const subjectResult = validateRequired(fbSubjectInput.value);
  const subjectError = getErrorElement(fbSubjectInput);
  if (!subjectResult.valid) {
    showError(fbSubjectInput, subjectError, 'Subject is required.');
    isFormValid = false;
  } else {
    clearError(fbSubjectInput, subjectError, true);
  }

  // ── Validate Message (min length using trim, not regex) ──
  const messageResult = validateMessage(fbMessageInput.value);
  const messageError = getErrorElement(fbMessageInput);
  if (!messageResult.valid) {
    showError(fbMessageInput, messageError, messageResult.message);
    isFormValid = false;
  } else {
    clearError(fbMessageInput, messageError, true);
  }

  // ── DECISION GATE ──
  if (!isFormValid) {
    // Focus the first invalid field for keyboard users
    const firstInvalid = feedbackForm.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();

    showStatus(fbStatus, 'Please fix the errors above before submitting.', 'error');
    return;
  }

  // ── SUCCESS: Package data and simulate transmission ──
  const formData = {
    name: fbNameInput.value.trim(),
    email: fbEmailInput.value.trim(),
    subject: fbSubjectInput.value.trim(),
    message: fbMessageInput.value.trim(),
    submittedAt: new Date().toISOString()
  };

  // Simulate "transmission" to backend API
  console.log('💬 Feedback Payload:', JSON.stringify(formData, null, 2));

  // Show success message in the aria-live region
  showStatus(
    fbStatus,
    '✅ Feedback submitted successfully! Thank you — we\'ll respond to ' + formData.email + ' within 24 hours.',
    'success'
  );

  // Reset the form and clear all visual states
  feedbackForm.reset();
  clearAllFieldStates(feedbackForm);

  // Reset char counter
  fbCharCount.textContent = '0';
}


// ═══════════════════════════════════════════════════════════════
// ATTACH SUBMIT LISTENERS — addEventListener only, no inline handlers
// ═══════════════════════════════════════════════════════════════

registrationForm.addEventListener('submit', handleRegistrationSubmit);
feedbackForm.addEventListener('submit', handleFeedbackSubmit);


// ═══════════════════════════════════════════════════════════════
// REGISTERED COURSES VIEWER & MODAL ENGINE
// ═══════════════════════════════════════════════════════════════

// Registered Courses Viewer DOM references
const recordsFilterCourse = document.querySelector('.js-records-filter-course');
const recordsSearchInput  = document.querySelector('.js-records-search');
const recordsCountBadge   = document.querySelector('.js-records-count');
const recordsListGrid     = document.querySelector('.js-records-list');

// Modal DOM references
const detailsModal      = document.querySelector('.js-modal');
const modalBody         = document.querySelector('.js-modal-body');
const modalCloseBtns    = document.querySelectorAll('.js-modal-close');
const modalOverlay      = document.querySelector('.js-modal-overlay');

// LocalStorage key for persisting course registrations
const STORAGE_KEY = 'niit_registered_courses_v1';

// Initial sample data if storage is empty
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

/**
 * Retrieves stored registrations from localStorage or initializes sample data.
 * @returns {Array<Object>}
 */
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

/**
 * Saves registrations array to localStorage.
 * @param {Array<Object>} list
 */
function saveRegistrations(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save registrations to localStorage:', e);
  }
}

/**
 * Adds a new course registration to storage and refreshes UI.
 * @param {Object} formData
 */
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
  list.unshift(newRecord); // Add to top
  saveRegistrations(list);
  renderRegisteredCourses();
}

/**
 * Deletes a course registration by ID.
 * @param {string} id
 */
function removeRegistration(id) {
  let list = getRegistrations();
  list = list.filter(item => item.id !== id);
  saveRegistrations(list);
  renderRegisteredCourses();
}

/**
 * Renders the filtered/searched registered courses list.
 */
function renderRegisteredCourses() {
  if (!recordsListGrid) return;

  const allRecords = getRegistrations();
  const selectedCourse = recordsFilterCourse ? recordsFilterCourse.value : 'ALL';
  const searchTerm = recordsSearchInput ? recordsSearchInput.value.trim().toLowerCase() : '';

  // Filter logic
  const filtered = allRecords.filter(item => {
    const matchesCourse = selectedCourse === 'ALL' || item.electiveCourse === selectedCourse;
    const matchesSearch = searchTerm === '' ||
      item.fullName.toLowerCase().includes(searchTerm) ||
      item.rollNumber.toLowerCase().includes(searchTerm) ||
      item.studentEmail.toLowerCase().includes(searchTerm);
    return matchesCourse && matchesSearch;
  });

  // Update badge count
  if (recordsCountBadge) {
    recordsCountBadge.textContent = `Showing ${filtered.length} enrollment${filtered.length === 1 ? '' : 's'}`;
  }

  // Clear existing grid using textContent
  recordsListGrid.textContent = '';

  if (filtered.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'records__empty';
    emptyMsg.textContent = 'No course registrations match your current filter or search criteria.';
    recordsListGrid.appendChild(emptyMsg);
    return;
  }

  // Render cards cleanly using textContent
  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'record-card';

    // Header
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

    // Info body
    const cardInfo = document.createElement('div');
    cardInfo.className = 'record-card__info';

    const semLine = document.createElement('div');
    semLine.textContent = `Semester ${item.semester}`;

    const emailLine = document.createElement('div');
    emailLine.textContent = item.studentEmail;

    const dateLine = document.createElement('div');
    const dateFormatted = new Date(item.submittedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    dateLine.textContent = `Enrolled: ${dateFormatted}`;

    cardInfo.appendChild(semLine);
    cardInfo.appendChild(emailLine);
    cardInfo.appendChild(dateLine);

    // Actions
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

    // Assemble card
    card.appendChild(cardHeader);
    card.appendChild(cardInfo);
    card.appendChild(cardActions);

    recordsListGrid.appendChild(card);
  });
}

/**
 * Opens the enrollment details modal.
 * @param {Object} item - Registration object
 */
function openModal(item) {
  if (!detailsModal || !modalBody) return;

  modalBody.textContent = ''; // clear

  const details = [
    { label: 'Student Name', value: item.fullName },
    { label: 'Roll Number', value: item.rollNumber },
    { label: 'Student Email', value: item.studentEmail },
    { label: 'Semester', value: `Semester ${item.semester}` },
    { label: 'Elective Course', value: item.electiveCourse },
    { label: 'Password Policy', value: 'Verified (Strict Policy Passed)' },
    { label: 'Submitted Date', value: new Date(item.submittedAt).toLocaleString() }
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
}

/**
 * Closes the enrollment details modal.
 */
function closeModal() {
  if (!detailsModal) return;
  detailsModal.classList.remove('is-open');
  detailsModal.setAttribute('aria-hidden', 'true');
}

// Attach modal close listeners
modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && detailsModal && detailsModal.classList.contains('is-open')) {
    closeModal();
  }
});

// Attach Filter and Search listeners
if (recordsFilterCourse) recordsFilterCourse.addEventListener('change', renderRegisteredCourses);
if (recordsSearchInput) recordsSearchInput.addEventListener('input', renderRegisteredCourses);

// Initial render on page load
renderRegisteredCourses();

