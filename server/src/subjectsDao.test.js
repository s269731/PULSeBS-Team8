process.env.NODE_ENV = 'test';

const db = require('./db');
const subjectDao = require('./subjectsDao');

// delete all the tickets inserted
db.prepare('DELETE from Lectures').run();
db.prepare('DELETE from Subjects').run();
// populate db
db.prepare('INSERT INTO Subjects(SubjectId, TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([1, 1, 'SoftwareEngineering II', 'Computer Engineering']);
db.prepare('INSERT INTO Subjects(SubjectId, TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([2, 1, 'SoftwareEngineering I', 'Computer Engineering']);

test('Should return correctly subject name by it id', async () => {
  const subjectid = 1;
  const obj = await subjectDao.getSubjectName(subjectid);
  expect(obj).toBeTruthy();
  // expect(obj.SubjectId).toBe(1);
  // expect(obj.TeacherId).toBe('t0002');
  expect(obj.SubjectName).toBeTruthy();
  expect(obj.SubjectName).toBe('SoftwareEngineering II');
  // expect(obj.Course).toBeTruthy();
});

test('Should not return subjects with an id that does not exist', async () => {
  try {
    await subjectDao.getSubjectName('12342459');
  } catch (err) {
    expect(err).toMatch("There isn't any Subject with that SubjectId");
  }
});

test('Should return an array with subjectId,subjectName related to a teacherId', async () => {
  const teacherId = 1;
  const obj = await subjectDao.getSubjectsByTeacherId(teacherId);
  expect(obj).toBeTruthy();
  expect(obj[0].SubjectId).toBe(1);
  expect(obj[1].SubjectId).toBe(2);
});

test('Should return an error because there arent subjectsId related to that teacherId', async () => {
  const teacherId = 2;
  try {
    await subjectDao.getSubjectsByTeacherId(teacherId);
  } catch (err) {
    expect(err).toBe('No Subject assigned to that teacherId');
  }
});
