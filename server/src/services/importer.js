// const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');
const db = require('../db');

async function importFile(file, table) {
  let sql = '';
  let sqlExists = '';
  switch (table) {
    case 'students':
    case 'teachers':
      sql = 'INSERT INTO Users(Id, Role,Name,Surname,Email,Password,Course) VALUES(?, ?, ?, ?, ?, ?, ?)';
      sqlExists = 'SELECT * FROM Users WHERE Id=?';
      break;
    case 'lectures':
      sql = 'INSERT INTO Lectures(LectureId, TeacherId,SubjectId,DateHour,Modality,Class,BookedPeople,Capacity) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
      sqlExists = 'SELECT * FROM Lectures WHERE LectureId=?';
      break;
    case 'courses':
      sql = 'INSERT INTO Subjects(SubjectId, TeacherId,SubjName,Course) VALUES(?, ?, ?, ?)';
      sqlExists = 'SELECT * FROM Subjects WHERE SubjectId=?';
      break;
    case 'classes':
      sql = 'INSERT INTO Classes(ClassId, Class,Capacity) VALUES(?, ?, ?)';
      sqlExists = 'SELECT * FROM Classes WHERE ClassId=?';
      break;
    default:
      throw new Error('Invalid url');
  }
  const stmt = db.prepare(sql);
  const stmtExists = db.prepare(sqlExists);
  const fileStream = fs.createReadStream(file.tempFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const values = line.split(',');
    const res = stmtExists.all(line[0]);
    if (res.length === 0) stmt.run(values);
  }
  return true;
}

exports.importFile = importFile;
