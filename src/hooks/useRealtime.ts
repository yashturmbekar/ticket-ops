import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useNotifications } from "./useNotifications";
import { websocketService } from "../services/websocketService";
import type { Ticket } from "../types";

export interface RealtimeEvent {
  type:
    | "ticket_created"
    | "ticket_updated"
    | "ticket_assigned"
    | "ticket_resolved"
    | "ticket_closed"
    | "sla_breach"
    | "user_mentioned"
    | "system_alert";
  data: {
    ticket?: Ticket;
    user?: { id: string; name: string };
    message?: string;
    severity?: "info" | "warning" | "error" | "critical";
    [key: string]: unknown;
  };
  timestamp: Date;
  userId?: string;
}

export interface UseRealtimeOptions {
  onTicketUpdate?: (ticket: Ticket) => void;
  onTicketCreated?: (ticket: Ticket) => void;
  onTicketAssigned?: (ticket: Ticket) => void;
  onTicketResolved?: (ticket: Ticket) => void;
  onSlaBreach?: (ticket: Ticket) => void;
  showNotifications?: boolean;
}

export const useRealtime = (options: UseRealtimeOptions = {}) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [eventCount, setEventCount] = useState(0);

  const {
    onTicketUpdate,
    onTicketCreated,
    onTicketAssigned,
    onTicketResolved,
    onSlaBreach,
    showNotifications = true,
  } = options;

  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      setLastEvent(event);
      setEventCount((prev) => prev + 1);

      // Call specific handlers
      if (event.data.ticket) {
        switch (event.type) {
          case "ticket_created":
            onTicketCreated?.(event.data.ticket);
            break;
          case "ticket_updated":
            onTicketUpdate?.(event.data.ticket);
            break;
          case "ticket_assigned":
            onTicketAssigned?.(event.data.ticket);
            break;
          case "ticket_resolved":
            onTicketResolved?.(event.data.ticket);
            break;
          case "sla_breach":
            onSlaBreach?.(event.data.ticket);
            break;
        }
      }

      // Show notifications if enabled
      if (showNotifications) {
        switch (event.type) {
          case "ticket_created":
            addNotification({
              type: "info",
              title: "New Ticket",
              message: `Ticket #${event.data.ticket?.id} has been created`,
              duration: 5000,
            });
            break;

          case "ticket_assigned":
            if (event.data.ticket?.assignedTo === user?.id) {
              addNotification({
                type: "info",
                title: "Ticket Assigned",
                message: `You have been assigned ticket #${event.data.ticket?.id}`,
                duration: 7000,
              });
            }
            break;

          case "ticket_updated":
            if (
              event.data.ticket?.assignedTo === user?.id ||
              event.data.ticket?.createdBy === user?.id
            ) {
              addNotification({
                type: "info",
                title: "Ticket Updated",
                message: `Ticket #${event.data.ticket?.id} has been updated`,
                duration: 5000,
              });
            }
            break;

          case "ticket_resolved":
            if (event.data.ticket?.createdBy === user?.id) {
              addNotification({
                type: "success",
                title: "Ticket Resolved",
                message: `Your ticket #${event.data.ticket?.id} has been resolved`,
                duration: 7000,
              });
            }
            break;

          case "ticket_closed":
            if (event.data.ticket?.createdBy === user?.id) {
              addNotification({
                type: "success",
                title: "Ticket Closed",
                message: `Your ticket #${event.data.ticket?.id} has been closed`,
                duration: 7000,
              });
            }
            break;

          case "sla_breach":
            if (event.data.ticket?.assignedTo === user?.id) {
              addNotification({
                type: "warning",
                title: "SLA Breach",
                message: `Ticket #${event.data.ticket?.id} has breached its SLA`,
                duration: 10000,
              });
            }
            break;

          case "user_mentioned":
            if (event.userId === user?.id) {
              addNotification({
                type: "info",
                title: "You were mentioned",
                message: `You were mentioned in ticket #${event.data.ticket?.id}`,
                duration: 7000,
              });
            }
            break;

          case "system_alert":
            addNotification({
              type: event.data.severity === "critical" ? "error" : "warning",
              title: "System Alert",
              message: event.data.message as string,
              duration: 10000,
            });
            break;
        }
      }
    },
    [
      user?.id,
      onTicketUpdate,
      onTicketCreated,
      onTicketAssigned,
      onTicketResolved,
      onSlaBreach,
      showNotifications,
      addNotification,
    ]
  );

  // Simple connection state management
  useEffect(() => {
    if (user) {
      setIsConnected(true);

      // Subscribe to WebSocket events
      const handleTicketCreated = (data: Record<string, unknown>) => {
        handleRealtimeEvent({
          type: "ticket_created",
          data: { ticket: data as unknown as Ticket },
          timestamp: new Date(),
        });
      };

      const handleTicketUpdated = (data: Record<string, unknown>) => {
        handleRealtimeEvent({
          type: "ticket_updated",
          data: { ticket: data as unknown as Ticket },
          timestamp: new Date(),
        });
      };

      const handleTicketAssigned = (data: Record<string, unknown>) => {
        handleRealtimeEvent({
          type: "ticket_assigned",
          data: { ticket: data as unknown as Ticket },
          timestamp: new Date(),
        });
      };

      const handleTicketResolved = (data: Record<string, unknown>) => {
        handleRealtimeEvent({
          type: "ticket_resolved",
          data: { ticket: data as unknown as Ticket },
          timestamp: new Date(),
        });
      };

      const handleSystemAlert = (data: Record<string, unknown>) => {
        handleRealtimeEvent({
          type: "system_alert",
          data: data,
          timestamp: new Date(),
        });
      };

      const handleNetworkAlert = (data: Record<string, unknown>) => {
        handleRealtimeEvent({
          type: "system_alert",
          data: {
            message: data.message as string,
            severity: data.severity as
              | "info"
              | "warning"
              | "error"
              | "critical",
          },
          timestamp: new Date(),
        });
      };

      websocketService.on("TICKET_CREATED", handleTicketCreated);
      websocketService.on("TICKET_UPDATED", handleTicketUpdated);
      websocketService.on("TICKET_ASSIGNED", handleTicketAssigned);
      websocketService.on("TICKET_RESOLVED", handleTicketResolved);
      websocketService.on("SYSTEM_ALERT", handleSystemAlert);
      websocketService.on("NETWORK_ALERT", handleNetworkAlert);

      return () => {
        websocketService.off("TICKET_CREATED", handleTicketCreated);
        websocketService.off("TICKET_UPDATED", handleTicketUpdated);
        websocketService.off("TICKET_ASSIGNED", handleTicketAssigned);
        websocketService.off("TICKET_RESOLVED", handleTicketResolved);
        websocketService.off("SYSTEM_ALERT", handleSystemAlert);
        websocketService.off("NETWORK_ALERT", handleNetworkAlert);
      };
    }
  }, [user, handleRealtimeEvent]);

  // Simulate real-time events for demo purposes
  const simulateEvent = (
    type: RealtimeEvent["type"],
    data: RealtimeEvent["data"]
  ) => {
    handleRealtimeEvent({
      type,
      data,
      timestamp: new Date(),
    });
  };

  return {
    isConnected,
    lastEvent,
    eventCount,
    simulateEvent,
  };
};

export default useRealtime;
