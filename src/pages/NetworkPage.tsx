import React, { useState, useEffect } from "react";
import { PageLayout } from "../components/common/PageLayout";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import "../styles/network.css";

interface NetworkDevice {
  id: string;
  name: string;
  type: "server" | "router" | "switch" | "firewall" | "printer" | "computer";
  ip: string;
  status: "online" | "offline" | "warning";
  location: string;
  lastSeen: Date;
  uptime: number;
  responseTime: number;
  bandwidth?: {
    used: number;
    total: number;
  };
}

interface NetworkAlert {
  id: string;
  device: string;
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const NetworkPage: React.FC = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [alerts, setAlerts] = useState<NetworkAlert[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(
    null
  );
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockDevices: NetworkDevice[] = [
      {
        id: "1",
        name: "Main Server",
        type: "server",
        ip: "192.168.1.100",
        status: "online",
        location: "Data Center",
        lastSeen: new Date(Date.now() - 2 * 60 * 1000),
        uptime: 99.8,
        responseTime: 12,
        bandwidth: { used: 450, total: 1000 },
      },
      {
        id: "2",
        name: "Core Router",
        type: "router",
        ip: "192.168.1.1",
        status: "online",
        location: "Network Room",
        lastSeen: new Date(Date.now() - 1 * 60 * 1000),
        uptime: 99.9,
        responseTime: 8,
        bandwidth: { used: 680, total: 1000 },
      },
      {
        id: "3",
        name: "Floor 2 Switch",
        type: "switch",
        ip: "192.168.2.1",
        status: "warning",
        location: "Floor 2",
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
        uptime: 97.2,
        responseTime: 45,
        bandwidth: { used: 320, total: 1000 },
      },
      {
        id: "4",
        name: "Firewall",
        type: "firewall",
        ip: "192.168.1.2",
        status: "online",
        location: "Data Center",
        lastSeen: new Date(Date.now() - 30 * 1000),
        uptime: 99.5,
        responseTime: 15,
      },
      {
        id: "5",
        name: "Marketing Printer",
        type: "printer",
        ip: "192.168.3.45",
        status: "offline",
        location: "Marketing Dept",
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        uptime: 85.3,
        responseTime: 0,
      },
      {
        id: "6",
        name: "John's Workstation",
        type: "computer",
        ip: "192.168.1.150",
        status: "online",
        location: "IT Department",
        lastSeen: new Date(Date.now() - 30 * 1000),
        uptime: 94.1,
        responseTime: 25,
      },
    ];

    const mockAlerts: NetworkAlert[] = [
      {
        id: "1",
        device: "Floor 2 Switch",
        type: "warning",
        message: "High response time detected (45ms)",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        resolved: false,
      },
      {
        id: "2",
        device: "Marketing Printer",
        type: "critical",
        message: "Device offline for 2 hours",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved: false,
      },
      {
        id: "3",
        device: "Core Router",
        type: "info",
        message: "Firmware update completed successfully",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        resolved: true,
      },
    ];

    setDevices(mockDevices);
    setAlerts(mockAlerts);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getDeviceIcon = (type: NetworkDevice["type"]) => {
    const icons = {
      server: "🖥️",
      router: "📡",
      switch: "🔌",
      firewall: "🛡️",
      printer: "🖨️",
      computer: "💻",
    };
    return icons[type];
  };

  const getStatusColor = (status: NetworkDevice["status"]) => {
    const colors = {
      online: "var(--color-success)",
      offline: "var(--color-error)",
      warning: "var(--color-warning)",
    };
    return colors[status];
  };

  const getAlertColor = (type: NetworkAlert["type"]) => {
    const colors = {
      critical: "var(--color-error)",
      warning: "var(--color-warning)",
      info: "var(--color-info)",
    };
    return colors[type];
  };

  const filteredDevices = devices.filter((device) => {
    if (filter === "all") return true;
    return device.status === filter;
  });

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`;
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  const renderNetworkOverview = () => {
    const onlineDevices = devices.filter((d) => d.status === "online").length;
    const offlineDevices = devices.filter((d) => d.status === "offline").length;
    const warningDevices = devices.filter((d) => d.status === "warning").length;
    const criticalAlerts = alerts.filter(
      (a) => a.type === "critical" && !a.resolved
    ).length;

    return (
      <div className="network-overview">
        <Card className="overview-card">
          <div className="overview-stat">
            <div className="stat-icon online">✓</div>
            <div className="stat-info">
              <div className="stat-number">{onlineDevices}</div>
              <div className="stat-label">Online</div>
            </div>
          </div>
        </Card>
        <Card className="overview-card">
          <div className="overview-stat">
            <div className="stat-icon offline">✕</div>
            <div className="stat-info">
              <div className="stat-number">{offlineDevices}</div>
              <div className="stat-label">Offline</div>
            </div>
          </div>
        </Card>
        <Card className="overview-card">
          <div className="overview-stat">
            <div className="stat-icon warning">⚠</div>
            <div className="stat-info">
              <div className="stat-number">{warningDevices}</div>
              <div className="stat-label">Warning</div>
            </div>
          </div>
        </Card>
        <Card className="overview-card">
          <div className="overview-stat">
            <div className="stat-icon critical">!</div>
            <div className="stat-info">
              <div className="stat-number">{criticalAlerts}</div>
              <div className="stat-label">Critical</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderDeviceCard = (device: NetworkDevice) => (
    <Card
      key={device.id}
      className={`device-card ${device.status}`}
      onClick={() => setSelectedDevice(device)}
    >
      <div className="device-header">
        <div className="device-info">
          <div className="device-icon">{getDeviceIcon(device.type)}</div>
          <div className="device-details">
            <div className="device-name">{device.name}</div>
            <div className="device-type">
              {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
            </div>
          </div>
        </div>
        <div
          className="device-status"
          style={{ color: getStatusColor(device.status) }}
        >
          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
        </div>
      </div>
      <div className="device-metrics">
        <div className="metric">
          <span className="metric-label">IP:</span>
          <span className="metric-value">{device.ip}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Location:</span>
          <span className="metric-value">{device.location}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Uptime:</span>
          <span className="metric-value">{formatUptime(device.uptime)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Response:</span>
          <span className="metric-value">{device.responseTime}ms</span>
        </div>
        {device.bandwidth && (
          <div className="metric">
            <span className="metric-label">Bandwidth:</span>
            <div className="bandwidth-bar">
              <div
                className="bandwidth-used"
                style={{
                  width: `${
                    (device.bandwidth.used / device.bandwidth.total) * 100
                  }%`,
                }}
              />
              <span className="bandwidth-text">
                {device.bandwidth.used}/{device.bandwidth.total} Mbps
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="device-footer">
        <span className="last-seen">
          Last seen: {formatLastSeen(device.lastSeen)}
        </span>
      </div>
    </Card>
  );

  const renderAlerts = () => (
    <Card className="alerts-card">
      <div className="alerts-header">
        <h3>Recent Alerts</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="alerts-list">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={`alert-item ${alert.resolved ? "resolved" : ""}`}
          >
            <div
              className="alert-indicator"
              style={{ backgroundColor: getAlertColor(alert.type) }}
            />
            <div className="alert-content">
              <div className="alert-message">{alert.message}</div>
              <div className="alert-meta">
                <span className="alert-device">{alert.device}</span>
                <span className="alert-time">
                  {formatLastSeen(alert.timestamp)}
                </span>
              </div>
            </div>
            {!alert.resolved && (
              <Button variant="outline" size="sm">
                Resolve
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  const renderDeviceDetail = () => {
    if (!selectedDevice) return null;

    return (
      <div
        className="device-detail-overlay"
        onClick={() => setSelectedDevice(null)}
      >
        <div
          className="device-detail-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="detail-header">
            <h2>{selectedDevice.name}</h2>
            <button
              className="close-button"
              onClick={() => setSelectedDevice(null)}
            >
              ×
            </button>
          </div>
          <div className="detail-content">
            <div className="detail-section">
              <h3>Device Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedDevice.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">IP Address:</span>
                  <span className="detail-value">{selectedDevice.ip}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">
                    {selectedDevice.location}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span
                    className="detail-value"
                    style={{ color: getStatusColor(selectedDevice.status) }}
                  >
                    {selectedDevice.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Performance Metrics</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Uptime:</span>
                  <span className="detail-value">
                    {formatUptime(selectedDevice.uptime)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Response Time:</span>
                  <span className="detail-value">
                    {selectedDevice.responseTime}ms
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Seen:</span>
                  <span className="detail-value">
                    {formatLastSeen(selectedDevice.lastSeen)}
                  </span>
                </div>
              </div>
            </div>
            {selectedDevice.bandwidth && (
              <div className="detail-section">
                <h3>Bandwidth Usage</h3>
                <div className="bandwidth-detail">
                  <div className="bandwidth-bar large">
                    <div
                      className="bandwidth-used"
                      style={{
                        width: `${
                          (selectedDevice.bandwidth.used /
                            selectedDevice.bandwidth.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="bandwidth-stats">
                    <span>Used: {selectedDevice.bandwidth.used} Mbps</span>
                    <span>Total: {selectedDevice.bandwidth.total} Mbps</span>
                    <span>
                      Utilization:{" "}
                      {(
                        (selectedDevice.bandwidth.used /
                          selectedDevice.bandwidth.total) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="network-page">
        <div className="network-header">
          <div className="header-content">
            <h1>Network Monitoring</h1>
            <p>Real-time network device monitoring and management</p>
          </div>
          <div className="header-actions">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Devices</option>
              <option value="online">Online Only</option>
              <option value="offline">Offline Only</option>
              <option value="warning">Warning Only</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="primary" size="sm">
              Add Device
            </Button>
          </div>
        </div>

        {renderNetworkOverview()}

        <div className="network-content">
          <div className="devices-section">
            <h2>Network Devices ({filteredDevices.length})</h2>
            <div className="devices-grid">
              {filteredDevices.map(renderDeviceCard)}
            </div>
          </div>

          <div className="alerts-section">{renderAlerts()}</div>
        </div>

        {renderDeviceDetail()}
      </div>
    </PageLayout>
  );
};

export { NetworkPage };
