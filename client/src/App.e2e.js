const puppeteer = require('puppeteer');

let browser
let page
const baseUrl = 'http://localhost:3000/'
const student = {
  email: 's0002@student.com',
  password: 'pass1',
}
const teacher = {
  email: 'd0001@prof.com',
  password: 'pass1',
}
const manager = {
  email: 'm0001@manager.com',
  password: 'pass1',
}
const officer = {
  email: 'o0001@officer.com',
  password: 'pass1',
}

beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({headless: false, devtools: true});
  // creates a new page in the opened browser
  page = await browser.newPage()
})

describe('Students', () => {
  test('students can login with an IdP', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('[data-testid="home-page"]');
    await page.click('[data-testid="login-link"]');

    await page.waitForSelector('[data-testid="login-page"]');
    await page.click('[data-testid="login-idp-button"]');
    await page.waitForSelector("input[name=username]");
    await page.type("input[name=username]", 's900000');
    await page.type("input[name=password]", 'MK97060783');
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-testid="home-page"]');
  }, 9000000);

  test('students can logout after logging in with IdP', async () => {
    await page.waitForSelector('[data-testid="logout-link"]');
    await page.click('[data-testid="logout-link"]');
    await page.waitForSelector('[data-testid="home-page"]');
  }, 9000000);

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
    const cards = await page.$$('[data-testid="card-toggle"]');
    await cards[2].click();
    await page.waitForSelector('[data-testid="course-book-button"]');
    await page.click('[data-testid="course-book-button"]');
    await page.waitForSelector('[data-testid="course-cancel-button"]');
  }, 9000000);

  test('students can cancel a booking for a lecture', async () => {
    await page.goto(baseUrl + 'student');
    await page.waitForSelector('[data-testid="student-page"]');
    const cards = await page.$$('[data-testid="card-toggle"]');
    await cards[2].click();
    await page.waitForSelector('[data-testid="course-cancel-button"]');
    await page.click('[data-testid="course-cancel-button"]');
    await page.waitForSelector('[data-testid="course-book-button"]');
  }, 9000000);

  test('students can show a calendar', async () => {
    await page.goto(baseUrl + 'student');
    await page.waitForSelector('[data-testid="student-page"]');
    await page.click('[id="controlled-tab-tab-calendar"]');
    await page.waitForSelector('[data-testid="calendar-page"]');
  }, 9000000);
  
  test('students can show a tutorial', async () => {
    await page.goto(baseUrl + 'student');
    await page.waitForSelector('[data-testid="student-page"]');
    await page.click('[data-testid="help-button"]');
    await page.waitForSelector('[data-testid="student-page-modal"]');
  }, 9000000);

  test('students can close the tutorial modal', async () => {
    await page.goto(baseUrl + 'student');
    await page.waitForSelector('[data-testid="student-page"]');
    await page.click('[data-testid="help-button"]');
    await page.waitForSelector('[data-testid="student-page-modal"]');
    await page.click('[data-testid="understood-button"]');
    await page.waitForSelector('[data-testid="logout-link"]');
  }, 9000000);

  test('students can logout', async () => {
    await page.goto(baseUrl + 'student');
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

  test('teachers can open the tutorial', async () => {
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.click('[data-testid="help-button"]');
    await page.waitForSelector('[data-testid="teacher-page-modal"]');
    //await page.click('[data-testid="understood-button"]');
  }, 9000000);

  test('teachers can see past lectures for recording presence', async () => {
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
    await page.click('[id="controlled-teacher-tab-tab-past-lectures"]');
    await page.waitForSelector('[id="controlled-teacher-tab-tabpane-past-lectures"]');
  }, 9000000);

  test('teachers can record presence for a lecture', async () => {
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
    await page.click('[id="controlled-teacher-tab-tab-past-lectures"]');
    await page.waitForSelector('[id="controlled-teacher-tab-tabpane-past-lectures"]');
    // this was modified to have a different action/name, but test-id remains the same
    // await page.waitForSelector('[data-testid="record-attendance-lecture-button"]');
    await page.waitForSelector('[data-testid="studentlist-button"]');
  }, 9000000);

  test('teachers can show the statistics page', async () => {
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
    await page.click('[id="controlled-tab-tab-stats"]');
    await page.waitForSelector('[data-testid="logs-daily-table"]');
  }, 9000000);

  test('teachers can show the attendance statistics graph', async () => {
    await page.goto(baseUrl + 'teacher');
    await page.waitForSelector('[data-testid="teacher-page"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
    await page.click('[id="controlled-tab-tab-stats"]');
    await page.waitForSelector('[data-testid="logs-daily-table"]');
    await page.click('[id="controlled-main-tab-tab-attendance"]');
    await page.waitForSelector('[id="controlled-main-attendance-tab-tabpane-daily-attendance"]');
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

  test('officers can show the modify lectures page', async () => {
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
    await page.click('[id="controlled-tab-tab-calendar"]');
    await page.waitForSelector('[data-testid="lecturetable"]');
  }, 9000000);
  
  test('officers can show the exclude holidays modal', async () => {
    await page.goto(baseUrl + 'officer');
    await page.waitForSelector('[data-testid="officer-page"]');
    await page.click('[id="controlled-tab-tab-calendar"]');
    await page.waitForSelector('[data-testid="exc-holiday-button"]');
    await page.click('[data-testid="exc-holiday-button"]');
    await page.waitForSelector('[data-testid="exc-holiday-modal"]');
  }, 9000000);

  test('officers can logout', async () => {
    await page.goto(baseUrl + 'officer');
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

  test('officers can show the contact tracing tab', async () => {
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
    await page.waitForSelector('[id="manager-tab-tab-chart"]');
    await page.click('[id="manager-tab-tab-search"]');
    await page.waitForSelector('[id="manager-tab-tabpane-search"]');
  }, 9000000);

  test('officers can show the contact tracing for a student', async () => {
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
    await page.waitForSelector('[id="manager-tab-tab-chart"]');
    await page.click('[id="manager-tab-tab-search"]');
    await page.waitForSelector('[data-testid="ssn-input"]');
    await page.focus('[data-testid="ssn-input"]')
    await page.keyboard.type('XT6141391')
    await page.click('[data-testid="ssn-button"]');
    await page.waitForSelector('[id="searchDataId"]');
  }, 9000000);

  test('officers can download a csv file of the contact tracing for a student', async () => {
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
    await page.waitForSelector('[id="manager-tab-tab-chart"]');
    await page.click('[id="manager-tab-tab-search"]');
    await page.waitForSelector('[data-testid="ssn-input"]');
    await page.focus('[data-testid="ssn-input"]')
    await page.keyboard.type('XT6141391')
    await page.click('[data-testid="ssn-button"]');
    await page.waitForSelector('[data-testid="csv-download-button"]');
    await page.click('[data-testid="csv-download-button"]');
  }, 9000000);

  test('officers can download a pdf file of the contact tracing for a student', async () => {
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
    await page.waitForSelector('[id="manager-tab-tab-chart"]');
    await page.click('[id="manager-tab-tab-search"]');
    await page.waitForSelector('[data-testid="ssn-input"]');
    await page.focus('[data-testid="ssn-input"]')
    await page.keyboard.type('XT6141391')
    await page.click('[data-testid="ssn-button"]');
    await page.waitForSelector('[data-testid="pdf-download-button"]');
    await page.click('[data-testid="pdf-download-button"]');
  }, 9000000);
  
    test('officers can download a csv file of the contact tracing for a teacher', async () => {
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
    await page.waitForSelector('[id="manager-tab-tab-chart"]');
    await page.click('[id="manager-tab-tab-search"]');
    await page.waitForSelector('[data-testid="ssn-input"]');
    await page.focus('[data-testid="ssn-input"]')
    await page.keyboard.type('XT6141340')
    await page.click('[data-testid="ssn-button"]');
    await page.waitForSelector('[data-testid="csv-download-button"]');
    await page.click('[data-testid="csv-download-button"]');
  }, 9000000);

  test('officers can download a pdf file of the contact tracing for a teacher', async () => {
    await page.goto(baseUrl + 'manager');
    await page.waitForSelector('[data-testid="manager-page"]');
    await page.waitForSelector('[id="manager-tab-tab-chart"]');
    await page.click('[id="manager-tab-tab-search"]');
    await page.waitForSelector('[data-testid="ssn-input"]');
    await page.focus('[data-testid="ssn-input"]')
    await page.keyboard.type('XT6141340')
    await page.click('[data-testid="ssn-button"]');
    await page.waitForSelector('[data-testid="pdf-download-button"]');
    await page.click('[data-testid="pdf-download-button"]');
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

