const statistics = require('./statistics');

test('Test the correct computing of statistics', async () => {
  const teacherId = 10;
  const obj = await statistics.computeTeacherStatistics(teacherId);
  expect(obj[0]).toBeTruthy();
  expect(obj[1]).toBeTruthy();
  expect(obj[0].subjectId.SubjectId).toBe('3.0');
  expect(obj[1].subjectId.SubjectId).toBe('4.0');
  expect(obj[0].dailystatsarray[8]).toBeTruthy();
  expect(obj[0].weeklystatsarray[0].weekId).toBe('31 AUG-06 SEP 2020');
  expect(obj[0].weeklystatsarray[0].weeklyavgbookings).toBe(50);
  expect(obj[0].weeklystatsarray[0].weeklyavgunoccupiedplaces).toBe(50);
  expect(obj[0].weeklystatsarray[1].weekId).toBe('28 SEP-04 OCT 2020');
  expect(obj[0].weeklystatsarray[3].weeklyavgbookings).toBe(50);
  expect(obj[0].weeklystatsarray[3].weeklyavgunoccupiedplaces).toBe(50);
});
