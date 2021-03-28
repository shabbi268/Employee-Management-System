import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://k2513388-default-rtdb.firebaseio.com/'
});

export default instance;