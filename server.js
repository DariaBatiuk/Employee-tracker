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
			"Exit"
		],
  },
]

function initQuestions() {
	return inquirer.prompt(questionsList)
	.then((answer) => {
		if (answer.choice === "View all departments") {
			viewDepertments();
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
initQuestions();