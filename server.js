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
	]) //change this/////////////////////////////////////////////////////////
	.then((answer) => {
		db.query('INSERT INTO departments SET ?', {department_name: answer.departmentName,}, (err, results) => {
			console.table(`'\n' Department ${answer.departmentName} is added to the database. '\n'`);
			initQuestions(); 
		}) 
	})
};

function addRole () {
	return inquirer.prompt([{
		type: "input",
		name: "roleName",
		message: "What is the name of new role?",
		validate: validateInput,
	}])
	.then((answer) => {
		db.query()
	})
}









initQuestions();