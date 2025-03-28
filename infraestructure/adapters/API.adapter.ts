import { axiosAdapter } from "./http/axios.adapter";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_LOCAL_URL;

if (!API_URL) {
  throw new Error(
    "La URL de la API no está configurada. Por favor, configure NEXT_PUBLIC_API_URL o API_LOCAL_URL en su archivo .env"
  );
}

console.log("Conectando a la API en:", API_URL);

export const APIFetcher = new axiosAdapter({
  baseUrl: API_URL,
});
