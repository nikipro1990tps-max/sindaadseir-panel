import Swal from 'sweetalert2';
import { useEffect } from 'react';

interface InputAlertOptions {
    title?: string;
    text?: string;
    value?: string | null;
    inputPlaceholder?: string;
    inputLabel?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: 'warning' | 'success' | 'error' | 'info' | 'question';
    onConfirm?: (value: string) => void; // تغییر اینجا - مقدار اینپوت رو برگردون
    onCancel?: () => void;
}

const InputAlert = (props: InputAlertOptions) => {
    const {
        title = 'Enter value',
        text = "Please enter your input below:",
        confirmButtonText = 'Confirm',
        cancelButtonText = 'Cancel',
        icon = 'question',
        value = '',
        inputPlaceholder = 'Type something...',
        inputLabel = 'Input',
        onConfirm = () => { },
        onCancel = () => { },
    } = props;


    Swal.fire({
        icon,
        title,
        text,
        input: 'text', // اضافه کردن اینپوت
        inputValue: value || '', // مقدار پیش‌فرض
        inputPlaceholder,
        inputLabel,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        padding: '2em',
        buttonsStyling: true,
        customClass: {
            confirmButton: 'btn btn-primary cursor-pointer mx-1',
            cancelButton: 'btn btn-outline-primary cursor-pointer',
            input: '' // استایل برای اینپوت
        },
        preConfirm: (inputValue) => {
            // اعتبارسنجی اختیاری
            if (!inputValue) {
                Swal.showValidationMessage('Please enter a value');
                return false;
            }
            return inputValue;
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            onConfirm(result.value); // ارسال مقدار اینپوت
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            onCancel();
        }
    });



}

export default InputAlert;