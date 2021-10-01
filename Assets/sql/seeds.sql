USE staff_db;

INSERT INTO departments (dep_name)
VALUES ('Sales'), ('Finance'), ('Engineering');

INSERT INTO roles (title, salary, dep_id)
VALUES 
('Sales Lead', 60000, 1),
('Sales Representative', 50000, 1),
('Account Manager', 40000, 2),
('Accountant', 30000, 2),
('Lead Engineer', 70000, 3), 
('Senior Engineer', 55000, 3), 
('Junior Engineer', 45000, 3) ,
('CS Representative', 40000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Serena', 'Joy', 1, 1),
('Nick', 'Blaine', 2, 1),
('Luke', 'Bankole', 3, null),
('June', 'Osborne', 4, 2),
('Mark', 'Tuello', 5, 3),
('Naomi', 'Putnam', 6, 3),
('Eden', 'Blaine', 7, 3),
('Joseph', 'Lawrence', 8, 1);