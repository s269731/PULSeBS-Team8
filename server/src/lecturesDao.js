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
  if (row === undefined) return 2;
  if (row.Status === 0) return 0;
  if (row.Status === 1) return 1;
}

/* function getBookedPeople(lectureId) {
  const result = db.prepare('SELECT COUNT(*) as num from Bookings WHERE lectureId=?').get(lectureId);
  return result.num || 0;
} */

async function getLecturesByUserId(id) {
  const user = await userDao.getUserById(id);
  let sql = "SELECT * FROM Lectures WHERE DateHour > DATETIME('now') AND SubjectId IN (SELECT SubjectId FROM Enrollments WHERE StudentId=?)";
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
  const insertbookings = db.prepare('INSERT INTO Bookings(LectureId,StudentId) VALUES(?,?)');
  const updatelecture = db.prepare('UPDATE Lectures SET BookedPeople=BookedPeople+1 WHERE LectureId=? AND BookedPeople<Capacity');
  const modalitychecksql = db.prepare('SELECT Modality FROM Lectures WHERE LectureId=?');
  const checkclasspace = db.prepare('SELECT * FROM Lectures WHERE LectureId=? AND Capacity=BookedPeople');
  const fullclassroom = checkclasspace.get(lectureId);

  const stmt = db.prepare(sql);
  const row = stmt.get(lectureId, studentId);
  const todayDateHour = new Date();
  const timeconstraint = getLectureTimeConstraint(lectureId);
  const modalitycheck = modalitychecksql.get(lectureId);

  if (modalitycheck !== undefined && modalitycheck.Modality === 'Virtual') reject('a Virtual Lecture can\'t be booked');
  if (timeconstraint === undefined) reject('No lecture for the specified id');
  if (todayDateHour < timeconstraint) {
    if (row !== undefined) {
      // 2 cases:
      // a) the row picked has Status=0 and so it's a duplicate, a reject should be thrown
      // b) the row picked has Status=1 and so it should be update and become an effective Booking
      if (row.Status === 0) reject('The Student has already booked a seat for that Lecture');
      if (row.Status === 1) {
        const updatebooking = db.prepare('UPDATE Bookings SET Status=0 WHERE LectureId=? AND StudentId=?');
        const transaction = db.transaction(() => {
          if (fullclassroom === undefined) {
            const updatebookingres = updatebooking.run(lectureId, studentId);
            const updatelectureres = updatelecture.run(lectureId);
            return updatebookingres.changes === 1 && updatebookingres.changes === updatelectureres.changes;
          }
          return false;
        });

        const transactionresult = transaction();
        if (transactionresult === true) resolve({ movedfromwaiting: 1 });
        reject('The classroom is still full');
      }
    }

    if (fullclassroom === undefined) {
      const transaction = db.transaction(() => {
        const insertres = insertbookings.run(lectureId, studentId);
        const updateres = updatelecture.run(lectureId);
        return insertres.changes === 1 && updateres.changes === insertres.changes;
      });
      const transactionresult = transaction();

      if (transactionresult === true) resolve({ result: 1 });
      reject('There was an error while inserting the reservation');
    } else {
      const insertinwaitinglist = db.prepare('INSERT INTO Bookings(LectureId,StudentId,Status) VALUES(?,?,1)');
      const insertres = insertinwaitinglist.run(lectureId, studentId);
      if (insertres.changes === 1) resolve({ insertedinwaiting: 1 });
      else reject('There was an error inserting the student in the waiting List for that lecture');
    }
  }
  reject('Booking is closed for that Lecture'); // throw
});

async function getTeachersForEmail() {
  const d1 = new Date();
  d1.setDate(d1.getDate() + 1);
  d1.setHours(1, 0, 0, 0); // tomorrow at midnight
  const d2 = new Date();
  d2.setDate(d2.getDate() + 2);
  d2.setHours(1, 0, 0, 0); // day after tomorrow at midnight

  const sql = 'SELECT LectureId, TeacherId, SubjectId, BookedPeople FROM Lectures WHERE DateHour BETWEEN ? AND ? AND Modality=\'In person\'';
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
  const sql = 'SELECT StudentId FROM Bookings WHERE LectureId=? AND Status=0';
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

exports.deleteBookingStudent = (lectureId, studentId) => new Promise((resolve, reject) => {
  const sql1 = 'SELECT * FROM Bookings WHERE LectureId=? AND StudentId=?';
  const stmt1 = db.prepare(sql1);
  const row = stmt1.get(lectureId, studentId);
  const deletesql = db.prepare('DELETE FROM Bookings WHERE LectureId=? AND StudentId=?');
  const updatesql = db.prepare('UPDATE Lectures SET BookedPeople = BookedPeople - 1 WHERE LectureId=?');

  const todayDateHour = new Date();
  const timeconstraint = getLectureTimeConstraint(lectureId);

  if (timeconstraint === undefined) reject('No lecture found for the specified id');
  if (todayDateHour < timeconstraint) {
    if (row === undefined) {
      reject('Deletion fails: selected lecture not available among the bookings of the student');
    } else if (row.Status === 0) {
      const transaction = db.transaction(() => {
        const deleteres = deletesql.run(lectureId, studentId);
        const updateres = updatesql.run(lectureId);
        return deleteres.changes === 1 && updateres.changes === deleteres.changes;
      });
      const transactionresult = transaction();
      if (transactionresult === true) resolve({ result: '1 1' });
      reject('Error in deleting row or updating BookedPeople number');
    } else if (row.Status === 1) {
      const res = deletesql.run(lectureId, studentId);
      if (res.changes === 1) { resolve({ removeWait: res.changes }); } else { reject('Error in deleting row'); }
    }
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
    // d1.setHours(d1.getHours() + 1);
    if (d2.getTime() - d1.getTime() < 3.6e+6) { // milliseconds in 1 hour
      reject('Deletion fails: time constraint is not satisfied');
    } else {
      const sql2 = 'DELETE FROM Lectures WHERE LectureId=? AND TeacherId=?';
      const stmt2 = db.prepare(sql2);
      const res = stmt2.run(lectureId, teacherId);
      if (res.changes === 1) { resolve({ result: res.changes }); } else { reject('Error in deleting row'); }
    }
  }
});

async function getBookingsByUserId(studentId) {
  const sql = "SELECT * FROM Bookings B, Lectures L WHERE B.StudentId=? AND B.LectureId=L.LectureId AND DateHour > DateTime('now')";
  const stmt = db.prepare(sql);
  const rows = stmt.all(studentId);
  const lectures = [];

  if (rows.length > 0) {
    await Promise.all(rows.map(async (rawlecture) => {
      const subjectName = await subjectDao.getSubjectName(rawlecture.SubjectId);
      const teacher = await userDao.getUserById(rawlecture.TeacherId);
      const teacherName = `${teacher.name} ${teacher.surname}`;
      const reservation = getReservation(studentId, rawlecture.LectureId);
      // eslint-disable-next-line max-len
      const lecture = new Lecture(rawlecture.LectureId, subjectName.SubjectName, teacherName, rawlecture.DateHour, rawlecture.Modality, rawlecture.Class, rawlecture.Capacity, rawlecture.BookedPeople, reservation);

      lectures.push(lecture);
    }));

    // console.log(lectures);
  }
  return lectures;
}

async function getStudentsCancelledLecture(lectureId, teacherId) {
  const sql = 'SELECT Email FROM Users WHERE id IN (SELECT StudentId FROM Bookings WHERE LectureId=?)';
  const stmt = db.prepare(sql);
  const rows = stmt.all(lectureId);
  const stud_emails = [];
  let info = {};
  let obj = {};

  const sql2 = 'SELECT SubjectId, DateHour FROM Lectures WHERE LectureId=? AND TeacherId=?';
  const stmt2 = db.prepare(sql2);
  const row = stmt2.get(lectureId, teacherId);

  if (row !== undefined) {
    const subjectName = await subjectDao.getSubjectName(row.SubjectId);
    const teacher = await userDao.getUserById(teacherId);
    const teacherName = `${teacher.name} ${teacher.surname}`;
    const date_hour = row.DateHour;

    info = {
      subject: subjectName.SubjectName,
      teacher: teacherName,
      date_hour,
    };
    stud_emails.push(info);

    if (rows.length > 0) {
      await Promise.all(rows.map(async (rawlecture) => {
        obj = {
          email_addr: rawlecture.Email,
        };

        stud_emails.push(obj);
      }));
    }
  }
  return stud_emails;
}

exports.changeLectureModality = (lectureId) => new Promise((resolve, reject) => {
  const sql = db.prepare('SELECT Modality,DateHour FROM Lectures WHERE LectureId=?');
  const sqlupdate = db.prepare('UPDATE Lectures SET Modality=? WHERE LectureId=?');
  const sqldelete = db.prepare('DELETE FROM Bookings WHERE LectureId=?');
  const virtual = 'Virtual';
  const result = sql.get(lectureId);
  if (result === undefined) reject('Error in retrieving lecture by his lectureId');
  else {
    const now = new Date();
    // now.setHours(now.getHours() + 1);
    console.log(`data: ${now}`);
    const lecturetime = new Date(result.DateHour);
    if (lecturetime.getTime() - now.getTime() > 1.8e+6) {
      if (result.Modality === 'In person') {
        const transaction = db.transaction(() => {
          const updateres = sqlupdate.run(virtual, lectureId);
          sqldelete.run(lectureId);
          return updateres.changes === 1;
        });
        const transactionresult = transaction();
        if (transactionresult === true) resolve({ result: 'Virtual' });
        else reject('Error in updating the Lecture Modality');
      } else reject('You can\'t convert a Virtual Lecture into a in presence one');
    }
    reject('Lecture Modality can\'t be changed within 30 minutes before its start');
  }
});

exports.getLecturesBySubjectId = (subjectId) => new Promise((resolve, reject) => {
  const sql = db.prepare("SELECT LectureId,DateHour,Capacity,BookedPeople FROM Lectures WHERE SubjectId=? AND DateHour < DateTime('now') ORDER BY DateHour");
  const rows = sql.all(subjectId);
  if (rows.length >= 0) resolve(rows);
  else reject('There aren\'t lectures for this subjectId');
});

async function checkWaitingList(lectureId) {
  const sql = 'SELECT StudentId FROM Bookings WHERE LectureId=? AND Status=1 ORDER BY ROWID ASC LIMIT 1';
  const stmt = db.prepare(sql);
  const row = stmt.get(lectureId);
  // console.log(row);
  let studentId;

  if (row !== undefined) {
    studentId = row.StudentId;
    try {
      await this.insertReservation(lectureId, studentId);
    } catch (err) {
      console.log('There was an error in updating row');
    }
  }
  return studentId;
}

exports.getLecturesForStudentContactTracing = (studentId) => new Promise((resolve, reject) => {
  const sql = db.prepare('SELECT LectureId FROM Bookings WHERE StudentId=? AND Status=0');
  const bookings = sql.all(studentId);
  const sql1 = db.prepare('SELECT LectureId,TeacherId,DateHour,SubjectId FROM Lectures WHERE LectureId=?');
  const lectures = [];
  const now = new Date();
  const oneweekago = moment(now).subtract('7', 'days');

  if (bookings.length > 0) {
    bookings.forEach((row) => {
      const lecture = sql1.get(row.LectureId);
      if (lecture !== undefined) {
        const lecturedate = new Date(lecture.DateHour);
        if (lecturedate > oneweekago && lecturedate < now) {
          lectures.push(lecture);
        }
      }
    });
    // console.log(`lectures for contact tracing:${lectures}`);
    resolve(lectures);
  }
  resolve(undefined);
});

async function getTeacherByLectureId(lectureId) {
  const sql = db.prepare('SELECT TeacherId FROM Lectures WHERE LectureId=?');
  const teacherId = sql.get(lectureId);
  let teacher;
  if (teacherId !== undefined) {
    teacher = await userDao.getUserById(teacherId.TeacherId);
  }
  return teacher;
}

async function getModalityBySubjectId(subjectId) {
  const sql = 'SELECT Modality FROM Lectures WHERE SubjectId = ? LIMIT 1'
  const stmt = db.prepare(sql);
  const res = stmt.get(subjectId);

  return res;
}

exports.getTeacherByLectureId = getTeacherByLectureId;
// exports.getLecturesForStudentContactTracing = getLecturesForStudentContactTracing;
exports.getLecturesByUserId = getLecturesByUserId;
exports.getTeachersForEmail = getTeachersForEmail;
exports.getInfoBookingConfirmation = getInfoBookingConfirmation;
exports.getStudentsListByLectureId = getStudentsListByLectureId;
exports.getBookingsByUserId = getBookingsByUserId;
exports.getStudentsCancelledLecture = getStudentsCancelledLecture;
exports.checkWaitingList = checkWaitingList;
exports.getModalityBySubjectId = getModalityBySubjectId;
