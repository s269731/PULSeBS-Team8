const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userDao = require('./userDao');
const lecturesDao = require('./lecturesDao');

const jwtSecret = 'BçFDJDLKSAJOIFBHNI$48tgopW$ITH"W$TBL';
const tokenExpireTime = 60 * 60; // 1 hour
const authErrorObj = { errors: [{ msg: 'Authorization error' }] };
const lecturesErr = { errors: [{ msg: 'There was an error retrieving available lectures' }] };
const PORT = 3001;
const app = express();
app.disable('x-powered-by');

app.use(express.json());

const db = require('./db');

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  userDao.getUser(email)
    .then((user) => {
      if (user === undefined) {
        res.status(404).send({
          errors: [{ msg: 'E-mail non valida' }],
        });
      } else if (!userDao.checkPassword(user, password)) {
        res.status(401).send({
          errors: [{ msg: 'Password errata' }],
        });
      } else {
        // AUTHENTICATION SUCCESS
        // eslint-disable-next-line max-len
        const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: tokenExpireTime });
        res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * tokenExpireTime });
        res.json({ id: user.id, username: user.username });
      }
    }).catch(() => {
      // Delay response when wrong user/pass is sent to avoid fast guessing attempts
    // eslint-disable-next-line max-len
      new Promise((resolve) => { setTimeout(resolve, 1000); }).then(() => res.status(401).json(authErrorObj));
    });
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
  res.clearCookie('token').end();
});

// AUTHENTICATED REST API endpoints
app.use(jwt({ secret: jwtSecret, getToken: (req) => req.cookies.token, algorithms: ['HS256'] }));

app.get('/api/user', (req, res) => {
  const userId = req.user && req.user.user;
  userDao.getUserById(userId)
    .then((user) => {
      res.json({ id: user.id, username: user.username });
    })
    .catch(
      () => {
        res.status(401).json(authErrorObj);
      },
    );
});

app.get('/api/lectures', (req, res) => {
  const userId = req.user && req.user.user;
  lecturesDao.getLecturesByUserId(userId)
    .then((lectures) => {
      res.json(lectures);
    })
    .catch(() => {
      res.json(lecturesErr);
    });
});

app.post('/api/reserve', (req, res) => {
  const userId = req.user && req.user.user;
  const { lectureId } = req.body;

  lecturesDao.insertReservation(lectureId, userId)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ errors: [{ msg: error }] });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
