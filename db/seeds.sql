INSERT INTO department (name)
    VALUES  ("Sales"),
            ("Engineering"),
            ("Finance"),
            ("Legal");

INSERT INTO roles (title, salary, department_id)
    VALUES  ("Salesperson", 80000, 1),
            ("Lead Engineer", 150000, 2),
            ("Software Engineer", 120000, 2),
            ("Account Manager", 160000, 3),
            ("Accountant", 125000, 3),
            ("Legal Team Lead", 250000, 4),
            ("Lawyer", 190000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES ("Jermaine", "Cole", 1, 1),
            ("Jon", "Snow", 2, 1),
            ("Arya", "Stark", 2, 1),
            ("Summer", "Walker", 3, 1),
            ("Denai", "Moore", 4, 2);