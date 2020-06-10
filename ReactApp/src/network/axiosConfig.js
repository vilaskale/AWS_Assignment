// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
    // .. where we make our configurations
    baseURL: 'https://wfg67sxv27.execute-api.ap-south-1.amazonaws.com',
    headers: {
        'Content-Type': 'application/json',
        // 'x-amzn-RequestId': '843d7140-4e0a-4119-8b91-a3c5d54daf7e',
        // 'x-amz-apigw-id': 'N6WcVHzhhcwFZ0g=',
        // 'X-Amzn-Trace-Id': 'Root=1-5ee0d11b-e75136ec5a62ce0ce84498dc;Sampled=0',
        // 'Content-Length': 78
    }
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// Also add/ configure interceptors && all the other cool stuff

// instance.interceptors.request...

export default instance;