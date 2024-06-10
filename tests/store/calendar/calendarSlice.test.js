import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en calendarSlice', () => {

    test('Debe de regresar el estado por defecto', () => {

        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);

    });

    test('onSetActiveEvent debe activar el evento', () => {

        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        // console.log(state);
        // console.log(calendarWithEventsState);

        expect(state.activeEvent).toEqual(events[0]);

    });

    test('onAddNewEvent debe de agregar el evento', () => {

        const newEvent = {
            id: '3',
            start: new Date('2022-11-21 13:00:00'),
            end: new Date('2022-11-22 17:00:00'),
            title: 'Felicitar al jefe',
            notes: 'llevar una tarjeta',
        };

        const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));
        // console.log(state);
        expect(state.events).toEqual([...events, newEvent])//? Evalua si se agrego el evento, esparciendo los eventos originales y poniendo el nuevo.
    });

    test('onUpdateEvent debe de actualizar el evento', () => {

        const updatedEvent = {
            id: '1',
            start: new Date('2022-11-21 13:00:00'),
            end: new Date('2022-11-22 17:00:00'),
            title: 'Felicitar al jefe',
            notes: 'llevar una tarjeta',
        };

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent));
        // console.log(state);
        expect(state.events).toContain(updatedEvent);
    });

    test('onDeleteEvent debe borrar el evento activo', () => {
        //CalendarEventWithActiveEventState
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
        // console.log(state);
        expect(state.activeEvent).toBe(null);
        expect(state.events).not.toContain(events[0]);
    });

    test('onLoadEvents debe de establecer los eventos', () => {
        //initialState
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toEqual(events);
    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
        //CalendarEventWithActiveEventState
        const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
        expect(state).toEqual(initialState);
    })

});