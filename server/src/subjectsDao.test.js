const subjectDao = require('./subjectsDao');

test('Should return correctly subjectName by its id', async () => {
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

test('Should return an array with subjectId, subjectName related to a teacherId', async () => {
  const teacherId = 1;
  const obj = await subjectDao.getSubjectsByTeacherId(teacherId);
  expect(obj).toBeTruthy();
  expect(obj[0].SubjectId).toBe('1.0');
  expect(obj[1].SubjectId).toBe('2.0');
});

test('Should return an error because there aren\'t subjectIds related to that teacherId', async () => {
  const teacherId = 2;
  try {
    await subjectDao.getSubjectsByTeacherId(teacherId);
  } catch (err) {
    expect(err).toBe('No Subject assigned to that teacherId');
  }
});

test('Should return an error because the SubjectId doesn\'t exist', async () => {
  const subjectId = 20;
  try {
    await subjectDao.getTeacherIdBySubjectId(subjectId);
  } catch (err) {
    expect(err).toBe('That SubjectId doesn\'t exist');
  }
});

test('Should return the teacherId corresponded to that subjectId', async () => {
  const subjectId = 6;
  const teacherId = await subjectDao.getTeacherIdBySubjectId(subjectId);
  expect(teacherId).toBeTruthy();
  expect(teacherId.TeacherId).toBe('11.0');
});
