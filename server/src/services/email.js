const config = require('config');
const nodemailer = require('nodemailer');
const lecturesDao = require('../lecturesDao');
const subjectDao = require('../subjectsDao');

const mail = nodemailer.createTransport({
  service: config.mailer.service,
  host: config.mailer.host,
  port: config.mailer.port,
  secure: false,
  auth: {
    user: config.mailer.user,
    pass: config.mailer.pass,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

function sendEmail(to, subject, text) {
  const mailOptions = {
    from: config.mailer.user,
    to,
    subject,
    text,
  };
  mail.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

function sendingEmailBookedPeople() {
  lecturesDao.getTeachersForEmail().then((array) => {
    // array.push({email_addr:"test@mail.com", booked_people:123, subject:"TEST"});
    array.forEach((elem) => {
      sendEmail(elem.email_addr, 'Booked people for tomorrow lesson',
        `There are ${elem.booked_people} people booked for the lesson: ${elem.subject} of tomorrow`);
    });
  });
}

async function sendBookingConfirmationEmail(lectureId, userId) {
  const information = await lecturesDao.getInfoBookingConfirmation(lectureId, userId);
  if (information.email) {
    const dateString = new Date(information.date_hour);
    sendEmail(information.email, 'Booking confirmation',
      `You have been successfully booked for the ${information.subject}'s lesson.\nDate: ${dateString}, Class: ${information.class}`);
  }
}

async function sendingEmailCancelledLecture(students) {
  if (students.length > 0) {
    const info = students.shift();
    const { subject, teacher, date_hour } = info;
    const dateString = new Date(date_hour);

    students.forEach((elem) => {
      sendEmail(elem.email_addr, 'Lecture has been cancelled',
        `The lecture "${subject}" teached by professor ${teacher} and scheduled for ${dateString} has been cancelled`);
    });
  }
}

async function sendModifySchedule(info, emails) {
  const subjectName = await subjectDao.getSubjectName(info.SubjectId);

  emails.forEach((emailaddr) => {
    sendEmail(emailaddr, 'Lecture Schedule changed', `The schedule related to ${subjectName.SubjectName} is changed, go check your already booked lectures`);
  });
}

exports.sendModifySchedule = sendModifySchedule;
exports.sendBookingConfirmationEmail = sendBookingConfirmationEmail;
exports.sendingEmailBookedPeople = sendingEmailBookedPeople;
exports.sendingEmailCancelledLecture = sendingEmailCancelledLecture;
