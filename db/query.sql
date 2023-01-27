-- SELECT roles.title AS title, departments.department_name
-- FROM roles
-- LEFT JOIN departments
-- ON roles.department_id = departments.id
-- ORDER BY departments.department_name;

-- SELECT roles.title AS title, departments.department_name AS department, roles.salary AS salary, employees.first_name AS first_name, employees.last_name AS last_name 
-- FROM roles
-- LEFT JOIN departments
-- ON roles.department_id = departments.id
-- ORDER BY departments.department_name, roles.salary;

SELECT * FROM departments;

SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles
JOIN departments ON roles.department_id = departments.id;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
departments.department_name, roles.salary FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id