import { toast } from "react-toastify"

export const MyToast = {

    success(message: string) {
        toast.success(message, {
            theme: "colored"
        })
    },


    
    info(message: string) {
        toast.info(message, {
            theme: "colored"
        })
    },

    error(errorValue: any) {
        let message = "unknown error";
    
        // بررسی اگر errorValue یک رشته باشد
        if (typeof errorValue === 'string') {
            message = errorValue;
        } else if (errorValue?.response?.data) {
            const error = errorValue.response.data;
    
            if (typeof error === "string") {
                message = error;
            } else if (error.message) {
                if (typeof error.message === "string") {
                    message = error.message;
                } else if (Array.isArray(error.message) && error.message[0] ) {
                    message = error.message.join(",\n");
                } else if (error.name) {
                    message = error.name;
                }
            }
        }
    
        // نمایش پیام خطا با استفاده از toast
        toast.error(message, {
            theme: "colored"
        });
    }
}