import axiosApiCall from "../axiosApiCall";

// سرویس‌های خاص
export const authApiService = {
    async login(body: { identifier: string, password: string }) {
        return await axiosApiCall.post('/user/auth/admin/login', body)
    },


    async checkLogin() {

        return await axiosApiCall.post("/user/auth/admin")

    },


}