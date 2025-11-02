import axiosApiCall from "../axiosApiCall";

// سرویس‌های خاص
export const mediaApiService = {


    async list(filters = {}) {
        return await axiosApiCall.get("/media/admin", filters)
    },

    async uploadFile(file: File) {
        const formData = new FormData()
        formData.append("file", file)
        return await axiosApiCall.postFormData('/media', formData)
    },



    async deleteFile(fileId: number) {

        return await axiosApiCall.delete(`/media/admin/${fileId}`)

    }


}