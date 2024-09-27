import axios from "axios";

import { HOST } from "@/utils";

const apiClient = axios.create({
  baseURL: HOST,
});

export default apiClient;
