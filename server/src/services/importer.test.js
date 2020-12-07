const fs = require('fs');
const importer = require('./importer');

afterAll(() => {
  fs.unlinkSync('importer.test.csv');
});

test('Should import students successfully', async () => {
  fs.writeFileSync('importer.test.csv', '900026', 'Nicla', 'Baresi', 'Montemarciano', 's900026@students.politu.it', '1991-11-14', 'BY75859842');
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
  fs.writeFileSync('importer.test.csv', 'd9047', 'Gherardo', 'Capon', 'Gherardo.Capon@politu.it', 'RG17768024');
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
  fs.writeFileSync('importer.test.csv', 'XY7032', 3, 2, 'Sistemi energetici industriali', 'd9034');
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

test('Should import enrollments successfully', async () => {
  fs.writeFileSync('importer.test.csv', 'XY1211', '902772');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'lectures');
  expect(res).toBe(true);
});

test('Should fail to import enrollments when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '112,1,30,2020-12-01T13:00:00.000Z,In person');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'lectures');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Should import schedules successfully', async () => {
  fs.writeFileSync('importer.test.csv', 'XY3731', 5, 'Wed', 70, '10:00-11:30');
  const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'classes');
  expect(res).toBe(true);
});

test('Should fail to import schedules when providing malformed csv file', async () => {
  fs.writeFileSync('importer.test.csv', '11,12A');
  try {
    const res = await importer.importFile({ tempFilePath: 'importer.test.csv' }, 'classes');
    expect(res).toBeFalsy();
  } catch (err) {
    expect(err).toBeTruthy();
  }
});
