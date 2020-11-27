const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectsDao');
const lecturesDao = require('./lecturesDao');

async function insertLog(userId, typeOp, obj) {
    // TypeOp is in the range [0, 3]
    // 0 = insert reservation (only students)
    // 1 = cancel reservation (only students)
    // 2 = cancel lecture (only teachers)
    // 3 = lectures switched to virtual modality (only teachers)
  
    const date_hour = new Date();
    const timestamp = date_hour.getTime();
  
    let lecture;
    let subjectId;
    if (isNaN(obj)) {
      lecture = obj.date_hour;
      const stmt2 = db.prepare('SELECT SubjectId FROM Subjects WHERE SubjName=?');
      const row2 = stmt2.get(obj.subject);
      subjectId = row2.SubjectId;
    }
    else {
      const stmt1 = db.prepare('SELECT DateHour, SubjectId FROM Lectures WHERE LectureId=?');
      const row1 = stmt1.get(obj);
      lecture = row1.DateHour;
      subjectId = row1.SubjectId;
    }
    
    const sql = 'INSERT INTO Logs(TypeOp, UserId, LectDate, SubjectId, Timestamp) VALUES (?,?,?,?,?)';
    const stmt = db.prepare(sql);
    const res = stmt.run(typeOp, userId, lecture, subjectId, timestamp);
  
    if (res !== undefined) return 0;
    return 1;
  }
  
  async function getLogs() {
    // TypeOp is in the range [0, 3]
    // 0 = insert reservation (only students)
    // 1 = cancel reservation (only students)
    // 2 = cancel lecture (only teachers)
    // 3 = lectures switched to virtual modality (only teachers)
  
    const sql = 'SELECT * FROM Logs ORDER BY Id DESC';
    const stmt = db.prepare(sql);
    const rows = stmt.all();
    const logs = [];
    let obj = {};
  
    if (rows.length > 0) {
      await Promise.all(rows.map(async (row) => {
        const user = await userDao.getUserById(row.UserId);
        const { name, surname, email } = user;
        const name_surname = `${name} ${surname}`;
        const subjectName = await subjectDao.getSubjectName(row.SubjectId);
  
        obj = {
          name_surname,
          email,
          typeOp: row.TypeOp,
          lectDate: row.LectDate,
          subject: subjectName.SubjectName,
          timestamp: row.Timestamp,
        };
        logs.push(obj);
      }));
  
      const sql2 = 'SELECT TypeOp, count(*) as count FROM Logs GROUP BY TypeOp ORDER BY TypeOp';
      const stmt2 = db.prepare(sql2);
      const records = stmt2.all();
      let obj3 = {};
  
      for (let i=0; i<4; i++) {
        let obj2 = records.find(o => o.TypeOp === i);
        if (obj2 === undefined) obj3[`TypeOp${i}`]=0;
        else obj3[`TypeOp${i}`]=obj2.count;
      }
      logs.unshift(obj3);
    }
    return logs;
  }

exports.insertLog = insertLog;
exports.getLogs = getLogs;