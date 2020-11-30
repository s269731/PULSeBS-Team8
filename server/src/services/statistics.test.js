process.env.NODE_ENV = 'test';

const moment = require('moment');
const db = require('../db');
const userDao = require('../userDao');
const subjectDao = require('../subjectsDao');
const lecturesDao = require('../lecturesDao');
const statistics = require('./statistics');

const d = new Date();
let today = moment(d);
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
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [2, 1, 1, today.add(5, 'hours').toISOString(), 'In person', '12A', 100, 6],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [3, 1, 1, today.subtract(3, 'months').toISOString(), 'In person', '12A', 100, 50],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [4, 1, 1, today.subtract(5, 'days').toISOString(), 'In person', '12A', 100, 50],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [5, 1, 1, today.subtract(1, 'days').toISOString(), 'In person', '12A', 100, 100],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [6, 1, 2, today.subtract(1, 'months').toISOString(), 'In person', '12A', 150, 6],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [7, 1, 2, today.add(2, 'hours').toISOString(), 'In person', '12A', 100, 6],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [8, 1, 2, today.subtract(3, 'months').toISOString(), 'In person', '12A', 100, 50],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [9, 1, 1, today.subtract(5, 'days').toISOString(), 'In person', '12A', 100, 50],
);
today = moment(d);
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [10, 1, 1, today.subtract(15, 'days').toISOString(), 'In person', '12A', 100, 100],
);
const oct4 = new Date('4 October 2020');
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [11, 1, 1, oct4.toISOString(), 'In person', '12A', 100, 100],
);
const oct1 = new Date('1 October 2020');
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [12, 1, 1, oct1.toISOString(), 'In person', '12A', 100, 100],
);
const oct2 = new Date('2 October 2020');
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [13, 1, 1, oct2.toISOString(), 'In person', '12A', 100, 100],
);
const sep28 = new Date('28 September 2020');
db.prepare('INSERT INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)').run(
  [14, 1, 1, sep28.toISOString(), 'In person', '12A', 100, 100],
);

test('Test the correct computing of statistics', async () => {
  const teacherId = 1;
  const obj = await statistics.computeTeacherStatistics(teacherId);
  expect(obj[0]).toBeTruthy();
  expect(obj[1]).toBeTruthy();
  expect(obj[0].subjectId.SubjectId).toBe(1);
  expect(obj[1].subjectId.SubjectId).toBe(2);
  expect(obj[0].dailystatsarray[9]).toBeTruthy();
  expect(obj[0].weeklystatsarray[0].weekId).toBe('24-30 AUG 2020');
  expect(obj[0].weeklystatsarray[0].weeklyavgbookings).toBe(50);
  expect(obj[0].weeklystatsarray[0].weeklyavgunoccupiedplaces).toBe(50);
  expect(obj[0].weeklystatsarray[1].weekId).toBe('28 SEP-04 OCT 2020');
  expect(obj[0].weeklystatsarray[3].weeklyavgbookings).toBe(51.5);
  expect(obj[0].weeklystatsarray[3].weeklyavgunoccupiedplaces).toBe(61);
  expect(obj[0].monthlystatsarray[3].monthId).toBe('NOV-2020');
  expect(obj[0].monthlystatsarray[3].monthlyavgbookings).toBe(61.2);
  expect(obj[0].monthlystatsarray[3].monthlyavgunoccupiedseats).toBe(48.8);
});
