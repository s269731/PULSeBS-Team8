// const db = require('./db')
const bcrypt = require('bcrypt');

exports.getUser = function (email) {
  return new Promise((resolve, reject) => {
    resolve({
      id: 1, username: 'user1', email: 'user1@gmail.com', password: 'dfnsdjfns',
    });
    const sql = 'SELECT * FROM users WHERE email = ?';
    const stmt = db.prepare(sql);
    const rows = stmt.all(email);

    if (rows.length === 0) resolve(undefined);
    else {
      const user = createUser(rows[0]);
      resolve(user);
    }
  });
};

exports.getUserById = function (id) {
  return new Promise((resolve, reject) => {
    resolve({
      id, username: 'user1', email: 'user1@gmail.com', password: 'dfnsdjfns',
    });
    const sql = 'SELECT * FROM users WHERE id = ?';
    const stmt = db.prepare(sql);
    const rows = stmt.all(id);

    if (rows.length === 0) resolve(undefined);
    else {
      const user = {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
      };
      resolve(user);
    }
  });
};

exports.checkPassword = function (user, password) {
  return true;
  // user.password is hashed
  return bcrypt.compareSync(password, user.password);
};
