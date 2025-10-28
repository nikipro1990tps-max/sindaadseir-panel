import { MyToast } from "../../components/Elements/MyToast";
import axiosInstance from "../axiosConfig"

// سرویس‌های خاص
export const authApiService = {
    async login(body: { identifier: string, password: string }, signal: any = null) {

        try {
            const response = await axiosInstance.post('/user/auth/login/admin', body, signal);
            return response.data.result
        } catch (error) {
            // throw error
            MyToast.error(error)
        }
    },


    async checkLogin() {
        try {
            const response = await axiosInstance.get("/user/auth")
            return response.data?.result
        } catch (error) {
            MyToast.error(error)
            throw error
        }
    },


}