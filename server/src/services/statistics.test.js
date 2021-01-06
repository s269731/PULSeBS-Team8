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

test('Test the correct computing of statistics about presences', async () => {
  const teacherId = 1;
  const obj = await statistics.computeTeacherPresencesStatistics(teacherId);
  expect(obj[0]).toBeTruthy();
  expect(obj[1]).toBeTruthy();
  expect(obj[0].subjectId.SubjectId).toBe('1.0');
  expect(obj[0].dailystatsarray.length).toBe(5);
  expect(obj[0].weeklystatsarray[0].weekId).toBe('12-18 OCT 2020');
  expect(obj[0].weeklystatsarray[0].weeklyavgpresences).toBe(78);
  expect(obj[0].weeklystatsarray[1].weekId).toBe('30 NOV-06 DEC 2020');
  expect(obj[0].weeklystatsarray[1].weeklyavgpresences).toBe(53.333333333333336);
  expect(obj[0].weeklystatsarray[2].weekId).toBe('28 DEC-03 JAN 2020');
  expect(obj[0].weeklystatsarray[2].weeklyavgpresences).toBe(34);
  expect(obj[0].monthlystatsarray[0].monthId).toBe('OCT-2020');
  expect(obj[0].monthlystatsarray[0].monthlyavgpresences).toBe(78);
  expect(obj[0].monthlystatsarray[1].monthlyavgpresences).toBe(53.333333333333336);
});