import axios from "axios";
// Default config options
const defaultOptions = {};

// Update instance
const instance = axios.create(defaultOptions);

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error.response);
  }
);
export default instance;

export const createAPIRequest = (config: any) => instance(config);
