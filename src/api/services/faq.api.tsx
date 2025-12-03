import axiosApiCall from "../axiosApiCall";

// سرویس‌های خاص
export const faqApiService = {

    /**
     * faq sections services
     */

    async sections(filters = {}) {
        return await axiosApiCall.get('/faq/admin/section', filters)
    },

    async showSection(sectionId: number) {
        return await axiosApiCall.get(`/faq/admin/section/${sectionId}`)
    },

    async createSection(body = {}) {
        return await axiosApiCall.post('/faq/admin/section', body)
    },

    async updateSection(sectionId: number, body = {}) {
        return await axiosApiCall.put(`/faq/admin/section/${sectionId}`, body)
    },

    async deleteSection(sectionId: number) {
        return await axiosApiCall.delete(`/faq/admin/section/${sectionId}`)
    },


    /**
     * faq secives
     * 
     */

    async list(filters = {}) {
        return await axiosApiCall.get('/faq/admin', filters)
    },

    async show(faqId: number) {
        return await axiosApiCall.get(`/faq/admin/${faqId}`)
    },


    async create(body = {}) {

        return await axiosApiCall.post("/faq/admin", body)

    },

    async update(faqId: number, body: {}) {

        return await axiosApiCall.put(`/faq/admin/${faqId}`, body)

    },

    async delete(faqId: number) {
        return await axiosApiCall.delete(`/faq/admin/${faqId}`)
    }


}