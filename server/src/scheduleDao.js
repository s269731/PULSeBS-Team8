const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');
const lecturesDao = require('./lecturesDao');

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const endSemester = new Date(); // Suppose the first semester ends on 15th Jan
endSemester.setDate(20);
endSemester.setMonth(1);
endSemester.setYear(2021);

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
    let dates = [];
    //let d = {};

    // iterate for each day of the week, from Mon to Fri
    days.forEach((day) => {
      let lect_dayOfWeek = rows.filter((r) => r.Day === day); // Array of all the lectures held in a specific day of the week
      if (lect_dayOfWeek.length > 0) {
        let d = new Date(day_week);
        let cond = d < endSemester;
        while (cond) { // iterate until we don't overcome the semester limit
          dates.push(new Date(d));
          d.setDate(d.getDate() + 7);
          cond = d < endSemester;
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
  const sql = 'SELECT SubjectId, SubjName, Year, Semester, u.Name as Tname, u.Surname as Tsurname, Modality FROM Subjects su, Users u WHERE su.TeacherId = u.Id ORDER BY Year';
  const stmt = db.prepare(sql);
  const rows = stmt.all();
  let schedules = [];
  const list = [];

  if (rows.length > 0) {
    await Promise.all(rows.map(async (row) => {
      /*const res = await lecturesDao.getModalityBySubjectId(row.SubjectId);
      if (res !== undefined) {
        row.Modality = res.Modality;
      }*/
      const sql2 = 'SELECT ScheduleId, Class, Day, Capacity, Hour FROM Schedule WHERE SubjectId=?';
      const stmt2 = db.prepare(sql2);
      const results = stmt2.all(row.SubjectId);

      if (results.length > 0) {
        results.forEach(async (res) => {
          schedules.push(res);
        });
        row.schedules = schedules;
        list.push(row);
      }
      schedules = [];
    }));
    return list;
  }
  return list;
}

exports.changeModalitySchedule = (array) => new Promise((resolve, reject) => {
  if (array.length > 0) {
    array.forEach(async (a) => {
      const sql2 = "SELECT LectureId FROM Lectures WHERE SubjectId=? AND DateHour > DATETIME('now')";
      const stmt2 = db.prepare(sql2);
      const sql3 = "UPDATE Subjects SET Modality=? WHERE SubjectId=?";
      const stmt3 = db.prepare(sql3);
      if (a.Modality === 'Virtual') {
        const ids = stmt2.all(a.SubjectId);
        if (ids.length === 0) reject('No results for that SubjectId');
        else {
          const sql = "UPDATE Lectures SET Modality='In person' WHERE SubjectId=? AND DateHour > DATETIME('now')";
          const stmt = db.prepare(sql);
          transaction = db.transaction(() => {
            const res1 = stmt3.run('In person', a.SubjectId);
            const res2 = stmt.run(a.SubjectId);
            return res1.changes > 0 && res2.changes > 0;
          });
          const transactionresult = transaction();
          if (transactionresult === true) resolve({ result: 'In person' });
          else reject('Error in updating rows');
        }
      } else {        
        const rows = stmt2.all(a.SubjectId);
        if (rows.length > 0) {
          let lectIds = rows.map(({ LectureId }) => LectureId); // array of lectureIds related to that SubjectId
          transaction = db.transaction(() => {
            const res1 = stmt3.run('Virtual', a.SubjectId);
            let res2;
            lectIds.forEach(async (lect) => {
              res2 = await lecturesDao.changeLectureModality(lect);
            });
            return res1.changes > 0;
          });
          const transactionresult = transaction();
          if (transactionresult === true) resolve({ result: 'Virtual' });
          else reject('Error in updating rows');
        } else reject('No results for that SubjectId');
      }
    });
  }
  else reject('Cannot convert empty array');
});

// info_schedule is an object with ScheduleId, SubjectId, Class, Day, Capacity and Hour
exports.modifySchedule = (info_schedule) => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM Schedule WHERE ScheduleId=?';
  const stmt = db.prepare(sql);
  const found_schedule = stmt.get(info_schedule.ScheduleId);
  let rows = [];
  let transaction;

  if (JSON.stringify(info_schedule) !== JSON.stringify(found_schedule)) {
    const today = new Date();
    const sql1 = 'SELECT LectureId, DateHour FROM Lectures WHERE ScheduleId=? AND DateHour>?';
    const stmt1 = db.prepare(sql1);
    rows = stmt1.all(info_schedule.ScheduleId, today.toISOString());
    if (rows.length > 0) {
      const sql3 = 'UPDATE Schedule SET Class=?, Day=?, Capacity=?, Hour=? WHERE ScheduleId=?';
      const stmt3 = db.prepare(sql3);
      // const res = stmt3.run(info_schedule.Class, info_schedule.Day, info_schedule.Capacity, info_schedule.Hour, info_schedule.ScheduleId);
      if (info_schedule.Day === found_schedule.Day && info_schedule.Hour === found_schedule.Hour) {
        // If Day and Hour were not modified, we can update directly only Class and Capacity
        const sql2 = 'UPDATE Lectures SET Class=?, Capacity=? WHERE ScheduleId=? AND DateHour>?';
        const stmt2 = db.prepare(sql2);
        transaction = db.transaction(() => {
          const res1 = stmt2.run(info_schedule.Class, info_schedule.Capacity, info_schedule.ScheduleId, today.toISOString());
          const res2 = stmt3.run(info_schedule.Class, info_schedule.Day, info_schedule.Capacity, info_schedule.Hour, info_schedule.ScheduleId);
          return res1.changes > 0 && res2.changes > 0;
        });
      } else { // We need to update also Day and/or Hour
        const current = new Date(rows[0].DateHour);
        const weekStart = current.getDate() - current.getDay() + 1;
        const day_week = new Date(current.setDate(weekStart)); // get Monday of the week of the first scheduled lesson
        let i;

        switch (info_schedule.Day) {
          case 'Mon':
            i = 0;
            break;
          case 'Tue':
            i = 1;
            break;
          case 'Wed':
            i = 2;
            break;
          case 'Thu':
            i = 3;
            break;
          case 'Fri':
            i = 4;
            break;
        }
        day_week.setDate(day_week.getDate() + i);
        const startHour = info_schedule.Hour.split('-')[0];
        const hour = startHour.split(':'); // hour[0] = hour, hour[1] = minutes
        day_week.setHours(hour[0], hour[1], 0, 0);

        const sql4 = 'UPDATE Lectures SET Class=?, Capacity=?, DateHour=? WHERE LectureId=?';
        const stmt4 = db.prepare(sql4);
        transaction = db.transaction(() => {
          let res1;
          rows.forEach((row) => {
            if (day_week.getTime() > today.getTime() && day_week.getTime() < endSemester.getTime()) {
              res1 = stmt4.run(info_schedule.Class, info_schedule.Capacity, day_week.toISOString(), row.LectureId);
            } else {
              rows.splice(rows.indexOf(row), 1);
            }
            day_week.setDate(day_week.getDate() + 7);
          });
          const res2 = stmt3.run(info_schedule.Class, info_schedule.Day, info_schedule.Capacity, info_schedule.Hour, info_schedule.ScheduleId);
          return res1.changes > 0 && res2.changes > 0;
        });
      }
    } else reject('There are no lectures to modify related to that Schedule');
    const lectIds = rows.map(({ LectureId }) => LectureId);
    const transactionresult = transaction();
    if (transactionresult === true) resolve(lectIds);
    else reject('There was an error in modifying Schedule and involved Lectures');
  }
  reject('The received object doesn\'t modify anything');
});

exports.populateLectures = populateLectures;
exports.getSchedule = getSchedule;
