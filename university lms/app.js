// Dummy Data
const studentData = {
    name: "John Doe",
    id: "CS-2023-001",
    courses: [
        { code: "CSC101", name: "Introduction to Programming", sem: "1", quizzes: 18, assignments: 15, mid: 25, final: 38, totalClasses: 40, attended: 38 },
        { code: "MTH101", name: "Calculus I", sem: "1", quizzes: 15, assignments: 18, mid: 22, final: 35, totalClasses: 40, attended: 35 },
        { code: "PHY101", name: "Physics I", sem: "1", quizzes: 12, assignments: 15, mid: 20, final: 30, totalClasses: 40, attended: 28 },
        { code: "ENG101", name: "English Composition", sem: "1", quizzes: 19, assignments: 19, mid: 28, final: 45, totalClasses: 30, attended: 20 },
        { code: "CSC102", name: "Object Oriented Programming", sem: "2", quizzes: 17, assignments: 18, mid: 26, final: 36, totalClasses: 42, attended: 40 },
        { code: "MTH102", name: "Calculus II", sem: "2", quizzes: 16, assignments: 14, mid: 24, final: 33, totalClasses: 42, attended: 30 }
    ]
};
// Utilities
function calculateGradeAndGPA(marks) {
    if (marks >= 85) return { grade: 'A', gpa: 4.0 };
    if (marks >= 80) return { grade: 'A-', gpa: 3.7 };
    if (marks >= 75) return { grade: 'B+', gpa: 3.3 };
    if (marks >= 70) return { grade: 'B', gpa: 3.0 };
    if (marks >= 65) return { grade: 'B-', gpa: 2.7 };
    if (marks >= 60) return { grade: 'C+', gpa: 2.3 };
    if (marks >= 55) return { grade: 'C', gpa: 2.0 };
    if (marks >= 50) return { grade: 'C-', gpa: 1.7 };
    return { grade: 'F', gpa: 0.0 };
}
// DOM Elements
const authView = document.getElementById('auth-view');
const dashboardView = document.getElementById('dashboard-view');
const authForm = document.getElementById('auth-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
// View switching
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}
// Section switching inside dashboard
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update active section
        const targetId = item.getAttribute('data-target');
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
    });
});
// Login Logic
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = document.getElementById('student-id').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!studentId || !password) {
        loginError.textContent = "Please fill in all fields.";
        return;
    }
    
    // Simulate auth success
    loginError.textContent = "";
    document.getElementById('nav-student-name').textContent = studentData.name;
    document.getElementById('profile-name').textContent = studentData.name;
    document.getElementById('profile-id').textContent = studentData.id;
    
    initDashboard();
    switchView('dashboard-view');
});
// Logout
logoutBtn.addEventListener('click', () => {
    authForm.reset();
    switchView('auth-view');
});
// Init Dashboard Data
function initDashboard() {
    renderMarksTable('all');
    renderAttendanceTable();
    updateDashboardSummary();
}
// Render Marks
const semesterSelect = document.getElementById('semester-select');
semesterSelect.addEventListener('change', (e) => {
    renderMarksTable(e.target.value);
});
function renderMarksTable(semesterFilter) {
    const tbody = document.querySelector('#marks-table tbody');
    tbody.innerHTML = '';
    
    let totalGPA = 0;
    let count = 0;
    
    const courses = semesterFilter === 'all' 
        ? studentData.courses 
        : studentData.courses.filter(c => c.sem === semesterFilter);
        
    courses.forEach(c => {
        const totalMarks = c.quizzes + c.assignments + c.mid + c.final;
        const { grade, gpa } = calculateGradeAndGPA(totalMarks);
        totalGPA += gpa;
        count++;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.code}</td>
            <td>${c.name}</td>
            <td>${c.quizzes}</td>
            <td>${c.assignments}</td>
            <td>${c.mid}</td>
            <td>${c.final}</td>
            <td><strong>${totalMarks}</strong></td>
            <td><strong>${grade}</strong></td>
        `;
        tbody.appendChild(tr);
    });
    
    const cgpa = count > 0 ? (totalGPA / count).toFixed(2) : "0.00";
    document.getElementById('display-cgpa').textContent = cgpa;
    
    // Update summary only if all are shown (general CGPA)
    if (semesterFilter === 'all') {
        document.getElementById('overall-cgpa').textContent = cgpa;
        document.getElementById('total-subjects').textContent = studentData.courses.length;
    }
}
// Render Attendance
function renderAttendanceTable() {
    const tbody = document.querySelector('#attendance-table tbody');
    tbody.innerHTML = '';
    
    let totalClassesGlobal = 0;
    let attendedGlobal = 0;
    let hasWarning = false;
    
    studentData.courses.forEach(c => {
        totalClassesGlobal += c.totalClasses;
        attendedGlobal += c.attended;
        const missed = c.totalClasses - c.attended;
        const percentage = Math.round((c.attended / c.totalClasses) * 100);
        
        let colorClass = 'att-good';
        if (percentage < 60) {
            colorClass = 'att-danger';
            hasWarning = true;
        } else if (percentage < 75) {
            colorClass = 'att-warning';
            hasWarning = true;
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.code}</td>
            <td>${c.name}</td>
            <td>${c.totalClasses}</td>
            <td>${c.attended}</td>
            <td>${missed}</td>
            <td class="${colorClass}">${percentage}%</td>
        `;
        tbody.appendChild(tr);
    });
    
    // Warning Alert
    const warningEl = document.getElementById('attendance-warning');
    if (hasWarning) {
        warningEl.classList.remove('hidden');
    } else {
        warningEl.classList.add('hidden');
    }
    
    // Overall Progress Chart
    const overallPercentage = Math.round((attendedGlobal / totalClassesGlobal) * 100);
    document.getElementById('overall-attendance').textContent = `${overallPercentage}%`;
    document.getElementById('attendance-circle-text').textContent = `${overallPercentage}%`;
    
    // Calculate stroke offset (283 is full circle)
    const offset = 283 - (283 * overallPercentage) / 100;
    const circle = document.getElementById('attendance-circle');
    circle.style.strokeDashoffset = offset;
    
    // Change color of circle based on overall attendance
    if (overallPercentage < 60) {
        circle.style.stroke = 'var(--danger)';
    } else if (overallPercentage < 75) {
        circle.style.stroke = 'var(--warning)';
    } else {
        circle.style.stroke = 'var(--success)';
    }
}
function updateDashboardSummary() {
    // Already updated by init functions
}