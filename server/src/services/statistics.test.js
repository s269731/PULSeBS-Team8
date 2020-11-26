process.env.NODE_ENV = 'test';

const moment = require('moment');
const db = require('../db');
const userDao = require('../userDao');
const subjectDao = require('../subjectsDao');
const lecturesDao = require('../lecturesDao');
const statistics = require('./statistics');

const d = new Date();
const today = moment(d);
// populate DB
db.prepare('DELETE FROM Logs').run();
db.prepare('DELETE FROM Users').run();
db.prepare('DELETE FROM Subjects').run();
db.prepare('DELETE from Lectures').run();
db.prepare('DELETE FROM Enrollments').run();
db.prepare('DELETE FROM Bookings').run();

db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [1, 'D', 'Marco', 'Torchiano', 'd0001@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering'],
);
db.prepare('INSERT INTO Subjects(SubjectId, TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([1, 1, 'SoftwareEngineering II', 'Computer Engineering']);
db.prepare('INSERT INTO Subjects(SubjectId, TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([2, 1, 'SoftwareEngineering I', 'Computer Engineering']);

db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [1, 1, 1, today.subtract(1, 'days').toISOString(), 'In person', '12A', 150, 6],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [2, 1, 1, today.add(2, 'hours').toISOString(), 'In person', '12A', 100, 6],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [3, 1, 1, today.subtract(3, 'months').toISOString(), 'In person', '12A', 100, 50],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [4, 1, 1, today.subtract(5, 'days').toISOString(), 'In person', '12A', 100, 50],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [5, 1, 1, today.subtract(15, 'hours').toISOString(), 'In person', '12A', 100, 100],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [6, 1, 2, today.subtract(1, 'months').toISOString(), 'In person', '12A', 150, 6],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [7, 1, 2, today.add(2, 'hours').toISOString(), 'In person', '12A', 100, 6],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [8, 1, 2, today.subtract(3, 'months').toISOString(), 'In person', '12A', 100, 50],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [9, 1, 1, today.subtract(5, 'days').toISOString(), 'In person', '12A', 100, 50],
);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [10, 1, 1, today.subtract(15, 'days').toISOString(), 'In person', '12A', 100, 100],
);

test('nothing', async () => {
  const teacherId = 1;
  const obj = await statistics.computeTeacherStatistics(teacherId);

});
