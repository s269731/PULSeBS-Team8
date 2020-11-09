/*import axios from "axios";
//注册接口

export const Login = async (params) => {
    return axios.post("/api/login ",
        {
            params
        }).then(res => {
            return res;
        }).catch(err => {
            return err
        })
}*/
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
const API = {Login} ;
export default API;