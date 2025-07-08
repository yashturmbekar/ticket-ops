import React from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { useNotifications } from "../../../hooks/useNotifications";
import { Button } from "../Button";
import type { Notification } from "../../../contexts/NotificationContext";
import "./NotificationContainer.css";

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <FaCheckCircle className="notification-icon" />;
      case "error":
        return <FaExclamationCircle className="notification-icon" />;
      case "warning":
        return <FaExclamationTriangle className="notification-icon" />;
      case "info":
        return <FaInfoCircle className="notification-icon" />;
      default:
        return <FaInfoCircle className="notification-icon" />;
    }
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <div className="notification-header">
          <div className="notification-title-wrapper">
            {getIcon()}
            <h4 className="notification-title">{notification.title}</h4>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(notification.id)}
            className="notification-close"
            aria-label="Close notification"
          >
            <FaTimes />
          </Button>
        </div>

        {notification.message && (
          <p className="notification-message">{notification.message}</p>
        )}

        {notification.action && (
          <div className="notification-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={notification.action.onClick}
            >
              {notification.action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};
