import axios from 'axios';
import { url } from '../globalParams';

const makePayment = async (data) => {
    try {
        let response = await axios.post(`${url}/payment/make-payment`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

export {makePayment};