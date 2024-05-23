import { configureStore } from "@reduxjs/toolkit";
import { authSlice, calendarSlice, uiSlice } from "./";

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        calendar: calendarSlice.reducer,
        auth: authSlice.reducer,
    },
    //Para no revisar si las fechas en ._id se pueden serializar
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})