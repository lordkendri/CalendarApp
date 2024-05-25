import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvent } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };


    const startSavingEvent = async (calendarEvent) => {

        try {
            if (calendarEvent.id) {
                //Actualizando
                const { data } = await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);

                dispatch(onUpdateEvent({ ...calendarEvent, user })); //! Se rompe la referencia con el spread entre {}
            } else {
                //Creando
                const { data } = await calendarApi.post('/events', calendarEvent);
                console.log(data)
                dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user })); //! Se rompe la referencia con el spread entre {}
            }
        } catch (error) {
            console.log('Error al actualizar nota');
            Swal.fire('Error al guardar', error.response.data?.msg, 'error');
        }

    };

    const startDeletingEvent = async () => {

        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            Swal.fire('Error al borrar', error.response.data?.msg, 'error');
        }

    };

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvent(data.eventos);
            dispatch(onLoadEvents(events));
        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error)
        }
    };

    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //?Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents,
    }
};