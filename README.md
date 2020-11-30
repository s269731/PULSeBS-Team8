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

# How to run docker images
(if you are on windows, you must avoid "sudo")

## Version v1
- sudo docker pull se2team8/pulsebs-team8:v1
- sudo docker run -p 3000:3000 -p 3001:3001 se2team8/pulsebs-team8:v1

## Version v0
For this very first version, we used docker-compose.
So, you need to:
- download the code of this repository with **tag v0**
- in the folder of the code, execute: *docker-compose pull*
- then execute: *docker-compose run*