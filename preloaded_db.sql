DROP DATABASE IF EXISTS sports_doctor_db;
CREATE DATABASE sports_doctor_db;
USE sports_doctor_db;

--patients table needs fk set up--
CREATE TABLE patient(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  doctor_id INTEGER(11) NOT NULL,
  room_number INTEGER(11) NOT NULL,
  pain_id INTEGER(11) NOT NULL,
  injury_location VARCHAR(30) NOT NULL,
  injury_id INTEGER(11) NOT NULL,
  PRIMARY KEY (id)
);

--doctor needs fk set up--
CREATE TABLE doctor(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  department_id INTEGER(11) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE pain(
    id INTEGER(11) NOT NULL,
    pain_level VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE injury(
    id INTEGER(11) NOT NULL,
    injury_name VARCHAR(30) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department(
    id INTEGER(11) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    injury_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

-- INSERT INTO `sports_doctor_db`.`injury` (`id`, `injury_name`, `department_id`) VALUES ('1', 'Sprain', '2');
-- INSERT INTO `sports_doctor_db`.`injury` (`id`, `injury_name`, `department_id`) VALUES ('2', 'Strain', '5');
-- INSERT INTO `sports_doctor_db`.`injury` (`id`, `injury_name`, `department_id`) VALUES ('3', 'Fracture', '3');
-- INSERT INTO `sports_doctor_db`.`injury` (`id`, `injury_name`, `department_id`) VALUES ('4', 'Concussion', '4');
-- INSERT INTO `sports_doctor_db`.`injury` (`id`, `injury_name`, `department_id`) VALUES ('5', 'Overuse', '1');
