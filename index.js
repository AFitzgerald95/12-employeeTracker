const { prompt } = require("inquirer");
const db = require("./db");

start();

function start() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "what would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Role",
                    value: "UPDATE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                },
                
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        switch(choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_ROLE":
                updateRole();
                break;
            case "UPDATE_MANAGER":
                updateManager();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;    
            default:
                quit();
        }   
    })
}

function viewEmployees() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => main());
}

function viewEmployeesByDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to see employees for"?
                choices: departmentChoices
            }
        ])
            .then(res => db.findAllEmployeesByDepartment(res.departmentId))
            .then(([rows]) => {
                let employees = rows;
                console.log("\n");
                console.table(employees);
            })
            .then(() => main())
    });
}

function viewEmployeesByManager() {
    db.findAllEmployees()
    .then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "managerId",
                message: "Which employee do you want to see direct reports for?",
                choices: managerChoices
            }
        ])
        .then(res => db.findAllEmployeesByManager(res.managerId))
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            if (employees.length === 0) {
                console.log("The selected employee has np direct reports");
            } else {
                console.table(employees);
            }
        })
        .then(() => main())
    });
}

function removeEmployee() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee do you want to remove?",
                choices: employeeChoices
            }
        ])
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log("Remove employee from the database."))
        .then(() => main())
        })
    }

    function updateRole() {
        db.findAllEmployees()
        .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's role do you want to update?",
                choice: employeeChoices
            }
        ])
            .then(res => {
                let employeeId = res.employeeId;
                db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    prompt([
                        {
                            type: "list",
                            name: "roleId",
                            message: "Which role do you want to assign the selected employee?",
                            choices: roleChoices
                        }
                    ])
                    .then(res => db.updateEmployeeRole(employeeId, res. roleId))
                    .then(() => console.log("Updated employees's role"))
                    .then(() => main())
                });
            });
        })
    }

    function updateManager() {
        db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's manager do you want to update?",
                    choices: employeeChoices
                }
            ])
            .then(res => {
                let employeeId = res.employeeId
                db.findAllManagers(employeeId)
                .then(([rows]) => {
                    let managers = rows;
                    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    prompt([
                        {
                            type: "list",
                            name: "managerId",
                            message: "Which employee do you want to set as manager for the selected employee?",
                            choices: managerChoices
                        }
                    ])
                    .then(res => db.updateManager(employeeId, res.managerId))
                    .then(() => console.log("Employee manager updated."))
                    .then(() => loadMainPrompts())
                })
            })
        })
    }

    function viewRoles() {
        db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log('\n');
            console.table(roles);
        })
        .then(() => main());
    }

    function addRole() {
        db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "title",
                    message: "what is the name of the role?"
                },
                {
                    name: "salary",
                    message: "what is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which Department does this role belong to?",
                    choices: departmentChoices
                }
            ])
            .then(role => {
                db.createRole(role)
                .then(() => console.log(`Added ${role.title}`))
                .then(() => main())
            })
        })
    }

    function removeRole() {
        db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "roleId",
                    message: "Which role would you like to remove?",
                    choices: roleChoices
                }
            ])
                .then(res => db.removeRole(res.roleId))
                .then(() => console.log("Role Removed"))
                .then(() => main())
        })
    }

    function viewDepartments() {
        db.findAllDepartments()
            .then(([rows]) => {
                let departments = rows;
                console.log("\n");
                console.table(departments);
            })
            .then(() => main());
    }

    function addDepartment() {
        prompt([
            {
                name: "name",
                message: "what is the name of this department?"
            }
        ])
        .then(res => {
            let name = res;
            db.createDepartment(name)
            .then(() => console.log("Added Department"))
            .then(() => main())
        })
    }

    function removeDepartment() {
        db.findAllDepartments()
        .then(([rows]) => {
            let deparments = rows;
            const departmentsChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt({
                type: "list",
                name: "departmentId",
                message: "Which department would you like to remove?",
                choices: departmentChoices
            })
            .then(res => db.removeDepartment(res.departmentId))
            .then(() => console.log('Removed Department'))
            .then(() => main())
        })
    }

    function addEmployee() {
        prompt([
            {
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                name: "last_name",
                message: "what is the employee's last name?"
            }
        ])
            .then(res => {
                let firstName = res.first_name;
                let lastName = res.last_name;

                db.findAllRoles()
                    .then(([rows]) => {
                        let roles = rows;
                        const roleChoices = role.map(({ id, title }) => ({
                            name: title,
                            value: id
                        }));

                        prompt({
                            type: "list",
                            name: "roleId",
                            message: "What is the employee's role?",
                            choices: roleChoices
                        })
                        .then(res => {
                            let roleId = res.roleId;

                            db.findAllEmployees()
                            .then(([rows]) => {
                                let employees = rows;
                                const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                    name: `${first_name} ${last_name}`,
                                    value: id
                                }));

                                managerChoices.unshift({ name: "None", value: null });

                                prompt({
                                    type: 'list',
                                    name: "managerId",
                                    message: "Who is the manager of this employee?",
                                    choices: managerChoices
                                })
                                .then(res => {
                                    let employee = {
                                        manager_id: res.managerId,
                                        role_id: roleId,
                                        first_name: firstName,
                                        last_name: lastName
                                    }

                                    db.createEmployee(employee);
                                })
                                .then(() => console.log(
                                    `Added ${firstName} ${lastName} to the database`
                                ))
                                .then(() => main())
                            })
                        })
                    })
            })
    }

    function quit() {
        console.log("Goodby!");
        process.exit();
    }
    