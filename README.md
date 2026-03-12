Course Registration System

This project is a simple course management web application that allows users to create and manage courses and handle student enrollments.

I built this application using Spring Boot for the backend, MySQL for the database, and a basic frontend with HTML, CSS, and JavaScript. The goal of the project is to provide a simple interface where courses can be added, viewed, updated, deleted, and where students can register for available courses.

This project was developed as part of the GUVI Internship Assessment.

Features

The application includes the following functionality:

Add new courses

View the list of available courses

Update course details

Delete existing courses

Search for courses by name

Register students for a course

Prevent students from registering if the course is full

Show course capacity visually

Responsive layout for easier usage

Technologies Used
Backend

Java 17

Spring Boot 3.2.0

Spring Data JPA

Maven

Database

MySQL

Frontend

HTML5

CSS3

JavaScript (ES6)

Fetch API

Prerequisites

Before running the project, make sure you have the following installed:

Java 17 or higher

Maven 3.6 or higher

MySQL 8.0 or higher

A modern web browser (Chrome, Firefox, Edge, etc.)

Setup Instructions
1. Create the Database

Open MySQL and create the database:

CREATE DATABASE course_registration;
2. Configure the Database Connection

Open the file:

src/main/resources/application.properties

Update the database configuration if necessary:

spring.datasource.url=jdbc:mysql://localhost:3306/course_registration
spring.datasource.username=root
spring.datasource.password=

3. Build and Run the Application

Open a terminal inside the project folder and run the following commands:

mvn clean install

Then start the application:

mvn spring-boot:run

After the application starts, it will run on:

http://localhost:8080
Accessing the Application

Open your browser and go to:

http://localhost:8080
