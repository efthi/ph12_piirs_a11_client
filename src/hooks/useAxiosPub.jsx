import axios from 'axios';

const axiosPub =axios.create({
  baseURL:import.meta.env.VITE_API_URL,
  
});

const useAxiosPub = () => {
  return axiosPub;
};

export default useAxiosPub;