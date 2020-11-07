const db = require('./db');

exports.getSubjectName = (id) => new Promise((resolve,reject)=> {
    const sql = 'SELECT SubjName FROM Subjects WHERE SubjectId = ?';
    const stmt = db.prepare(sql);
    const subjectname = stmt.get(id);

    if(subjectname!==undefined){
         resolve({SubjectName:subjectname.SubjName})
    }
    else{
        //There isn't any Subject with that SubjectId
         reject("There isn't any Subject with that SubjectId")
    }
})
