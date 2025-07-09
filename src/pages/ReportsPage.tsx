import React, { useState } from "react";

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const metrics = [
    {
      title: "Total Tickets",
      value: 1247,
      change: 12.5,
      trend: "up",
      color: "#2563eb",
    },
    {
      title: "Resolved Tickets",
      value: 1089,
      change: 8.3,
      trend: "up",
      color: "#10b981",
    },
    {
      title: "Avg Resolution Time",
      value: 2.4,
      change: -15.2,
      trend: "down",
      color: "#f59e0b",
    },
    {
      title: "Customer Satisfaction",
      value: 4.2,
      change: 5.8,
      trend: "up",
      color: "#8b5cf6",
    },
  ];

  const ticketTrendData = [65, 78, 89, 95, 102, 115];
  const resolvedData = [59, 75, 85, 91, 98, 112];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="compact-page">
      {/* Header */}
      <div className="compact-header">
        <h1>Reports & Analytics</h1>
        <div className="compact-actions">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="compact-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="compact-select"
          >
            <option value="overview">Overview</option>
            <option value="tickets">Ticket Analysis</option>
            <option value="performance">Performance</option>
            <option value="sla">SLA Compliance</option>
          </select>
          <button className="compact-btn compact-btn-primary">Export</button>
          <button className="compact-btn compact-btn-secondary">
            Schedule
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="compact-grid compact-grid-4">
        {metrics.map((metric, index) => (
          <div key={index} className="compact-card">
            <div className="compact-stats-header">
              <h3>{metric.title}</h3>
              <span className={`compact-trend compact-trend-${metric.trend}`}>
                {metric.trend === "up"
                  ? "↗"
                  : metric.trend === "down"
                  ? "↘"
                  : "→"}
              </span>
            </div>
            <div
              className="compact-stats-value"
              style={{ color: metric.color }}
            >
              {metric.title.includes("Time")
                ? `${metric.value}h`
                : metric.value}
            </div>
            <div
              className={`compact-stats-change compact-change-${metric.trend}`}
            >
              {metric.change > 0 ? "+" : ""}
              {metric.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="compact-grid compact-grid-2">
        <div className="compact-card">
          <h3>Ticket Trends</h3>
          <div className="compact-chart">
            <div className="compact-chart-bars">
              {ticketTrendData.map((value, index) => (
                <div key={index} className="compact-bar-group">
                  <div
                    className="compact-bar compact-bar-primary"
                    style={{ height: `${(value / 115) * 100}%` }}
                    title={`Created: ${value}`}
                  />
                  <div
                    className="compact-bar compact-bar-success"
                    style={{ height: `${(resolvedData[index] / 115) * 100}%` }}
                    title={`Resolved: ${resolvedData[index]}`}
                  />
                </div>
              ))}
            </div>
            <div className="compact-chart-labels">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="compact-card">
          <h3>Resolution Time by Priority</h3>
          <div className="compact-chart">
            <div className="compact-horizontal-bars">
              {[
                { label: "P1", value: 2.1 },
                { label: "P2", value: 8.5 },
                { label: "P3", value: 24.2 },
                { label: "P4", value: 72.8 },
              ].map((item, index) => (
                <div key={index} className="compact-horizontal-bar">
                  <span className="compact-bar-label">{item.label}</span>
                  <div className="compact-bar-track">
                    <div
                      className="compact-bar-fill"
                      style={{ width: `${(item.value / 73) * 100}%` }}
                    />
                  </div>
                  <span className="compact-bar-value">{item.value}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="compact-grid compact-grid-2">
        <div className="compact-card">
          <h3>Top Performers</h3>
          <div className="compact-table-container">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Technician</th>
                  <th>Resolved</th>
                  <th>Avg Time</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>42</td>
                  <td>2.1h</td>
                  <td>4.8</td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>38</td>
                  <td>2.3h</td>
                  <td>4.6</td>
                </tr>
                <tr>
                  <td>Mike Johnson</td>
                  <td>35</td>
                  <td>2.7h</td>
                  <td>4.4</td>
                </tr>
                <tr>
                  <td>Sarah Wilson</td>
                  <td>33</td>
                  <td>2.9h</td>
                  <td>4.3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="compact-card">
          <h3>Issue Categories</h3>
          <div className="compact-table-container">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>% Total</th>
                  <th>Avg Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hardware</td>
                  <td>156</td>
                  <td>25%</td>
                  <td>3.2h</td>
                </tr>
                <tr>
                  <td>Software</td>
                  <td>248</td>
                  <td>40%</td>
                  <td>1.8h</td>
                </tr>
                <tr>
                  <td>Network</td>
                  <td>89</td>
                  <td>14%</td>
                  <td>4.5h</td>
                </tr>
                <tr>
                  <td>Access</td>
                  <td>132</td>
                  <td>21%</td>
                  <td>0.9h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SLA Compliance */}
      <div className="compact-card">
        <h3>SLA Compliance</h3>
        <div className="compact-sla-metrics">
          {[
            { label: "Response Time SLA", value: 92 },
            { label: "Resolution Time SLA", value: 87 },
            { label: "Customer Satisfaction SLA", value: 95 },
          ].map((sla, index) => (
            <div key={index} className="compact-sla-metric">
              <span className="compact-sla-label">{sla.label}</span>
              <div className="compact-sla-bar">
                <div
                  className="compact-sla-progress"
                  style={{ width: `${sla.value}%` }}
                />
              </div>
              <span className="compact-sla-value">{sla.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ReportsPage };
export default ReportsPage;
