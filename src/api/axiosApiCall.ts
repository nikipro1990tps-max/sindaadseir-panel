import { MyToast } from "../components/Elements/MyToast";
import axiosInstance from "./axiosConfig";

let abortController: any;


const axiosApiCall = {

    async get(url: string, filters = {}) {


        if (!abortController) {
            abortController = new AbortController()
        }

        try {
            const response = await axiosInstance.get(url, {
                params: filters,
                signal: abortController.signal,

            })
            return response.data.result
        } catch (error) {
            MyToast.error(error)
            throw error
        }

    },


    async post(url: string, body = {}) {
        try {
            const response = await axiosInstance.post(url, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data.result
        } catch (error) {
            MyToast.error(error)
            throw error
        }
    },

    async postFormData(url: string, formData: FormData) {
        try {
            const response = await axiosInstance.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
       
            return response.data.result
        } catch (error) {
            MyToast.error(error)
            throw error
        }
    },

    async patch(url: string, body = {}) {
        try {
            const response = await axiosInstance.patch(url, body)

            return response.data.result
        } catch (error) {
            MyToast.error(error)
            throw error
        }
    },

    async put(url: string, body = {}) {
        try {
            const response = await axiosInstance.put(url, body)
            return response.data.result
        } catch (error) {
            MyToast.error(error)
            throw error
        }
    },

    async delete(url: string) {
        try {
            const response = await axiosInstance.delete(url)
            return response.data.result
        } catch (error) {
            MyToast.error(error)
            throw error
        }
    }
}

export default axiosApiCall