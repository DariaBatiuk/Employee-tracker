// const express = require('express');
// // Import and require mysql2
// const mysql = require('mysql2');

// const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Connect to database
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     // MySQL username,
//     user: 'root',
//     // TODO: Add MySQL password here
//     password: '12345',
//     database: 'departments_db'
//   },
//   console.log(`Connected to the departments_db database.`)
// );

// // Create a department
// app.post('/api/new-department', ({ body }, res) => {
//   const sql = `INSERT INTO departments (department_name)
//     VALUES (?)`;
//   const params = [body.department_name];
  
//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: body
//     });
//   });
// });

// // Read all departments
// app.get('/api/departments', (req, res) => {
//   const sql = `SELECT * FROM departments`;
  
//   db.query(sql, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//        return;
//     }
//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// });

// // Delete a department
// app.delete('/api/department/:id', (req, res) => {
//   const sql = `DELETE FROM departments WHERE id = ?`;
//   const params = [req.params.id];
  
//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.statusMessage(400).json({ error: res.message });
//     } else if (!result.affectedRows) {
//       res.json({
//       message: 'Department not found'
//       });
//     } else {
//       res.json({
//         message: 'deleted',
//         changes: result.affectedRows,
//         id: req.params.id
//       });
//     }
//   });
// });

// ////////////////////////////////Check from here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// // Read list of all roles and associated department name using LEFT JOIN
// app.get('/api/department-roles', (req, res) => {
//   const sql = `SELECT departments.department_name AS department, roles.title FROM roles LEFT JOIN departments ON reviews.movie_id = movies.id ORDER BY movies.movie_name;`;
//   db.query(sql, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// });

// // // Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require('mysql2');
const cTable = require('console.table');
const { abort } = require("process");


const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '12345',
    database: 'departments_db'
  },
  console.log(`Connected to the departments_db database.`)
);

const questionsList =[
	{
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
			"View all departments", 
			"Add a department", 
			"View all roles",
			"Add a role",	
			"View all employees", 
			"Add an employee", 
			"Exit",
		],
  },
]

const validateInput = (userInput) =>{
	if (userInput == ""){
		return "Please write your answer to the question"
	} else {
		return true;
	}
}

function initQuestions() {
	return inquirer.prompt(questionsList)
	.then((answer) => {
		if (answer.choice == "View all departments") {
			viewDepartments();
		} else if (answer.choice === "Add a department") {
			addDepartment();
		} else if (answer.choice === "View all roles") {
			viewRoles();
		} else if (answer.choice === "Add a role") {
			addRole();
		} else if (answer.choice === "View all employees") {
			viewEmployees();
		} else if (answer.choice === "Add an employee") {
			addEmployee();
		} else if (answer.choice === "Exit") {
			db.end();
			console.log("You've logged out of the database")
		}
	})
};


function viewDepartments () {
	db.query('SELECT * FROM departments;', function (err, results) {
		if (err) throw err;
		console.table('\n', results, '\n');
		initQuestions(); 
	});
	
}

function viewRoles () {
	db.query('SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.id;', function (err, results) {
		console.table('\n', results, '\n');
		initQuestions(); 
	});
};

function viewEmployees() {
	db.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, employees.manager_id FROM employees JOIN roles ON employees.role_id = roles.id 	JOIN departments ON roles.department_id = departments.id', function (err, results) {
		console.table('\n', results, '\n');
		initQuestions(); 
	});
}

function addDepartment() {
	return inquirer.prompt([{
		type: "input",
    name: "departmentName",
    message: "What is the name of the department?",
		validate: validateInput,
	}		
	]) 
	.then((answer) => {
		db.query('INSERT INTO departments SET ?', {department_name: answer.departmentName,}, (err, results) => {
			console.table(`'\n' Department ${answer.departmentName} is added to the database. '\n'`);
			initQuestions(); 
		}) 
	})
};

function addRole () {
	db.query (`SELECT * FROM departments;`, (err, departments) =>{
		if (err) throw err;
		let departmentsList = departments.map(department => department.department_name);
		return inquirer.prompt([
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
			type: 'list',
			name: "departmentName",			
			message: "What is the department for this role?",
			choices: departmentsList,
		},
	])
		.then((answer) => {
			let departmentId = departments.find(department => department.department_name === answer.departmentName).id;
			db.query('INSERT INTO roles SET ?', 
			{	title: answer.title,
				salary: answer.salary,
				department_id: departmentId,
			}, 
			(err, results) => {
				if (err) throw err;
				console.table(`'\n' Role ${results.title} is added to the ${answer.departmentName} department. '\n'`);
				initQuestions(); 
			})
		})
	})	
};

function addEmployee() {
	db.query (`SELECT * FROM roles;`, (err, roles) =>{
		if (err) throw err;
		let rolesList = roles.map(role => role.title);
		return inquirer.prompt([
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
			type: 'list',
			name: "role_id",			
			message: "What is the role of the employee?",
			choices: rolesList,
		},
		{
			type: 'input',
			name: "manager_id",			
			message: "What is the manager's id of the employee?",
			// choices: rolesList,
		},
	])
		.then((answer) => {
			let roleId = roles.find(role => role.title === answer.role_id).id;
			db.query('INSERT INTO employees SET ?', 
			{	first_name: answer.first_name,
				last_name: answer.last_name,
				role_id: roleId,
				manager_id: answer.manager_id,
			}, 
			(err, results) => {
				if (err) throw err;
				console.table(`'\n' Employee ${results.first_name} ${results.last_name} is added to the ${answer.role_id} role. '\n'`);
				initQuestions(); 
			})
		})
	})	
}

initQuestions();