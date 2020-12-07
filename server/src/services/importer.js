const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db');

async function importFile(file, table) {
  let sql = '';

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
    });
  return true;
}

exports.importFile = importFile;
