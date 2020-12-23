const moment = require('moment');
const db = require('../db');
const subjectDao = require('../subjectsDao');
const lecturesDao = require('../lecturesDao');
const userDao = require('../userDao');

function refactorUserForContactTracing(users) {
  if (Array.isArray(users)) {
    const refactoredUsers = [];
    users.forEach((user) => {
      const name = `${user.name} ${user.surname}`;
      refactoredUsers.push({
        Id: user.id, Name: name, Email: user.email, SSN: user.ssn,
      });
    });
    return refactoredUsers;
  }
  const name = `${users.name} ${users.surname}`;
  return ({
    Id: users.id, Name: name, Email: users.email, SSN: users.ssn,
  });
}

function rearrangeTrackArray(list) {
  const reducedList = list.reduce((accumulator, currentValue) => {
    const found = accumulator.find((a) => a.Subject === currentValue.Subject);
    // const value = { SubjectName: currentValue.SubjectName, Lectures: currentValue.value };
    const value = { DateHour: currentValue.DateHour, StudentList: currentValue.StudentList };
    if (!found) {
      accumulator.push({ Subject: currentValue.Subject, Teacher: currentValue.Teacher, Lectures: [value] });
    } else {
      found.Lectures.push(value);
      // found.data.push(value);
    }
    return accumulator;
  }, []);
  return reducedList;
}

async function trackStudentContacts(studentSSN) {
  const student = refactorUserForContactTracing(await userDao.getUserBySSN(studentSSN));
  if (student === undefined || await userDao.isStudent(student.Id) === false) throw ('Error in Contact Tracing: The SSN you inserted doesn\'t correspond to any student');
  const lectures = await lecturesDao.getLecturesForStudentContactTracing(student.Id);
  if (lectures === undefined) throw ('Error in Contact Tracing: The Student didn\'t follow any lesson in the past week');
  const subjectLectureStudentListArr = [];

  await Promise.all(lectures.map(async (lecture) => {
    // eslint-disable-next-line max-len
    const teacher = refactorUserForContactTracing(await lecturesDao.getTeacherByLectureId(lecture.LectureId));
    if (teacher === undefined) throw ('Error in Contact Tracing: Error retrieving teacher of a lesson followed by the student');
    // eslint-disable-next-line max-len
    const studentlist = refactorUserForContactTracing(await lecturesDao.getStudentsListByLectureId(lecture.LectureId, true));
    if (Array.isArray(studentlist)) {
      const index = studentlist.findIndex((obj) => obj.Id === student.Id);
      if (index > -1) studentlist.splice(index, 1);
      // eslint-disable-next-line max-len
    }
    subjectLectureStudentListArr.push({
      Subject: lecture.SubjectName, DateHour: lecture.DateHour, Teacher: teacher, StudentList: studentlist,
    });
  }));

  const reducedlist = rearrangeTrackArray(subjectLectureStudentListArr);
  return reducedlist;
}

exports.trackStudentContacts = trackStudentContacts;
