import { MyToast } from "../components/Elements/MyToast";
import axiosInstance from "./axiosConfig";
import { AxiosError, isCancel } from "axios";

let abortController: AbortController | null = null;

const axiosApiCall = {

    async get(url: string, filters = {}) {

        // لغو درخواست قبلی اگر وجود داشته باشد
        if (abortController) {
            abortController.abort();
            abortController = null;
        }

        // ایجاد کنترلر جدید برای درخواست فعلی
        abortController = new AbortController();

        try {
            const response = await axiosInstance.get(url, {
                params: filters,
                signal: abortController.signal,
            })
            return response.data.result
        } catch (error) {
            // بررسی اینکه آیا درخواست لغو شده است
            const isCanceled = 
                isCancel(error) ||
                (error instanceof AxiosError && error.code === 'ERR_CANCELED') ||
                (error instanceof AxiosError && error.name === 'CanceledError') ||
                (error instanceof AxiosError && error.message?.toLowerCase().includes('cancel'));
            
            // اگر درخواست لغو شده باشد، toast نمایش نده
            if (isCanceled) {
                // درخواست لغو شده است - خطا را throw کن اما toast نمایش نده
                throw error;
            }
            
            // برای سایر خطاها، toast نمایش بده
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