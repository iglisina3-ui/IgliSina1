let students = [
    {
        id: 1,
        firstName: "Ana",
        lastName: "Gjoka",
        faculty: "Shkencat Natyrore",
        year: "3",
        grade: "8",
        email: "ana.gjoka@universiteti.edu.al",
        gender: "F",
        registrationDate: "2025-11-20"
    },
    {
        id: 2,
        firstName: "Blerim",
        lastName: "Hoxha",
        faculty: "Inxhinieri",
        year: "2",
        grade: "7",
        email: "blerim.hoxha@universiteti.edu.al",
        gender: "M",
        registrationDate: "2025-11-18"
    },
    {
        id: 3,
        firstName: "Era",
        lastName: "Dervishi",
        faculty: "Mjekësi",
        year: "4",
        grade: "9",
        email: "era.dervishi@universiteti.edu.al",
        gender: "F",
        registrationDate: "2025-11-15"
    }
];

let nextId = 4;

const studentForm = document.getElementById('studentForm');
const studentsTableBody = document.getElementById('studentsTableBody');
const studentCount = document.getElementById('studentCount');
const totalStudents = document.getElementById('totalStudents');
const averageGrade = document.getElementById('averageGrade');
const highestGrade = document.getElementById('highestGrade');
const femalePercentage = document.getElementById('femalePercentage');
const emptyMessage = document.getElementById('emptyMessage');
const filterFaculty = document.getElementById('filterFaculty');
const filterGrade = document.getElementById('filterGrade');
const clearFilters = document.getElementById('clearFilters');
const tabButtons = document.querySelectorAll('.tab-btn');

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadStudents() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
        if (students.length > 0) {
            nextId = Math.max(...students.map(s => s.id)) + 1;
        }
    }
}

function addStudent(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const faculty = document.getElementById('faculty').value;
    const year = document.getElementById('year').value;
    const grade = document.getElementById('grade').value;
    const email = document.getElementById('email').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    const newStudent = {
        id: nextId++,
        firstName,
        lastName,
        faculty,
        year,
        grade,
        email,
        gender,
        registrationDate: new Date().toISOString().split('T')[0]
    };
    
    students.push(newStudent);
    
    saveStudents();
    
    displayStudents();
    updateStatistics();
    updateStudentCount();
    
    showMessage(`Student ${firstName} ${lastName} u shtua me sukses!`, 'success');
    
    studentForm.reset();
    
    switchTab('students');
}

function deleteStudent(id) {
    if (confirm('A jeni i sigurt që dëshironi të fshini këtë student?')) {
        students = students.filter(student => student.id !== id);
        
        saveStudents();
        
        displayStudents();
        updateStatistics();
        updateStudentCount();
        
        showMessage('Studenti u fshi me sukses!', 'success');
    }
}

function getGradeText(grade) {
    const gradeMap = {
        "4": "4 (Ngeles)",
        "5": "5 (Kalues)",
        "6": "6 (Mirë)",
        "7": "7 (Mirë)",
        "8": "8 (Shumë mirë)",
        "9": "9 (Shumë mirë)",
        "10": "10 (Shkëlqyeshëm)"
    };
    return gradeMap[grade] || grade;
}

function getGradeColor(grade) {
    if (grade <= 4) return "#f72585"; // e kuqe
    if (grade <= 5) return "#f8961e"; // portokalli
    if (grade <= 7) return "#4cc9f0"; // blu
    if (grade <= 9) return "#7209b7"; // vjollcë
    return "#2ecc71"; // gjelbër për 10
}

function displayStudents() {
    const filteredStudents = getFilteredStudents();
    
    if (filteredStudents.length === 0) {
        studentsTableBody.innerHTML = '';
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        
        studentsTableBody.innerHTML = filteredStudents.map(student => `
            <tr>
                <td>${student.id}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td><span class="status-badge">${student.faculty}</span></td>
                <td>Viti ${student.year}</td>
                <td>
                    <span class="grade-badge" style="background: ${getGradeColor(parseInt(student.grade))}">
                        ${getGradeText(student.grade)}
                    </span>
                </td>
                <td>${student.email}</td>
                <td>${student.gender === 'M' ? '👨 Mashkull' : '👩 Femër'}</td>
                <td>${student.registrationDate}</td>
                <td class="action-buttons">
                    <button class="btn btn-danger action-btn" onclick="deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i> Fshij
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function getFilteredStudents() {
    let filtered = [...students];
    
    const facultyFilter = filterFaculty.value;
    const gradeFilter = filterGrade.value;
    
    if (facultyFilter) {
        filtered = filtered.filter(student => student.faculty === facultyFilter);
    }
    
    if (gradeFilter) {
        filtered = filtered.filter(student => student.grade === gradeFilter);
    }
    
    return filtered;
}

function updateStatistics() {
    if (students.length === 0) {
        totalStudents.textContent = '0';
        averageGrade.textContent = '0.0';
        highestGrade.textContent = '0';
        femalePercentage.textContent = '0%';
        return;
    }
    
    totalStudents.textContent = students.length;
    
    const grades = students.map(student => parseInt(student.grade));
    const avgGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    averageGrade.textContent = avgGrade.toFixed(1);
    
    const maxGrade = Math.max(...grades);
    highestGrade.textContent = maxGrade;
    
    const femaleCount = students.filter(student => student.gender === 'F').length;
    const percentage = (femaleCount / students.length * 100).toFixed(1);
    femalePercentage.textContent = `${percentage}%`;
}

function updateStudentCount() {
    studentCount.textContent = students.length;
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'flex';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function switchTab(tabName) {
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
}

function clearAllFilters() {
    filterFaculty.value = '';
    filterGrade.value = '';
    displayStudents();
}

function init() {
    loadStudents();
    
    displayStudents();
    updateStatistics();
    updateStudentCount();
    
    studentForm.addEventListener('submit', addStudent);
    
    filterFaculty.addEventListener('change', displayStudents);
    filterGrade.addEventListener('change', displayStudents);
    clearFilters.addEventListener('click', clearAllFilters);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });
    
}

document.addEventListener('DOMContentLoaded', init);