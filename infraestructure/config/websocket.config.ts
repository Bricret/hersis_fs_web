export const WEBSOCKET_CONFIG = {
  // URL del servidor WebSocket
  SERVER_URL:
    process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
    "http://localhost:3000/notifications",

  // Configuración de reconexión
  RECONNECTION: {
    ENABLED: true,
    MAX_ATTEMPTS: 5,
    DELAY: 1000, // ms
    MAX_DELAY: 30000, // ms
  },

  // Configuración de heartbeat
  HEARTBEAT: {
    ENABLED: true,
    INTERVAL: 30000, // ms
    TIMEOUT: 10000, // ms
  },

  // Configuración de eventos
  EVENTS: {
    NOTIFICATION: "notification",
    CONNECT: "connect",
    CONNECT_ERROR: "connect_error",
    DISCONNECT: "disconnect",
    ERROR: "error",
    RECONNECT: "reconnect",
  },

  // Configuración de autenticación
  AUTH: {
    TOKEN_HEADER: "token",
    TIMEOUT: 10000, // ms
  },
};
