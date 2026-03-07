# Course Registration System

A full-stack web application for managing courses and student enrollments using Java Spring Boot, MySQL, HTML, CSS, and JavaScript.

## Features

- Add, view, update, and delete courses
- Search courses by name
- Register students to courses
- Visual indication of course capacity
- Prevent over-enrollment
- Responsive design

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Modern web browser

## Setup Instructions

### 1. Database Setup

```sql
CREATE DATABASE course_registration;
```

### 2. Configure Database

Edit `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/course_registration
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## API Endpoints

- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `GET /api/courses/search?name={name}` - Search courses
- `POST /api/courses/{id}/register` - Register student

## Project Structure

```
course-registration/
├── src/
│   └── main/
│       ├── java/com/course/
│       │   ├── CourseRegistrationApplication.java
│       │   ├── controller/
│       │   │   └── CourseController.java
│       │   ├── model/
│       │   │   └── Course.java
│       │   ├── repository/
│       │   │   └── CourseRepository.java
│       │   └── service/
│       │       └── CourseService.java
│       └── resources/
│           ├── static/
│           │   ├── css/
│           │   │   └── style.css
│           │   ├── js/
│           │   │   └── app.js
│           │   └── index.html
│           └── application.properties
└── pom.xml
```

## Usage

1. **Add Course**: Fill in the form and click "Add Course"
2. **View Courses**: All courses are displayed in cards
3. **Search**: Use the search bar to find courses by name
4. **Edit Course**: Click "Edit" button on any course card
5. **Delete Course**: Click "Delete" button (with confirmation)
6. **Register Student**: Click "Register Student" (disabled when full)

## Author

Created for GUVI Internship Assessment
