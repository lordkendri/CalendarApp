export const events = [
    {
    id: '1',
    start: new Date('2022-10-21 13:00:00'),
    end: new Date('2022-10-21 15:00:00'),
    title: 'Cumplee de kendri',
    notes: 'Hay que comprar bizcocho',
},
{
    id: '2',
    start: new Date('2022-10-22 13:00:00'),
    end: new Date('2022-10-22 15:00:00'),
    title: 'Parcial',
    notes: 'Estuduar para un examen',
},];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
};
export const calendarWithEventsState = {
    isLoadingEvents: true,
    events: [...events],
    activeEvent: null
};
export const calendarWithActiveEventState = {
    isLoadingEvents: true,
    events: [...events],
    activeEvent: { ...events[0] }
};