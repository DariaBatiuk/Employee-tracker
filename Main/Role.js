const Department = require ("./Department");


class Role extends Department {
	constructor(id, title, departmentName, salary){
		super (id, departmentName);

		this.title = title;
		this.salary = salary;
	}

	getTitle(){
		return this.title;
	}
	getSalary(){
		return this.salary;
	}
}
module.exports = Role;