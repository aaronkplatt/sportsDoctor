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