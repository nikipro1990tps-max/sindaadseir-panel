import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { setPageTitle } from '../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';

const Index = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()

    useEffect(() => {
        dispatch(setPageTitle(t("dashboard")));
    }, []);


    return (
        <div>
            <h1>starter page</h1>
        </div>
    );
};

export default Index;
