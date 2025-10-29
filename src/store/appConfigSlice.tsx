import { createSlice } from '@reduxjs/toolkit';
import appConfig from '../app.config';

const defaultState = {
    user: null
}

const initialState = {

    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : defaultState.user,
    isLogin: !!localStorage.getItem('user') && !!localStorage.getItem('token'),

}

const appConfigSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {

        setLogin(state, { payload }) {
            state.isLogin = payload
        },

        changeUserData(state, { payload }) {
            payload = payload || state.user; // full, boxed-layout
            localStorage.setItem('user', payload ? JSON.stringify(payload) : "");
            const hasToken = !!localStorage.getItem('token')
            state.user = payload
            state.isLogin = !!payload && hasToken
        },

        logout(state) {
            state.isLogin = false
            localStorage.removeItem("uesr")
            localStorage.removeItem("token")
        }
    }

})

export const { setLogin, changeUserData, logout } = appConfigSlice.actions;

export default appConfigSlice.reducer;