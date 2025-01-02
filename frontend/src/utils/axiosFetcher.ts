import axiosInstance from './axios';

const AxiosFetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

export default AxiosFetcher;
