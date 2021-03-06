# PULSeBS Project - Team 8
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=alert_status)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=security_rating)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=sqale_index)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=code_smells)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=coverage)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=s269731_PULSeBS-Team8&metric=bugs)](https://sonarcloud.io/dashboard?id=s269731_PULSeBS-Team8)

# Contents

- [How to run docker images](#how-to-run-docker-images)
    - [Release 2 - Version v2](#release-2---version-v2)
    - [Release 1.5 - Version v1.5](#release-15---version-v15)
    - [Release 1 - Version v1](#release-1---version-v1)
    - [Release 0 - Version v0](#release-0---version-v0)
- [How to use the application](#how-to-use-the-application)
    - [Credentials](#credentials)
        - [Students](#students)
        - [Teachers](#teachers)
        - [Officers](#officers)
        - [Managers](#managers)
    - [CSV File format](#csv-file-format)
        - [Version v1.5](#For-version-v15)
        - [Version v1](#For-version-v1)
                 - [Students](#students)
                 - [Teachers](#teachers)
                - [Courses](#courses)
                - [Classes](#classes)
                - [Lectures](#lectures)
- [How to run E2E automated tests](#how-to-run-e2e-automated-tests)
- [How to run SAML Identity provider](#how-to-run-saml-identity-provider)


# How to run docker images

(if you are on windows, you must avoid "sudo")

## Release 2 - Version v2
- `sudo docker pull se2team8/pulsebs-team8:v2`
- `sudo docker run -p 3000:3000 -p 3001:3001 se2team8/pulsebs-team8:v2`
-  in the browser, go to `http://localhost:3000`

Notice: to use the `Login with SoftEng credentials` feature in the login page, you have to run the IdP docker image. See [How to run SAML Identity provider](#how-to-run-saml-identity-provider).

## Release 1.5 - Version v1.5
- `sudo docker pull se2team8/pulsebs-team8:v1.5`
- `sudo docker run -p 3000:3000 -p 3001:3001 se2team8/pulsebs-team8:v1.5`
-  in the browser, go to `http://localhost:3000`

## Release 1 - Version v1
- `sudo docker pull se2team8/pulsebs-team8:v1`
- `sudo docker run -p 3000:3000 -p 3001:3001 se2team8/pulsebs-team8:v1`
-  in the browser, go to `http://localhost:3000`

## Release 0 - Version v0
For only the very first version, we used docker-compose.
So, you need to:
- download the code of this repository with **tag v0**
- in the folder of the code, execute: `docker-compose pull`
- then execute: `docker-compose run`
-  in the browser, go to `http://localhost:3000`

# How to use the application

## Credentials

### Students

| Email | Password |
| -----|---------|
| pulsebs8-s0001@yahoo.com | pass1 |
| pulsebs8-s0002@yahoo.com | pass1 |
| pulsebs8-s0003@yahoo.com | pass1 |
| ... | ... |
| pulsebs8-s0023@yahoo.com | pass1 |

**Notice**: for version *v0*, use the emails s0001@stud.com,s0002@stud.com 

 ### Teachers

| Email | Password |
| -----|---------|
| pulsebs8-d0001@yahoo.com | pass2 |
| pulsebs8-d0002@yahoo.com | pass2 |
| pulsebs8-d0003@yahoo.com | pass2 |
| ... | ... |
| pulsebs8-d0007@yahoo.com | pass2 |

**Notice**: for version *v0*, use the emails d0001@prof.com, d0002@prof.com

### Officers
| Email | Password |
| -----|---------|
| pulsebs8-o0001@yahoo.com | pass2 |

### Managers
| Email | Password |
| -----|---------|
| pulsebs8-m0001@yahoo.com | pass2 |

## CSV Files format 

## For version v1.5
Use the same format of csv files provided by the Product Owner 


## For version v1
To upload some data in the officer page

### Students
Integer ID, "S", Name, Surname, Email, Password Hash, Course

ex. 56,S,Aron,Avneet,pulsebs8-s0056@yahoo.com,$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa,Computer Engineering

### Teachers
Integer ID, "D", Name, Surname, Email, Password Hash, Course

ex. 79,D,Pietro,Bianchi,pulsebs8-d0079@yahoo.com,$2b$12$AYemd0Fi1NUOLOMgENIUGes2xDB4IPlaCYPLmYGwM2chNF9qfgpzK,Computer Engineering

### Courses
Integer ID, Course Name, Course of study

ex. 10,2,Information Systems security,Computer Engineering

### Classes

Integer ID, Name, Capacity

ex. 16,10A,250

### Lectures
Integer ID, Teacher ID, Subject ID, DateHour (in the format YYYY-MM-DDTHH:MM:SS.000Z), Modality ("In person" or "Virtual"), Classroom, Capacity Of the classroom, Booked People

ex. 121,28,7,2020-12-10T11:30:00.000Z,In person,14,30,21

## How to run SAML Identity provider

- Clone the Repository https://github.com/LucaBarco/Pulsebs-SAMLIdP
- Go into the repository folder
- run the commands:
    - `docker-compose build`
    - `docker-compose up`
- Then, run the application as usual (either npm start in both server and client or via docker image)

## How to run E2E automated tests
To successfully run all end-to-end tests, you must first have the SAML IdP up and running ([see instructions above](#how-to-run-e2e-automated-tests)).

Then, run these configurations:
- on the server
    - `npm start:test`
- on the client
    - `npm start`
    - `npm test:e2e`
