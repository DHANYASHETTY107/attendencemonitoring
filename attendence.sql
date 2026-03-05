-- ================================
-- DATABASE
-- ================================
CREATE DATABASE IF NOT EXISTS attendance_monitor;
USE attendance_monitor;

-- ================================
-- USERS TABLE
-- ================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','employee') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- DEPARTMENTS TABLE
-- ================================
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- ================================
-- SECTIONS TABLE
-- ================================
CREATE TABLE sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INT,
  description TEXT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE CASCADE
);

-- ================================
-- ATTENDANCE TABLE
-- ================================
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  in_time TIME,
  out_time TIME,
  total_work_minutes INT DEFAULT 0,
  idle_minutes INT DEFAULT 0,
  status ENUM('Present','Absent') DEFAULT 'Present',
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- ================================
-- SAMPLE USERS
-- password = password123
-- ================================
INSERT INTO users (name, email, password, role) VALUES
(
  'Admin User',
  'admin@example.com',
  '$2a$10$7q7G0oQZrG4N1QnZzYtQ5e5V9QxY3zE5e7nQnGZQ8VwZQZJv5xZ1m',
  'admin'
),
(
  'Employee User',
  'employee@example.com',
  '$2a$10$7q7G0oQZrG4N1QnZzYtQ5e5V9QxY3zE5e7nQnGZQ8VwZQZJv5xZ1m',
  'employee'
);

-- ================================
-- SAMPLE DEPARTMENTS
-- ================================
INSERT INTO departments (name, description) VALUES
('IT', 'Information Technology'),
('HR', 'Human Resources'),
('Finance', 'Finance and Accounting'),
('Operations', 'Operations and Logistics');

-- ================================
-- SAMPLE SECTIONS
-- ================================
INSERT INTO sections (name, department_id, description) VALUES
('Development', 1, 'Software Development Team'),
('Support', 1, 'IT Support Team'),
('Recruitment', 2, 'Talent Acquisition'),
('Accounts', 3, 'Payable and Receivable'),
('Logistics', 4, 'Supply Chain Management');

-- ================================
-- SAMPLE ATTENDANCE RECORDS
-- ================================
INSERT INTO attendance (user_id, date, in_time, out_time, total_work_minutes, idle_minutes, status) VALUES
(2, '2025-10-01', '09:30:00', '18:00:00', 480, 60, 'Present'),
(2, '2025-10-02', NULL, NULL, 0, 0, 'Absent'),
(2, '2025-10-03', '09:15:00', '18:10:00', 500, 40, 'Present'),
(2, '2025-10-04', '09:20:00', '18:05:00', 490, 50, 'Present');
