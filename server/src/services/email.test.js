const Mailer = require('nodemailer/lib/mailer');
const waitForExpect = require('wait-for-expect');
const emailService = require('./email');

const array = [
  {
    subject: 'Web Applications II',
    teacher: 'Mario Rossi',
    date_hour: '2020-11-23T17:30:00.000Z',
  },
  {
    email_addr: 's0002@student.com',
  },
  {
    email_addr: 's0003@student.com',
  },
];

test('Should send the email to teachers', async () => {
  jest.useFakeTimers();
  spyOn(Mailer.prototype, 'sendMail').and.callFake((mailOptions, cb) => {
    cb(null, true);
  });
  emailService.sendingEmailBookedPeople();

  await waitForExpect(() => {
    expect(Mailer.prototype.sendMail).toHaveBeenCalledTimes(2);
  });
});

test('Should send the email for booking confirmation', async () => {
  const lectureId = 1;
  const studentId = 2;
  spyOn(Mailer.prototype, 'sendMail').and.callFake((mailOptions, cb) => {
    cb(null, true);
  });
  await emailService.sendBookingConfirmationEmail(lectureId, studentId);
  expect(Mailer.prototype.sendMail).toHaveBeenCalled();
});

test('Should not send the email since that lectureId doesn\'t exist in the db', async () => {
  const lectureId = 8000;
  const studentId = 2;
  spyOn(Mailer.prototype, 'sendMail').and.callFake((mailOptions, cb) => {
    cb(null, false);
  });
  await emailService.sendBookingConfirmationEmail(lectureId, studentId);
  expect(Mailer.prototype.sendMail).not.toHaveBeenCalled();
});

test('Should send emails to all the student booked for that cancelled lecture', async () => {
  spyOn(Mailer.prototype, 'sendMail').and.callFake((mailOptions, cb) => {
    cb(null, true);
  });
  await emailService.sendingEmailCancelledLecture(array);
  expect(Mailer.prototype.sendMail).toHaveBeenCalledTimes(2);
});

test('Should not send emails because the array is empty', async () => {
  const empty = [];
  spyOn(Mailer.prototype, 'sendMail').and.callFake((mailOptions, cb) => {
    cb(null, false);
  });
  await emailService.sendingEmailCancelledLecture(empty);
  expect(Mailer.prototype.sendMail).not.toHaveBeenCalled();
});
