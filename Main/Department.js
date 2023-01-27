const inquirer = require("inquirer");

class Department {
	constructor(id, departmentName){
		this.id = id;
		this.departmentName = departmentName;
	}

	getID(){
		return this.id
	}
	getDepartmentName(){
		return this.departmentName
	}
}

module.exports = Department;