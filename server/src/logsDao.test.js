process.env.NODE_ENV = 'test';

const moment = require('moment');
const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');
const lecturesDao = require('./lecturesDao');
const logsDao = require('./logsDao');

// populate db
const d = new Date();

db.prepare('DELETE FROM Logs').run();
db.prepare('DELETE FROM Users').run();
// populate Users Table
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
  [7, 'S', 'Nino', 'Sasa', 's0007@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);

// populate Subjects Table
db.prepare('DELETE FROM Subjects').run();
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([1, 1, 'SoftwareEngineering II', 'Computer Engineering']);
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([2, 1, 'SoftwareEngineering I', 'Computer Engineering']);

// delete all the lectures inserted
db.prepare('DELETE from Lectures').run();
// populate Lectures Table
const today = moment(d); // .format('YYYY-MM-DD HH:MM:SS.SSS');
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [1, 1, 1, today.add(1, 'days').toISOString(), 'In person', '12A', 150, 6],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [2, 1, 1, today.add(2, 'hours').toISOString(), 'In person', '12A', 100, 6],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [3, 1, 1, today.subtract(3, 'days').toISOString(), 'In person', '12A', 100, 50],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [4, 1, 1, today.add(5, 'days').toISOString(), 'In person', '12A', 100, 50],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [5, 1, 1, today.add(15, 'minutes').toISOString(), 'In person', '12A', 100, 100],
);
// populate Enrollments Table
db.prepare('DELETE FROM Enrollments').run();
db.prepare('INSERT INTO Enrollments(StudentId,SubjectId) VALUES(?,?)').run(2, 1);

// populate Bookings Table
db.prepare('DELETE FROM Bookings').run();
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 2);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 3);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 4);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 5);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 6);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(1, 7);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(2, 2);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(2, 3);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(2, 4);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(2, 5);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(2, 6);
db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)').run(2, 7);

// populate Logs table
//db.prepare('DELETE FROM Logs').run();
db.prepare('INSERT INTO Logs(TypeOp, UserId, LectDate, SubjectId, Timestamp) VALUES(?,?,?,?,?)').run(0, 2, '2020-11-29T17:30:00.000Z', 1, '1606295135031.0');
db.prepare('INSERT INTO Logs(TypeOp, UserId, LectDate, SubjectId, Timestamp) VALUES(?,?,?,?,?)').run(1, 3, '2020-11-29T17:30:00.000Z', 1, '1606295137354.0');
db.prepare('INSERT INTO Logs(TypeOp, UserId, LectDate, SubjectId, Timestamp) VALUES(?,?,?,?,?)').run(2, 1, '2020-11-29T17:30:00.000Z', 2, '1606295180671.0');
db.prepare('INSERT INTO Logs(TypeOp, UserId, LectDate, SubjectId, Timestamp) VALUES(?,?,?,?,?)').run(3, 1, '2020-11-29T17:30:00.000Z', 2, '1606295191955.0');

test('Should insert the record into Logs table, lecture passed as id', async () => {
    const userId = 1;
    const typeOp = 3;
    const lect = 4;
    const res = await logsDao.insertLog(userId, typeOp, lect);
    expect(res).toBe(0);
  });
  
  test('Should insert the record into Logs table, lecture passed directly as object with 2 properties', async () => {
    const userId = 1;
    const typeOp = 2;
    const lect = {date_hour: '2020-11-29T17:30:00.000Z', subject: 'SoftwareEngineering II'};
    const res = await logsDao.insertLog(userId, typeOp, lect);
    expect(res).toBe(0);
  });
  
  test('Should return all the records of Logs table in descending order', async () => {
    const logs = await logsDao.getLogs();
    const info = logs.shift();
    expect(info.TypeOp0).toBe(1);
    expect(info.TypeOp1).toBe(1);
    expect(info.TypeOp2).toBe(2);
    expect(info.TypeOp3).toBe(2);
    expect(logs.length).toBe(6);
  });