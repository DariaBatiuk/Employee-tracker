SELECT * FROM departments;

SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles
JOIN departments ON roles.department_id = departments.id;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
departments.department_name, roles.salary, employees.manager_id FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id