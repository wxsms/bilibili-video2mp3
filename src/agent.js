import axios from 'axios';
import axiosRetry from 'axios-retry';

const agent = axios.create();
axiosRetry(agent, { retries: 3 });

export default agent;
