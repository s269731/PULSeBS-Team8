process.env.NODE_ENV = 'test';
const setupTestDB = require('./setupTestDB');

beforeAll(() => {
  setupTestDB.initTestDB();
});

afterAll(() => {
  setupTestDB.cleanupTestDB();
});
