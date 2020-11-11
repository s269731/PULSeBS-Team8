const baseURL="/api";
async function Login(params) {
    let username=params.email
    let password=params.password
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: username, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj["status"]=response.status;reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function getLectures(){
    let url="/lectures";
    const response=await fetch(baseURL+url);
    const lecturesJson=await response.json();
    if(response.ok){
        return lecturesJson.map((l)=>{
            let fields=l.dateHour.split("T")
            let date=fields[0]
            let hour=fields[1].split(".")[0].split(":")[0]+":"+fields[1].split(".")[0].split(":")[1]
            return {
                subject:l.subjectName,
                date:date,
                hour:hour,
                modality:l.modality,
                room:l.className,
                capacity:l.capacity,
                bookedStudents:l.bookedPeople,
                teacherName: l.teacherName,
                lectureId: l.lectureId,
                booked: l.booked
        }})
    }
    else{
        let err={status:response.status, errObj:lecturesJson};
        throw err;
    }
}

async function getUser(){
    let url="/user";
    const response=await fetch(baseURL+url);
    const userJson=await response.json();
    if(response.ok){
        return userJson
    }
    else{
        let err={status:response.status, errObj:userJson};
        throw err;
    }
}

async function bookLeacture(id){
    let url="/reserve"
    const response= await fetch(baseURL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({lectureId: id}),
    });
    const result=await response.json();
    if(response.ok){
        return (result)
    }
}

async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}





const API = {Login,getLectures,getUser,userLogout, bookLeacture} ;
export default API;