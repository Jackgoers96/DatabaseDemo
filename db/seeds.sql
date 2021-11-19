USE staff_db;

INSERT INTO departments (dep_name)
VALUES ('Sales'), ('Finance'), ('Engineering');

INSERT INTO roles (title, salary, dep_id)
VALUES 
('Team Lead', 60000, 1),
('Inside Sales', 45000, 1),
('Account Manager', 40000, 2),
('Accountant', 60000, 2),
('Lead Engineer', 100000, 3), 
('Senior Engineer', 80000, 3), 
('Junior Engineer', 50000, 3) ,
('Customer Service', 38000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Luke', 'Combs', 1, 1),
('Nick', 'Jonas', 2, 1),
('Mike', 'Myers', 3, 2),
('Jasmine', 'Flowers', 4, 2),
('Tommy', 'Haverford', 5, 3),
('Blake', 'Lively', 6, 3),
('Sarah', 'Rose', 7, 3),
('John', 'Smith', 8, 1);