const Role = require ("./Role");

class Employee extends Role {
	constructor(id, firstName, lastName){
		super (id, title, departmentName, salary);

		this.firstName = firstName;
		this.lastName = lastName;
	}

	getFirstName(){
		return this.firstName
	}
	getLastName(){
		return this.lastName
	}
}

module.exports = Employee;