-- Create Database Architecture Context
CREATE DATABASE IF NOT EXISTS vavuniya_lms_db;
USE vavuniya_lms_db;

-- 1. Users Security Directory Matrix
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Academic Course Directory Table
CREATE TABLE courses (
    course_id VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    faculty_instructor_id VARCHAR(50),
    FOREIGN KEY (faculty_instructor_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Academic Evaluation Target Rules Registry
CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    points_possible INT NOT NULL,
    due_date DATETIME NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Student Resource Document Submissions Directory
CREATE TABLE submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    file_path_reference VARCHAR(255) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Student Metrics Tracking Matrix
CREATE TABLE grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    graded_by_faculty_id VARCHAR(50) NOT NULL,
    score_achieved DECIMAL(5,2) NOT NULL,
    date_graded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by_faculty_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;