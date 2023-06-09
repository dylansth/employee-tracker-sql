const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'mysql',
    database: 'employee_tracker_db'
  },
  console.log(`Connected to the employee_tracker_db database.`)
);
async function mainMenu() {
  const {choice} = await inquirer
  .prompt([
    {
      type: "list",
      message: "Please select from the following",
      name: "choice",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
      ]
    }
  ])
  switch (choice) {
    case "View all Departments":
        return viewAllDepartments()
    case "View all Roles":
        return viewAllRoles()
    case "View all Employees":
        return viewAllEmployees()
    case "Add a Department":
        return addDepartment()
    case "Add a Role":
        return addRole()
    case "Add an Employee":
        return addEmployee()
    case "Update an Employee Role":
        return updateRole()
  }

}

function viewAllDepartments() {
  const query = 'SELECT * FROM department'
  db.query(query, (err, results) => {
    console.table(results)
  })
  mainMenu();
}

function viewAllRoles() {
  const query = 'SELECT * FROM roles'
  db.query(query, (err, results) => {
    console.table(results)
  })
  mainMenu();
}

function viewAllEmployees() {
  const query = 'SELECT * FROM employees'
  db.query(query, (err, results) => {
    console.table(results)
  })
  mainMenu();
}

async function addDepartment() {
  const {name} = await inquirer
  .prompt([
    {
      type: 'input',
      message: "Please input Department",
      name: "name"
    }
  ])
  const query = 'INSERT INTO department(name)VALUES(?)'
  db.query(query, name, (err, results) => {
    console.log("Department Added!")
  })
  mainMenu();
}

async function addRole() {
  const department = await getDepartments();
  console.log(roles);
  const { roleName, salaryName, depName } = await inquirer
  .prompt([
    {
      type: 'input',
      message: "Please input Role",
      name: "roleName"
    },
    {
      type: 'input',
      message: "Please input Salary",
      name: "salaryName"
    },
    {
      type: 'list',
      message: "Please select Department",
      name: "depName",
      choices: department
    }
  ])
  console.log(roleName, salaryName, depName)
  const query = 'INSERT INTO roles(title, salary, department_id)VALUES(?, ?, ?)'
  db.query(query, [roleName, salaryName, depName], (err, results) => {
    console.log("Role Added!")
  })
  mainMenu();
}
async function addEmployee() {
  const employees = await addEmployee();
  console.log(employees);
  const { employeeFirstN, employeeLastN, roleName } = await inquirer
  .prompt([
    {
      type: 'input',
      message: "Please input Employee Name",
      name: "employeeFirstN"
    },
    {
      type: 'input',
      message: "Please input Employee Last Name",
      name: "employeeLastN"
    },
    {
      type: 'list',
      message: "Please select Role",
      name: "roleName",
      choices: employees
    }
  ])
  console.log(employeeFirstN, employeeLastN, roleName)
  const query = 'INSERT INTO employees(first_name, last_name, role_id)VALUES(?, ?, ?)'
  db.query(query, [employeeFirstN, employeeLastN, roleName], (err, results) => {
    console.log(`${employeeFirstN} Added!`)
  })
  mainMenu();
}

async function updateRole() {
  try {
    const employees = await getEmployees();
    const roles = await getRoles();
    //List employees and save choice as employeeID
    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Select an employee to update:',
        name: 'employeeId',
        //employee represents each element in employees array .map is called
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name} ${employee.role_id}`,
          value: employee.id,
        })),
      },
    ]);
    //list roles and save selection
    const { roleId, } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Select a new role for the employee:',
        name: 'roleId',
        choices: roles,
      },
    ]);

    const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
    await db.promise().query(query, [roleId, employeeId]);
    console.log('Employee role updated successfully!');
  } catch (err) {
    console.error('Error updating employee role:', err);
  }
  mainMenu();
}

async function getEmployees() {
  try {
    const query = 'SELECT id, first_name, last_name, role_id FROM employees';
    const [results] = await db.promise().query(query);
    return results;
  } catch (err) {
    console.error('Error retrieving employees:', err);
    return [];
  }
}

async function getRoles() {
  try {
    const query = 'SELECT id, title FROM roles';
    const [results] = await db.promise().query(query);
    const data = results.map((role) => {
      return {
        name: role.title,
        value: parseInt(role.id),
        salary: parseFloat(role.salary)
      }
    })
    return data;
  } catch (err) {
    console.error('Error retrieving roles:', err);
    return [];
  }
}
async function getDepartments() {
  try {
    const query = 'SELECT id, name FROM department';
    const [results] = await db.promise().query(query);
    const data = results.map((department) => {
      return {name: department.name, value: department.id}
    })
    return data;
  } catch (err) {
    console.error('Error retrieving departments:', err);
    return [];
  }
}

mainMenu();