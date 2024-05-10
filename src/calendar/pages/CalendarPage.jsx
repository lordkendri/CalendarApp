//Importaciones de react-big-calendar
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { localizer, getMessagesES } from '../../helpers';
import { useState } from 'react';

import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../';
import { useUiStore, useCalendarStore } from '../../hooks';



export const CalendarPage = () => {

    const { openDateModal } = useUiStore();
    const { events, setActiveEvent } = useCalendarStore();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

    const eventStyleGetter = (event, start, end, isSelected) => {
        // console.log(event, start, end, isSelected);

        const style = {
            backgroundColor: "#0f928c",
            borderRadious: '0px',
            opacity: 0.8,
            color: 'white',

        }

        return {
            style
        }
    };

    const onDoubleClick = (event) => {
        // console.log({ doubleClick: event });
        openDateModal();
    }
    const onSelect = (event) => {
        // console.log({ click: event });
        setActiveEvent(event);
    }

    //Si cambia la vista guardar en el evento la ultima vista
    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event)
    }
    return (
        <>
            <Navbar />

            <Calendar
                culture='es'
                localizer={localizer}
                defaultView={lastView}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />
            <CalendarModal />

            <FabAddNew />
            <FabDelete />
        </>
    )
}
