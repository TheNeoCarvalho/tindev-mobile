import axios from "axios";

const api = axios.create({
  baseURL: "https://tindev-backend-hekxjqtqkt.now.sh"
});

export default api;
