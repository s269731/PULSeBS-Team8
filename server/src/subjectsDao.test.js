process.env.NODE_ENV = 'test';

const db = require('./db');
const subjectDao = require('./subjectsDao');

// delete all the tickets inserted
db.prepare('DELETE from Subjects').run();
// populate db
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([1, 't0002', 'SoftwareEngineering II', 'Computer Engineering']);
db.prepare('INSERT INTO Subjects(SubjectId,TeacherId,SubjName,Course) VALUES(?,?,?,?)').run([2, 't0002', 'SoftwareEngineering I', 'Computer Engineering']);

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
    const text = await subjectDao.getSubjectName('12342459');
  } catch (err) {
    expect(err).toMatch("There isn't any Subject with that SubjectId");
  }
});
