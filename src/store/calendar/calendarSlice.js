import { createSlice } from '@reduxjs/toolkit';

// import { addHours } from 'date-fns';

// const tempEvent = {
//     _id: new Date().getTime(),
//     title: 'Cumples',
//     notes: 'Hay que comprar bizcocho',
//     start: new Date(),
//     end: addHours(new Date(), 2),
//     bgColor: '#fafafa',
//     user: {
//         _id: '123',
//         name: 'Kendri'
//     }
// };
export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoadingEvents: true,
        events: [
            // tempEvent
        ],
        activeEvent: null
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push(payload);
            state.activeEvent = null;
        },
        onUpdateEvent: (state, { payload }) => {
            state.events = state.events.map(event => {
                //?en caso de que el id guardado coincida con el id a editar entonces retornar el event
                if (event.id === payload.id) {
                    return payload;
                };
                return event;
            }
            );
        },
        onDeleteEvent: (state) => {
            //*Si existe una nota esta activa que ejecute la accion
            if (state.activeEvent) {
                state.events = state.events.filter(event => event.id !== state.activeEvent.id);
                state.activeEvent = null;
            }
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.isLoadingEvents = false;
            // state.events = payload;
            payload.forEach(event => {
                const exist = state.events.some(dbEvent => dbEvent.id === event.id) //regresa un booleano si encuentra o no el evento
                if (!exist) {
                    state.events.push(event);
                };
            });
        },
        onLogoutCalendar: (state) => {
            state.isLoadingEvents = true;
            state.events = [];
            state.activeEvent = null;
        },
    }
});


export const {
    onSetActiveEvent,
    onAddNewEvent,
    onUpdateEvent,
    onLoadEvents,
    onDeleteEvent,
    onLogoutCalendar,
} = calendarSlice.actions;