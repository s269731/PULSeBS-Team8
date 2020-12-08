const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db');
const subjectDao = require('../subjectsDao');

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

async function populateLectures() {
  const sql = 'SELECT * FROM Lectures';
  const stmt = db.prepare(sql);
  const lectures = stmt.all();

  if (lectures.length === 0) { // If Lectures is empty, we need to populate it with the Schedule of the current Semester
    const sql1 = 'SELECT * FROM Schedule';
    const stmt1 = db.prepare(sql1);
    const rows = stmt1.all();

    if (rows.length > 0) {
      const current = new Date(); // get current date
      const weekStart = current.getDate() - current.getDay() + 1;
      const day_week = new Date(current.setDate(weekStart)); // get Monday of the current week
      const endSemester = new Date(); // Suppose the first semester ends on 15th Jan
      endSemester.setDate(16);
      endSemester.setMonth(0);
      endSemester.setYear(2021);
      let dates = [];
      let d = {};

      // iterate for each day of the week, from Mon to Fri
      days.forEach((day) => {
        let lect_dayOfWeek = rows.filter((r) => r.Day === day); // Array of all the lectures held in a specific day of the week
        if (lect_dayOfWeek.length > 0) {
          d = new Date(day_week);
          while (d < endSemester) { // iterate until we don't overcome the semester limit
            dates.push(new Date(d));
            d.setDate(d.getDate() + 7);
          }
          lect_dayOfWeek.forEach(async (lect) => {
            const startHour = lect.Hour.split('-')[0];
            const hour = startHour.split(':'); // hour[0] = hour, hour[1] = minutes

            await Promise.all(dates.map(async (dt) => {
              const date_hour = new Date(dt.setHours(hour[0], hour[1], 0, 0));
              const teacherId = await subjectDao.getTeacherIdBySubjectId(lect.SubjectId);
              const sql2 = 'INSERT INTO Lectures(TeacherId, SubjectId, DateHour, Class, Capacity) VALUES (?,?,?,?,?)';
              const stmt2 = db.prepare(sql2);
              const res = stmt2.run(teacherId.TeacherId, lect.SubjectId, date_hour.toISOString(), lect.Class, lect.Capacity);
            }));
          });
        }
        day_week.setDate(day_week.getDate() + 1);
        dates = [];
        lect_dayOfWeek = [];
      });
    }
  }
}

async function importFile(file, table) {
  let sql = '';
  let lectures = 0;

  switch (table) {
    case 'students':
      sql = 'INSERT OR IGNORE INTO Users(Id,Role,Name,Surname,City,Email,Birthday,SSN) VALUES(?, \'S\', ?, ?, ?, ?, ?, ?)';
      break;
    case 'teachers':
      sql = 'INSERT OR IGNORE INTO Users(Id,Role,Name,Surname,Email,SSN) VALUES(?, \'D\', ?, ?, ?, ?)';
      break;
    case 'courses':
      sql = 'INSERT OR IGNORE INTO Subjects(SubjectId,Year,Semester,SubjName,TeacherId) VALUES(?, ?, ?, ?, ?)';
      break;
    case 'enrollments':
      sql = 'INSERT OR IGNORE INTO Enrollments(SubjectId, StudentId) VALUES(?, ?)';
      break;
    case 'schedules':
      sql = 'INSERT OR IGNORE INTO Schedule(SubjectId,Class,Day,Capacity,Hour) VALUES(?, ?, ?, ?, ?)';
      lectures = 1;
      break;
    default:
      throw new Error('Invalid url');
  }

  const stmt = db.prepare(sql);

  fs.createReadStream(file.tempFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const values = Object.values(data);
      try {
        stmt.run(values);
      } catch (err) {
        console.log(err);
      }
    })
    .on('end', () => {
      if (lectures === 1) { populateLectures(); }
      lectures = 0;
    });
  return true;
}

exports.importFile = importFile;
