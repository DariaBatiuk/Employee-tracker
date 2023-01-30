SELECT * FROM departments;

SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles
JOIN departments ON roles.department_id = departments.id
ORDER BY departments.department_name;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
departments.department_name, roles.salary, 
concat (manager.first_name , '  ', manager.last_name ) AS manager
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees manager on manager.id = employees.manager_id
ORDER BY departments.department_name;