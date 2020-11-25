const config = require('config');
const nodemailer = require('nodemailer');
const lecturesDao = require('../lecturesDao');

const mail = nodemailer.createTransport({
  service: config.mailer.service,
  auth: {
    user: config.mailer.user,
    pass: config.mailer.pass,
  },
});

function sendEmail(to, subject, text) {
  const mailOptions = {
    from: config.mailer.email,
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
    sendEmail(information.email, 'Booking confirmation',
      `You have been successfully booked for the ${information.subject}'s lesson.\nDate: ${information.date_hour}, Class: ${information.class}`);
  }
}

async function sendingEmailCancelledLecture(students) {
  if (students.length > 0) {
    const info = students.shift();
    const { subject, teacher, date_hour } = info;
    const dateString = (new Date(date_hour)).toLocaleString('en', {timeZone: 'Europe/Helsinki'});

    students.forEach((elem) => {
      sendEmail(elem.email_addr, 'Lecture has been cancelled',
        `The lecture "${subject}" teached by professor ${teacher} and scheduled for ${dateString} has been cancelled`);
    });
  }
}

exports.sendBookingConfirmationEmail = sendBookingConfirmationEmail;
exports.sendingEmailBookedPeople = sendingEmailBookedPeople;
exports.sendingEmailCancelledLecture = sendingEmailCancelledLecture;
