process.env.NODE_ENV = 'test';

const db = require('./db');
const userDao = require('./userDao');

// delete all the tickets inserted
db.prepare('DELETE from Users').run();
db.prepare('INSERT INTO Users(Id, Role, Name, Surname, Email, Password, Course) VALUES(?,?,?,?,?,?,?)').run(
  [1, 'D', 'nome1', 'cognome1', 'd0001@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'corso4'],
);

test('Should return correctly user by his email', async () => {
  const email = 'd0001@prof.com';
  const obj = await userDao.getUser(email);
  expect(obj).toBeTruthy();
  expect(obj.id).toBe(1);
  expect(obj.role).toBe('D');
  expect(obj.name).toBeTruthy();
  expect(obj.surname).toBeTruthy();
  expect(obj.email).toBe(email);
  expect(obj.password).toBeTruthy();
  expect(obj.course).toBeTruthy();
});

test('Should return correctly user by his id', async () => {
  const id = 1;
  const obj = await userDao.getUserById(id);
  expect(obj).toBeTruthy();
  expect(obj.id).toBe(id);
  expect(obj.role).toBe('D');
  expect(obj.name).toBeTruthy();
  expect(obj.surname).toBeTruthy();
  expect(obj.email).toBeTruthy();
  expect(obj.password).toBeTruthy();
  expect(obj.course).toBeTruthy();
});

test('Should not return users with an email that does not exist', async () => {
  const obj = await userDao.getUser('dfgsndjfiksbnd@prof.com');
  expect(obj).toBeUndefined();
});

test('Should not return users with an id that does not exist', async () => {
  const obj = await userDao.getUserById(12332);
  expect(obj).toBeUndefined();
});
