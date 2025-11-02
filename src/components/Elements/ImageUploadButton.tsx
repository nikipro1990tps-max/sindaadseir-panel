import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageUploadButtonProps {
    onImageSelect: (file: File | null, imageSrc: string | null) => void;
    accept?: string;
    multiple?: boolean;
    children?: React.ReactNode;
    className?: string;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
    onImageSelect,
    accept = "image/*",
    multiple = false,
    children = null,
    className = ""
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { t } = useTranslation()

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (file) {
            // بررسی اینکه فایل انتخاب شده واقعاً عکس است
            if (!file.type.startsWith('image/')) {
                alert('لطفاً یک فایل تصویر معتبر انتخاب کنید');
                onImageSelect(null, null);
                return;
            }

            // ایجاد URL برای نمایش در تگ img
            const imageSrc = URL.createObjectURL(file);

            // فراخوانی callback با فایل و آدرس تصویر
            onImageSelect(file, imageSrc);
        } else {
            // اگر فایلی انتخاب نشده باشد
            onImageSelect(null, null);
        }

        // ریست کردن input برای امکان انتخاب همان فایل مجدداً
        event.target.value = '';
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
                style={{ display: 'none' }}
            />

            <button
                type="button"
                onClick={handleButtonClick}
                className={`bg-success rounded p-2 text-white  ${className}`}
            >
                {children || t("select_photo")}
            </button>
        </>
    );
};

export default ImageUploadButton;