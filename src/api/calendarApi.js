import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL } = getEnvVariables();

//? Para evitar especificar a cada rato el api
const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

//? interceptores
calendarApi.interceptors.request.use(config => {

    //?Le coloca este header a cualquer peticion que se haga en el api
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token'),
    }

    return config;
})

export default calendarApi;