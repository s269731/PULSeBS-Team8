const db = require('./db');
const userDao = require('./userDao');
const subjectDao = require('./subjectDao');

class Lecture {
    constructor(lectureId,subjectName,teacherName,dateHour,modality,className,capacity,bookedPeople) {
        this.lectureId = lectureId;
        this.subjectName = subjectName;
        this.teacherName = teacherName;
        this.dateHour = dateHour;
        this.modality = modality;
        this.className = className;
        this.capacity = capacity;
        this.bookedPeople = bookedPeople;
    }
}


exports.getLecturesByUserId = (id) => new Promise((resolve,reject)=> {
    const sql = 'SELECT * FROM Lectures WHERE SubjectId IN (SELECT SubjectId FROM Enrollments WHERE StudentId=?)  ';
    const stmt = db.prepare(sql);
    const rows = stmt.all(id);
    let lectures = {};

    if(rows.length>0){
        rows.forEach(rawlecture => {
        const subjectName = subjectDao.getSubjectName(rawlecture.SubjectId);
        const teacher = userDao.getUserById(rawlecture.TeacherId);
        const teacherName = string.concat(teacher.Name,teacher.Surname);
        lecture = new Lecture(rawlecture.LectureId,subjectName,teacherName,rawlecture.DateHour,rawlecture.Modality,rawlecture.Class,rawlecture.Capacity,rawlecture.bookedPeople);
        lectures.push(lecture)

        })

        console.log(lectures);
        resolve(lectures);

    }
    else{
        //There aren't lectures for this StudentId
        reject("There aren't lecture for this StudentId")
    }

});


