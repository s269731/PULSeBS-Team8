const fs = require('fs');
const importer = require('./importer');

afterAll(() => {
  fs.unlinkSync('importer.test.csv');
});

test('Should import students successfully', async () => {
  fs.writeFileSync('importer.test.csv', '100,S,dfsd,dfaa,sda@asdds.sdds,sdfasda,dfsfds');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
  expect(res).toBe(true);
});

test('Should fail to import students when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '101,S,dfsd,dfaa,sda@asdds.sdds,sdfasda');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import teachers successfully', async () => {
  fs.writeFileSync('importer.test.csv', '103,D,dfsd,dfaa,sda@asdds.sdds,sdfasda,dfsfds');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
  expect(res).toBe(true);
});

test('Should fail to import teachers when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '104,D,dfsd,dfaa,sda@asdds.sdds,sdfasda');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'students');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import courses successfully', async () => {
  fs.writeFileSync('importer.test.csv', '130,1,Software Engineering II,Computer Engineering');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'courses');
  expect(res).toBe(true);
});

test('Should fail to import courses when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '110,1,Software Engineering I');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'courses');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import lectures successfully', async () => {
  fs.writeFileSync('importer.test.csv', '120,1,2,2020-12-01T13:00:00.000Z,In person,12A,20,0');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'lectures');
  expect(res).toBe(true);
});

test('Should fail to import lectures when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '112,1,30,2020-12-01T13:00:00.000Z,In person');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'lectures');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import classes successfully', async () => {
  fs.writeFileSync('importer.test.csv', '101,12A,20');
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
