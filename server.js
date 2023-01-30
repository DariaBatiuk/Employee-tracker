const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const cTable = require("console.table");
const { abort } = require("process");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "12345",
    database: "departments_db",
  },
  console.log(`Connected to the departments_db database.`)
);

const questionsList = [
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "Add a department",
			"Remove a department",
      "View all roles",
      "Add a role",
			"Remove a role",
      "View all employees",
      "Add an employee",
			"Remove an employee",
      "Exit",
    ],
  },
];

const validateInput = (userInput) => {
  if (userInput == "") {
    return "Please write your answer to the question";
  } else {
    return true;
  }
};

function initQuestions() {
  return inquirer.prompt(questionsList).then((answer) => {
    if (answer.choice == "View all departments") {
      viewDepartments();
    } else if (answer.choice === "Add a department") {
      addDepartment();
    } else if (answer.choice === "Remove a department") {
			deleteDepartment();
		} else if (answer.choice === "View all roles") {
      viewRoles();
    } else if (answer.choice === "Add a role") {
      addRole();
    } else if (answer.choice === "Remove a role") {
			deleteRole();
		} else if (answer.choice === "View all employees") {
      viewEmployees();
    } else if (answer.choice === "Add an employee") {
      addEmployee();
    } else if (answer.choice === "Remove an employee") {
			deleteEmployee();
		} else if (answer.choice === "Exit") {
      db.end();
      console.log("You've logged out of the database");
    }
  });
}

function viewDepartments() {
  db.query("SELECT * FROM departments;", function (err, results) {
    if (err) throw err;
    console.table("\n", results, "\n");
    initQuestions();
  });
}

function viewRoles() {
  db.query(
    "SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name;",
    function (err, results) {
      console.table("\n", results, "\n");
      initQuestions();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, 	departments.department_name, roles.salary, concat (manager.first_name , ' ', manager.last_name ) AS manager_name FROM employees 	LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id ORDER BY departments.department_name",
    function (err, results) {
      console.table("\n", results, "\n");
      initQuestions();
    }
  );
}

function addDepartment() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department?",
        validate: validateInput,
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO departments SET ?",
        { department_name: answer.departmentName },
        (err, results) => {
          console.table(
            `\n\n  Department ${answer.departmentName} is added to the database. \n\n `
          );
          initQuestions();
        }
      );
    });
}

function addRole() {
  db.query(`SELECT * FROM departments;`, (err, departments) => {
    if (err) throw err;
    let departmentsList = departments.map(
      (department) => department.department_name
    );
    return inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of new role?",
          validate: validateInput,
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?",
          validate: validateInput,
        },
        {
          type: "list",
          name: "departmentName",
          message: "What is the department for this role?",
          choices: departmentsList,
        },
      ])
      .then((answer) => {
        let departmentId = departments.find(
          (department) => department.department_name === answer.departmentName
        ).id;
        db.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: departmentId,
          },
          (err, results) => {
            if (err) throw err;
            console.table(
              `\n\n Role ${answer.title} is added to the ${answer.departmentName} department. \n\n `
            );
            initQuestions();
          }
        );
      });
  });
}

function addEmployee() {
  db.query(`SELECT * FROM roles;`, (err, roles) => {
    if (err) throw err;
    let rolesList = roles.map((role) => ({name: role.title, value: role.id}));
		// console.log(roles);
		// console.log(rolesList);
    db.query(`SELECT * FROM employees;`, (err, employees) => {
			if (err) throw err;
    	let employeesList = employees.map((employee) => ({name: employee.first_name + " " + employee.last_name, value: employee.id})); 
			employeesList.push ({name: "null", value: null});
      return inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee?",
            validate: validateInput,
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee?",
            validate: validateInput,
          },
          {
            type: "list",
            name: "role_id",
            message: "What is the role of the employee?",
            choices: rolesList,
          },
          {
            type: "list",
            name: "manager_id",
            message: "What is the manager's id of the employee?",
            choices: employeesList,
          },
        ])
        .then((answer) => {
					let roleTitle = rolesList.find((role) => role.value === answer.role_id)
        .name;
            db.query(
              "INSERT INTO employees SET ?",
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id,
              },
              (err, results) => {
                if (err) throw err;
                console.table(
                  `\n\n Employee ${answer.first_name} ${answer.last_name} is added to the ${roleTitle} role. \n\n `
                );
								initQuestions();
              }
            );
						
        });
    });
  });
}

function deleteEmployee () {
	db.query(`SELECT * FROM employees;`, (err, employees) => {
		if (err) throw err;
		let employeesList = employees.map((employee) => ({name: employee.first_name + " " + employee.last_name, value: employee.id}));
		return inquirer.prompt ([{
			type: "list",
			name: "employee_id",
			message: "Which employee you want to delete?",
			choices: employeesList,
		},])
		.then((answer) => {
			db.query(
				"DELETE FROM employees WHERE ?",
				{
					id: answer.employee_id,
				},
				(err, results) => {
					if (err) throw err;
					console.table(
						`\n\n Employee was removed. \n\n`
					);
					initQuestions();
				}
			);			
		})		
	})
}

function deleteRole () {
	db.query(`SELECT * FROM roles;`, (err, roles) => {
		if (err) throw err;
		let rolesList = roles.map((role) => ({name: role.title, value: role.id}));
		return inquirer.prompt ([{
			type: "list",
			name: "role_id",
			message: "Which role you want to delete?",
			choices: rolesList,
		},])
		.then((answer) => {
			db.query(
				"DELETE FROM roles WHERE ?",
				{
					id: answer.role_id,
				},
				(err, results) => {
					if (err) throw err;
					console.table(
						`\n\n The role was removed. \n\n`
					);
					initQuestions();
				}
			);			
		})		
	})
};

function deleteDepartment () {
	db.query(`SELECT * FROM departments;`, (err, departments) => {
		if (err) throw err;
		let departmentsList = departments.map((department) => ({name: department.department_name, value: department.id}));
		return inquirer.prompt ([{
			type: "list",
			name: "department_id",
			message: "Which department you want to delete?",
			choices: departmentsList,
		},])
		.then((answer) => {
			db.query(
				"DELETE FROM roles WHERE ?",
				{
					id: answer.department_id,
				},
				(err, results) => {
					if (err) throw err;
					console.table(
						`\n\n The department was removed. \n\n`
					);
					initQuestions();
				}
			);			
		})		
	})
}

initQuestions();
