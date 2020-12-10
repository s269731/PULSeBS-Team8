const contactTracing = require('./contactTracing');

test('should return contact tracing', async () => {
  const studentSSN = 'XT6141396';
  const obj = await contactTracing.trackStudentContacts(studentSSN);
  expect(obj).toBeTruthy();
  expect(obj[0].Subject).toBe('Computer Network Technologies');
  expect(obj[1].Subject).toBe('Big Data');
  expect(obj[0].Teacher.Name).toBe('Maria Balducci');
  expect(obj[1].Teacher.Name).toBe('Paolino Garzetta');
  expect(obj[0].Lectures[0].StudentList.length).toBe(3);
  expect(obj[0].Lectures[1].StudentList.length).toBe(3);
  expect(obj[1].Lectures[0].StudentList.length).toBe(3);
});

test('should return an error because the SSN doesn\'t correspond to a studentSSN but to a TeacherSSN', async () => {
  const studentSSN = 'XT6141390';
  try {
    const obj = await contactTracing.trackStudentContacts(studentSSN);
  } catch (error) {
    expect(error).toBe('not a student');
  }
});

/*
test('should return an error because the SSN doesn\'t correspond to any student SSN', async () => {
  const studentSSN = 'XT6142296';
  try {
    const obj = await contactTracing.trackStudentContacts(studentSSN);
  } catch (error) {
    expect(error).toBe('Error in Contact Tracing: The SSN you inserted doesn\'t correspond to any student');
  }
});
 */

test('should throw an error if the student didnt have follow any lesson in the last week', async () => {
  const studentSSN = 'XT6141342';
  try {
    const obj = await contactTracing.trackStudentContacts(studentSSN);
  } catch (error) {
    expect(error).toBe('Error in Contact Tracing: The Student didn\'t follow any lesson in the past week');
  }
});
