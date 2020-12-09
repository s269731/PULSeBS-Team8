const moment = require('moment');
const db = require('./db');
const scheduleDao = require('./scheduleDao');
const lecturesDao = require('./lecturesDao');

db.prepare('DELETE FROM Logs').run();
db.prepare('DELETE FROM Enrollments').run();
db.prepare('DELETE FROM Bookings').run();
db.prepare('DELETE from Lectures').run();
db.prepare('DELETE FROM Schedule').run();
db.prepare('DELETE FROM Subjects').run();
db.prepare('DELETE FROM Users').run();

const usersStmt = db.prepare('INSERT OR IGNORE INTO Users(Id, Role, Name, Surname, Email, Password, SSN) VALUES(?,?,?,?,?,?,?)');
usersStmt.run(['d0001', 'D', 'Marco', 'Torchiano', 'd0001@prof.com', '$2b$12$JzpgpB9ruQNwczLJXMkL9.UPoo4K1Sdlpx4g6/9aVHRyz/GzjrRpa', 'XT6141393']);

const subjStmt = db.prepare('INSERT OR IGNORE INTO Subjects(SubjectId,Year,Semester,TeacherId,SubjName) VALUES(?,?,?,?,?)');
subjStmt.run(['XX678', 1, 1, 'd0001', 'SoftwareEngineering II']);
subjStmt.run(['XX680', 1, 1, 'd0001', 'SoftwareEngineering I']);

const schedStmt = db.prepare('INSERT OR IGNORE INTO Schedule(ScheduleId, SubjectId, Class, Day, Capacity, Hour) VALUES(?,?,?,?,?,?)');
schedStmt.run([1, 'XX678', 4, 'Mon', 100, '8:30-11:00']);
schedStmt.run([2, 'XX678', 4, 'Tue', 100, '14:30-16:00']);
schedStmt.run([3, 'XX680', 3, 'Wed', 80, '14:30-17:30']);

test('Should populate Lectures', async () => {
    const res = await scheduleDao.populateLectures();
    expect(res).toBe(0);
});

test('Should populate Lectures after making the table empty', async () => {
    const res = await scheduleDao.populateLectures();
    expect(res).toBe(0);
});

let array = [
    {"Modality": "In person", 
    "Semester": 1, 
    "SubjName": "SoftwareEngineering II", 
    "SubjectId": "XX678", 
    "Tname": "Marco", 
    "Tsurname": "Torchiano", 
    "Year": 1, 
    "schedules": [{"Capacity": 100, "Class": 4, "Day": "Mon", "Hour": "8:30-11:00", "ScheduleId": 1}, 
                {"Capacity": 100, "Class": 4, "Day": "Tue", "Hour": "14:30-16:00", "ScheduleId": 2}]}, 
    {"Modality": "In person", 
    "Semester": 1, 
    "SubjName": "SoftwareEngineering I", 
    "SubjectId": "XX680", 
    "Tname": "Marco", 
    "Tsurname": "Torchiano", 
    "Year": 1, 
    "schedules": [{"Capacity": 80, "Class": 3, "Day": "Wed", "Hour": "14:30-17:30", "ScheduleId": 3}]}];

test('Should get the Schedule', async () => {
    const results = await scheduleDao.getSchedule();
    expect(results).toEqual(array);
});

test('Should change the modality to Virtual all the lectures related to that SubjectId', async () => {
    let subjectId_Mod = [
        { "SubjectId": 'XX678', "Modality": 'In person'}
    ];
    const res = await scheduleDao.changeModalitySchedule(subjectId_Mod);
    expect(res.result).toBe('Virtual');
});

test('Should change the modality to In person all the lectures related to that SubjectId', async () => {
    let subjectId_Mod = [
        { "SubjectId": 'XX678', "Modality": 'Virtual'}
    ];
    const res = await scheduleDao.changeModalitySchedule(subjectId_Mod);
    expect(res.result).toBe('In person');
});

test('Should change the modality to In person all the lectures related to that SubjectId', async () => {
    let subjectId_Mod = [
        { "SubjectId": 'XX699', "Modality": 'In person'}
    ];
    try {
        await scheduleDao.changeModalitySchedule(subjectId_Mod);
    } catch (err) {
        expect(err).toBe('No results for that SubjectId');
    }
});

test('Should change the modality to In person all the lectures related to that SubjectId', async () => {
    let subjectId_Mod = [
        { "SubjectId": 'XX699', "Modality": 'Virtual'}
    ];
    try {
        await scheduleDao.changeModalitySchedule(subjectId_Mod);
    } catch (err) {
        expect(err).toBe('No results for that SubjectId');
    }
});