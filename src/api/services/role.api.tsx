import axiosApiCall from "../axiosApiCall";

// سرویس‌های خاص
export const rolehApiService = {

    async permissions() {
        return await axiosApiCall.get('/user/role/permissions')
    },

    async roles() {
        return await axiosApiCall.get('/user/role')
    },


    async create(body = {  }) {

        return await axiosApiCall.post("/user/role", body)

    },

    async update(roleId: number, body: {}) {

        return await axiosApiCall.put(`/user/role/${roleId}`, body)

    },

    async delete(roleId: number){
        return await axiosApiCall.delete(`/user/role/${roleId}`)
    }


}