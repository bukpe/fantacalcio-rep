import axios from "axios";

const AxiosService = axios.create({
  baseURL: "http://localhost:3000/api", // Modifica l'URL base secondo le tue necessità
  timeout: 10000, // Timeout di 10 secondi
});

// Gestione globale degli errori
AxiosService.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestisci gli errori globalmente
    if (error.response) {
      // La richiesta è stata fatta e il server ha risposto con un codice di stato
      // che non è 2xx
      console.error(
        `API error: ${error.response.status} - ${error.response.data}`
      );
      // Invia un errore globale per l'applicazione
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La richiesta è stata fatta ma non c'è stata risposta
      console.error("API error: No response received", error.request);
      return Promise.reject("No response received from server.");
    } else {
      // Qualcosa è andato storto nella configurazione della richiesta
      console.error("API error: Request setup error", error.message);
      return Promise.reject("Error in request setup.");
    }
  }
);

export default AxiosService;
