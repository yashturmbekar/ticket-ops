// Minimal WebSocket service, refactored for clarity

let socket: WebSocket | null = null;
const listeners: Record<string, Set<(...args: unknown[]) => void>> = {};

export function connect(url: string) {
  if (socket) disconnect();
  socket = new WebSocket(url);
  socket.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);
    if (listeners[type]) {
      listeners[type].forEach((cb) => cb(data));
    }
  };
}

export function disconnect() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function send(type: string, data: unknown) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, data }));
  }
}

export function on(type: string, callback: (...args: unknown[]) => void) {
  if (!listeners[type]) listeners[type] = new Set();
  listeners[type].add(callback);
}

export function off(type: string, callback: (...args: unknown[]) => void) {
  if (listeners[type]) listeners[type].delete(callback);
}
