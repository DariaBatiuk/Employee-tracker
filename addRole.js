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
			if (!answer.manager_id) {
				db.query('INSERT INTO employees SET ?', 
				{	first_name: answer.first_name,
					last_name: answer.last_name,
					role_id: roleId,
					manager_id: null,
				}, 
				(err, results) => {
					if (err) throw err;
					answer.manager_id = results.insertId;
					db.query('UPDATE employees SET manager_id = ? WHERE id = ?', [answer.manager_id, answer.manager_id], (err) => {
						if (err) throw err;
						console.table(`'\n' Employee ${answer.first_name} ${answer.last_name} is added to the ${answer.role_id} role. '\n'`);
						initQuestions(); 
					});
				});
				} else {
				db.query('INSERT INTO employees SET ?', 
				{	first_name: answer.first_name,
					last_name: answer.last_name,
					role_id: roleId,
					manager_id: answer.manager_id,
				}, 
				(err, results) => {
					if (err) throw err;
					console.table(`'\n' Employee ${answer.first_name} ${answer.last_name} is added to the ${answer.role_id} role. '\n'`);
				})
			}
		})
	})
};
