/* ========================================================
   BSCS Student Toolkit — script.js
   Single-purpose functions · const/let only
   textContent & createElement for DOM safety
   ======================================================== */

document.addEventListener('DOMContentLoaded', function initApp() {

  /* ======================================================
     1. GRADE MAP (fixed lookup — never reassigned)
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


  /* ======================================================
     2. STATE
     ====================================================== */

  // GPA calculator — array of course objects
  let courses = [];
  let nextCourseId = 1;

  // Theme
  let isDarkMode = false;

  // Accordion — index of currently open item (null = all closed)
  let openAccordionIndex = null;


  /* ======================================================
     3. DOM REFERENCES (const — never reassigned)
     ====================================================== */

  // GPA
  const courseListEl   = document.querySelector('.js-course-list');
  const addCourseBtn   = document.querySelector('.js-add-course-btn');
  const gpaValueEl     = document.querySelector('.js-gpa-value');
  const creditTotalEl  = document.querySelector('.js-credit-total');

  // Theme
  const themeToggleBtn = document.querySelector('.js-theme-toggle');
  const themeIconEl    = document.querySelector('.js-theme-icon');
  const themeLabelEl   = document.querySelector('.js-theme-label');

  // Accordion
  const accordionItems    = document.querySelectorAll('.js-accordion-item');
  const accordionTriggers = document.querySelectorAll('.js-accordion-trigger');


  /* ======================================================
     4. DARK MODE
     ====================================================== */

  /** Read saved theme from localStorage and apply it. */
  function loadSavedTheme() {
    const saved = localStorage.getItem('theme');
    isDarkMode = saved === 'dark';
    applyTheme();
  }

  /** Apply the current isDarkMode state to the DOM. */
  function applyTheme() {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    updateThemeToggleUI();
  }

  /** Update the toggle button's icon and label to reflect state. */
  function updateThemeToggleUI() {
    themeIconEl.textContent  = isDarkMode ? '☀️' : '🌙';
    themeLabelEl.textContent = isDarkMode ? 'Light' : 'Dark';
  }

  /** Toggle theme: flip state → persist → re-render. */
  function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
  }


  /* ======================================================
     5. GPA CALCULATOR
     ====================================================== */

  /** Create a new course entry in state and render its row. */
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

  /** Remove a course from state by id, remove its DOM row, and recalculate. */
  function removeCourse(courseId) {
    courses = courses.filter(function keepOthers(c) {
      return c.id !== courseId;
    });

    const rowEl = courseListEl.querySelector('[data-course-id="' + courseId + '"]');
    if (rowEl) {
      courseListEl.removeChild(rowEl);
    }

    recalculateGPA();

    if (courses.length === 0) {
      showEmptyState();
    }
  }

  /** Build a single course row using createElement and append it. */
  function renderCourseRow(course) {
    const row = document.createElement('div');
    row.classList.add('gpa__course-row');
    row.setAttribute('role', 'listitem');
    row.setAttribute('data-course-id', course.id);

    // — Course Name field
    const nameField = createField('Course Name', 'text', 'e.g. Data Structures');
    const nameInput = nameField.querySelector('input');
    nameInput.classList.add('js-course-name');
    nameInput.value = course.name;
    nameInput.addEventListener('input', function handleNameInput() {
      updateCourseName(course.id, nameInput.value);
    });

    // — Credit Hours field
    const creditField = createField('Credits', 'number', '3');
    const creditInput = creditField.querySelector('input');
    creditInput.classList.add('js-course-credits');
    creditInput.min  = '0';
    creditInput.max  = '6';
    creditInput.step = '1';
    creditInput.value = course.credits || '';
    creditInput.addEventListener('input', function handleCreditInput() {
      updateCourseCredits(course.id, creditInput.value);
    });

    // — Grade dropdown
    const gradeField = createGradeField(course.grade);
    const gradeSelect = gradeField.querySelector('select');
    gradeSelect.classList.add('js-course-grade');
    gradeSelect.addEventListener('change', function handleGradeChange() {
      updateCourseGrade(course.id, gradeSelect.value);
    });

    // — Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('gpa__remove-btn');
    removeBtn.setAttribute('aria-label', 'Remove course');
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

  /** Helper: create a labelled text/number input field. */
  function createField(labelText, inputType, placeholder) {
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

  /** Helper: create a grade <select> dropdown. */
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

  /** Update a course's name in state. */
  function updateCourseName(courseId, newName) {
    const course = findCourseById(courseId);
    if (course) {
      course.name = newName;
    }
    // No GPA recalc needed for name changes
  }

  /** Update a course's credit hours in state, then recalculate. */
  function updateCourseCredits(courseId, newCredits) {
    const course = findCourseById(courseId);
    if (course) {
      course.credits = parseFloat(newCredits) || 0;
    }
    recalculateGPA();
  }

  /** Update a course's grade in state, then recalculate. */
  function updateCourseGrade(courseId, newGrade) {
    const course = findCourseById(courseId);
    if (course) {
      course.grade = newGrade;
    }
    recalculateGPA();
  }

  /** Find a course object in state by its id. */
  function findCourseById(courseId) {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].id === courseId) {
        return courses[i];
      }
    }
    return null;
  }

  /** Recalculate GPA from state and update the results display. */
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

    // Output — update only the result elements
    gpaValueEl.textContent    = gpa;
    creditTotalEl.textContent = totalCredits;
  }

  /** Show the empty-state placeholder when no courses exist. */
  function showEmptyState() {
    // Only add if not already present
    if (courseListEl.querySelector('.gpa__empty-state')) return;

    const empty = document.createElement('div');
    empty.classList.add('gpa__empty-state');

    const icon = document.createElement('span');
    icon.classList.add('gpa__empty-icon');
    icon.textContent = '📚';
    icon.setAttribute('aria-hidden', 'true');

    const text = document.createElement('p');
    text.classList.add('gpa__empty-text');
    text.textContent = 'No courses added yet. Click "Add Course" to begin!';

    empty.appendChild(icon);
    empty.appendChild(text);
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

  /** Toggle a specific accordion item by index (accordion behavior). */
  function toggleAccordionItem(clickedIndex) {
    // If clicking the already-open item, close it
    if (openAccordionIndex === clickedIndex) {
      closeAccordionItem(clickedIndex);
      openAccordionIndex = null;
      return;
    }

    // Close the previously open item (if any)
    if (openAccordionIndex !== null) {
      closeAccordionItem(openAccordionIndex);
    }

    // Open the clicked item
    openAccordionItem(clickedIndex);
    openAccordionIndex = clickedIndex;
  }

  /** Open a single accordion item at the given index. */
  function openAccordionItem(index) {
    const item    = accordionItems[index];
    const trigger = accordionTriggers[index];

    if (item && trigger) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  /** Close a single accordion item at the given index. */
  function closeAccordionItem(index) {
    const item    = accordionItems[index];
    const trigger = accordionTriggers[index];

    if (item && trigger) {
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  }


  /* ======================================================
     7. EVENT LISTENERS (Input step of IPO)
     ====================================================== */

  // Dark mode toggle
  themeToggleBtn.addEventListener('click', toggleTheme);

  // GPA — add course
  addCourseBtn.addEventListener('click', addCourse);

  // Accordion — attach a listener to each trigger button
  for (let i = 0; i < accordionTriggers.length; i++) {
    accordionTriggers[i].addEventListener('click', function handleAccordionClick() {
      toggleAccordionItem(i);
    });
  }


  /* ======================================================
     8. INITIALIZATION
     ====================================================== */

  // Apply saved theme immediately (before any paint flicker)
  loadSavedTheme();

  // Show the empty state in GPA calculator on first load
  showEmptyState();

});
