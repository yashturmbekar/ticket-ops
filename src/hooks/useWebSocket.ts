import { useEffect, useState } from "react";
import {
  on,
  off,
  send
} from "../services/websocketService";
import { useAuth } from "./useAuth";
import { useNotifications } from "./useNotifications";
import type { WebSocketEvent } from "../types";

export interface UseWebSocketOptions {
  onEvent?: (event: WebSocketEvent) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);
  const [eventHistory, setEventHistory] = useState<WebSocketEvent[]>([]);

  const { onEvent } = options;

  // Handle WebSocket events
  useEffect(() => {
    const handleTicketCreated = (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>;
      const event: WebSocketEvent = {
        id: Date.now().toString(),
        type: "ticket_created",
        data,
        timestamp: new Date(),
      };
      setLastEvent(event);
      setEventHistory((prev) => [...prev.slice(-99), event]);
      onEvent?.(event);
      const ticket = data.ticket as { id: string };
      addNotification({
        type: "info",
        title: "New Ticket",
        message: `Ticket #${ticket?.id || "Unknown"} has been created`,
        duration: 5000,
      });
    };
    const handleTicketAssigned = (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>;
      const event: WebSocketEvent = {
        id: Date.now().toString(),
        type: "ticket_assigned",
        data,
        timestamp: new Date(),
      };
      setLastEvent(event);
      setEventHistory((prev) => [...prev.slice(-99), event]);
      onEvent?.(event);
      const ticket = data.ticket as { id: string; assignedTo: string };
      if (ticket?.assignedTo === user?.id) {
        addNotification({
          type: "info",
          title: "Ticket Assigned",
          message: `You have been assigned ticket #${ticket?.id || "Unknown"}`,
          duration: 7000,
        });
      }
    };
    const handleTicketUpdated = (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>;
      const event: WebSocketEvent = {
        id: Date.now().toString(),
        type: "ticket_updated",
        data,
        timestamp: new Date(),
      };
      setLastEvent(event);
      setEventHistory((prev) => [...prev.slice(-99), event]);
      onEvent?.(event);
      const ticket = data.ticket as {
        id: string;
        assignedTo: string;
        createdBy: string;
      };
      if (ticket?.assignedTo === user?.id || ticket?.createdBy === user?.id) {
        addNotification({
          type: "info",
          title: "Ticket Updated",
          message: `Ticket #${ticket?.id || "Unknown"} has been updated`,
          duration: 5000,
        });
      }
    };
    const handleTicketResolved = (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>;
      const event: WebSocketEvent = {
        id: Date.now().toString(),
        type: "ticket_resolved",
        data,
        timestamp: new Date(),
      };
      setLastEvent(event);
      setEventHistory((prev) => [...prev.slice(-99), event]);
      onEvent?.(event);
      const ticket = data.ticket as { id: string; createdBy: string };
      if (ticket?.createdBy === user?.id) {
        addNotification({
          type: "success",
          title: "Ticket Resolved",
          message: `Your ticket #${ticket?.id || "Unknown"} has been resolved`,
          duration: 7000,
        });
      }
    };
    const handleSystemAlert = (...args: unknown[]) => {
      const data = args[0] as Record<string, unknown>;
      const event: WebSocketEvent = {
        id: Date.now().toString(),
        type: "system_alert",
        data,
        timestamp: new Date(),
      };
      setLastEvent(event);
      setEventHistory((prev) => [...prev.slice(-99), event]);
      onEvent?.(event);
      const alert = data as { severity: string; message: string };
      addNotification({
        type: alert.severity === "critical" ? "error" : "warning",
        title: "System Alert",
        message: alert.message || "System alert received",
        duration: 10000,
      });
    };
    on("TICKET_CREATED", handleTicketCreated);
    on("TICKET_ASSIGNED", handleTicketAssigned);
    on("TICKET_UPDATED", handleTicketUpdated);
    on("TICKET_RESOLVED", handleTicketResolved);
    on("SYSTEM_ALERT", handleSystemAlert);
    return () => {
      off("TICKET_CREATED", handleTicketCreated);
      off("TICKET_ASSIGNED", handleTicketAssigned);
      off("TICKET_UPDATED", handleTicketUpdated);
      off("TICKET_RESOLVED", handleTicketResolved);
      off("SYSTEM_ALERT", handleSystemAlert);
    };
  }, [user?.id, onEvent, addNotification]);

  // Send event
  const sendEvent = (type: string, data: Record<string, unknown>) => {
    send(type, data);
  };

  // Get events by type
  const getEventsByType = (eventType: string) => {
    return eventHistory.filter((event) => event.type === eventType);
  };

  // Get recent events
  const getRecentEvents = (limit: number = 10) => {
    return eventHistory.slice(-limit);
  };

  // Clear event history
  const clearEventHistory = () => {
    setEventHistory([]);
  };

  return {
    lastEvent,
    eventHistory,
    sendEvent,
    getEventsByType,
    getRecentEvents,
    clearEventHistory,
  };
};

export default useWebSocket;
