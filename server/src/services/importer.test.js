const fs = require('fs');
const importer = require('./importer');
const db = require('../db');

afterAll(() => {
  fs.unlinkSync('importer.test.csv');
});

beforeAll(() => {
  db.prepare('DELETE FROM Classes').run();
  db.prepare('DELETE FROM Subjects').run();
  db.prepare('DELETE FROM Lectures').run();
  db.prepare('DELETE FROM Users').run();
});

test('Should import students successfully', async () => {
  fs.writeFileSync('importer.test.csv', '1,S,dfsd,dfaa,sda@asdds.sdds,sdfasda,dfsfds');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
  expect(res).toBe(true);
});

test('Should fail to import students when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '2,S,dfsd,dfaa,sda@asdds.sdds,sdfasda');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import teachers successfully', async () => {
  fs.writeFileSync('importer.test.csv', '3,D,dfsd,dfaa,sda@asdds.sdds,sdfasda,dfsfds');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
  expect(res).toBe(true);
});

test('Should fail to import teachers when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '4,D,dfsd,dfaa,sda@asdds.sdds,sdfasda');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import courses successfully', async () => {
  fs.writeFileSync('importer.test.csv', '30,3,Software Engineering II,Computer Engineering');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'courses');
  expect(res).toBe(true);
});

test('Should fail to import courses when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '10,3,Software Engineering I');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'courses');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import lectures successfully', async () => {
  fs.writeFileSync('importer.test.csv', '20,3,30,2020-12-01T13:00:00.000Z,In person,12A,20,0');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'lectures');
  expect(res).toBe(true);
});

test('Should fail to import lectures when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '2,3,30,2020-12-01T13:00:00.000Z,In person');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'lectures');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import classes successfully', async () => {
  fs.writeFileSync('importer.test.csv', '1,12A,20');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'classes');
  expect(res).toBe(true);
});

test('Should fail to import classes when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '11,12A');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'classes');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});
