import axios from "axios";

const api = axios.create({
  baseURL: "https://tindev-backend-ciouxlzlzj.now.sh"
});

export default api;
