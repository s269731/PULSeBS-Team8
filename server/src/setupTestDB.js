const moment = require('moment');
const db = require('./db');

global.now = new Date();

function initTestDB() {
  /** ********************* */
  /*       USERS TABLE      */
  /** ********************* */
  const usersStmt = db.prepare('INSERT OR IGNORE INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)');
  usersStmt.run([1, 'D', 'Marco', 'Torchiano', 'd0001@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([2, 'S', 'Jinzhuo', 'dghfg', 's0002@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([3, 'S', 'Daniele', 'fhghf', 's0003@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([4, 'S', 'Luca', 'asdfdasd', 's0004@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([5, 'S', 'Loredana', 'dffg', 's0005@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([6, 'S', 'Elchin', 'fgngfg', 's0006@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([7, 'S', 'Nino', 'Sasa', 's0007@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([8, 'M', 'aaaaa', 'bbbb', 'm0001@manager.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([9, 'O', 'cccc', 'ddddd', 'o0001@officer.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);
  usersStmt.run([10, 'D', 'Mario', 'Rossi', 'd0002@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'Computer Engineering']);

  /** ********************* */
  /*    SUBJECTS TABLE      */
  /** ********************* */
  const subjStmt = db.prepare('INSERT OR IGNORE INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)');
  subjStmt.run([1, 1, 'SoftwareEngineering II', 'Computer Engineering']);
  subjStmt.run([2, 1, 'SoftwareEngineering I', 'Computer Engineering']);
  subjStmt.run([3, 10, 'Web Applications I', 'Computer Engineering']);
  subjStmt.run([4, 10, 'Web Applications II', 'Computer Engineering']);
  subjStmt.run([5, 10, 'Security', 'Computer Engineering']);

  /** ********************* */
  /*    LECTURES TABLE      */
  /** ********************* */
  let today = moment(global.now); // .format('YYYY-MM-DD HH:MM:SS.SSS');
  const lectStmt = db.prepare('INSERT OR IGNORE INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople) VALUES(?,?,?,?,?,?,?,?)');
  lectStmt.run([1, 1, 1, today.add(1, 'days').toISOString(), 'In person', '12A', 150, 6]);
  lectStmt.run([2, 1, 1, today.add(2, 'hours').toISOString(), 'In person', '12A', 100, 6]);
  lectStmt.run([3, 1, 1, today.subtract(3, 'days').toISOString(), 'In person', '12A', 100, 50]);
  lectStmt.run([4, 1, 1, today.add(5, 'days').toISOString(), 'In person', '12A', 100, 50]);
  today = moment(global.now);
  lectStmt.run([5, 1, 1, today.add(2, 'days').toISOString(), 'In person', '12A', 100, 100]);
  // add past lectures for statistics
  const nov30 = new Date('30 November 2020');
  lectStmt.run([6, 10, 3, nov30.toISOString(), 'In person', '12A', 150, 6]);
  lectStmt.run([7, 10, 3, moment(global.now).add(5, 'days').toISOString(), 'In person', '12A', 100, 6]);
  const sept1 = new Date('1 September 2020');
  lectStmt.run([8, 10, 3, sept1.toISOString(), 'In person', '12A', 100, 50]);
  const nov26 = new Date('26 November 2020');
  lectStmt.run([9, 10, 3, nov26.toISOString(), 'In person', '12A', 100, 50]);
  lectStmt.run([10, 10, 3, nov30.toISOString(), 'In person', '12A', 100, 100]);
  const nov1 = new Date('1 November 2020');
  lectStmt.run([11, 10, 4, nov1.toISOString(), 'In person', '12A', 150, 6]);
  lectStmt.run([12, 10, 4, moment(global.now).add(2, 'hours').toISOString(), 'In person', '12A', 100, 6]);
  lectStmt.run([13, 10, 4, sept1.toISOString(), 'In person', '12A', 100, 50]);
  lectStmt.run([14, 10, 5, nov26.toISOString(), 'In person', '12A', 100, 50]);
  const nov16 = new Date('16 November 2020');
  lectStmt.run([15, 10, 3, nov16.toISOString(), 'In person', '12A', 100, 100]);
  const oct4 = new Date('4 October 2020');
  lectStmt.run([16, 10, 3, oct4.toISOString(), 'In person', '12A', 100, 100]);
  const oct1 = new Date('1 October 2020');
  lectStmt.run([17, 10, 3, oct1.toISOString(), 'In person', '12A', 100, 100]);
  const oct2 = new Date('2 October 2020');
  lectStmt.run([18, 10, 3, oct2.toISOString(), 'In person', '12A', 100, 100]);
  const sep28 = new Date('28 September 2020');
  lectStmt.run([19, 10, 3, sep28.toISOString(), 'In person', '12A', 100, 100]);

  /** ********************* */
  /*    ENROLLMENTS TABLE   */
  /** ********************* */
  db.prepare('INSERT OR IGNORE INTO Enrollments(StudentId,SubjectId) VALUES(?,?)').run(2, 1);

  /** ********************* */
  /*    BOOKINGS TABLE      */
  /** ********************* */
  const bookStmt = db.prepare('INSERT OR IGNORE INTO Bookings(LectureId,StudentId,Status) VALUES(?,?,?)');
  bookStmt.run(1, 2, 0);
  bookStmt.run(1, 3, 0);
  bookStmt.run(1, 4, 0);
  bookStmt.run(1, 5, 0);
  bookStmt.run(1, 6, 0);
  bookStmt.run(1, 7, 0);
  bookStmt.run(2, 2, 0);
  bookStmt.run(2, 3, 0);
  bookStmt.run(2, 4, 0);
  bookStmt.run(2, 5, 0);
  bookStmt.run(2, 6, 0);
  bookStmt.run(2, 7, 0);
  bookStmt.run(4, 7, 1);
  bookStmt.run(4, 6, 1);

  /** ********************* */
  /*      LOGS TABLE        */
  /** ********************* */
  const logsStmt = db.prepare('INSERT OR IGNORE INTO Logs(TypeOp, UserId, LectDate, SubjectId, Timestamp) VALUES(?,?,?,?,?)');
  logsStmt.run(0, 2, '2020-11-29T17:30:00.000Z', 1, '1606295135031.0');
  logsStmt.run(1, 3, '2020-11-29T17:30:00.000Z', 1, '1606295137354.0');
  logsStmt.run(2, 1, '2020-11-29T17:30:00.000Z', 2, '1606295180671.0');
  logsStmt.run(3, 1, '2020-11-29T17:30:00.000Z', 2, '1606295191955.0');
}

function cleanupTestDB() {
  db.prepare('DELETE FROM Logs').run();
  db.prepare('DELETE FROM Users').run();
  db.prepare('DELETE FROM Subjects').run();
  db.prepare('DELETE from Lectures').run();
  db.prepare('DELETE FROM Enrollments').run();
  db.prepare('DELETE FROM Bookings').run();
}

exports.initTestDB = initTestDB;
exports.cleanupTestDB = cleanupTestDB;
