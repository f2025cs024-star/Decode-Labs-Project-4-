/* ========================================================
   BSCS Student Toolkit — script.js
   Expert-level interactive logic
   const/let only · single-purpose functions
   textContent & createElement for DOM safety
   ======================================================== */

document.addEventListener('DOMContentLoaded', function initApp() {

  /* ======================================================
     1. GRADE MAP (fixed lookup)
     ====================================================== */
  const GRADE_POINTS = {
    'A':  4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B':  3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C':  2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D':  1.0,
    'F':  0.0
  };

  /* GPA status thresholds */
  const GPA_THRESHOLDS = {
    excellent: 3.5,
    good: 2.5,
    warning: 2.0
  };


  /* ======================================================
     2. APPLICATION STATE
     ====================================================== */
  let courses        = [];
  let nextCourseId   = 1;
  let isDarkMode     = false;
  let openAccordionIndex = null;


  /* ======================================================
     3. DOM REFERENCES
     ====================================================== */

  // GPA Calculator
  const courseListEl   = document.querySelector('.js-course-list');
  const addCourseBtn   = document.querySelector('.js-add-course-btn');
  const gpaValueEl     = document.querySelector('.js-gpa-value');
  const creditTotalEl  = document.querySelector('.js-credit-total');
  const courseCountEl   = document.querySelector('.js-course-count');
  const gpaStatusEl    = document.querySelector('.js-gpa-status');
  const gpaCardEl      = document.querySelector('.gpa__result-card--gpa');

  // Theme
  const themeToggleBtn = document.querySelector('.js-theme-toggle');

  // Accordion
  const accordionItems    = document.querySelectorAll('.js-accordion-item');
  const accordionTriggers = document.querySelectorAll('.js-accordion-trigger');

  // Sections for scroll reveal
  const revealElements = document.querySelectorAll('.section, .gpa__results, .accordion');


  /* ======================================================
     4. DARK MODE
     ====================================================== */

  /** Read saved theme from localStorage and apply immediately. */
  function loadSavedTheme() {
    const saved = localStorage.getItem('bscs-toolkit-theme');
    isDarkMode = saved === 'dark';
    applyTheme();
  }

  /** Sync DOM with the current isDarkMode state. */
  function applyTheme() {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Toggle thumb position is handled entirely by CSS via body.dark-mode
  }

  /** Flip theme state, persist, and re-render. */
  function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('bscs-toolkit-theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
  }


  /* ======================================================
     5. GPA CALCULATOR
     ====================================================== */

  /** Add a new blank course to state + DOM. */
  function addCourse() {
    const course = {
      id: nextCourseId++,
      name: '',
      credits: 0,
      grade: 'A'
    };
    courses.push(course);
    renderCourseRow(course);
    recalculateGPA();
    hideEmptyState();
  }

  /** Remove a course from state + DOM and recalculate. */
  function removeCourse(courseId) {
    courses = courses.filter(function keepOthers(c) {
      return c.id !== courseId;
    });

    const rowEl = courseListEl.querySelector('[data-course-id="' + courseId + '"]');
    if (rowEl) {
      // Animate out then remove
      rowEl.style.opacity = '0';
      rowEl.style.transform = 'translateY(-8px) scale(0.98)';
      setTimeout(function removeAfterAnimation() {
        if (rowEl.parentNode) {
          courseListEl.removeChild(rowEl);
        }
      }, 200);
    }

    recalculateGPA();

    if (courses.length === 0) {
      showEmptyState();
    }
  }

  /** Build a course row with createElement and attach it. */
  function renderCourseRow(course) {
    const row = document.createElement('div');
    row.classList.add('gpa__course-row');
    row.setAttribute('role', 'listitem');
    row.setAttribute('data-course-id', course.id);

    // Transition styles for removal animation
    row.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    // — Course Name
    const nameField = createInputField('Course Name', 'text', 'e.g. Data Structures');
    const nameInput = nameField.querySelector('input');
    nameInput.classList.add('js-course-name');
    nameInput.value = course.name;
    nameInput.addEventListener('input', function handleNameInput() {
      updateCourseName(course.id, nameInput.value);
    });

    // — Credit Hours
    const creditField = createInputField('Credits', 'number', '3');
    const creditInput = creditField.querySelector('input');
    creditInput.classList.add('js-course-credits');
    creditInput.min  = '0';
    creditInput.max  = '6';
    creditInput.step = '1';
    creditInput.value = course.credits || '';
    creditInput.addEventListener('input', function handleCreditInput() {
      updateCourseCredits(course.id, creditInput.value);
    });

    // — Grade Dropdown
    const gradeField = createGradeField(course.grade);
    const gradeSelect = gradeField.querySelector('select');
    gradeSelect.classList.add('js-course-grade');
    gradeSelect.addEventListener('change', function handleGradeChange() {
      updateCourseGrade(course.id, gradeSelect.value);
    });

    // — Remove Button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('gpa__remove-btn');
    removeBtn.setAttribute('aria-label', 'Remove this course');
    removeBtn.textContent = '✕ Remove';
    removeBtn.addEventListener('click', function handleRemove() {
      removeCourse(course.id);
    });

    row.appendChild(nameField);
    row.appendChild(creditField);
    row.appendChild(gradeField);
    row.appendChild(removeBtn);
    courseListEl.appendChild(row);
  }

  /** Helper: build a labelled input field. */
  function createInputField(labelText, inputType, placeholder) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('gpa__field');

    const label = document.createElement('span');
    label.classList.add('gpa__field-label');
    label.textContent = labelText;

    const input = document.createElement('input');
    input.classList.add('gpa__field-input');
    input.type = inputType;
    input.placeholder = placeholder;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
  }

  /** Helper: build a grade <select> dropdown. */
  function createGradeField(selectedGrade) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('gpa__field');

    const label = document.createElement('span');
    label.classList.add('gpa__field-label');
    label.textContent = 'Grade';

    const select = document.createElement('select');
    select.classList.add('gpa__field-select');

    const grades = Object.keys(GRADE_POINTS);
    for (let i = 0; i < grades.length; i++) {
      const option = document.createElement('option');
      option.value = grades[i];
      option.textContent = grades[i];
      if (grades[i] === selectedGrade) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    return wrapper;
  }

  /** Update course name in state (no GPA recalc needed). */
  function updateCourseName(courseId, newName) {
    const course = findCourseById(courseId);
    if (course) {
      course.name = newName;
    }
  }

  /** Update credit hours in state + recalculate. */
  function updateCourseCredits(courseId, newCredits) {
    const course = findCourseById(courseId);
    if (course) {
      course.credits = parseFloat(newCredits) || 0;
    }
    recalculateGPA();
  }

  /** Update grade in state + recalculate. */
  function updateCourseGrade(courseId, newGrade) {
    const course = findCourseById(courseId);
    if (course) {
      course.grade = newGrade;
    }
    recalculateGPA();
  }

  /** Lookup a course by id. */
  function findCourseById(courseId) {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].id === courseId) {
        return courses[i];
      }
    }
    return null;
  }

  /** Recalculate GPA from state and update result display. */
  function recalculateGPA() {
    let totalPoints  = 0;
    let totalCredits = 0;

    for (let i = 0; i < courses.length; i++) {
      const credits    = courses[i].credits;
      const gradePoint = GRADE_POINTS[courses[i].grade];

      if (credits > 0 && gradePoint !== undefined) {
        totalPoints  += credits * gradePoint;
        totalCredits += credits;
      }
    }

    const gpa = totalCredits > 0
      ? (totalPoints / totalCredits).toFixed(2)
      : '0.00';

    // Update DOM — only the result elements
    gpaValueEl.textContent    = gpa;
    creditTotalEl.textContent = totalCredits;
    courseCountEl.textContent  = courses.length;

    // Pulse animation on value change
    triggerPulse(gpaValueEl);

    // Update GPA status badge + color state
    updateGPAStatus(parseFloat(gpa), totalCredits);
  }

  /** Apply color-coded status to the GPA card. */
  function updateGPAStatus(gpa, totalCredits) {
    // Clear previous state classes
    gpaCardEl.classList.remove('is-excellent', 'is-good', 'is-warning', 'is-danger');

    if (totalCredits === 0) {
      gpaStatusEl.textContent = 'Add courses to begin';
      return;
    }

    if (gpa >= GPA_THRESHOLDS.excellent) {
      gpaCardEl.classList.add('is-excellent');
      gpaStatusEl.textContent = "Dean's List ★";
    } else if (gpa >= GPA_THRESHOLDS.good) {
      gpaCardEl.classList.add('is-good');
      gpaStatusEl.textContent = 'Good Standing';
    } else if (gpa >= GPA_THRESHOLDS.warning) {
      gpaCardEl.classList.add('is-warning');
      gpaStatusEl.textContent = 'Needs Improvement';
    } else {
      gpaCardEl.classList.add('is-danger');
      gpaStatusEl.textContent = 'Academic Probation';
    }
  }

  /** Trigger a pulse animation on an element. */
  function triggerPulse(element) {
    element.classList.remove('is-pulse');
    // Force reflow to restart animation
    void element.offsetWidth;
    element.classList.add('is-pulse');
  }

  /** Show the empty-state placeholder. */
  function showEmptyState() {
    if (courseListEl.querySelector('.gpa__empty-state')) return;

    const empty = document.createElement('div');
    empty.classList.add('gpa__empty-state');

    const icon = document.createElement('span');
    icon.classList.add('gpa__empty-icon');
    icon.textContent = '📚';
    icon.setAttribute('aria-hidden', 'true');

    const text = document.createElement('p');
    text.classList.add('gpa__empty-text');
    text.textContent = 'No courses added yet';

    const hint = document.createElement('p');
    hint.classList.add('gpa__empty-hint');
    hint.textContent = 'Click "Add Course" below to start calculating your GPA';

    empty.appendChild(icon);
    empty.appendChild(text);
    empty.appendChild(hint);
    courseListEl.appendChild(empty);
  }

  /** Remove the empty-state placeholder. */
  function hideEmptyState() {
    const empty = courseListEl.querySelector('.gpa__empty-state');
    if (empty) {
      courseListEl.removeChild(empty);
    }
  }


  /* ======================================================
     6. FAQ ACCORDION
     ====================================================== */

  /** Toggle an accordion item (only one open at a time). */
  function toggleAccordionItem(clickedIndex) {
    if (openAccordionIndex === clickedIndex) {
      closeAccordionItem(clickedIndex);
      openAccordionIndex = null;
      return;
    }

    if (openAccordionIndex !== null) {
      closeAccordionItem(openAccordionIndex);
    }

    openAccordionItem(clickedIndex);
    openAccordionIndex = clickedIndex;
  }

  /** Open an accordion item at a given index. */
  function openAccordionItem(index) {
    const item    = accordionItems[index];
    const trigger = accordionTriggers[index];

    if (item && trigger) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  /** Close an accordion item at a given index. */
  function closeAccordionItem(index) {
    const item    = accordionItems[index];
    const trigger = accordionTriggers[index];

    if (item && trigger) {
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  }


  /* ======================================================
     7. SCROLL-REVEAL (IntersectionObserver)
     ====================================================== */

  /** Set up scroll-triggered reveal animations. */
  function initScrollReveal() {
    // Bail out if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(handleRevealEntries, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    for (let i = 0; i < revealElements.length; i++) {
      revealElements[i].classList.add('is-reveal');
      observer.observe(revealElements[i]);
    }
  }

  /** Callback for IntersectionObserver entries. */
  function handleRevealEntries(entries, observer) {
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('is-visible');
        observer.unobserve(entries[i].target);
      }
    }
  }


  /* ======================================================
     8. EVENT LISTENERS
     ====================================================== */

  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleTheme);

  // GPA — add course
  addCourseBtn.addEventListener('click', addCourse);

  // Accordion triggers
  for (let i = 0; i < accordionTriggers.length; i++) {
    accordionTriggers[i].addEventListener('click', function handleAccordionClick() {
      toggleAccordionItem(i);
    });
  }


  /* ======================================================
     9. INITIALIZATION
     ====================================================== */

  // Apply saved theme immediately
  loadSavedTheme();

  // Show empty state on first load
  showEmptyState();

  // Boot scroll reveal
  initScrollReveal();

});
