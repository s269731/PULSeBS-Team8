const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');

class Lecture {
  constructor(lectureId, subjectName, teacherName, dateHour, modality, className, capacity, bookedPeople) {
    this.lectureId = lectureId;
    this.subjectName = subjectName;
    this.teacherName = teacherName;
    this.dateHour = dateHour;
    this.modality = modality;
    this.className = className;
    this.capacity = capacity;
    this.bookedPeople = bookedPeople;
  }
}

exports.getLecturesByUserId = (id) => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM Lectures WHERE SubjectId IN (SELECT SubjectId FROM Enrollments WHERE StudentId=?)  ';
  const stmt = db.prepare(sql);
  const rows = stmt.all(id);
  const lectures = [];

  if (rows.length > 0) {
    rows.forEach((rawlecture) => {
      const subjectName = subjectDao.getSubjectName(rawlecture.SubjectId);
      const teacher = userDao.getUserById(rawlecture.TeacherId);
      const teacherName = string.concat(teacher.Name, teacher.Surname);
      const lecture = new Lecture(rawlecture.LectureId, subjectName, teacherName, rawlecture.DateHour, rawlecture.Modality, rawlecture.Class, rawlecture.Capacity, rawlecture.bookedPeople);

      lectures.push(lecture);
    });

    console.log(lectures);
    resolve(lectures);
  } else {
    // There aren't lectures for this StudentId
    reject("There aren't lecture for this StudentId");
  }
});

exports.getNextLecturesByTeacherId = (id, todayDateHour) => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM Lectures WHERE TeacherId = ? and DateHour > DATETIME(?)';
  const stmt = db.prepare(sql);
  const rows = stmt.all(id, todayDateHour);
  const lectures = [];

  if (rows.length > 0) {
    rows.forEach((rawlecture) => {
      const subjectName = subjectDao.getSubjectName(rawlecture.SubjectId);
      const teacher = userDao.getUserById(rawlecture.TeacherId);
      const teacherName = string.concat(teacher.Name, teacher.Surname);
      const lecture = new Lecture(rawlecture.LectureId, subjectName, teacherName, rawlecture.DateHour, rawlecture.Modality, rawlecture.Class, rawlecture.Capacity, rawlecture.bookedPeople);

      lectures.push(lecture);
    });

    console.log(lectures);
    resolve(lectures);
  } else {
    // There aren't lectures for this StudentId
    reject('No lectures scheduled for this TeacherId');
  }
});

const getLectureTimeConstraint = (lectureId) => new Promise((resolve, reject) => {
  const sql = 'SELECT DateHour FROM Lectures WHERE LectureId=?';
  const stmt = db.prepare(sql);
  const row = stmt.get(lectureId);
  if (row !== undefined) {
    const lectureTimeConstraint = new Date(row.dateHour);
    lectureTimeConstraint.setHours(0, 0, 0, 0);
    resolve(lectureTimeConstraint);
  } else reject('No Lecture for that LectureId');
});

exports.insertReservation = (lectureId, studentId, todayDateHour) => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM Bookings WHERE LectureId=? AND StudentId=?';
  const stmt = db.prepare(sql);
  const row = stmt.get(lectureId, studentId);
  if (todayDateHour < getLectureTimeConstraint(lectureId)) {
    if (row !== undefined) {
      reject('The Student has already booked a seat for that Lecture');
    } else {
      const sql1 = 'INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)';
      const stmt1 = db.prepare(sql1);
      const res = stmt1.run(lectureId, studentId);
      if (res.changes === 1) resolve({ result: res.changes });
      else reject('Error in inserting row');
    }
  } else reject('Booking is closed for that Lecture');
});
