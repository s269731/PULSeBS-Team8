const db = require('./db');

/*
async function getSubjectName(id) {
  const sql = 'SELECT SubjName FROM Subjects WHERE SubjectId = ?';
  const stmt = db.prepare(sql);
  const subjectname = stmt.get(id);

  if (subjectname !== undefined) {
    console.log(subjectname);
    return ({ SubjectName: subjectname.SubjName });
  }
  // There isn't any Subject with that SubjectId
  return ("There isn't any Subject with that SubjectId");
}
 */

exports.getSubjectName = (id) => new Promise((resolve, reject) => {
  const sql = 'SELECT SubjName FROM Subjects WHERE SubjectId = ?';
  const stmt = db.prepare(sql);
  const subjectname = stmt.get(id);

  if (subjectname !== undefined) {
    resolve({ SubjectName: subjectname.SubjName });
  } else {
    // There isn't any Subject with that SubjectId
    reject("There isn't any Subject with that SubjectId");
  }
});

exports.getSubjectsByTeacherId = (teacherId) => new Promise((resolve, reject) => {
  const sql = db.prepare('SELECT SubjectId,SubjName FROM Subjects WHERE TeacherId=?');
  const rows = sql.all(teacherId);
  const subjects = [];
  if (rows.length > 0) {
    rows.forEach((row) => {
      subjects.push({ SubjectId: row.SubjectId, SubjectName: row.SubjName });
    });
    resolve(subjects);
  } else reject('No Subject assigned to that teacherId');
});

exports.getTeacherIdBySubjectId = (subjectId) => new Promise((resolve, reject) => {
  const sql = db.prepare('SELECT TeacherId FROM Subjects WHERE SubjectId=?');
  const row = sql.get(subjectId);
  if (row !== undefined) {
    resolve ({ TeacherId: row.TeacherId });
  }
  else { reject('That SubjectId doesn\'t exist'); }
});

// exports.getSubjectName = getSubjectName;
