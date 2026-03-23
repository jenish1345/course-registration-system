const API_URL = 'http://localhost:8080/api/courses';

let isEditMode = false;
let currentCourseId = null;
let currentView = 'cards';

// DOM Elements
const courseForm = document.getElementById('courseForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const coursesList = document.getElementById('coursesList');
const themeToggle = document.getElementById('themeToggle');
const viewToggleBtns = document.querySelectorAll('.view-toggle button');
const tableView = document.getElementById('tableView');
const tableBody = document.getElementById('tableBody');

// Event Listeners
courseForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);
searchBtn.addEventListener('click', handleSearch);
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    loadCourses();
});

themeToggle.addEventListener('click', toggleTheme);

viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentView = btn.dataset.view;
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (currentView === 'cards') {
            coursesList.style.display = 'grid';
            tableView.classList.remove('active');
        } else {
            coursesList.style.display = 'none';
            tableView.classList.add('active');
        }
        loadCourses();
    });
});

// Load courses on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    loadTheme();
});

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Form Submit Handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const courseData = {
        courseName: document.getElementById('courseName').value.trim(),
        instructorName: document.getElementById('instructorName').value.trim(),
        credits: parseInt(document.getElementById('credits').value),
        maximumCapacity: parseInt(document.getElementById('maximumCapacity').value)
    };
    
    if (!courseData.courseName || !courseData.instructorName || !courseData.credits) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const btnText = submitBtn.querySelector('.btn-text') || submitBtn;
    const originalText = btnText.textContent;
    btnText.innerHTML = '<span class="loading"></span> Saving...';
    submitBtn.disabled = true;
    
    try {
        if (isEditMode) {
            await updateCourse(currentCourseId, courseData);
        } else {
            await createCourse(courseData);
        }
        resetForm();
        loadCourses();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        btnText.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// API Functions
async function createCourse(courseData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
    }
    
    showToast('Course created successfully!', 'success');
}

async function loadCourses() {
    try {
        const response = await fetch(API_URL);
        const courses = await response.json();
        
        if (currentView === 'cards') {
            displayCourses(courses);
        } else {
            displayTable(courses);
        }
        
        updateStats(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesList.innerHTML = '<p>Error loading courses</p>';
        showToast('Error loading courses', 'error');
    }
}

function updateStats(courses) {
    const total = courses.length;
    const full = courses.filter(c => c.enrolledCount >= c.maximumCapacity).length;
    const available = total - full;
    const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolledCount, 0);
    
    document.getElementById('totalCourses').textContent = total;
    document.getElementById('availableCourses').textContent = available;
    document.getElementById('fullCourses').textContent = full;
    document.getElementById('totalEnrolled').textContent = totalEnrolled;
}

async function updateCourse(id, courseData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update course');
    }
    
    showToast('Course updated successfully!', 'success');
}

async function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete course');
        }
        
        showToast('Course deleted successfully!', 'success');
        loadCourses();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function registerStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/register`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to register student');
        }
        
        showToast('Student registered successfully!', 'success');
        loadCourses();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        loadCourses();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(searchTerm)}`);
        const courses = await response.json();
        
        if (currentView === 'cards') {
            displayCourses(courses);
        } else {
            displayTable(courses);
        }
        
        updateStats(courses);
    } catch (error) {
        console.error('Error searching courses:', error);
    }
}

// Display Functions
function displayCourses(courses) {
    if (courses.length === 0) {
        coursesList.innerHTML = '<p>No courses found</p>';
        return;
    }
    
    coursesList.innerHTML = courses.map(course => createCourseCard(course)).join('');
}

function displayTable(courses) {
    if (courses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No courses found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = courses.map(course => {
        const isFull = course.enrolledCount >= course.maximumCapacity;
        return `
            <tr class="${isFull ? 'full' : ''}">
                <td>${course.courseName}</td>
                <td>${course.instructorName}</td>
                <td>${course.credits}</td>
                <td>${course.enrolledCount} / ${course.maximumCapacity}</td>
                <td>
                    <span class="badge ${isFull ? 'badge-full' : 'badge-available'}">
                        ${isFull ? 'FULL' : 'AVAILABLE'}
                    </span>
                </td>
                <td>
                    <div class="course-actions">
                        <button class="btn btn-success" onclick="registerStudent(${course.courseId})" 
                            ${isFull ? 'disabled' : ''}>
                            Register
                        </button>
                        <button class="btn btn-warning" onclick="editCourse(${course.courseId})">
                            Edit
                        </button>
                        <button class="btn btn-danger" onclick="deleteCourse(${course.courseId})">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function createCourseCard(course) {
    const isFull = course.enrolledCount >= course.maximumCapacity;
    const percentage = (course.enrolledCount / course.maximumCapacity) * 100;
    const capacityClass = percentage >= 100 ? 'full' : percentage >= 75 ? 'warning' : '';
    
    return `
        <div class="course-card ${isFull ? 'full' : ''}">
            <h3>${course.courseName}</h3>
            <div class="course-info">
                <strong>Instructor:</strong> ${course.instructorName}
            </div>
            <div class="course-info">
                <strong>Credits:</strong> ${course.credits}
            </div>
            <div class="course-info">
                <strong>Capacity:</strong> ${course.enrolledCount} / ${course.maximumCapacity}
            </div>
            <div class="capacity-bar">
                <div class="capacity-fill ${capacityClass}" style="width: ${percentage}%"></div>
            </div>
            <div class="course-info">
                <strong>Created:</strong> ${formatDateTime(course.createdDateTime)}
            </div>
            <span class="badge ${isFull ? 'badge-full' : 'badge-available'}">
                ${isFull ? 'FULL' : 'AVAILABLE'}
            </span>
            <div class="course-actions">
                <button class="btn btn-success" onclick="registerStudent(${course.courseId})" 
                    ${isFull ? 'disabled' : ''}>
                    Register Student
                </button>
                <button class="btn btn-warning" onclick="editCourse(${course.courseId})">
                    Edit
                </button>
                <button class="btn btn-danger" onclick="deleteCourse(${course.courseId})">
                    Delete
                </button>
            </div>
        </div>
    `;
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString();
}

// Edit Course
async function editCourse(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const course = await response.json();
        
        document.getElementById('courseId').value = course.courseId;
        document.getElementById('courseName').value = course.courseName;
        document.getElementById('instructorName').value = course.instructorName;
        document.getElementById('credits').value = course.credits;
        document.getElementById('maximumCapacity').value = course.maximumCapacity;
        
        isEditMode = true;
        currentCourseId = id;
        formTitle.textContent = 'Update Course';
        const btnText = submitBtn.querySelector('.btn-text') || submitBtn;
        btnText.textContent = 'Update Course';
        cancelBtn.style.display = 'inline-block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showToast('Error loading course details', 'error');
    }
}

function resetForm() {
    courseForm.reset();
    isEditMode = false;
    currentCourseId = null;
    formTitle.textContent = 'Add New Course';
    const btnText = submitBtn.querySelector('.btn-text') || submitBtn;
    btnText.textContent = 'Add Course';
    cancelBtn.style.display = 'none';
}
