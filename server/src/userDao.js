const bcrypt = require('bcrypt');
const db = require('./db');

class User {
  constructor(id, role, name, surname, city, email, password, birthday, ssn) {
    this.id = id;
    this.role = role;
    this.name = name;
    this.surname = surname;
    this.city = city;
    this.email = email;
    this.password = password;
    this.birthday = birthday;
    this.ssn = ssn;
  }
}

const createUser = (row) => new User(
  row.Id,
  row.Role,
  row.Name,
  row.Surname,
  row.City,
  row.Email,
  row.Password,
  row.Birthday,
  row.SSN,
);

exports.getUser = (email) => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const stmt = db.prepare(sql);
  const rows = stmt.all(email);

  if (rows.length === 0) resolve(undefined);
  else {
    resolve(createUser(rows[0]));
  }
});

exports.getUserById = (id) => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const stmt = db.prepare(sql);
  const rows = stmt.all(id);

  if (rows.length === 0) resolve(undefined);
  else {
    resolve(createUser(rows[0]));
  }
});

exports.isStudent = (id) => new Promise((resolve, reject) => {
  const row = db.prepare('SELECT Role FROM users WHERE id = ?').get(id);
  if (!row || !row.Role || row.Role !== 'S') {
    reject('not a student');
  } else {
    resolve(true);
  }
});

exports.isTeacher = (id) => new Promise((resolve, reject) => {
  const row = db.prepare('SELECT Role FROM users WHERE id = ?').get(id);
  if (!row || !row.Role || row.Role !== 'D') reject('not a teacher');
  else {
    resolve(true);
  }
});

exports.isManager = (id) => new Promise((resolve, reject) => {
  const row = db.prepare('SELECT Role FROM users WHERE id = ?').get(id);
  if (!row || !row.Role || row.Role !== 'M') reject('not a manager');
  else {
    resolve(true);
  }
});

exports.isOfficer = (id) => new Promise((resolve, reject) => {
  const row = db.prepare('SELECT Role FROM users WHERE id = ?').get(id);
  if (!row || !row.Role || row.Role !== 'O') reject('not an officer');
  else {
    resolve(true);
  }
});

exports.checkPassword = (user, password) => {
  // if no password is stored (e.g. after an import) set it
  if (!user.password) {
    const res = db.prepare('UPDATE Users SET Password=? WHERE Id=?').run([bcrypt.hashSync(password, 10), user.id]);
    return res.changes === 1;
  }
  return bcrypt.compareSync(password, user.password);
};
