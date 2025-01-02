import axiosInstance from '@/utils/axios';

const deleteRedisData = async () => {
    try {
        const response = await axiosInstance.delete(`/api/v1/redis`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { deleteRedisData };
