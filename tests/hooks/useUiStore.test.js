import { act, renderHook } from "@testing-library/react";
import { useUiStore } from "../../src/hooks";
import { Provider } from "react-redux";
import { uiSlice } from "../../src/store";
import { configureStore } from "@reduxjs/toolkit";


//? Esta es una funcion que se manda a llamar para crear el store al que se le mandara un initialState
getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}

describe('Pruebas en useUiStore', () => {

    test('Debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({ isDateModalOpen: false }) //? De esta forma podemos verificar el store on cualquier tipo de condicion de forma controlada

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider> //? en este segundo argumento del renderHook se envuelve el hook en el provider con el store
        });
        // console.log(result.current);
        expect(result.current).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any(Function),
            openDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function),
        });
    });

    test('openDateModal debe retornar true en el isDataModalOpen', () => {

        const mockStore = getMockStore({ isDateModalOpen: false }) //? De esta forma podemos verificar el store on cualquier tipo de condicion de forma controlada

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider> //? en este segundo argumento del renderHook se envuelve el hook en el provider con el store
        });

        const { openDateModal } = result.current; //! Evitar tomar objetos primitivos para evitar falsos positivos o negativos

        act(() => {
            openDateModal();
        });

        // console.log({ result: result.current, isDateModalOpen })
        expect(result.current.isDateModalOpen).toBeTruthy();

    });

    test('closeDateModal debe retornar false en el isDataModalOpen', () => {

        const mockStore = getMockStore({ isDateModalOpen: true })

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        // const { closeDateModal } = result.current; //! Evitar tomar objetos primitivos para evitar falsos positivos o negativos

        act(() => {
            result.current.closeDateModal(); //?Se puede hacer de ambas maneras
        });

        // console.log({ result: result.current, isDateModalOpen })
        expect(result.current.isDateModalOpen).toBeFalsy();

    });
    test('toogleDateModal debe cambiar el estado true/false en el isDataModalOpen segun corresponda', () => {

        const mockStore = getMockStore({ isDateModalOpen: false })

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        // const { closeDateModal } = result.current; //! Evitar tomar objetos primitivos para evitar falsos positivos o negativos

        act(() => {
            result.current.toggleDateModal(); //?Se puede hacer de ambas maneras
        });

        // console.log({ result: result.current, isDateModalOpen })
        expect(result.current.isDateModalOpen).toBeTruthy();

        act(() => {
            result.current.toggleDateModal(); //?Se puede hacer de ambas maneras
        });

        expect(result.current.isDateModalOpen).toBeFalsy();
    });

});