import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { setPageTitle } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation(["profile"])

    useEffect(() => {
        dispatch(setPageTitle(t("profile:title")));
    }, []); 

    return (
        <div>
            <h1>{t('profile:title')}</h1>
        </div>
    );
};

export default ProfilePage;
