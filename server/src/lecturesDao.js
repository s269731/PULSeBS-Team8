const moment = require('moment');
const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');
const emailService = require('./services/email');

class Lecture {
  constructor(lectureId, subjectName, teacherName, dateHour, modality, className, capacity, bookedPeople, booked, presentPeople) {
    this.lectureId = lectureId;
    this.subjectName = subjectName;
    this.teacherName = teacherName;
    this.dateHour = dateHour;
    this.modality = modality;
    this.className = className;
    this.capacity = capacity;
    this.bookedPeople = bookedPeople;
    this.booked = booked;
    this.presentPeople = presentPeople;
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
      const lecture = new Lecture(rawlecture.LectureId, subjectName.SubjectName, teacherName, rawlecture.DateHour, rawlecture.Modality, rawlecture.Class, rawlecture.Capacity, rawlecture.BookedPeople, reservation, rawlecture.PresentPeople);

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

/*    Bookings STATUS map:
      Status = 0 -> Student booked
      Status = 1 -> Student in Waiting List
      Status = 3 -> Student present at Lecture

 */
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

async function getStudentsListByLectureId(lectureId, contactTracing) {
  let sql;
  if (contactTracing === true) sql = 'SELECT StudentId,Status FROM Bookings WHERE LectureId=? AND Status=3';
  else sql = 'SELECT StudentId,Status FROM Bookings WHERE LectureId=? AND (Status=0 OR Status=3)';
  const stmt = db.prepare(sql);
  const rows = stmt.all(lectureId);
  const studentlist = [];
  // console.log(`number of rows:${rows}`);
  if (rows.length > 0) {
    rows.forEach(async (row) => {
      const student = await userDao.getUserById(row.StudentId);
      studentlist.push({
        // eslint-disable-next-line max-len
        id: student.id, role: student.role, name: student.name, surname: student.surname, city: student.city, email: student.email, birthday: student.birthday, ssn: student.ssn, status: row.Status,
      });
    });
    // console.log(studentlist);
    return studentlist;
  }
  // return studentlist;
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
  const sql = db.prepare('SELECT Modality, DateHour, BookedPeople, SubjectId FROM Lectures WHERE LectureId=?');
  const result = sql.get(lectureId);
  const virtual = 'Virtual';
  let emails = {};
  const info = {};
  if (result === undefined) reject('Error in retrieving lecture by his lectureId');
  else {
    const now = new Date();
    // console.log(`data: ${now}`);
    const lecturetime = new Date(result.DateHour);
    if (lecturetime.getTime() - now.getTime() > 1.8e+6) {
      if (result.Modality === 'In person') {
        if (result.BookedPeople > 0) {
          const sql2 = db.prepare('SELECT Email FROM Users WHERE Id IN (SELECT StudentId FROM Bookings WHERE LectureId=?)');
          const results = sql2.all(lectureId);
          emails = results.map(({ Email }) => Email);
          obj = { SubjectId: result.SubjectId, date_hour: result.DateHour };
          // emailService.sendChangeModalityVirtual(obj, emails);
        }
        const sqlupdate = db.prepare('UPDATE Lectures SET Modality=?, BookedPeople=0 WHERE LectureId=?');
        const sqldelete = db.prepare('DELETE FROM Bookings WHERE LectureId=?');
        const transaction = db.transaction(() => {
          const updateres = sqlupdate.run(virtual, lectureId);
          sqldelete.run(lectureId);
          return updateres.changes === 1;
        });
        const transactionresult = transaction();
        if (transactionresult === true) {
          if (result.BookedPeople > 0) {
            emailService.sendChangeModalityVirtual(obj, emails);
          }
          resolve({ result: 'Virtual' });
        } else reject('Error in updating the Lecture Modality');
      }
      resolve({ result: 'Virtual' });
    } else reject('Lecture Modality can\'t be changed within 30 minutes before its start');
  }
});

exports.getLecturesBySubjectId = (subjectId) => new Promise((resolve, reject) => {
  const sql = db.prepare("SELECT LectureId,DateHour,Capacity,BookedPeople FROM Lectures WHERE SubjectId=? AND DateHour < DateTime('now') ORDER BY DateHour");
  const rows = sql.all(subjectId);
  if (rows.length >= 0) resolve(rows);
  else reject('There aren\'t lectures for this subjectId');
});

exports.getLecturesForPresenceStatisticsBySubjectId = (subjectId) => new Promise((resolve, reject) => {
  const sql = db.prepare("SELECT LectureId,DateHour,Capacity,BookedPeople,PresentPeople FROM Lectures WHERE SubjectId=? AND ReportPresence=1 AND DateHour < DateTime('now') ORDER BY DateHour");
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
  const sql = db.prepare('SELECT LectureId FROM Bookings WHERE StudentId=? AND Status=3');
  const bookings = sql.all(studentId);
  const sql1 = db.prepare('SELECT LectureId,TeacherId,DateHour,SubjectId FROM Lectures WHERE LectureId=?');
  const lectures = [];
  const now = new Date();
  const oneweekago = moment(now).subtract('7', 'days');

  if (bookings.length > 0) {
    bookings.forEach(async (row) => {
      const lecture = sql1.get(row.LectureId);
      if (lecture !== undefined) {
        const lecturedate = new Date(lecture.DateHour);
        if (lecturedate > oneweekago && lecturedate < now) {
          const subjName = await subjectDao.getSubjectName(lecture.SubjectId);
          lectures.push({
            // eslint-disable-next-line max-len
            LectureId: lecture.LectureId, TeacherId: lecture.TeacherId, DateHour: lecture.DateHour, SubjectName: subjName.SubjectName,
          });
        }
      }
    });
    // console.log(`lectures for contact tracing:${lectures}`);
    resolve(lectures);
  }
  resolve(undefined);
});

exports.getLecturesForTeacherContactTracing = (teacherId) => new Promise((resolve, reject) => {
  const sql = db.prepare('SELECT LectureId,TeacherId,DateHour,SubjectId FROM Lectures WHERE TeacherId=?');
  const result = sql.all(teacherId);
  const lectures = [];
  const now = new Date();
  const oneweekago = moment(now).subtract('7', 'days');
  if (result.length > 0) {
    result.forEach(async (row) => {
      const lecturedate = new Date(row.DateHour);
      if (lecturedate > oneweekago && lecturedate < now) {
        const subjName = await subjectDao.getSubjectName(row.SubjectId);
        lectures.push({
          // eslint-disable-next-line max-len
          LectureId: row.LectureId, TeacherId: row.TeacherId, DateHour: row.DateHour, SubjectName: subjName.SubjectName,
        });
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

exports.updatePresentPeople = (lectureId, presentPeople) => new Promise((resolve, reject) => {
  const now = new Date();
  const sql1 = db.prepare('SELECT DateHour FROM Lectures WHERE LectureId=?');
  const res1 = sql1.get(lectureId);
  const lectureTime = new Date(res1.DateHour);
  let i = 0;
  const sqlupdate = db.prepare('UPDATE Bookings SET Status=3 WHERE LectureId=? AND StudentId=?');
  if (Array.isArray(presentPeople) === false) reject('The value inserted is not correct, please insert an Array of StudentId');

  const transaction = db.transaction(() => {
    if (lectureTime < now) {
      presentPeople.forEach((studentId) => {
        const updateres = sqlupdate.run(lectureId, studentId);
        if (updateres.changes === 1) i += 1;
        else reject('Error while marking students as present');
      });

      if (i === presentPeople.length) {
        const sql = db.prepare('UPDATE Lectures SET PresentPeople=?, ReportPresence=1 WHERE LectureId=? AND Capacity>=PresentPeople AND BookedPeople>=?');
        const res = sql.run(presentPeople.length, lectureId, presentPeople.length);
        if (res.changes === 1) return 0;
        reject('Error while marking students as present');
      } reject('Error while marking students as present');
    } return 1;
  });

  const transactionresult = transaction();
  if (transactionresult === 0) resolve({ result: 1 });
  else if (transactionresult === 1) reject('Lecture is still in program');
});

async function getTeacherPastLectures(teacherId) { //= > new Promise((resolve, reject) => {
  const sql = db.prepare('SELECT * FROM Lectures WHERE TeacherId = ?');
  const lectures = [];
  const now = new Date();
  const oneweekago = moment(now).subtract('7', 'days');
  const rows = sql.all(teacherId);

  if (rows.length > 0) {
    await Promise.all(rows.map(async (rawlecture) => {
      const lecturedate = new Date(rawlecture.DateHour);
      if (lecturedate > oneweekago && lecturedate < now) {
        const subjectName = await subjectDao.getSubjectName(rawlecture.SubjectId);
        const teacher = await userDao.getUserById(rawlecture.TeacherId);
        const teacherName = `${teacher.name} ${teacher.surname}`;
        // const reservation = getReservation(id, rawlecture.LectureId);
        const lecture = new Lecture(rawlecture.LectureId, subjectName.SubjectName, teacherName, rawlecture.DateHour, rawlecture.Modality, rawlecture.Class, rawlecture.Capacity, rawlecture.BookedPeople, undefined, rawlecture.PresentPeople);

        lectures.push(lecture);
      }
    }));
  }
  return lectures;
} // ));

exports.excludeHolidays = (date_array) => new Promise((resolve, reject) => {
  if (date_array.length > 0) {
    const today = new Date();
    let correct = [];
    let already_held = [];
    let not_found = [];
    date_array.forEach(async (d) => {
      const year = d.year;
      const month = d.month.index;
      const day = d.day;
      const dt = new Date();
      dt.setDate(day);
      dt.setMonth(month);
      dt.setYear(year);

      if (dt > today) {
        const sql1 = db.prepare('SELECT COUNT(*) as count FROM Lectures WHERE DATE(DateHour) = DATE(?)');
        const obj = sql1.get(dt.toISOString());
        if (obj.count > 0) {
          const sql2 = db.prepare('DELETE FROM Lectures WHERE DATE(DateHour) = DATE(?)');
          const res = sql2.run(dt.toISOString());
          console.log(res);
          if (res.changes > 0) { correct.push(dt.toISOString()); } else { reject('Error in deleting row'); }
        } else {
          not_found.push(dt.toISOString());
          //reject('No lectures scheduled for that date');
        }
      } else {
        already_held.push(dt.toISOString());
        //reject('Cannot delete lectures already held');
      }
    });
    let result = {};
    result.correct = correct;
    result.already_held = already_held;
    result.not_found = not_found;
    resolve(result);
  } else reject('Array of dates is empty');
});

exports.getTeacherByLectureId = getTeacherByLectureId;
exports.getTeacherPastLectures = getTeacherPastLectures;
exports.getLecturesByUserId = getLecturesByUserId;
exports.getTeachersForEmail = getTeachersForEmail;
exports.getInfoBookingConfirmation = getInfoBookingConfirmation;
exports.getStudentsListByLectureId = getStudentsListByLectureId;
exports.getBookingsByUserId = getBookingsByUserId;
exports.getStudentsCancelledLecture = getStudentsCancelledLecture;
exports.checkWaitingList = checkWaitingList;
