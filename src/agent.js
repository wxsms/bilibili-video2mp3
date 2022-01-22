import axios from 'axios';

const agent = axios.create({ timeout: 0 });

export default agent;
