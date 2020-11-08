import axios from "axios";
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
}