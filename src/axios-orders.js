import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-8661b.firebaseio.com/'
});

export default instance;