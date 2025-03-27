import { axiosAdapter } from "./http/axios.adapter";

const API_URL = process.env.API_LOCAL_URL;
const baseUrl = API_URL || "API_LOCAL_URL"; // Proporcionar un valor predeterminado
console.log("Conectando a la API en:", baseUrl);

export const APIFetcher = new axiosAdapter({
  baseUrl: baseUrl,
});
