import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';

const AdminListPage = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation(["admin"])



 
    useEffect(() => {
        dispatch(setPageTitle(t("admin:adminList")));
    }, []);



    return (
        <div>
            <h1>{t("admin:adminList")}</h1>
        </div>
    );
};

export default AdminListPage;
