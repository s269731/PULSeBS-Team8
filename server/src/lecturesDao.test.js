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

// populate Users Table
db.prepare('DELETE FROM Users').run();
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [1, 'D', 'Marco', 'Torchiano', 'd0001@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [2, 'S', 'Jinzhuo', 'Chen', 's0002@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [3, 'S', 'Daniele', 'fhgfghf', 's0003@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [4, 'S', 'Luca', 'Torchiano', 's0004@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [5, 'S', 'Loredana', 'Finocchiaro', 's0005@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [6, 'S', 'Elchin', 'Farhad', 's0006@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [7, 'S', 'Nino', 'Nicolò', 's0007@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);

// populate Subjects Table
db.prepare('DELETE FROM Subjects').run();
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([1, 1, 'SoftwareEngineering II', 'Computer Engineering']);
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([2, 1, 'SoftwareEngineering I', 'Computer Engineering']);

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

// populate Bookings Table
db.prepare('DELETE FROM Bookings').run();
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 2);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 3);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 4);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 5);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 6);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 7);

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

test('Should not return the list of lectures for a userId that doesn\'t exist', async () => {
  const userid = 2;
  const obj = await lecturesDao.getLecturesByUserId(userid);
  expect(obj.length).toBe(0);
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
  try {
    const obj = await lecturesDao.insertReservation(lectureId, studentId);
  } catch (err) {
    expect(err).toBe('No lecture for the specified id');
  }
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
  try {
    const obj1 = await lecturesDao.insertReservation(lectureId, studentId);
  } catch (err) {
    console.log(err);
    expect(err).toBe('The Student has already booked a seat for that Lecture');
  }
});

test('Should return list of student booked for a certain lectureId', async () => {
  const lectureId = 1;
  const obj = await lecturesDao.getStudentsListByLectureId(lectureId);
  expect(obj).toBeTruthy();
  expect(obj[1].id).toBe(2);
  expect(obj[2].id).toBe(3);
  expect(obj[3].id).toBe(4);
  expect(obj[4].id).toBe(5);
  expect(obj[5].id).toBe(6);
  expect(obj[6].id).toBe(7);
});

test('Should not return list of student but undefined because of wrong lectureId', async () => {
  const lectureId = 10;
  const obj = await lecturesDao.getStudentsListByLectureId(lectureId);
  expect(obj).toBeUndefined();
});

test('Should return info about all the lectures scheduled for tomorrow, so that email notifications can be sent', async () => {
  const array = await lecturesDao.getTeachersForEmail();
  expect(Array.isArray(array)).toBe(true);
  expect(array.length).toBe(2);
  expect(array[0].email_addr).toBe('d0001@prof.com');
  expect(array[0].subject).toBe('SoftwareEngineering II');
  expect(array[0].booked_people).toBe(100);
  expect(array[1].email_addr).toBe('d0001@prof.com');
  expect(array[1].subject).toBe('SoftwareEngineering II');
  expect(array[1].booked_people).toBe(100);
});

test('Should return an object with necessary info related to specific booking, so that the email confirmation can be sent', async () => {
  const lectureId = 1;
  const studentId = 5;
  const tomorrow = moment(d).add(1, 'days');
  const obj = await lecturesDao.getInfoBookingConfirmation(lectureId, studentId);
  expect(obj).toBeTruthy();
  expect(obj.email).toBe('s0005@student.com');
  expect(obj.subject).toBe('SoftwareEngineering II');
  expect(obj.date_hour).toBe(tomorrow.toISOString());
  expect(obj.class).toBe('12A');
});

test('Should return an empty object', async () => {
  const lectureId = 10;
  const studentId = 5;
  const obj = await lecturesDao.getInfoBookingConfirmation(lectureId, studentId);
  expect(Object.keys(obj).length).toBe(0);
  expect(obj.constructor).toBe(Object);
});