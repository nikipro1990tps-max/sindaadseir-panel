import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import themeConfig from './theme.config';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: themeConfig.locale || 'fa',
        debug: false,
        load: 'languageOnly',
        
        // فقط namespace پیش‌فرض را مشخص کنید
        defaultNS: 'common',
        
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        
        // این تنظیمات به i18next اجازه می‌دهد namespaces را به صورت داینامیک مدیریت کند
        ns: ['common'], // فقط common به صورت پیش‌فرض بارگذاری شود
        fallbackNS: 'common', // اگر namespace پیدا نشد از common استفاده کن
        
        // بارگذاری خودکار namespaces هنگام نیاز
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
            caches: ['cookie']
        }
    });

export default i18n;