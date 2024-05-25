//? Forma para evitar hacer thunks
import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        // console.log({ email, password });
        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/auth', { email, password });

            localStorage.setItem('token', data.token); //?token es igual a data.token
            localStorage.setItem('token-init-date', new Date().getTime()); //?Se puede ahorrar una peticion al backend o hacer calculos para volver a validar el token

            dispatch(onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'));

            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 50);
        };

    };

    const startRegister = async ({ name, email, password }) => {

        dispatch(onChecking());

        try {

            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            console.log({ error });
            dispatch(onLogout(error.response.data?.msg || '--'));
            dispatch(onLogout(error.response.data.errors.password?.msg || ''));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 50);
        }
    };

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    };

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogoutCalendar());
        dispatch(onLogout());
    }

    return {
        //*Propiedades
        status, user, errorMessage,

        //?Metodos
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }
};