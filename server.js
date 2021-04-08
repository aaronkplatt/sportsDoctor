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
            choices: [ "View all Patients", "Add a new Patient", "Remove a Patient"]
        }
    ])
    .then(function(answers) {
        const initialQuestion = answers.initialQuestion;
        if (initialQuestion === "View all Patients") {
            viewAllPatients(); // DONE
        }
        else if (initialQuestion === "Add a new Patient") {
            addNewPatient(); // to do
        }
        else if (initialQuestion === "Remove a Patient") {
            removePatient(); // to do
        }
    });
}
                                                                                       
//VIEW ALL PATIENTS (DONE)
function viewAllPatients() {
    connection.query(
        `SELECT p.id, concat(p.first_name, ' ', p.last_name) AS Patient, concat(d.first_name, ' ', d.last_name) AS Doctor, h.pain_level AS PainLevel, p.injury_location AS InjuryLocation, i.injury_name AS TypeOfInjury, p.room_number AS RoomNumber
        FROM sports_doctor_db.patient AS p 
        JOIN sports_doctor_db.doctor AS d ON p.doctor_id = d.id
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

//ADD NEW PATIENT (TO DO)
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

        //1st prompts to add new employee
        inquirer
        .prompt([ 
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
                injury_name = answers.injury_name

                // CREATE DOCTORS BASED OFF OF THE INJURY NAME. GRAB SPECIFIC DOCTORS
                let importDoctors = [];
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
                    //last prompt for doctors
                    inquirer
                    .prompt([ 
                        {
                            type: "list",
                            name: "doctor_name",
                            message: "Which Doctor would you like to see?",
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
                // doctors = doctor_name;
            });
              
    });
    });
    // });
}

