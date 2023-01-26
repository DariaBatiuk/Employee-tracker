INSERT INTO departments (department_name)
VALUES ("IT"),
       ("Finance");

INSERT INTO roles (department_id, title, salary)
VALUES (1, "Softwaree Engineer", 100000),
       (1, "Lead Engineer", 8000),
       (2, "Account Manager", 5000),
       (2, "Accountant", 3000);

INSERT INTO employees (role_id, first_name, last_name)
VALUES (1, "Daria", "Batiuk"),
       (1, "Valentina", "Batiuk"),
       (2, "Michael", "Batiuk"),
       (2, "Nikita", "Batiuk");
