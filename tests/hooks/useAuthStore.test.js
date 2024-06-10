import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks";
import { Provider } from "react-redux";
import { authenticatedState, initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import calendarApi from "../../src/api/calendarApi";

describe('Pruebas en useAuthStore', () => {

    //? Esta es una funcion que se manda a llamar para crear el store al que se le mandara un initialState
    getMockStore = (initialState) => {
        return configureStore({
            reducer: {
                auth: authSlice.reducer
            },
            preloadedState: {
                auth: { ...initialState }
            }
        })
    };

    beforeEach(() => localStorage.clear());  //? Por si alguna otra prueba gravo anteriormente el token o alguna informacion

    test('Debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({ ...authenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        // console.log(result);
        expect(result.current).toEqual({
            status: 'authenticated',
            user: {
                uid: 'abc',
                name: 'Kendri'
            },
            errorMessage: undefined,
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        })
    });

    test('startLogin debe de realizar el Login correctamente', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });


        await act(async () => { //? Es raro pero se manda una promesa al act y hay que esperar que esa promesa termine o sea el act
            await result.current.startLogin(testUserCredentials);
        });
        // console.log(result.current);

        const { status, user, errorMessage } = result.current;
        expect({ status, user, errorMessage }).toEqual({
            status: 'authenticated',
            user: { name: 'testUser', uid: '665ba179413b7a2b1353ada3' },
            errorMessage: undefined,
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

    });

    test('startLogin debe de fallar la authenticacion', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => { //? Es raro pero se manda una promesa al act y hay que esperar que esa promesa termine o sea el act
            await result.current.startLogin({ email: 'algo@google.com', password: 'cosas' });
        });

        const { status, user, errorMessage } = result.current;
        expect({ status, user, errorMessage }).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Credenciales incorrectas'
        });

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );

        expect(localStorage.getItem('token')).not.toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).not.toEqual(expect.any(String));

    });

    test('starRegister debe de crear un usuario', async () => {

        const newUser = { email: 'algo@google.com', password: 'cosas', name: 'testuser2' };

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: 'ALGUN-ID',
                name: 'Test User',
                token: 'ALGUN-TOKEN',

            }
        }); //? se hace un mock parcial, en este caso evita que el usuario se grabe en la base de datos y nos de la respuesta esperada

        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: 'ALGUN-ID' }
        });

        spy.mockRestore(); //! Esto se usa cada vez que se utilice un spy dentro de un test

    });

    test('starRegister debe fallar la creacion', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startRegister(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario existe con ese correo',
            status: 'not-authenticated',
            user: {}
        });

    });

    test('checkAuthToken debe fallar si no hay token', async () => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        // console.log('token: ', localStorage.getItem('token'));

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({

            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });

    });

    test('checkAuthToken debe de autenticar el usuario si hay un token', async () => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        // console.log('token: ', localStorage.getItem('token'));

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        console.log({ errorMessage, status, user });

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'testUser', uid: '665ba179413b7a2b1353ada3' }
        });

    });


});