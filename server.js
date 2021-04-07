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
    console.log("connected as id " + connection.threadId + "\n");
});

//THE FIRST QUESTION PROMPTED
initialQuestion();
function initialQuestion() {
    inquirer
    .prompt([
        //WHAT WOULD YOU LIKE TO DO? (initialQuestion)
        {
            type: "list",
            name: "initialQuestion",
            message: "Welcome to the Sports Doctor! How can I help you today?",
            choices: ["Add a new Patient", "Remove a Patient", "View all Patients"]
        }
    ])
    .then(function(answers) {
        const initialQuestion = answers.initialQuestion;
        if (initialQuestion === "Add a new Patient") {
            // addNewPatient(); // to do
            console.log("it worked!")
        }
        else if (initialQuestion === "Remove a Patient") {
            removePatient(); // to do
        }
        else if (initialQuestion === "View all Patients") {
            viewAllPatients(); // DONE
        }
    });
}
                                                                                       
//VIEW ALL PATIENTS (TO DO)
function viewAllPatients() {
    connection.query(
        `SELECT p.id, concat(p.first_name, ' ', p.last_name) AS Patient, concat(d.first_name, ' ', d.last_name) AS Doctor, h.pain_level, p.injury_location, i.injury_name, p.room_number
        FROM sports_doctor_db.patient AS p 
        JOIN sports_doctor_db.doctor AS d ON p.doctor_id = d.id
        JOIN sports_doctor_db.pain AS h ON p.pain_id = h.id
        JOIN sports_doctor_db.injury AS i on p.injury_id = i.id;`,
            function(err, res) {
                if (err) throw err;
                console.log("\n");
            console.table(res);
            //go back to inital
            initialQuestion();
    });
}

