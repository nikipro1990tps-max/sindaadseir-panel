import { createSlice } from '@reduxjs/toolkit';
import appConfig from '../app.config';

const defaultState = {
    user: null
}

const initialState = {

    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : defaultState.user,
    isLogin: !!defaultState.user,

}

const appConfigSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {

        changeUserData(state, { payload }) {
            payload = payload || state.user; // full, boxed-layout
            localStorage.setItem('user', payload ? JSON.stringify(payload) : "");
            state.isLogin = !!payload
        },
    }

})

export const { setLogin, changeUserData } = appConfigSlice.actions;

export default appConfigSlice.reducer;