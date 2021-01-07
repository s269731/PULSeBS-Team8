const contactTracing = require('./contactTracing');

test('should return student contact tracing', async () => {
  const studentSSN = 'XT6141396';
  const obj = await contactTracing.getContactTracing(studentSSN);
  expect(obj).toBeTruthy()
  expect(obj.Role).toBe('Student');
  expect(obj.Result[0].Subject).toBe('Computer Network Technologies');
  expect(obj.Result[1].Subject).toBe('Big Data');
  expect(obj.Result[0].Teacher.Name).toBe('Maria Balducci');
  expect(obj.Result[1].Teacher.Name).toBe('Paolino Garzetta');
  expect(obj.Result[0].Lectures[0].StudentList.length).toBe(3);
  expect(obj.Result[0].Lectures[1].StudentList.length).toBe(3);
  expect(obj.Result[1].Lectures[0].StudentList.length).toBe(3);
});

test('should return teacher contact tracing', async () => {
  const teacherSSN = 'XT6141340';
  const obj = await contactTracing.getContactTracing(teacherSSN);
  expect(obj).toBeTruthy();
  expect(obj.Role).toBe('Teacher');
});

test('should return an error because the SSN doesn\'t correspond to any entry in the User Table', async () => {
  const studentSSN = 'XT6142296';
  try {
    const obj = await contactTracing.getContactTracing(studentSSN);
  } catch (error) {
    expect(error).toBe('Error in Contact Tracing: The SSN you inserted doesn\'t correspond to any entry in the DB');
  }
});

test('should return an error because the SSN doesn\'t correspond to any student or teacher SSN', async () => {
  const studentSSN = 'XT6141397';
  try {
    const obj = await contactTracing.getContactTracing(studentSSN);
  } catch (error) {
    expect(error).toBe('Error in Contact Tracing: The SSN you inserted doesn\'t correspond to any student or teacher');
  }
});


test('should throw an error if the student didnt have follow any lesson in the last week', async () => {
  const studentSSN = 'XT6141342';
  try {
    const obj = await contactTracing.getContactTracing(studentSSN);
  } catch (error) {
    expect(error).toBe('Error in Contact Tracing: The Student didn\'t follow any lesson in the past week');
  }
});

test('should throw an error if the teacher didnt have held any lesson in the last week', async () => {
  const teacherSSN = 'XT6141399';
  try {
    const obj = await contactTracing.getContactTracing(teacherSSN);
  } catch (error) {
    expect(error).toBe('Error in Contact Tracing: The Teacher didn\'t held any lesson in the past week');
  }
});

test('should throw an error because the SSN is undefined', async () => {
  const studentSSN = undefined;
  try {
    const obj = await contactTracing.getContactTracing(studentSSN);
  } catch (error) {
    expect(error).toBe("Error in Contact Tracing: The SSN you inserted doesn't correspond to any entry in the DB");
  }
});
