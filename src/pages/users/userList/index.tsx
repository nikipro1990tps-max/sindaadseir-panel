import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '../../../store/themeConfigSlice';

const UserListPage = () => {


    const dispatch = useDispatch()
    const { t } = useTranslation(["user"])

    useEffect(() => {
        dispatch(setPageTitle(t("user:usersList")));
    }, []);



    return (
        <div>
            <h1>{t("user:usersList")}</h1>
        </div>
    );
};

export default UserListPage;
