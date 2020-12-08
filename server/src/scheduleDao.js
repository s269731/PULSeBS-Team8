const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');
const lecturesDao = require('./lecturesDao');

async function getSchedule() {
    const sql = 'SELECT SubjectId, SubjName, Year, Semester, u.Name as Tname, u.Surname as Tsurname FROM Subjects su, Users u WHERE su.TeacherId = u.Id ORDER BY Year';
    const stmt = db.prepare(sql);
    const rows = stmt.all();
    let schedules = [];

    if (rows.length > 0) {
        rows.forEach(async (row) => {
            const sql2 = 'SELECT Class, Day, Capacity, Hour FROM Schedule WHERE SubjectId = ?';
            const stmt2 = db.prepare(sql2);
            const results = stmt2.all(row.SubjectId);

            if (results.length > 0) {
                results.forEach(async (res) => {
                    schedules.push(res);
                });
                row['schedules'] = schedules;
            }
            schedules = [];
        });
        return rows;
    } else {
        rows = [];
    }
    return rows;
}

exports.getSchedule = getSchedule;