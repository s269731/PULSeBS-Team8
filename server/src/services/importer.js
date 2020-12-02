// const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');
const db = require('../db');

async function importFile(file, table) {
  let sql = '';
  switch (table) {
    case 'students':
    case 'teachers':
      sql = 'INSERT OR REPLACE INTO Users VALUES(?, ?, ?, ?, ?, ?, ?)';
      break;
    case 'lectures':
      sql = 'INSERT OR REPLACE INTO Lectures VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
      break;
    case 'courses':
      sql = 'INSERT OR REPLACE INTO Subjects VALUES(?, ?, ?, ?)';
      break;
    case 'classes':
      sql = 'INSERT OR REPLACE INTO Classes VALUES(?, ?, ?)';
      break;
    default:
      throw new Error('Invalid url');
  }
  const stmt = db.prepare(sql);
  const fileStream = fs.createReadStream(file.tempFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    stmt.run(line.split(','));
  }
}

exports.importFile = importFile;
