const API_URL = 'http://localhost:8080/api/courses';

let isEditMode = false;
let currentCourseId = null;

// DOM Elements
const courseForm = document.getElementById('courseForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const coursesList = document.getElementById('coursesList');

// Event Listeners
courseForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);
searchBtn.addEventListener('click', handleSearch);
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    loadCourses();
});

// Load courses on page load
document.addEventListener('DOMContentLoaded', loadCourses);

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
        alert('Please fill all required fields');
        return;
    }
    
    try {
        if (isEditMode) {
            await updateCourse(currentCourseId, courseData);
        } else {
            await createCourse(courseData);
        }
        resetForm();
        loadCourses();
    } catch (error) {
        alert('Error: ' + error.message);
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
    
    alert('Course created successfully!');
}

async function loadCourses() {
    try {
        const response = await fetch(API_URL);
        const courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesList.innerHTML = '<p>Error loading courses</p>';
    }
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
    
    alert('Course updated successfully!');
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
        
        alert('Course deleted successfully!');
        loadCourses();
    } catch (error) {
        alert('Error: ' + error.message);
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
        
        alert('Student registered successfully!');
        loadCourses();
    } catch (error) {
        alert('Error: ' + error.message);
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
        displayCourses(courses);
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
        submitBtn.textContent = 'Update Course';
        cancelBtn.style.display = 'inline-block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        alert('Error loading course details');
    }
}

function resetForm() {
    courseForm.reset();
    isEditMode = false;
    currentCourseId = null;
    formTitle.textContent = 'Add New Course';
    submitBtn.textContent = 'Add Course';
    cancelBtn.style.display = 'none';
}
