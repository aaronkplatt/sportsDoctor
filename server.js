const express = require('express');
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

//Express connection
const app = express();
const PORT = 3306;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//MY SQL SERVER CONNECTION
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "sports_doctor_db"
});
//CONNECTION
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});

//WELCOME TP THE SPORTS DOCTOR DIRECTORY
welcome();
function welcome() {
    console.log('-----------------------------------------------------------------------------');
    console.log('-----------------------------------------------------------------------------');
    console.log('WELCOME TO THE SPORTS DOCTOR DIRECTORY');
    console.log("\n");
    console.log('USE ARROW KEYS TO NAVIGATE');
    console.log('-----------------------------------------------------------------------------');
    console.log('-----------------------------------------------------------------------------');
};

//THE FIRST QUESTION PROMPTED
initialQuestion();
function initialQuestion() {
    inquirer
    .prompt([
        //WHAT WOULD YOU LIKE TO DO? (initialQuestion)
        {
            type: "list",
            name: "initialQuestion",
            message: "How can I help you today?",
            choices: [ "View all Patients", "Add a new Patient", "Remove a Patient", "View All Doctors", "Add a New Doctor", "Remove a Doctor", "Waiting List"]
        }
    ])
    .then(function(answers) {
        const initialQuestion = answers.initialQuestion;
        if (initialQuestion === "View all Patients") {
            viewAllPatients(); // DONE
        }
        else if (initialQuestion === "Add a new Patient") {
            addNewPatient(); // DONE
        }
        else if (initialQuestion === "Remove a Patient") {
            removePatient(); // DONE
        }
        else if (initialQuestion === "View All Doctors") {
            viewAllDoctors(); // DONE
        }
        else if (initialQuestion === "Add a New Doctor") {
            addNewDoctor(); // DONE
        }
        else if (initialQuestion === "Remove a Doctor") {
            removeDoctor(); // DONE
        }
        else if (initialQuestion === "Waiting List") {
            waitingList(); // TO DO
        }
    });
}
                                                                                       
//VIEW ALL PATIENTS (DONE)
function viewAllPatients() {
    //Left join is used so we can get a null doctor
    connection.query(
        `SELECT p.id, concat(p.first_name, ' ', p.last_name) AS Patient, concat(d.first_name, ' ', d.last_name) AS Doctor, h.pain_level AS PainLevel, p.injury_location AS InjuryLocation, i.injury_name AS TypeOfInjury, p.room_number AS RoomNumber
        FROM sports_doctor_db.patient AS p 
        LEFT JOIN sports_doctor_db.doctor AS d ON p.doctor_id = d.id
        JOIN sports_doctor_db.pain AS h ON p.pain_id = h.id
        JOIN sports_doctor_db.department AS i on p.injury_id = i.id;`,
            function(err, res) {
                if (err) throw err;
                console.log("\n");
            console.table(res);
            //go back to inital
            initialQuestion();
    });
}

//ADD NEW PATIENT (DONE)
function addNewPatient() {
    //LIST OF PAIN LEVELS ARRAY
    let importPainLevel = [];
    connection.query(`SELECT * FROM sports_doctor_db.pain;`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let painObject = { 
                name: row.pain_level, 
                value: row.id
            }
            importPainLevel.push(painObject)
        });
    //LIST of Injury ARRAY
    let importInjuryType = [];
    connection.query(`SELECT * FROM sports_doctor_db.department;`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let injuryObject = { 
                name: row.injury_name, 
                value: row.id
            }
            importInjuryType.push(injuryObject)
        });
        inquirer
        .prompt([ //1st prompts to add new employee
            {
                type: "input",
                name: "first_name",
                message: "What's the Patients First Name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What's the Patients Last Name?"
            },
            {
                type: "input",
                name: "room_number",
                message: "What's this Patients Room Number? (USE INTEGERS)"
            },
            {
                type: "list",
                name: "pain_level",
                message: "What's this Patients Pain Level? (USE ARROW KEYS)",
                choices: importPainLevel
            },
            {
                type: "input",
                name: "injury_location",
                message: "What's this Patients Injury Location?"
            },
            {
                type: "list",
                name: "injury_name",
                message: "What type of Injury?",
                choices: importInjuryType
            }
            ])
            .then(answers => {
                first_name = answers.first_name,
                last_name = answers.last_name,
                room_number = answers.room_number,
                pain_level = answers.pain_level,
                injury_location = answers.injury_location,
                injury_name = answers.injury_name //GRABBING THIS FOR DOCTORS

                // CREATE DOCTORS BASED OFF OF THE INJURY NAME. GRAB SPECIFIC DOCTORS
                // Create a null for no doctor (TO DO)
                let importDoctors = [{
                    name: "null",
                    value: 0
                }];
                connection.query(`SELECT d.id, concat(d.first_name, ' ', d.last_name) AS Doctor  
                FROM sports_doctor_db.doctor as d
                WHERE d.department_id = "${injury_name}"`, (err,rows) => {
                    if(err) throw err;
                    rows.forEach((row) => {
                        let doctorObject = { 
                            name: row.Doctor, 
                            value: row.id
                        }
                        importDoctors.push(doctorObject)
                    });
                    inquirer
                    .prompt([ //last prompt for doctors
                        {
                            type: "list",
                            name: "doctor_name",
                            message: "Which Doctor would you like to see? (NULL puts them on the waiting list)",
                            choices: importDoctors
                        }
                        ])
                        //grab all answers from this prompt and the last ones about the patient
                        .then(answers => {
                            doctor_name = answers.doctor_name
                            first_name = first_name,
                            last_name = last_name,
                            room_number = room_number,
                            pain_level = pain_level,
                            injury_location = injury_location,
                            injury_name = injury_name
                            connection.query(`INSERT INTO sports_doctor_db.patient (first_name,last_name,room_number,pain_id,injury_location,injury_id,doctor_id) VALUES ("${first_name}","${last_name}","${room_number}","${pain_level}","${injury_location}","${injury_name}","${doctor_name}")`,
                            function(err) {
                                if(err) throw err;
                                console.log("PATIENT ADDED!")
                                console.log("\n")
                                initialQuestion();
                            });
                        });
                });
            });   
    });
    });
}

//REMOVE A PATIENT (DONE)
function removePatient() {
    let importPatientArray = [];
    connection.query(`SELECT id, concat(first_name, ' ', last_name) AS Name FROM sports_doctor_db.patient;`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let patients = {
                name: row.Name,
                value: row.id
            };
            importPatientArray.push(patients);
        });
        inquirer
        .prompt([
            {
                type: "list",
                name: "removePatient",
                message: "Which Patient would you like to Remove?",
                choices: importPatientArray
            }
        ])
        .then(answers => {
            const removePatient = answers.removePatient
            connection.query(
            `DELETE FROM sports_doctor_db.patient WHERE id = "${removePatient}";`,
         function(err, res) {
            if (err) throw err;
            console.log("PATIENT REMOVED!");
            console.log("\n");
            //go back to inital
            initialQuestion();
        });
    });
    });
}

//VIEW ALL DOCTORS (DONE)
function viewAllDoctors() {
    connection.query(
        `SELECT p.id, concat(p.first_name, ' ', p.last_name) AS Name, d.department_name AS Department, d.injury_name AS InjuryType
        FROM sports_doctor_db.doctor as p
        JOIN sports_doctor_db.department as d ON p.department_id = d.id;`,
            function(err, res) {
                if (err) throw err;
                console.log("\n");
            console.table(res);
            //go back to inital
            initialQuestion();
    });
}

//ADD NEW DOCTOR (DONE)
function addNewDoctor() {
    //LIST OF PAIN LEVELS ARRAY
    let importDepartments = [];
    connection.query(`SELECT id, department_name FROM sports_doctor_db.department;`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let departmentObject = { 
                name: row.department_name, 
                value: row.id
            }
            importDepartments.push(departmentObject)
        });
    inquirer
    .prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the Doctor's First Name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the Doctor's Last Name?"
        },
        {
            type: "list",
            name: "department",
            message: "In Which Department does this Doctor Work?",
            choices: importDepartments
        }
    ])
    .then(answers => {
        const first_name = answers.first_name
        const last_name = answers.last_name
        const department = answers.department

        connection.query(`INSERT INTO sports_doctor_db.doctor (first_name, last_name, department_id)
        VALUES ("${first_name}","${last_name}","${department}")`,
            function(err) {
                if(err) throw err;
                console.log("DOCTOR ADDED!")
                console.log("\n");
                initialQuestion();
            }
        );
    });  
    });
}

//REMOVE A DOCTOR, IF DOCTOR HAS PATIENT< THEY GO TO THE WAITING LIST
function removeDoctor() {
    let importDoctorArray = [];
    connection.query(`SELECT id, concat(first_name, ' ', last_name) AS Name FROM sports_doctor_db.doctor;`, (err,rows) => {
        if(err) throw err;
        rows.forEach((row) => {
            let doctors = {
                name: row.Name,
                value: row.id
            };
            importDoctorArray.push(doctors);
        });
        inquirer
        .prompt([
            {
                type: "list",
                name: "removeDoctor",
                message: "Which Doctor would you like to Remove?",
                choices: importDoctorArray
            }
        ])
        .then(answers => {
            const removeDoctor = answers.removeDoctor
            connection.query(
            `DELETE FROM sports_doctor_db.doctor WHERE id = "${removeDoctor}";`,
         function(err, res) {
            if (err) throw err;
            console.log("DOCTOR REMOVED!");
            console.log("\n");
            //go back to inital
            initialQuestion();
        });
    });
    });
}

//WAITING LIST
function waitingList(){
    //Left join is used so we can get a null doctor
    connection.query(
        `SELECT p.id, concat(p.first_name, ' ', p.last_name) AS Patient, p.doctor_id, h.pain_level AS PainLevel, p.injury_location AS InjuryLocation, i.injury_name AS TypeOfInjury, p.room_number AS RoomNumber
        FROM sports_doctor_db.patient AS p 
        JOIN sports_doctor_db.pain AS h ON p.pain_id = h.id
        JOIN sports_doctor_db.department AS i on p.injury_id = i.id
        WHERE p.doctor_id IS null;`,
            function(err, res) {
                if (err) throw err;
                console.log("\n");
            console.table(res);
            //go back to inital
            initialQuestion();
    });
}