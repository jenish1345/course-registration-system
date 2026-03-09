# TODO: Login and Register Pages Implementation

## Project Understanding
- Spring Boot REST API backend (port 8080)
- Vanilla JS frontend in `frontend/` directory
- Current system manages courses with CRUD operations
- User authentication (login/register) implemented

## Implementation Plan

### Backend (Java/Spring Boot)

- [x] 1. Create User entity model (`src/main/java/com/course/model/User.java`)
  - Fields: userId, username, password, email, role, createdDateTime

- [x] 2. Create User repository (`src/main/java/com/course/repository/UserRepository.java`)
  - Methods: findByUsername, findByEmail

- [x] 3. Create Auth Controller (`src/main/java/com/course/controller/AuthController.java`)
  - POST /api/auth/register - Register new user
  - POST /api/auth/login - Authenticate user
  - GET /api/auth/user/{id} - Get user info

- [x] 4. Added Spring Security dependency in pom.xml for password encryption

### Frontend

- [x] 5. Create login page (`frontend/login.html`)
  - Username and password fields
  - Login button
  - Link to register page
  - Error handling display

- [x] 6. Create register page (`frontend/register.html`)
  - Username, email, password, confirm password fields
  - Register button
  - Link to login page
  - Form validation

- [x] 7. Create auth service (`frontend/js/auth.js`)
  - handleLogin(username, password)
  - handleRegister(username, email, password)
  - Token storage and retrieval
  - Logout functionality

- [x] 8. Update existing pages to require authentication
  - Add auth check on page load
  - Show user info in header when logged in

## Database Configuration
- Updated: `src/main/resources/application.properties`
- Database: courseregistration (MySQL)
- Hibernate auto-creates tables from entities

## Follow-up Steps
1. Run the Spring Boot application: `cd /Users/antonyjenish/Documents/intern\ guvi && mvn spring-boot:run`
2. Open frontend in browser: `open frontend/login.html`
3. Register a new user, then login
4. Access the main course page at `frontend/index.html`

