import { axiosAdapter } from "./http/axios.adapter";

const API_URL = process.env.API_URL;
const baseUrl = API_URL || "default_url"; // Proporcionar un valor predeterminado

export const APIFetcher = new axiosAdapter({
  baseUrl: baseUrl,
});
