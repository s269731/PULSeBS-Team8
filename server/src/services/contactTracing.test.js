const contactTracing = require('./contactTracing');

test('should return contact tracing', async () => {
  const studentId = 7;
  const obj = await contactTracing.trackStudentContacts(studentId);
  expect(obj).toBeTruthy();
  expect(obj[0].trackedStudent).toBeTruthy();
  expect(obj[0].lecturesTrack[0]).toBeTruthy();
  expect(obj[0].lecturesTrack[1]).toBeTruthy();
  expect(obj[0].lecturesTrack[2]).toBeTruthy();
  expect(obj[0].lecturesTrack[0].teacher.name).toBe('Maria');
  expect(obj[0].lecturesTrack[1].teacher.name).toBe('Paolino');
  expect(obj[0].lecturesTrack[2].teacher.name).toBe('Maria');
  expect(obj[0].lecturesTrack[0].students.length).toBe(3);
  expect(obj[0].lecturesTrack[1].students.length).toBe(3);
  expect(obj[0].lecturesTrack[2].students.length).toBe(3);
  // expect(obj.lecturesTrack[3]).toBeTruthy();
});

test('should throw an error if the student didnt have follow any lesson in the last week', async () => {
  const studentId = 9;
  try {
    const obj = await contactTracing.trackStudentContacts(studentId);
  } catch (error) {
    expect(error).toBe('Error in Contact Tracing: Tracked student didn\'t follow any lesson in the past week');
  }
});
