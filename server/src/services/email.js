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

function start() {
  const now = new Date();
  const end_of_today = new Date(now);
  end_of_today.setHours(23, 59, 59, 999);
  setTimeout(sendingEmailBookedPeople, end_of_today.getTime() - now.getTime());
}

function sendingEmailBookedPeople() {
  lecturesDao.getTeachersForEmail().then((array) => {
    // array.push({email_addr:"test@mail.com", booked_people:123, subject:"TEST"});
    array.forEach((elem) => {
      const mailOptions = {
        from: config.mailer.email,
        to: elem.email_addr,
        subject: 'Booked people for tomorrow lesson',
        text: `There are ${elem.booked_people} people booked for the lesson: ${elem.subject} of tomorrow`,
      };

      mail.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    });
  });
  setTimeout(sendingEmailBookedPeople, 8.64e+7); // set timeout for the following day
}

async function sendBookingConfirmationEmail(lectureId, userId) {
  const information = await lecturesDao.getInfoBookingConfirmation(lectureId, userId);
  if (information.email) {
    const mailOptions = {
      from: config.mailer.email,
      to: information.email,
      subject: 'Booking confirmation',
      text: `You have been successfully booked for the ${information.subject}'s lesson. Date: ${information.date_hour}, Class: ${information.class}`,
    };

    mail.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}

exports.start = start;
exports.sendBookingConfirmationEmail = sendBookingConfirmationEmail;
exports.sendingEmailBookedPeople = sendingEmailBookedPeople;
