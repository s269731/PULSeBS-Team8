process.env.NODE_ENV = 'test';

const db = require('./db');
const userDao = require('./userDao');

test('Should return correctly user by his email', async () => {
  const email = 's0002@student.com';
  const obj = await userDao.getUser(email);
  expect(obj).toBeTruthy();
  expect(obj.id).toBe('2.0');
  expect(obj.role).toBe('S');
  expect(obj.name).toBeTruthy();
  expect(obj.surname).toBeTruthy();
  expect(obj.email).toBe(email);
  expect(obj.password).toBeTruthy();
  //expect(obj.course).toBeTruthy();
});

test('Should return correctly user by his id', async () => {
  const id = '2.0';
  const obj = await userDao.getUserById(id);
  expect(obj).toBeTruthy();
  expect(obj.id).toBe(id);
  expect(obj.role).toBe('S');
  expect(obj.name).toBeTruthy();
  expect(obj.surname).toBeTruthy();
  expect(obj.email).toBeTruthy();
  expect(obj.password).toBeTruthy();
  //expect(obj.course).toBeTruthy();
});

test('Should not return users with an email that does not exist', async () => {
  const obj = await userDao.getUser('dfgsndjfiksbnd@prof.com');
  expect(obj).toBeUndefined();
});

test('Should not return users with an id that does not exist', async () => {
  const obj = await userDao.getUserById(12332);
  expect(obj).toBeUndefined();
});

test('isStudent should resolve true if provided the correct id type', async () => {
  const obj = await userDao.isStudent(2);
  expect(obj).toBeTruthy();
});

test('isStudent should reject if provided the wrong id type', async () => {
  try {
    const obj = await userDao.isStudent(1);
    expect(obj).toBeUndefined();
  } catch (err) {
    expect(err).toBe('not a student');
  }
});

test('isTeacher should resolve true if provided the correct id type', async () => {
  const obj = await userDao.isTeacher(1);
  expect(obj).toBeTruthy();
});

test('isTeacher should reject if provided the wrong id type', async () => {
  try {
    const obj = await userDao.isTeacher(2);
    expect(obj).toBeUndefined();
  } catch (err) {
    expect(err).toBe('not a teacher');
  }
});

test('isManager should resolve true if provided the correct id type', async () => {
  const obj = await userDao.isManager(8);
  expect(obj).toBeTruthy();
});

test('isManager should reject if provided the wrong id type', async () => {
  try {
    const obj = await userDao.isManager(9);
    expect(obj).toBeUndefined();
  } catch (err) {
    expect(err).toBe('not a manager');
  }
});

test('isOfficer should resolve true if provided the correct id type', async () => {
  const obj = await userDao.isOfficer(9);
  expect(obj).toBeTruthy();
});

test('isOfficer should reject if provided the wrong id type', async () => {
  try {
    const obj = await userDao.isOfficer(8);
    expect(obj).toBeUndefined();
  } catch (err) {
    expect(err).toBe('not an officer');
  }
});

test('Hashed password should match with the provided plaintext one', async () => {
  const user = await userDao.getUserById(1);
  expect(userDao.checkPassword(user, 'pass1')).toBe(true);
});
