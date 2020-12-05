const puppeteer = require('puppeteer');

let browser
let page
const baseUrl = 'http://localhost:3000/'
const student = {
  email: 'pulsebs8-s0001@yahoo.com',
  password: 'pass1',
}
const teacher = {
  email: 'pulsebs8-d0001@yahoo.com',
  password: 'pass2',
}
const manager = {
  email: 'pulsebs8-m0001@yahoo.com',
  password: 'pass2',
}
const officer = {
  email: 'pulsebs8-o0001@yahoo.com',
  password: 'pass2',
}

beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({headless: false});
  // creates a new page in the opened browser
  page = await browser.newPage()
})

describe('Students', () => {
  test('students can login', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('[data-testid="home-page"]');
    await page.click('[data-testid="login-link"]');

    await page.waitForSelector('[data-testid="login-page"]');
    await page.type("input[name=email]", student.email);
    await page.type("input[name=password]", student.password);
    await page.click('[data-testid="login-button"]');
  }, 1600000);

  test('students can book for a lecture', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.goto(baseUrl + 'student');
    await page.waitForSelector('[data-testid="student-page"]');
    await page.click('[data-testid="course-book-button"]');
    await page.waitForSelector('[data-testid="course-cancel-button"]');
  }, 9000000);

  test('students can cancel a booking for a lecture', async () => {
    await page.goto(baseUrl + 'student');
    await page.waitForSelector('[data-testid="student-page"]');
    await page.click('[data-testid="course-cancel-button"]');
    await page.waitForSelector('[data-testid="course-book-button"]');
  }, 9000000);

  test('students can show a calendar', async () => {
    await page.goto(baseUrl + 'student');
    await page.waitForSelector('[data-testid="student-page"]');
    await page.click('[id="controlled-tab-tab-calendar"]');
    await page.waitForSelector('[data-testid="calendar-page"]');
  }, 9000000);

  test('students can logout', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.click('[data-testid="logout-link"]');
    await page.waitForSelector('[data-testid="home-page"]');
  }, 9000000);

});

describe('Teachers', () => {
  test('teachers can login', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('[data-testid="home-page"]');
    await page.click('[data-testid="login-link"]');

    await page.waitForSelector('[data-testid="login-page"]');
    await page.type("input[name=email]", teacher.email);
    await page.type("input[name=password]", teacher.password);
    await page.click('[data-testid="login-button"]');
  }, 1600000);

  test('teachers can show the list of booked students', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
    await page.click('[data-testid="card-toggle"]');
    await page.waitForSelector('[data-testid="studentlist-button"]');
    await page.click('[data-testid="studentlist-button"]');
    await page.waitForSelector('[data-testid="close-button"]');
  }, 9000000);

  test('teachers can delete a lecture', async () => {
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
    await page.click('[data-testid="card-toggle"]');
    await page.waitForSelector('[data-testid="studentlist-button"]');
    await page.click('[data-testid="cancel-lecture-button"]');
    await page.waitForSelector('[data-testid="cancel-lecture-closemodal-button"]');
    // TODO: also click on cancel-lecture-closemodal-button
  }, 9000000);

  // TODO: test the time constraints

  test('teachers can show the statistics page', async () => {
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
    await page.click('[id="controlled-tab-tab-stats"]');
    await page.waitForSelector('[data-testid="logs-daily-table"]');
  }, 9000000);

  test('teachers can logout', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.click('[data-testid="logout-link"]');
    await page.waitForSelector('[data-testid="home-page"]');
  }, 9000000);

});

describe('Officers', () => {
  test('officers can login', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('[data-testid="home-page"]');
    await page.click('[data-testid="login-link"]');

    await page.waitForSelector('[data-testid="login-page"]');
    await page.type("input[name=email]", officer.email);
    await page.type("input[name=password]", officer.password);
    await page.click('[data-testid="login-button"]');
  }, 1600000);

  test('officers can show the main page', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
  }, 9000000);

  test('officers can show the student upload page', async () => {
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
    await page.click('[data-testid="student-upload-button"]');
    await page.waitForSelector('[data-testid="upload-page"]');
  }, 9000000);

  test('officers can show the teacher upload page', async () => {
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
    await page.click('[data-testid="teacher-upload-button"]');
    await page.waitForSelector('[data-testid="upload-page"]');
  }, 9000000);

  test('officers can show the lecture upload page', async () => {
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
    await page.click('[data-testid="lecture-upload-button"]');
    await page.waitForSelector('[data-testid="upload-page"]');
  }, 9000000);

  test('officers can show the course upload page', async () => {
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
    await page.click('[data-testid="course-upload-button"]');
    await page.waitForSelector('[data-testid="upload-page"]');
  }, 9000000);

  test('officers can show the subject upload page', async () => {
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
    await page.click('[data-testid="subject-upload-button"]');
    await page.waitForSelector('[data-testid="upload-page"]');
  }, 9000000);

  test('officers can logout', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.click('[data-testid="logout-link"]');
    await page.waitForSelector('[data-testid="home-page"]');
  }, 9000000);

});

describe('Managers', () => {
  test('managers can login', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('[data-testid="home-page"]');
    await page.click('[data-testid="login-link"]');

    await page.waitForSelector('[data-testid="login-page"]');
    await page.type("input[name=email]", manager.email);
    await page.type("input[name=password]", manager.password);
    await page.click('[data-testid="login-button"]');
  }, 1600000);

  test('managers can show the main page', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
  }, 9000000);

  test('officers can show the statistics chart', async () => {
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
    await page.waitForSelector('[id="manager-tab-tab-chart"]');
    await page.click('[id="manager-tab-tab-chart"]');
    await page.waitForSelector('[class="canvasjs-chart-container"]');
  }, 9000000);

  test('officers can logout', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.click('[data-testid="logout-link"]');
    await page.waitForSelector('[data-testid="home-page"]');
  }, 9000000);

});

afterAll(() => {
  browser.close();
});
