const baseURL = "/api";
const parseErr={errors: [{ param: "Application", msg: "Cannot parse server response" }, ],}
const commErr={ errors: [{ param: "Server", msg: "Cannot communicate" }] }

async function Login(params) {
  let username = params.email;
  let password = params.password;
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            resolve(user);
          });
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              obj["status"] = response.status;
              reject(obj);
            }) // error msg in the response body
              .catch((err) => {
                reject({parseErr });}); // something else
        }
      })
        .catch((err) => {
          console.log(err);
        reject({commErr});
      }); // connection errors
  });
}


async function retrieveLectures(url){
  return new Promise((resolve, reject) => {
    fetch(baseURL + url)
        .then((response) => {
          if (response.ok) {
            response.json().then((list) => {
              resolve(
                  list
                      .sort((l1, l2) => {
                        return new Date(l1.dateHour) - new Date(l2.dateHour);
                      })
                      .map((l) => {
                        let now = new Date();
                        let lectDay = new Date(l.dateHour);
                        let canDelete = lectDay - now - 3600000 > 0;
                        let canModify= lectDay - now - 3600000/2 > 0;
                        let fields = l.dateHour.split("T");
                        let date = fields[0];
                        let hour = date.getHours() + ":" + date.getMinutes();
                            /*
                            fields[1].split(".")[0].split(":")[0] +
                            ":" +
                            fields[1].split(".")[0].split(":")[1];
                             */
                        return {
                          id: l.lectureId,
                          subject: l.subjectName,
                          date: date,
                          hour: hour,
                          modality: l.modality,
                          room: l.className,
                          capacity: l.capacity,
                          bookedStudents: l.bookedPeople,
                          teacherName: l.teacherName,
                          lectureId: l.lectureId,
                          booked: l.booked,
                          visible: true,
                          canDelete: canDelete,
                          canModify:canModify
                        };
                      })
              );
            });
          } else {
            response
                .json()
                .then((obj) => {
                  obj["status"] = response.status;
                  console.log(obj);
                  reject(obj);
                }) // error msg in the response body
                .catch((err) => {
                  reject({parseErr});
                }); // something else
          }
        })
        .catch((err) => {
          console.log(err);
          reject({commErr});
        }); // connection errors
  });
}


async function getLectures() {
  let url = "/student/lectures";
  return await retrieveLectures(url)
}

async function getLecturesTeacher() {
  let url = "/teacher/lectures";
  return await retrieveLectures(url)

}

async function getUser() {
  let url = "/user";
  const response = await fetch(baseURL + url);
  const userJson = await response.json();
  if (response.ok) {
    return userJson;
  } else {
    console.log("not auth. get user");

    let err = { status: response.status, errObj: userJson };
    console.log(err);
    throw err;
  }
}

async function bookLeacture(id) {
  let url = "/student/reserve";
  const response = await fetch(baseURL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lectureId: id }),
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  } else {
    let err = { status: response.status, errObj: result };

    throw err;
  }
}

async function userLogout() {
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/logout", {
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response
          .json()
          .then((obj) => {
            reject(obj);
          }) // error msg in the response body
          .catch((err) => {
            reject({parseErr});
          }); // something else
      }
    });
  });
}
async function getStudentListByLectureId(id) {
  let url = "/teacher/lectures/" + String(id);
  const response = await fetch(baseURL + url);
  const listJson = await response.json();
  if (response.ok) {
    return listJson.sort((a, b) => {
      if (a.surname.localeCompare(b.surname) === -1) {
        return 0;
      }
      if (a.surname.localeCompare(b.surname) === 1) {
        return 1;
      }
      if (a.surname.localeCompare(b.surname) === 0) {
        if (a.name.localeCompare(b.name) === -1) {
          return 0;
        }
        if (a.name.localeCompare(b.name) === 1) {
          return 1;
        }
      }
    });
  } else {
    let err = { status: response.status, errObj: listJson };
    throw err;
  }
}

async function deleteLectureByTeacher(id) {
  let url = "/teacher/lectures/" + String(id);
  const response = await fetch(baseURL + url, {
    method: "DELETE",
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  } else {
    let err = { status: response.status, errObj: result };

    throw err;
  }
}

async function cancelBookingByStudent(id) {
  let url = "/student/lectures/" + String(id);
  const response = await fetch(baseURL + url, {
    method: "DELETE",
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  } else {
    let err = { status: response.status, errObj: result };

    throw err;
  }
}

async function changeModalityLecture(id){
  return new Promise((resolve, reject) => {
    fetch(baseURL + "/teacher/changemodality", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lectureId: id }),
    })
        .then((response) => {
          if (response.ok) {
            response.json().then((res) => {
              resolve(res);
            });
          } else {
            // analyze the cause of error
            response
                .json()
                .then((obj) => {
                  obj["status"] = response.status;
                  reject(obj);
                }) // error msg in the response body
                .catch((err) => {
                  reject({
                   parseErr
                  });
                }); // something else
          }
        })
        .catch((err) => {
          reject({ commErr });
        }); // connection errors
  });
}

async function getLogs(){
  let url = "/manager/logs";
  const response = await fetch(baseURL + url);
  const logs = await response.json();
  if (response.ok) {
    console.log(logs)
    return logs;
  } else {
    let err = { status: response.status, errObj: logs};
    throw err;
  }
}

const API = {
  Login,
  getLectures,
  getUser,
  userLogout,
  bookLeacture,
  getStudentListByLectureId,
  getLecturesTeacher,
  deleteLectureByTeacher,
  cancelBookingByStudent,
  changeModalityLecture,
  getLogs
};
export default API;
