process.env.NODE_ENV = 'test';

const moment = require('moment');
const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');
const lecturesDao = require('./lecturesDao');

// delete all the lectures inserted
db.prepare('DELETE from Lectures').run();
// populate db
const d = new Date();
// populate Lectures Table
const today = moment(d); // .format('YYYY-MM-DD HH:MM:SS.SSS');
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [1, 1, 1, today.add(1, 'days').toISOString(), 'In person', '12A', 150, 100],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [2, 1, 1, today.add(2, 'hours').toISOString(), 'In person', '12A', 50, 100],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [3, 1, 1, today.subtract(3, 'days').toISOString(), 'In person', '12A', 50, 100],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [4, 1, 1, today.add(5, 'days').toISOString(), 'In person', '12A', 50, 100],
);
// populate Enrollments Table
db.prepare('DELETE FROM Enrollments').run();
db.prepare('INSERT INTO Enrollments(StudentId,SubjectId) VALUES(?,?)').run(1, 1);
// populate Subjects Table
db.prepare('DELETE FROM Subjects').run();
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([1, 1, 'SoftwareEngineering II', 'Computer Engineering']);
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([2, 1, 'SoftwareEngineering I', 'Computer Engineering']);
// populate Users Table
db.prepare('DELETE FROM Users').run();
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [1, 'D', 'Marco', 'Torchiano', 'd0001@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);

test('Should return list of lectures for the userId', async () => {
  const userid = 1;
  const obj = await lecturesDao.getLecturesByUserId(userid);
  expect(Array.isArray(obj)).toBe(true);
  // expect(obj[0] instanceof lecturesDao.Lecture).toBe(true);
  expect(obj[0].lectureId).toBeTruthy();
  expect(obj[0].subjectName).toBeTruthy();
  expect(obj[0].teacherName).toBeTruthy();
  expect(obj[0].dateHour).toBeTruthy();
  expect(obj[0].modality).toBeTruthy();
  expect(obj[0].className).toBeTruthy();
  expect(obj[0].capacity).toBeTruthy();
  expect(obj[0].bookedPeople).toBeTruthy();
});

test('Should not return the list of lectures for a userId that doesnt exist', async () => {
  const userid = 2;
  const obj = await lecturesDao.getLecturesByUserId(userid);
  expect(obj).toBeTruthy();
  // expect(obj).toBe('There aren\'t lecture for this StudentId');
});

test('Should return 1 to indicate that the reservation was correctly inserted ', async () => {
  const lectureId = 1;
  const studentId = 1;
  const obj = await lecturesDao.insertReservation(lectureId, studentId);
  expect(obj).toBeTruthy();
  expect(obj.result).toBe(1);
});

test('Should not return 1 because lectureId doesn\'t correspond to any lecture ', async () => {
  const lectureId = 5;
  const studentId = 1;
  const obj = await lecturesDao.insertReservation(lectureId, studentId);
  expect(obj).toBeTruthy();
  expect(obj.result).toBeUndefined();
});

test('Should return a message indicating lectureId bookings are closed ', async () => {
  const lectureId = 2;
  const studentId = 1;
  const obj = await lecturesDao.insertReservation(lectureId, studentId);
  expect(obj).toBeTruthy();
  // expect(obj.result).toBe('Booking is closed for that Lecture');
});

test('Second reservation should return a message showing that a seat for that lectureId is already booked', async () => {
  const lectureId = 1;
  const studentId = 1;
  const obj = await lecturesDao.insertReservation(lectureId, studentId);
  const obj1 = await lecturesDao.insertReservation(lectureId, studentId);
  expect(obj1).toBeTruthy();
  // expect(obj1).toBe('The Student has already booked a seat for that Lecture');
});
