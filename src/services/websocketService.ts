import { WS_EVENTS } from "../constants";

type WebSocketEventType = keyof typeof WS_EVENTS;

interface WebSocketMessage {
  type: WebSocketEventType;
  data: Record<string, unknown>;
  timestamp: Date;
}

interface WebSocketEventHandler {
  (data: Record<string, unknown>): void;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<WebSocketEventType, WebSocketEventHandler[]> =
    new Map();
  private isConnected = false;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.init();
  }

  private init() {
    this.connect();
  }

  private connect() {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.scheduleReconnect();
    }
  }

  private handleOpen() {
    console.log("WebSocket connected");
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Authenticate the connection
    this.authenticate();
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.emit(message.type, message.data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log("WebSocket disconnected:", event.code, event.reason);
    this.isConnected = false;

    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  private handleError(error: Event) {
    console.error("WebSocket error:", error);
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  private authenticate() {
    const token = localStorage.getItem("auth-token");
    if (token) {
      this.send("authenticate", { token });
    }
  }

  private emit(type: WebSocketEventType, data: Record<string, unknown>) {
    const handlers = this.eventHandlers.get(type) || [];
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in WebSocket event handler for ${type}:`, error);
      }
    });
  }

  // Public methods
  public on(event: WebSocketEventType, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off(event: WebSocketEventType, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  public send(type: string, data: Record<string, unknown>): void {
    if (this.isConnected && this.socket) {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, "Manual disconnect");
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Convenience methods for common events
  public onTicketCreated(
    handler: (ticket: Record<string, unknown>) => void
  ): void {
    this.on("TICKET_CREATED", handler);
  }

  public onTicketUpdated(
    handler: (ticket: Record<string, unknown>) => void
  ): void {
    this.on("TICKET_UPDATED", handler);
  }

  public onTicketAssigned(
    handler: (data: Record<string, unknown>) => void
  ): void {
    this.on("TICKET_ASSIGNED", handler);
  }

  public onTicketResolved(
    handler: (data: Record<string, unknown>) => void
  ): void {
    this.on("TICKET_RESOLVED", handler);
  }

  public onAssetUpdated(
    handler: (asset: Record<string, unknown>) => void
  ): void {
    this.on("ASSET_UPDATED", handler);
  }

  public onUserOnline(handler: (data: Record<string, unknown>) => void): void {
    this.on("USER_ONLINE", handler);
  }

  public onUserOffline(handler: (data: Record<string, unknown>) => void): void {
    this.on("USER_OFFLINE", handler);
  }

  public onNetworkAlert(
    handler: (alert: Record<string, unknown>) => void
  ): void {
    this.on("NETWORK_ALERT", handler);
  }

  public onSystemAlert(
    handler: (alert: Record<string, unknown>) => void
  ): void {
    this.on("SYSTEM_ALERT", handler);
  }
}

// Create singleton instance
const websocketService = new WebSocketService(
  import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3000"
);

export { websocketService, WebSocketService };
export type { WebSocketEventType, WebSocketMessage, WebSocketEventHandler };
