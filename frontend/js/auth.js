const API_URL = 'http://localhost:8080/api/auth';

// Store user data in localStorage
const USER_KEY = 'currentUser';

// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store user data in localStorage
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            return { success: true, user: data.user, message: data.message };
        } else {
            return { success: false, message: data.error || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please check if the server is running.' };
    }
}

// Register function
async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store user data in localStorage after successful registration
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            return { success: true, user: data.user, message: data.message };
        } else {
            return { success: false, message: data.error || 'Registration failed' };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Network error. Please check if the server is running.' };
    }
}

// Get current logged in user
function getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Logout function
function logout() {
    localStorage.removeItem(USER_KEY);
    window.location.href = 'login.html';
}

// Get user by ID
async function getUserById(userId) {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

// Update user info in localStorage
function updateUserInStorage(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

