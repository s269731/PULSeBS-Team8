const db = require('../db');
const subjectDao = require('../subjectsDao');
const lecturesDao = require('../lecturesDao');

async function computeTeacherStatistics(teacherId) {
  const subjects = await subjectDao.getSubjectsByTeacherId(teacherId);
  const statsArray = [];
  // eslint-disable-next-line no-restricted-syntax
  await Promise.all(subjects.map(async (subject) => {
    const rows = await lecturesDao.getLecturesBySubjectId(subject);

    statsArray.push(rows);
  }));
  console.log(statsArray);
  return statsArray;
}

exports.computeTeacherStatistics = computeTeacherStatistics;
