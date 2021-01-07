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

async function trackStudentContacts(student) {
  const lectures = await lecturesDao.getLecturesForStudentContactTracing(student.Id);
  if (lectures === undefined) throw ('Error in Contact Tracing: The Student didn\'t follow any lesson in the past week');
  const subjectLectureStudentListArr = [];

  await Promise.all(lectures.map(async (lecture) => {
    // eslint-disable-next-line max-len

    const teacher = await refactorUserForContactTracing(await lecturesDao.getTeacherByLectureId(lecture.LectureId));
    if (teacher === undefined) throw ('Error in Contact Tracing: Error retrieving teacher of a lesson followed by the student');

    // eslint-disable-next-line max-len
    const res = await lecturesDao.getStudentsListByLectureId(lecture.LectureId, true);
    if (res) {
      const studentlist = refactorUserForContactTracing(res);
      if (Array.isArray(studentlist)) {
        const index = studentlist.findIndex((obj) => obj.Id === student.Id);
        if (index > -1) studentlist.splice(index, 1);
        // eslint-disable-next-line max-len
      }
      subjectLectureStudentListArr.push({
        Subject: lecture.SubjectName, DateHour: lecture.DateHour, Teacher: teacher, StudentList: studentlist,
      });
    }
  }));
  const reducedlist = rearrangeTrackArray(subjectLectureStudentListArr);
  return reducedlist;
}

async function trackTeacherContacts(teacher) {
  const lectures = await lecturesDao.getLecturesForTeacherContactTracing(teacher.Id);
  if (lectures === undefined) throw ('Error in Contact Tracing: The Teacher didn\'t held any lesson in the past week');
  const subjectLectureStudentListArr = [];

  await Promise.all(lectures.map(async (lecture) => {
    const res = await lecturesDao.getStudentsListByLectureId(lecture.LectureId, true);
    if (res) {
      const studentlist = refactorUserForContactTracing(res);

      subjectLectureStudentListArr.push({
        Subject: lecture.SubjectName, DateHour: lecture.DateHour, Teacher: teacher, StudentList: studentlist,
      });
    }
  }));
  const reducedlist = rearrangeTrackArray(subjectLectureStudentListArr);
  return reducedlist;
}

async function getContactTracing(SSN) {
  const usr = await userDao.getUserBySSN(SSN);
  let mode;
  if (usr === undefined) throw ("Error in Contact Tracing: The SSN you inserted doesn't correspond to any entry in the DB");
  const user = refactorUserForContactTracing(usr);
  let res;
  try {
    if (await userDao.isStudent(user.Id)) {
      res = await trackStudentContacts(user);
      mode = 'Student';
    }
  } catch (e) {
    if (e !== 'Error in Contact Tracing: The Student didn\'t follow any lesson in the past week') {
      try {
        if (await userDao.isTeacher(user.Id)) {
          res = await trackTeacherContacts(user);
          mode = 'Teacher';
        }
      } catch (er) {
        throw ('Error in Contact Tracing: The SSN you inserted doesn\'t correspond to any student or teacher');
      }
    }
  }
  return ({ Role: mode, Result: res });
}

exports.getContactTracing = getContactTracing;
