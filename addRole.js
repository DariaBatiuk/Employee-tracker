
// db.query("SELECT id, title FROM role", function (err, roles) {
//         if (err) throw err;
//         // Use map to extract the title of the roles and store them in an array
//         const roleTitles = roles.map(role => role.title);
//         inquirer
//           .prompt([
//             {
//               name: 'first_name',
//               type: 'input',
//               message: 'Enter the employees first name:'
//             },
//             {
//               name: 'last_name',
//               type: 'input',
//               message: 'Enter the employees last name:'
//             },
//             {
//               name: 'role_id',
//               type: 'list',
//               message: 'Select the employees role:',
//               choices: roleTitles
//             },
//             {
//               name: 'manager_id',
//               type: 'input',
//               message: 'Enter the employees manager id:'
//             }
//           ])
//           .then(answers => {
//             const selectedRole = roles.find(role => role.title === answers.role_id);
//             db.query(INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', '${selectedRole.id}', '${answers.manager_id}'), function (err, result) {
//               if (err) throw err;
//               console.log("1 record inserted");
//               promptUser();
//             });
//           });