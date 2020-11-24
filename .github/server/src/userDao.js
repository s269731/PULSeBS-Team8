const bcrypt = require('bcrypt');
const db = require('./db');

class User {
  constructor(id, role, name, surname, email, password, course) {
    this.id = id;
    this.role = role;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.course = course;
  }
}

const createUser = (row) => new User(
  row.Id,
  row.Role,
  row.Name,
  row.Surname,
  row.Email,
  row.Password,
  row.Course,
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

exports.checkPassword = (user, password) => bcrypt.compareSync(password, user.password);
