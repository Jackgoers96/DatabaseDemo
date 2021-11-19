const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "Halobob1",
    database: "staff_db",
  },
);
console.log(`Connected to the ${db} database.`)
/// Validation for a string
const validateName = (answer) => {
  const pass = answer.match(/^[a-z A-Z]+$/);
  if (pass) {
    return true;
  }
  return ("Please enter a valid name.");
};

// Validation for a numerical value
const validateNumber = (answer) => {
  const pass = answer.match("^[0-9]+$");
  if (pass) {
    return true;
  }
  return ("Please enter a numeric value.");
};

// Main prompt questions
const mainLobby = () => {
  inquirer
    .prompt({
      type: "list",
      name: "mainListOfActions",
      message: `What would you like to do?`,
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add a Role",
        "Delete a Role",
        "Delete an Employee",
        "View All Departments",
        "Add a Department",
        "Quit"
      ],
    })
    .then((choice) => {
      switch (choice.mainListOfActions) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Delete a Role":
          deleteRole();
          break;
          case "Delete an Employee":
          deleteEmployee();
          break;
        case "View All Departments":
          viewDep();
          break;
        case "Add a Department":
          addDep();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

//iewing all of the emplioyees
const viewEmployees = () => {
  db.query(
    `SELECT employees.id, first_name, last_name, roles.title, roles.salary, departments.dep_name AS department, manager_id AS manager FROM employees 
    JOIN roles ON roles.id = employees.role_id
    JOIN departments ON departments.id = roles.dep_id;`,
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(data);
      mainLobby();
    }
  );
};

//Adding a new Employee to the database;
const addEmployee = () => {
  db.query(`SELECT * FROM roles
  JOIN employees ON employees.id = roles.id`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const roleData = data.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    const managers = data.map((myManager) => ({
      name: myManager.last_name,
      value: myManager.manager_id,
    }))

    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: `What is the employee's name?`,
          validate: validateName,
        },
        {
          type: "input",
          name: "lastName",
          message: `What is the employee's last name?`,
          validate: validateName,
        },
        {
          type: "list",
          name: "title",
          message: `What is the employee's title?`,
          choices: roleData,
        },
        {
          type: "list",
          name: "manager",
          message: `Who is the employee's manager?`,
          choices: managers,
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
          [data.firstName, data.lastName, data.title, data.manager],
          (err, data) => {
            if (err) {
              console.log(err);
            }
            console.log(("A new employee was hired!"));
            mainLobby();
          }
        );
      });
  });
};

//Function for updating roles
const updateRole = () => {
  db.query(`SELECT * FROM employees;`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    db.query(`SELECT * FROM roles;`, (err, roles) => {
      if (err) {
        console.log(err);
        return;
      }

      const listOfNames = data.map(
        (staffNames) =>
          `${staffNames.id}: ${staffNames.first_name} ${staffNames.last_name} `
      );
      const rolesData = roles.map((listOfRoles) => ({
        name: listOfRoles.title,
        value: listOfRoles.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "updatedEmployee",
            message: `Which employee's role would you like to update?`,
            choices: listOfNames,
          },
          {
            type: "list",
            name: "updatedRole",
            message: `Which role do you wish to assign to the selected employee?`,
            choices: rolesData,
          },
        ])

        .then((udateEmployeeResponse) => {
          console.log(udateEmployeeResponse);
          db.query(
            `UPDATE employees SET role_id = ? WHERE id = ?`,
            [
              udateEmployeeResponse.updatedRole,
              udateEmployeeResponse.updatedEmployee.split(": ")[0],
            ],
            (err, roles) => {
              if (err) {
                console.log(err);
              }
              console.log(`Role updated!`);
              mainLobby();
            }
          );
        });
    });
  });
};

//function hat allows you to view rolls
const viewRoles = () => {
  db.query(
    `SELECT roles.id, title, salary, departments.dep_name AS department FROM roles 
    JOIN departments on departments.id = roles.dep_id;`,
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(data);
      mainLobby();
    }
  );
};

//Add a new role into the database
const addRole = () => {
  db.query(`SELECT * FROM departments`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const depData = data.map((department) => ({
      name: department.dep_name,
      value: department.id,
    }));
    // console.table("department data \n", depData);
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: `What is the name of the role you wish to add?`,
          validate: validateName,
        },
        {
          type: "input",
          name: "salary",
          message: `Enter Base salary for this role`,
          validate: validateNumber,
        },
        {
          type: "list",
          name: "role",
          message: `Under which dept. does this role fall? `,
          choices: depData,
        },
      ])
      .then((data) => {
        db.query(
          `INSERT INTO roles (title, salary, dep_id) VALUES (?, ?, ?)`,
          [data.title, data.salary, data.role],
          (err, data) => {
            if (err) {
              console.log(err);
            }
            console.log(`Role added`);
            mainLobby();
          }
        );
      });
  });
};

// deleteRole
const deleteRole = () => {
  db.query(`SELECT * FROM employees;`, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  db.query(`SELECT * FROM roles;`, (err, roles) => {
    if (err) {
      console.log(err);
      return;
    }

    const listOfNames = data.map(
      (staffNames) =>
        `${staffNames.id}: ${staffNames.first_name} ${staffNames.last_name} `
    );
    const rolesData = roles.map((listOfRoles) => ({
      name: listOfRoles.title,
      value: listOfRoles.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "updatedEmployee",
          message: `Which employee's role would you like to update?`,
          choices: listOfNames,
        },
        {
          type: "list",
          name: "updatedRole",
          message: `Which role do you wish to assign to the selected employee?`,
          choices: rolesData,
        },
      ])

      .then((udateEmployeeResponse) => {
        console.log(udateEmployeeResponse);
        db.query(
          `UPDATE employees SET role_id = ? WHERE id = ?`,
          [
            udateEmployeeResponse.updatedRole,
            udateEmployeeResponse.updatedEmployee.split(": ")[0],
          ],
          (err, roles) => {
            if (err) {
              console.log(err);
            }
            console.log(`Role removed!`);
            mainLobby();
          }
        );
      });
  });
})}


// const deleteEmployee = () => {
//   db.query(`SELECT * FROM employees;`, (err, data) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     db.query(`SELECT * FROM roles;`, (err, roles) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
  
//       const listOfNames = data.map(
//         (staffNames) =>
//           `${staffNames.id}: ${staffNames.first_name} ${staffNames.last_name} `
//       );
//       const employeeData = employees.map((listOfEmployees) => ({
//         name: listOfEmployees.first_name,
//         value: listOfEmployees.id,
//       }));
//       inquirer
//         .prompt([
//           {
//             type: "list",
//             name: "deletedEmployee",
//             message: `Which employee would you like to remove?`,
//             choices: listOfNames,
//           },
//           {
//             type: "list",
//             name: "updatedRole",
//             message: `Which role do you wish to assign to the selected employee?`,
//             choices: employeeData,
//           },
//         ])
  
//         .then((udateEmployeeResponse) => {
//           console.log(udateEmployeeResponse);
//           db.query(
//             `DROP employees SET employees.id`,
//             [
//               udateEmployeeResponse.updatedEmployee,
//               udateEmployeeResponse.updatedEmployee.split(": ")[0],
//             ],
//             (err, roles) => {
//               if (err) {
//                 console.log(err);
//               }
//               console.log(`Employee Removed!`);
//               mainLobby();
//           }
//         );
//       });
//     });
//   });
// }

//View Deppartments
const viewDep = () => {
  db.query(`SELECT * FROM departments;`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(data);
    mainLobby();
  });
};

//Adds a new department to the database;
const addDep = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: `What is the name of the department you wish to add?`,
        validate: validateName,
      },
    ])
    .then((data) => {
      db.query(
        `INSERT INTO departments (dep_name) VALUES (?)`,
        data.department,
        (err, data) => {
          if (err) {
            console.log(err);
          }
          console.log(`Department created`);
          mainLobby();
        }
      );
    });
};

//Quit function
const quit = () => {
  console.log("Deuces!");
  process.exit();
};

mainLobby();