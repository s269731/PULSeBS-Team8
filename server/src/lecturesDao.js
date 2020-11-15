const moment = require('moment');
const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');

class Lecture {
  constructor(lectureId, subjectName, teacherName, dateHour, modality, className, capacity, bookedPeople, booked) {
    this.lectureId = lectureId;
    this.subjectName = subjectName;
    this.teacherName = teacherName;
    this.dateHour = dateHour;
    this.modality = modality;
    this.className = className;
    this.capacity = capacity;
    this.bookedPeople = bookedPeople;
    this.booked = booked;
  }
}

function getReservation(studentId, lectureId) {
  const sql = 'SELECT * FROM Bookings WHERE StudentId=? AND LectureId=?';
  const stmt = db.prepare(sql);
  const row = stmt.get(studentId, lectureId);
  if (row === undefined) return false;
  return true;
}

async function getLecturesByUserId(id) {
  const user = await userDao.getUserById(id);
  let sql = 'SELECT * FROM Lectures WHERE SubjectId IN (SELECT SubjectId FROM Enrollments WHERE StudentId=?)';
  if (user.role === 'D') sql = "SELECT * FROM Lectures WHERE TeacherId = ? and DateHour > DATETIME('now')";

  const stmt = db.prepare(sql);
  const rows = stmt.all(id);
  const lectures = [];

  if (rows.length > 0) {
    await Promise.all(rows.map(async (rawlecture) => {
      const subjectName = await subjectDao.getSubjectName(rawlecture.SubjectId);
      const teacher = await userDao.getUserById(rawlecture.TeacherId);
      const teacherName = `${teacher.name} ${teacher.surname}`;
      const reservation = getReservation(id, rawlecture.LectureId);
      const lecture = new Lecture(rawlecture.LectureId, subjectName.SubjectName, teacherName, rawlecture.DateHour, rawlecture.Modality, rawlecture.Class, rawlecture.Capacity, rawlecture.BookedPeople, reservation);

      lectures.push(lecture);
    }));

    // console.log(lectures);
  }
  return lectures;
}

const getLectureTimeConstraint = (lectureId) => {
  const sql = 'SELECT DateHour FROM Lectures WHERE LectureId=?';
  const stmt = db.prepare(sql);
  const row = stmt.get(lectureId);
  // console.log(row)
  if (row !== undefined) {
    const lectureTimeConstraint = new Date(row.DateHour);
    lectureTimeConstraint.setHours(0, 0, 0, 0);
    return lectureTimeConstraint;
  }
  return row;
};

exports.insertReservation = (lectureId, studentId) => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM Bookings WHERE LectureId=? AND StudentId=?';
  const stmt = db.prepare(sql);
  const row = stmt.get(lectureId, studentId);
  const todayDateHour = new Date();
  const timeconstraint = getLectureTimeConstraint(lectureId);
  if (timeconstraint === undefined) reject('No lecture for the specified id');
  if (todayDateHour < timeconstraint) {
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

async function getTeachersForEmail() {
  const d1 = new Date();
  d1.setHours(23, 59, 59, 999); // last minute of today
  const d2 = new Date(d1);
  d2.setDate(d2.getDate() + 2);
  d2.setHours(1, 0, 0, 0); // day after the lecture (=day after tomorrow)

  const sql = 'SELECT TeacherId, BookedPeople, SubjectId FROM Lectures WHERE DateHour BETWEEN DATETIME(?) AND DATETIME(?)';
  const stmt = db.prepare(sql);
  const rows = stmt.all(d1.toISOString(), d2.toISOString());
  const email_bp = [];
  let obj = {};

  if (rows.length > 0) {
    await Promise.all(rows.map(async (rawlecture) => {
      const teacher = await userDao.getUserById(rawlecture.TeacherId);
      const { email } = teacher;
      const subjectName = await subjectDao.getSubjectName(rawlecture.SubjectId);
      const bp = rawlecture.BookedPeople;

      obj = {
        email_addr: email,
        subject: subjectName.SubjectName,
        booked_people: bp,
      };
      email_bp.push(obj);
    }));
  }
  return email_bp;
}

async function getInfoBookingConfirmation(lectureId, studentId) {
  const sql = 'SELECT DateHour, SubjectId, Class FROM Lectures WHERE LectureId=?';
  const stmt = db.prepare(sql);
  const row = stmt.get(lectureId);
  let info = {};

  if (row !== undefined) {
    const student = await userDao.getUserById(studentId);
    const subjectName = await subjectDao.getSubjectName(row.SubjectId);

    info = {
      email: student.email,
      subject: subjectName.SubjectName,
      date_hour: row.DateHour,
      class: row.Class,
    };
  }
  return info;
}

async function getStudentsListByLectureId(lectureId) {
  const sql = 'SELECT StudentId FROM Bookings WHERE LectureId=?';
  const stmt = db.prepare(sql);
  const rows = stmt.all(lectureId);
  const studentlist = [];
  // console.log(`number of rows:${rows}`);
  if (rows.length > 0) {
    rows.forEach(async (row) => {
      const student = await userDao.getUserById(row.StudentId);
      studentlist.push(student);
    });
    // console.log(studentlist);
    return studentlist;
  }
}

exports.deleteBookingStudent = (lectureId, studentId) => new Promise((resolve, reject) =>  {
  const sql1 = 'SELECT * FROM Bookings WHERE LectureId=? AND StudentId=?';
  const stmt1 = db.prepare(sql1);
  const row = stmt1.get(lectureId, studentId);

  if (row === undefined) {
    reject('Deletion fails: selected lecture not available among the bookings of the student');
  } else {
    const sql2 = 'DELETE FROM Bookings WHERE LectureId=? AND StudentId=?';
    const stmt2 = db.prepare(sql2);
    const res = stmt2.run(lectureId, studentId);

    if (res.changes === 1)
      resolve({ result: res.changes });
    else
      reject('Error in deleting row');
  }
});

exports.deleteLectureTeacher = (lectureId, teacherId) => new Promise((resolve, reject) => {
  const sql1 = 'SELECT DateHour FROM Lectures WHERE LectureId=? AND TeacherId=?';
  const stmt1 = db.prepare(sql1);
  const row = stmt1.get(lectureId, teacherId);
  if (row === undefined) {
    reject('Deletion fails: selected lecture was not found');
  } else {
    const d1 = new Date();
    const d2 = new Date(row.DateHour);
    if (d2.getTime() - d1.getTime() < 3.6e+6) { // milliseconds in 1 hour
      reject('Deletion fails: time constaint is not satisfied')
    } else {
      const sql2 = 'DELETE FROM Lectures WHERE LectureId=? AND TeacherId=?';
      const stmt2 = db.prepare(sql2);
      const res = stmt2.run(lectureId, teacherId);

      if (res.changes === 1)
        resolve({ result: res.changes });
      else
        reject('Error in deleting row');
    }
  }
});

exports.getLecturesByUserId = getLecturesByUserId;
exports.getTeachersForEmail = getTeachersForEmail;
exports.getInfoBookingConfirmation = getInfoBookingConfirmation;
exports.getStudentsListByLectureId = getStudentsListByLectureId;
