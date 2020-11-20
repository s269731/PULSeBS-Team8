const express = require('express');
const config = require('config');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const emailService = require('./services/email');
const schedule = require('node-schedule');
const userDao = require('./userDao');
const lecturesDao = require('./lecturesDao');

const authErrorObj = { errors: [{ msg: 'Authorization error' }] };
const lecturesErr = { errors: [{ msg: 'There was an error retrieving available lectures' }] };
const studentListError = { errors: [{ msg: 'There was an error retrieving list of students for this lectureId' }] };
const deleteBookingError = { errors: [{ msg: 'There was an error in deleting the selected booking' }] };
const deleteLectureError = { errors: [{ msg: 'There was an error in deleting the selected lecture' }] };

const app = express();
app.disable('x-powered-by');

//emailService.start();
var rule = new schedule.RecurrenceRule();
rule.hour = 23;
 
var j = schedule.scheduleJob(rule, function(){
  emailService.sendingEmailBookedPeople();
});

app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userDao.getUser(email);
    if (user === undefined || !userDao.checkPassword(user, password)) {
      res.status(401).send({
        errors: [{ msg: 'Invalid credentials' }],
      });
    } else {
      // AUTHENTICATION SUCCESS
      // eslint-disable-next-line max-len
      const token = jsonwebtoken.sign({ user: user.id }, config.jwtSecret, { expiresIn: config.tokenExpireTime });
      res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * config.tokenExpireTime });
      res.json({ id: user.id, username: user.username });
    }
  } catch {
    // Delay response when wrong user/pass is sent to avoid fast guessing attempts
    // eslint-disable-next-line max-len
    new Promise((resolve) => { setTimeout(resolve, 1000); }).then(() => res.status(401).json(authErrorObj));
  }
});

app.use(cookieParser());

// AUTHENTICATED REST API endpoints
app.use(jwt({ secret: config.jwtSecret, getToken: (req) => req.cookies.token, algorithms: ['HS256'] }));
// To return a better object in case of errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json(authErrorObj);
  }
});
app.post('/api/logout', (req, res) => {
  res.clearCookie('token').end();
});

app.get('/api/user', async (req, res) => {
  const userId = req.user && req.user.user;
  try {
    const user = await userDao.getUserById(userId);
    res.json({
      id: user.id, role: user.role, name: user.name, surname: user.surname,
    });
  } catch {
    res.status(401).json(authErrorObj);
  }
});

app.get('/api/student/lectures', async (req, res) => {
  const studentId = req.user && req.user.user;
  try {
    const lectures = await lecturesDao.getLecturesByUserId(studentId);
    res.json(lectures);
  } catch {
    res.json(lecturesErr);
  }
});

app.post('/api/student/reserve', async (req, res) => {
  const userId = req.user && req.user.user;
  const { lectureId } = req.body;
  try {
    const result = await lecturesDao.insertReservation(lectureId, userId);
    // no need to wait
    emailService.sendBookingConfirmationEmail(lectureId, userId);
    res.json(result);
  } catch (error) {
    res.json({ errors: [{ msg: error }] });
  }
});

app.get('/api/student/bookings', async (req, res) => {
  const userId = req.user && req.user.user;
  try {
    const lectures = await lecturesDao.getBookingsByUserId(userId);
    res.json(lectures);
  } catch {
    res.json(lecturesErr);
  }
});

app.delete('/api/student/lectures/:lectureId', async (req, res) => {
  const userId = req.user && req.user.user;
  try {
    const result = await lecturesDao.deleteBookingStudent(req.params.lectureId, userId);
    res.json(result);
  } catch {
    res.json(deleteBookingError);
  }
});

app.get('/api/teacher/lectures', async (req, res) => {
  const teacherId = req.user && req.user.user;
  try {
    const lectures = await lecturesDao.getLecturesByUserId(teacherId);
    res.json(lectures);
  } catch {
    res.json(lecturesErr);
  }
});

app.get('/api/teacher/lectures/:lectureId', async (req, res) => {
  try {
    const list = await lecturesDao.getStudentsListByLectureId(req.params.lectureId);
    if (!list) {
      res.json([]);
    }
    res.json(list);
  } catch {
    res.json(studentListError);
  }
});

app.delete('/api/teacher/lectures/:lectureId', async (req, res) => {
  const userId = req.user && req.user.user;
  try {
    const result = await lecturesDao.deleteLectureTeacher(req.params.lectureId, userId);
    res.json(result);
  } catch {
    res.json(deleteLectureError);
  }
});

app.listen(config.PORT, () => console.log(`Server running on http://localhost:${config.PORT}/`));
