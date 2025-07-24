import React, { useState, useRef, useEffect } from "react";
import "../styles/reports.css";

interface ReportFilter {
  period: string;
  reportType: string;
  department: string;
  priority: string;
  status: string;
}

interface MetricData {
  title: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "stable";
  color: string;
  icon: string;
  description: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
}

const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilter>({
    period: "month",
    reportType: "overview",
    department: "all",
    priority: "all",
    status: "all",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("tickets");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "info",
  });
  const reportRef = useRef<HTMLDivElement>(null);

  // Show notification popup
  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In a real app, this would fetch new data from the API
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  const metrics: MetricData[] = [
    {
      title: "Total Tickets",
      value: 1247,
      change: 12.5,
      trend: "up",
      color: "#ff5d5d",
      icon: "📋",
      description: "Total tickets created this period",
    },
    {
      title: "Resolved Tickets",
      value: 1089,
      change: 8.3,
      trend: "up",
      color: "#22c55e",
      icon: "✓",
      description: "Successfully resolved tickets",
    },
    {
      title: "Avg Resolution Time",
      value: "2.4h",
      change: -15.2,
      trend: "down",
      color: "#f59e0b",
      icon: "⏱",
      description: "Average time to resolve tickets",
    },
    {
      title: "Customer Satisfaction",
      value: "4.2/5",
      change: 5.8,
      trend: "up",
      color: "#6c7293",
      icon: "★",
      description: "Average customer satisfaction rating",
    },
    {
      title: "First Call Resolution",
      value: "78%",
      change: 3.2,
      trend: "up",
      color: "#3b82f6",
      icon: "🎯",
      description: "Tickets resolved on first contact",
    },
    {
      title: "SLA Compliance",
      value: "92%",
      change: -2.1,
      trend: "down",
      color: "#ef4444",
      icon: "📊",
      description: "Overall SLA compliance rate",
    },
  ];

  const chartData: ChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Created Tickets",
        data: [65, 78, 89, 95, 102, 115],
        color: "#ff5d5d",
      },
      {
        label: "Resolved Tickets",
        data: [59, 75, 85, 91, 98, 112],
        color: "#22c55e",
      },
    ],
  };

  const performanceData = [
    {
      name: "John Doe",
      tickets: 42,
      avgTime: "2.1h",
      rating: 4.8,
      efficiency: 95,
    },
    {
      name: "Jane Smith",
      tickets: 38,
      avgTime: "2.3h",
      rating: 4.6,
      efficiency: 92,
    },
    {
      name: "Mike Johnson",
      tickets: 35,
      avgTime: "2.7h",
      rating: 4.4,
      efficiency: 88,
    },
    {
      name: "Sarah Wilson",
      tickets: 33,
      avgTime: "2.9h",
      rating: 4.3,
      efficiency: 85,
    },
  ];

  const handleFilterChange = (key: keyof ReportFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    showNotification("Generating PDF report...", "info");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showNotification("PDF report exported successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showNotification("Export failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setIsLoading(true);
    showNotification("Generating Excel report...", "info");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showNotification("Excel report exported successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showNotification("Export failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-reports-page" ref={reportRef}>
      {/* Header Section */}
      <div className="reports-header-modern">
        <div className="header-content-modern">
          <div className="title-section">
            <h1>📊 Reports & Analytics</h1>
            <p>Comprehensive IT service management insights and metrics</p>
            <div className="update-status">
              <span className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button
                className={`realtime-toggle ${isRealTime ? "active" : ""}`}
                onClick={() => setIsRealTime(!isRealTime)}
              >
                {isRealTime ? "🔴 Live" : "⚪ Static"}
              </button>
            </div>
          </div>

          <div className="header-controls">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <span>▦</span> Grid
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <span>☰</span> List
              </button>
            </div>

            <div className="export-buttons">
              <button
                className="export-btn export-pdf"
                onClick={handleExportPDF}
                disabled={isLoading}
              >
                {isLoading ? "⏳" : "📄"} Export PDF
              </button>
              <button
                className="export-btn export-excel"
                onClick={handleExportExcel}
                disabled={isLoading}
              >
                {isLoading ? "⏳" : "📊"} Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>📅 Time Period</label>
            <select
              value={filters.period}
              onChange={(e) => handleFilterChange("period", e.target.value)}
              className="modern-select"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="filter-group">
            <label>📈 Report Type</label>
            <select
              value={filters.reportType}
              onChange={(e) => handleFilterChange("reportType", e.target.value)}
              className="modern-select"
            >
              <option value="overview">Overview</option>
              <option value="performance">Performance</option>
              <option value="sla">SLA Compliance</option>
              <option value="trends">Trends Analysis</option>
              <option value="customer">Customer Satisfaction</option>
            </select>
          </div>

          <div className="filter-group">
            <label>🏢 Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="modern-select"
            >
              <option value="all">All Departments</option>
              <option value="it">IT Support</option>
              <option value="hr">Human Resources</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
            </select>
          </div>

          <div className="filter-group">
            <label>⚡ Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="modern-select"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className={`metrics-grid ${viewMode === "list" ? "list-view" : ""}`}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`metric-card ${
              selectedMetric === metric.title.toLowerCase() ? "selected" : ""
            }`}
            onClick={() => setSelectedMetric(metric.title.toLowerCase())}
          >
            <div className="metric-header">
              <div
                className="metric-icon"
                style={{ backgroundColor: `${metric.color}20` }}
              >
                {metric.icon}
              </div>
              <div className="metric-trend">
                <span className={`trend-indicator ${metric.trend}`}>
                  {metric.trend === "up"
                    ? "📈"
                    : metric.trend === "down"
                    ? "📉"
                    : "➡️"}
                </span>
              </div>
            </div>

            <div className="metric-content">
              <h3>{metric.title}</h3>
              <div className="metric-value" style={{ color: metric.color }}>
                {metric.value}
              </div>
              <div className={`metric-change ${metric.trend}`}>
                {metric.change > 0 ? "+" : ""}
                {metric.change}%
              </div>
              <p className="metric-description">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Charts Section */}
      <div className="charts-section">
        <div className="chart-container main-chart">
          <div className="chart-header">
            <h3>📈 Ticket Trends Analysis</h3>
            <div className="chart-controls">
              <button className="chart-btn active">Line Chart</button>
              <button className="chart-btn">Bar Chart</button>
              <button className="chart-btn">Area Chart</button>
            </div>
          </div>

          <div className="chart-content">
            <div className="chart-visualization">
              {chartData.datasets.map((dataset, index) => (
                <div
                  key={index}
                  className="chart-line"
                  style={
                    { "--line-color": dataset.color } as React.CSSProperties
                  }
                >
                  <div className="line-label" style={{ color: dataset.color }}>
                    {dataset.label}
                  </div>
                  <div className="chart-bars">
                    {dataset.data.map((value, idx) => {
                      const maxValue = Math.max(...dataset.data);
                      const height = Math.max((value / maxValue) * 100, 10);
                      return (
                        <div key={idx} className="chart-bar-group">
                          <div
                            className="chart-bar"
                            style={{
                              height: `${height}%`,
                              backgroundColor: dataset.color,
                            }}
                            title={`${dataset.label}: ${value}`}
                          />
                          <span className="bar-label">
                            {chartData.labels[idx]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container side-chart">
          <h3>🎯 Resolution Time by Priority</h3>
          <div className="priority-chart">
            {[
              { label: "Critical", value: 2.1, color: "#ef4444", maxValue: 73 },
              { label: "High", value: 8.5, color: "#f59e0b", maxValue: 73 },
              { label: "Medium", value: 24.2, color: "#ff5d5d", maxValue: 73 },
              { label: "Low", value: 72.8, color: "#22c55e", maxValue: 73 },
            ].map((item, index) => (
              <div key={index} className="priority-bar">
                <div className="priority-info">
                  <span
                    className="priority-label"
                    style={{ color: item.color }}
                  >
                    {item.label}
                  </span>
                  <span className="priority-value">{item.value}h</span>
                </div>
                <div className="priority-track">
                  <div
                    className="priority-fill"
                    style={{
                      width: `${(item.value / item.maxValue) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="analytics-section">
        <div className="performance-table">
          <div className="table-header">
            <h3>🏆 Top Performers</h3>
            <div className="table-controls">
              <button className="sort-btn">Sort by Performance</button>
              <button className="filter-btn">Filter</button>
            </div>
          </div>

          <div className="modern-table">
            <table>
              <thead>
                <tr>
                  <th>Technician</th>
                  <th>Tickets Resolved</th>
                  <th>Avg Time</th>
                  <th>Rating</th>
                  <th>Efficiency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((performer, index) => (
                  <tr key={index} className="table-row">
                    <td>
                      <div className="performer-info">
                        <div className="avatar">
                          {performer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{performer.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ticket-count">{performer.tickets}</span>
                    </td>
                    <td>
                      <span className="time-value">{performer.avgTime}</span>
                    </td>
                    <td>
                      <div className="rating">
                        <span className="stars">
                          {"⭐".repeat(Math.floor(performer.rating))}
                        </span>
                        <span className="rating-value">{performer.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="efficiency-bar">
                        <div
                          className="efficiency-fill"
                          style={{ width: `${performer.efficiency}%` }}
                        />
                        <span className="efficiency-text">
                          {performer.efficiency}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <button className="action-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="category-analytics">
          <h3>📊 Issue Categories</h3>
          <div className="category-grid">
            {[
              {
                category: "Hardware",
                count: 156,
                percentage: 25,
                avgTime: 3.2,
                color: "#ef4444",
              },
              {
                category: "Software",
                count: 248,
                percentage: 40,
                avgTime: 1.8,
                color: "#3b82f6",
              },
              {
                category: "Network",
                count: 89,
                percentage: 14,
                avgTime: 4.5,
                color: "#f59e0b",
              },
              {
                category: "Access",
                count: 132,
                percentage: 21,
                avgTime: 0.9,
                color: "#10b981",
              },
            ].map((cat, index) => (
              <div key={index} className="category-card">
                <div className="category-header">
                  <h4 style={{ color: cat.color }}>{cat.category}</h4>
                  <span className="category-count">{cat.count}</span>
                </div>
                <div className="category-stats">
                  <div className="stat">
                    <span className="stat-label">Percentage</span>
                    <span className="stat-value">{cat.percentage}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg Time</span>
                    <span className="stat-value">{cat.avgTime}h</span>
                  </div>
                </div>
                <div className="category-progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Compliance Dashboard */}
      <div className="sla-section">
        <h3>📋 SLA Compliance Dashboard</h3>
        <div className="sla-grid">
          {[
            {
              label: "Response Time SLA",
              value: 92,
              target: 95,
              status: "warning",
              description: "First response within 4 hours",
            },
            {
              label: "Resolution Time SLA",
              value: 87,
              target: 90,
              status: "danger",
              description: "Resolution within 24 hours",
            },
            {
              label: "Customer Satisfaction SLA",
              value: 95,
              target: 90,
              status: "success",
              description: "Minimum 4.0/5.0 rating",
            },
          ].map((sla, index) => (
            <div key={index} className={`sla-card ${sla.status}`}>
              <div className="sla-header">
                <h4>{sla.label}</h4>
                <span className={`sla-status ${sla.status}`}>
                  {sla.status === "success"
                    ? "✅"
                    : sla.status === "warning"
                    ? "⚠️"
                    : "❌"}
                </span>
              </div>

              <div className="sla-metrics">
                <div className="sla-value">
                  <span className="current-value">{sla.value}%</span>
                  <span className="target-value">Target: {sla.target}%</span>
                </div>

                <div className="sla-progress">
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{ width: `${sla.value}%` }}
                    />
                    <div
                      className="target-line"
                      style={{ left: `${sla.target}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="sla-description">{sla.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Generating report...</p>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {notification.show && (
        <div className={`notification-popup notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === "success"
                ? "✅"
                : notification.type === "error"
                ? "❌"
                : "ℹ️"}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
