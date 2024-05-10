import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector(state => state.calendar);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };


    const startSavingEvent = async (calendarEvent) => {
        //TODO: Llegar al backend

        //Todo: Todo bien
        if (calendarEvent._id) {
            //Actualizando
            dispatch(onUpdateEvent({ ...calendarEvent })); //! Se rompe la referencia con el spread entre {}
        } else {
            //Creando
            dispatch(onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() })); //! Se rompe la referencia con el spread entre {}
        }
    };

    const startDeletingEvent = () => {
        dispatch(onDeleteEvent());
    }

    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //?Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
    }
};