const moment = require('moment');
const db = require('../db');
const subjectDao = require('../subjectsDao');
const lecturesDao = require('../lecturesDao');
const userDao = require('../userDao');

//
// TO BE TESTED
async function trackStudentContacts(studentId) {
  const student = await userDao.getUserById(studentId);
  const lectures = await lecturesDao.getLecturesForStudentContactTracing(studentId);
  const contactTrack = [];
  const lecturesTrack = [];
  if (lectures === undefined) throw ('Error in Contact Tracing: Tracked student didn\'t follow any lesson in the past week');

  await Promise.all(lectures.map(async (lecture) => {
  // lectures.forEach((async (lecture) => {
    const studentlist = await lecturesDao.getStudentsListByLectureId(lecture.LectureId);
    const teacher = await lecturesDao.getTeacherByLectureId(lecture.LectureId);
    if (teacher === undefined) throw ('Error in Contact Tracing: Error retrieving teacher of a lesson followed by the student');

    if (Array.isArray(studentlist)) {
      const index = studentlist.findIndex((obj) => obj.id === student.id);
      if (index > -1) studentlist.splice(index, 1);

      lecturesTrack.push({ teacher, students: studentlist });
    }
  }));
  // );
  contactTrack.push({ trackedStudent: student, lecturesTrack });
  console.log(lecturesTrack);
  console.log(contactTrack);
  console.log(contactTrack[0].lecturesTrack[0].students);
  return contactTrack;
}

exports.trackStudentContacts = trackStudentContacts;
