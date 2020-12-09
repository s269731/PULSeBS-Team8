const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');
const lecturesDao = require('./lecturesDao');

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

async function populateLectures() {
  const sql = 'SELECT * FROM Lectures';
  const stmt = db.prepare(sql);
  const lectures = stmt.all();

  if (lectures.length !== 0) { // If Lectures is not empty, we need to empty it
    db.prepare('DELETE from Lectures').run();
  }
  // populate Lectures with the Schedule of the current Semester
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
            const sql2 = 'INSERT INTO Lectures(TeacherId, SubjectId, ScheduleId, DateHour, Class, Capacity) VALUES (?,?,?,?,?,?)';
            const stmt2 = db.prepare(sql2);
            const res = stmt2.run(teacherId.TeacherId, lect.SubjectId, lect.ScheduleId, date_hour.toISOString(), lect.Class, lect.Capacity);
          }));
        });
      }
      day_week.setDate(day_week.getDate() + 1);
      dates = [];
      lect_dayOfWeek = [];
    });
  }
  return 0;
}

async function getSchedule() {
    const sql = 'SELECT SubjectId, SubjName, Year, Semester, u.Name as Tname, u.Surname as Tsurname FROM Subjects su, Users u WHERE su.TeacherId = u.Id ORDER BY Year';
    const stmt = db.prepare(sql);
    const rows = stmt.all();
    let schedules = [];

    if (rows.length > 0) {
        await Promise.all(rows.map(async (row) => {
            let res = await lecturesDao.getModalityBySubjectId(row.SubjectId);
            row['Modality'] = res.Modality;
            const sql2 = 'SELECT ScheduleId, Class, Day, Capacity, Hour FROM Schedule WHERE SubjectId=?';
            const stmt2 = db.prepare(sql2);
            const results = stmt2.all(row.SubjectId);

            if (results.length > 0) {
                results.forEach(async (res) => {
                    schedules.push(res);
                });
                row['schedules'] = schedules;
            }
            schedules = [];
        }));
        return rows;
    } else {
        rows = [];
    }
    return rows;
}

exports.changeModalitySchedule = (array) => new Promise((resolve, reject) => {
    if (array.length > 0) {
        array.forEach(async (a) => {
            if (a.Modality === 'Virtual') {
                const sql3 = "SELECT LectureId FROM Lectures WHERE SubjectId=? AND DateHour > DATETIME('now')";
                const stmt3 = db.prepare(sql3);
                let ids = stmt3.all(a.SubjectId);
                if (ids.length === 0) reject('No results for that SubjectId');
                else {
                  const sql = "UPDATE Lectures SET Modality='In person' WHERE SubjectId=? AND DateHour > DATETIME('now')"
                  const stmt = db.prepare(sql);
                  let res = stmt.run(a.SubjectId);
                  if (res.changes) { resolve({ result: 'In person' }); } else { reject('Error in updating row'); }
                }
            } else {
                const sql2 = "SELECT LectureId FROM Lectures WHERE SubjectId=? AND DateHour > DATETIME('now')";
                const stmt2 = db.prepare(sql2);
                let rows = stmt2.all(a.SubjectId);
                if (rows.length > 0) {
                    let lectIds = rows.map(({ LectureId }) => LectureId);   // array of lectureIds related to that SubjectId
                    lectIds.forEach(async (lect) => {
                    let res = await lecturesDao.changeLectureModality(lect);  
                    if (res.result === 'Virtual') { resolve({ result: 'Virtual' }); } else { reject('Error in changing the modality to Virtual'); }                      
                    });
                    lectIds = [];
                } else reject('No results for that SubjectId');
            }
        });
    }
});

exports.populateLectures = populateLectures;
exports.getSchedule = getSchedule;
