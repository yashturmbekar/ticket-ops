import React, { useState } from "react";

const NetworkPage: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const networkStats = [
    { label: "Total Devices", value: 47, status: "healthy" },
    { label: "Online", value: 42, status: "success" },
    { label: "Offline", value: 3, status: "warning" },
    { label: "Critical", value: 2, status: "danger" },
  ];

  const devices = [
    {
      id: "1",
      name: "Main Server",
      type: "server",
      ip: "192.168.1.100",
      status: "online",
      location: "Data Center",
      uptime: 99.9,
      responseTime: 12,
      bandwidth: { used: 45, total: 100 },
    },
    {
      id: "2",
      name: "Router-01",
      type: "router",
      ip: "192.168.1.1",
      status: "online",
      location: "Network Room",
      uptime: 99.5,
      responseTime: 8,
      bandwidth: { used: 78, total: 1000 },
    },
    {
      id: "3",
      name: "Switch-Floor2",
      type: "switch",
      ip: "192.168.2.10",
      status: "warning",
      location: "Floor 2",
      uptime: 95.2,
      responseTime: 45,
      bandwidth: { used: 23, total: 100 },
    },
    {
      id: "4",
      name: "Firewall-Main",
      type: "firewall",
      ip: "192.168.1.2",
      status: "online",
      location: "Network Room",
      uptime: 99.8,
      responseTime: 15,
      bandwidth: { used: 34, total: 1000 },
    },
    {
      id: "5",
      name: "Printer-HR",
      type: "printer",
      ip: "192.168.3.45",
      status: "offline",
      location: "HR Department",
      uptime: 0,
      responseTime: 0,
      bandwidth: { used: 0, total: 10 },
    },
  ];

  const alerts = [
    {
      id: "1",
      device: "Switch-Floor2",
      type: "warning",
      message: "High response time detected",
      timestamp: new Date(),
      resolved: false,
    },
    {
      id: "2",
      device: "Printer-HR",
      type: "critical",
      message: "Device unreachable",
      timestamp: new Date(),
      resolved: false,
    },
    {
      id: "3",
      device: "Router-01",
      type: "info",
      message: "Firmware update available",
      timestamp: new Date(),
      resolved: true,
    },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#10b981";
      case "offline":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "server":
        return "🖥️";
      case "router":
        return "📡";
      case "switch":
        return "🔌";
      case "firewall":
        return "🛡️";
      case "printer":
        return "🖨️";
      case "computer":
        return "💻";
      default:
        return "📱";
    }
  };

  return (
    <div className="compact-page">
      {/* Header */}
      <div className="compact-header">
        <h1>Network Monitoring</h1>
        <div className="actions-container">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="compact-select"
          >
            <option value="all">All Devices</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="warning">Warning</option>
          </select>
          <button
            className="compact-btn compact-btn-primary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="compact-btn compact-btn-secondary">
            Add Device
          </button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="compact-grid compact-grid-4">
        {networkStats.map((stat, index) => (
          <div key={index} className="compact-card">
            <div className="compact-stats-header">
              <h3>{stat.label}</h3>
              <span
                className={`compact-status compact-status-${stat.status}`}
              ></span>
            </div>
            <div className="compact-stats-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Devices and Alerts */}
      <div className="compact-grid compact-grid-2">
        <div className="compact-card">
          <h3>Network Devices</h3>
          <div className="compact-table-container">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>IP</th>
                  <th>Status</th>
                  <th>Uptime</th>
                  <th>Response</th>
                  <th>Bandwidth</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id}>
                    <td>
                      <div className="compact-device-info">
                        <span className="compact-device-icon">
                          {getTypeIcon(device.type)}
                        </span>
                        <div>
                          <div className="compact-device-name">
                            {device.name}
                          </div>
                          <div className="compact-device-location">
                            {device.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{device.ip}</td>
                    <td>
                      <span
                        className="compact-status-dot"
                        style={{ color: getStatusColor(device.status) }}
                      >
                        ● {device.status}
                      </span>
                    </td>
                    <td>{device.uptime}%</td>
                    <td>{device.responseTime}ms</td>
                    <td>
                      <div className="compact-bandwidth">
                        <div className="compact-bandwidth-bar">
                          <div
                            className="compact-bandwidth-fill"
                            style={{
                              width: `${
                                (device.bandwidth.used /
                                  device.bandwidth.total) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="compact-bandwidth-text">
                          {device.bandwidth.used}/{device.bandwidth.total} Mbps
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="compact-card">
          <h3>Network Alerts</h3>
          <div className="compact-alerts">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`compact-alert compact-alert-${alert.type}`}
              >
                <div className="compact-alert-header">
                  <span className="compact-alert-device">{alert.device}</span>
                  <span className="compact-alert-time">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="compact-alert-message">{alert.message}</div>
                {!alert.resolved && (
                  <div className="compact-alert-actions">
                    <button className="compact-btn compact-btn-sm compact-btn-primary">
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Topology */}
      <div className="compact-card">
        <h3>Network Topology</h3>
        <div className="compact-topology">
          <div className="compact-topology-node compact-topology-router">
            <div className="compact-topology-icon">📡</div>
            <div className="compact-topology-label">Router-01</div>
          </div>
          <div className="compact-topology-connections">
            <div className="compact-topology-line"></div>
            <div className="compact-topology-line"></div>
            <div className="compact-topology-line"></div>
          </div>
          <div className="compact-topology-devices">
            <div className="compact-topology-node compact-topology-server">
              <div className="compact-topology-icon">🖥️</div>
              <div className="compact-topology-label">Main Server</div>
            </div>
            <div className="compact-topology-node compact-topology-switch">
              <div className="compact-topology-icon">🔌</div>
              <div className="compact-topology-label">Switch-Floor2</div>
            </div>
            <div className="compact-topology-node compact-topology-firewall">
              <div className="compact-topology-icon">🛡️</div>
              <div className="compact-topology-label">Firewall-Main</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { NetworkPage };
export default NetworkPage;
