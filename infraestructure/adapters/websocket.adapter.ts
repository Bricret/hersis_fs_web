import { io, Socket } from "socket.io-client";
import { WEBSOCKET_CONFIG } from "@/infraestructure/config/websocket.config";

export interface WebSocketAdapter {
  connect(): Promise<void>;
  disconnect(): void;
  emit(event: string, data: any): void;
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
  isConnected(): boolean;
  reconnect(): Promise<void>;
}

export class SocketIOAdapter implements WebSocketAdapter {
  private socket: Socket | null = null;
  private url: string;
  private token: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number =
    WEBSOCKET_CONFIG.RECONNECTION.MAX_ATTEMPTS;
  private reconnectDelay: number = WEBSOCKET_CONFIG.RECONNECTION.DELAY;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.url, {
          auth: {
            Authorization: `Bearer ${this.token}`,
            userid: "7dcae87d-c05c-441f-8cc8-e845b4f5e4ad",
          },
          transports: ["websocket", "polling"],
          timeout: WEBSOCKET_CONFIG.AUTH.TIMEOUT,
          reconnection: WEBSOCKET_CONFIG.RECONNECTION.ENABLED,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: WEBSOCKET_CONFIG.RECONNECTION.MAX_DELAY,
        });

        this.socket.on(WEBSOCKET_CONFIG.EVENTS.CONNECT, () => {
          console.log("WebSocket conectado exitosamente");
          this.reconnectAttempts = 0;
          this.reconnectDelay = WEBSOCKET_CONFIG.RECONNECTION.DELAY;
          resolve();
        });

        this.socket.on(WEBSOCKET_CONFIG.EVENTS.CONNECT_ERROR, (error) => {
          console.error("Error de conexión WebSocket:", error);
          reject(error);
        });

        this.socket.on(WEBSOCKET_CONFIG.EVENTS.DISCONNECT, (reason) => {
          console.log("WebSocket desconectado:", reason);
          if (reason === "io server disconnect") {
            // El servidor desconectó, intentar reconectar
            this.socket?.connect();
          }
        });

        this.socket.on(WEBSOCKET_CONFIG.EVENTS.ERROR, (error) => {
          console.error("Error en WebSocket:", error);
        });

        this.socket.on(WEBSOCKET_CONFIG.EVENTS.RECONNECT, (attemptNumber) => {
          console.log(`WebSocket reconectado en el intento ${attemptNumber}`);
          this.reconnectAttempts = attemptNumber;
        });

        // Configurar heartbeat si está habilitado
        if (WEBSOCKET_CONFIG.HEARTBEAT.ENABLED) {
          this.setupHeartbeat();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupHeartbeat(): void {
    if (!this.socket) return;

    const heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit("ping");
      } else {
        clearInterval(heartbeatInterval);
      }
    }, WEBSOCKET_CONFIG.HEARTBEAT.INTERVAL);

    this.socket.on("pong", () => {
      // Heartbeat exitoso
    });

    this.socket.on("disconnect", () => {
      clearInterval(heartbeatInterval);
    });
  }

  async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      throw new Error("Se alcanzó el máximo de intentos de reconexión");
    }

    this.reconnectAttempts++;
    this.reconnectDelay = Math.min(
      this.reconnectDelay * 2,
      WEBSOCKET_CONFIG.RECONNECTION.MAX_DELAY
    );

    console.log(`Intentando reconectar... Intento ${this.reconnectAttempts}`);

    // Esperar antes de intentar reconectar
    await new Promise((resolve) => setTimeout(resolve, this.reconnectDelay));

    return this.connect();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
    this.reconnectDelay = WEBSOCKET_CONFIG.RECONNECTION.DELAY;
  }

  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("WebSocket no está conectado");
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  getMaxReconnectAttempts(): number {
    return this.maxReconnectAttempts;
  }
}
