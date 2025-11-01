import axiosApiCall from "../axiosApiCall";

// سرویس‌های خاص
export const userApiService = {
    async admins(filters = {}) {
        return await axiosApiCall.get('user/admin/admins', filters)
    },


    async users(filters = {}) {

        return await axiosApiCall.get("/user/admin", filters)

    },

    async showUser(userId: number) {

        return await axiosApiCall.get(`/user/admin/${userId}`)

    },


    async profile() {

        return await axiosApiCall.get(`/user/admin/profile`)

    },

    async createAdmin(body = {}) {

        return await axiosApiCall.post(`/user/admin/admin`, body)

    },

    async createUser(body = {}) {

        return await axiosApiCall.post(`/user/admin`, body)

    },

    async updateUser(userId: number, body = {}) {

        return await axiosApiCall.put(`/user/admin/${userId}`, body)

    },

    async updateProfile( body = {}) {

        return await axiosApiCall.put(`/user/admin/profile`,body)

    },


    async changePassword(userId: number, password: string) {

        return await axiosApiCall.patch(`/user/admin/password/${userId}`, { password })

    },



    async changeStatus(userId: number, status: string) {

        return await axiosApiCall.patch(`/user/admin/status/${userId}`, { status })

    },

    async assignRole(userId: number, roles: []) {

        return await axiosApiCall.patch(`/user/role/${userId}`, { roles })

    },

    async deleteUser(userId: number) {

        return await axiosApiCall.delete(`/user/admin/${userId}`)

    },


}