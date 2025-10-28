import { Fragment, PropsWithChildren, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { IRootState } from '../store';
import { changeUserData, setLogin } from '../store/appConfigSlice';
import { authApiService } from '../api/services/auth.api';
import LoginPage from '../pages/LoginPage';
import { MyToast } from './Elements/MyToast';

const CheckLogin = ({ children }: PropsWithChildren) => {
    const isLogin = useSelector((state: IRootState) => state.appConfig.isLogin);
    const dispatch = useDispatch();
    const location = useLocation(); // Get current location

    const fetchCheckLogin = async () => {

        try {
            const response = await authApiService.checkLogin();

            if (response?.user) {
                dispatch(changeUserData(response.user));
                MyToast.success("hello");
            }

        } catch (error) {
            console.error('Login check failed:', error);
            // Clear any invalid tokens
            localStorage.removeItem('token');
            dispatch(changeUserData(null));
        }
    }

    // Check login on component mount and route changes
    useEffect(() => {
        fetchCheckLogin();
    }, [location.pathname]); // Add location.pathname as dependency

    return <div>{isLogin ? <>{children}</> : <LoginPage />}</div>;
};

export default CheckLogin;