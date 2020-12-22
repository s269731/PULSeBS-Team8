const moment = require('moment');
const db = require('./db');

global.now = new Date();

function initTestDB() {
  /** ********************* */
  /*       USERS TABLE      */
  /** ********************* */
  const usersStmt = db.prepare('INSERT OR IGNORE INTO Users(Id, Role, Name, Surname, Email, Password, SSN) VALUES(?,?,?,?,?,?,?)');
  usersStmt.run([1, 'D', 'Marco', 'Torchiano', 'd0001@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141390']);
  usersStmt.run([2, 'S', 'Jinzhuo', 'dghfg', 's0002@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141391']);
  usersStmt.run([3, 'S', 'Daniele', 'fhghf', 's0003@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141392']);
  usersStmt.run([4, 'S', 'Luca', 'asdfdasd', 's0004@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141393']);
  usersStmt.run([5, 'S', 'Loredana', 'dffg', 's0005@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141394']);
  usersStmt.run([6, 'S', 'Elchin', 'fgngfg', 's0006@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141395']);
  usersStmt.run([7, 'S', 'Nino', 'Sasa', 's0007@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141396']);
  usersStmt.run([8, 'M', 'aaaaa', 'bbbb', 'm0001@manager.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141397']);
  usersStmt.run([9, 'O', 'cccc', 'ddddd', 'o0001@officer.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141398']);
  usersStmt.run([10, 'D', 'Mario', 'Rossi', 'd0002@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141399']);
  usersStmt.run([11, 'D', 'Maria', 'Balducci', 'd0003@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141340']);
  usersStmt.run([12, 'D', 'Paolino', 'Garzetta', 'd0004@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141341']);
  usersStmt.run([13, 'S', 'Alvaro', 'Vitale', 's0007@student.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141342']);

  /** ********************* */
  /*    SUBJECTS TABLE      */
  /** ********************* */
  const subjStmt = db.prepare('INSERT OR IGNORE INTO Subjects(SubjectId,Year,Semester,TeacherId,SubjName) VALUES(?,?,?,?,?)');
  subjStmt.run([1, 1, 1, 1, 'SoftwareEngineering II']);
  subjStmt.run([2, 1, 1, 1, 'SoftwareEngineering I']);
  subjStmt.run([3, 1, 1, 10, 'Web Applications I']);
  subjStmt.run([4, 1, 1, 10, 'Web Applications II']);
  subjStmt.run([5, 1, 1, 10, 'Security']);
  subjStmt.run([6, 1, 1, 11, 'Computer Network Technologies']);
  subjStmt.run([7, 1, 1, 12, 'Big Data']);

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
  lectStmt.run([20, 11, 6, moment(global.now).subtract(2, 'days').toISOString(), 'In person', '12A', 100, 6]);
  lectStmt.run([21, 12, 7, moment(global.now).subtract(4, 'days').toISOString(), 'In person', '12A', 100, 6]);
  lectStmt.run([22, 11, 6, moment(global.now).subtract(1, 'days').toISOString(), 'In person', '12A', 100, 6]);
  const lectStmt1 = db.prepare('INSERT OR IGNORE INTO Lectures(LectureId, TeacherId, SubjectId, DateHour, Modality, Class, Capacity, BookedPeople,PresentPeople,ReportPresence) VALUES(?,?,?,?,?,?,?,?,?,?)');
  const dec10 = new Date();
  dec10.setDate(dec10.getDate() - 4);
  lectStmt1.run([23, 1, 1, dec10.toISOString(), 'In person', '12A', 100, 50, 34, 1]);
  const dec6 = new Date('6 December 2020');
  lectStmt1.run([24, 1, 1, dec6.toISOString(), 'In person', '12A', 100, 60, 55, 1]);
  lectStmt1.run([25, 1, 1, moment(global.now).add(1, 'month').toISOString(), 'In person', '12A', 100, 6, 6, 1]);
  const oct15 = new Date('15 October 2020');
  lectStmt1.run([26, 1, 1, oct15.toISOString(), 'In person', '12A', 100, 80, 78, 1]);
  const dec1 = new Date('1 December 2020');
  lectStmt1.run([27, 1, 1, dec1.toISOString(), 'In person', '12A', 100, 15, 5, 1]);
  lectStmt1.run([28, 1, 1, dec6.toISOString(), 'In person', '12A', 100, 100, 100, 1]);
  lectStmt.run([29, 1, 1, today.subtract(4, 'days').toISOString(), 'In person', '12A', 100, 50]);

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
  bookStmt.run(29, 2, 0);
  bookStmt.run(29, 3, 0);
  bookStmt.run(29, 4, 0);
  bookStmt.run(29, 5, 0);
  bookStmt.run(4, 7, 1);
  bookStmt.run(4, 6, 1);
  bookStmt.run(20, 7, 0);
  bookStmt.run(21, 7, 0);
  bookStmt.run(22, 7, 0);
  bookStmt.run(20, 4, 0);
  bookStmt.run(21, 2, 0);
  bookStmt.run(22, 3, 0);
  bookStmt.run(20, 5, 0);
  bookStmt.run(21, 6, 0);
  bookStmt.run(22, 2, 0);
  bookStmt.run(20, 6, 0);
  bookStmt.run(21, 5, 0);
  bookStmt.run(22, 8, 0);

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
  db.prepare('DELETE FROM Enrollments').run();
  db.prepare('DELETE FROM Bookings').run();
  db.prepare('DELETE from Lectures').run();
  db.prepare('DELETE FROM Subjects').run();
  db.prepare('DELETE FROM Users').run();
}

exports.initTestDB = initTestDB;
exports.cleanupTestDB = cleanupTestDB;
