const logsDao = require('./logsDao');

test('Should insert the record into Logs table, lecture passed as id', async () => {
  const userId = 1;
  const typeOp = 3;
  const lect = 4;
  const res = await logsDao.insertLog(userId, typeOp, lect);
  expect(res).toBe(0);
});

test('Should insert the record into Logs table, lecture passed directly as object with 2 properties', async () => {
  const userId = 1;
  const typeOp = 2;
  const lect = { date_hour: '2020-11-29T17:30:00.000Z', subject: 'SoftwareEngineering II' };
  const res = await logsDao.insertLog(userId, typeOp, lect);
  expect(res).toBe(0);
});

test('Should return all the records of Logs table in descending order', async () => {
  const logs = await logsDao.getLogs();
  const info = logs.shift();
  expect(info.TypeOp0).toBe(1);
  expect(info.TypeOp1).toBe(1);
  expect(info.TypeOp2).toBe(2);
  expect(info.TypeOp3).toBe(2);
  expect(logs.length).toBe(6);
});
