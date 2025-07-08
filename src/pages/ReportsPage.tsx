import React, { useState } from "react";
import { PageLayout } from "../components/common/PageLayout";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import "../styles/reports.css";

interface ReportMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock metrics data
  const metrics: ReportMetric[] = [
    {
      id: "total-tickets",
      title: "Total Tickets",
      value: 1247,
      change: 12.5,
      trend: "up",
      color: "var(--color-primary)",
    },
    {
      id: "resolved-tickets",
      title: "Resolved Tickets",
      value: 1089,
      change: 8.3,
      trend: "up",
      color: "var(--color-success)",
    },
    {
      id: "avg-resolution-time",
      title: "Avg Resolution Time",
      value: 4.2,
      change: -15.2,
      trend: "down",
      color: "var(--color-warning)",
    },
    {
      id: "satisfaction-score",
      title: "Satisfaction Score",
      value: 87,
      change: 3.1,
      trend: "up",
      color: "var(--color-info)",
    },
  ];

  // Mock chart data
  const ticketVolumeData: ChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Created",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "var(--color-primary)",
        backgroundColor: "var(--color-primary-light)",
      },
      {
        label: "Resolved",
        data: [45, 69, 70, 75, 66, 60],
        borderColor: "var(--color-success)",
        backgroundColor: "var(--color-success-light)",
      },
    ],
  };

  const reportTypes = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "tickets", name: "Ticket Analytics", icon: "🎫" },
    { id: "assets", name: "Asset Reports", icon: "💻" },
    { id: "users", name: "User Analytics", icon: "👥" },
    { id: "sla", name: "SLA Reports", icon: "⏱️" },
    { id: "custom", name: "Custom Reports", icon: "🔧" },
  ];

  const periods = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const renderMetricCard = (metric: ReportMetric) => (
    <Card key={metric.id} className="metric-card">
      <div className="metric-header">
        <h3>{metric.title}</h3>
        <span className={`trend-indicator ${metric.trend}`}>
          {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"}
        </span>
      </div>
      <div className="metric-value" style={{ color: metric.color }}>
        {metric.title.includes("Time")
          ? `${metric.value}h`
          : metric.title.includes("Score")
          ? `${metric.value}%`
          : metric.value}
      </div>
      <div
        className={`metric-change ${
          metric.change > 0 ? "positive" : "negative"
        }`}
      >
        {metric.change > 0 ? "+" : ""}
        {metric.change}% from last period
      </div>
    </Card>
  );

  const renderChart = () => (
    <Card className="chart-card">
      <div className="chart-header">
        <h3>Ticket Volume Trends</h3>
        <div className="chart-controls">
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>
      <div className="chart-placeholder">
        <div className="chart-mock">
          <div className="chart-bars">
            {ticketVolumeData.labels.map((label, index) => (
              <div key={label} className="chart-bar-group">
                <div className="chart-label">{label}</div>
                <div className="chart-bars-container">
                  <div
                    className="chart-bar created"
                    style={{
                      height: `${ticketVolumeData.datasets[0].data[index]}%`,
                      backgroundColor: ticketVolumeData.datasets[0].borderColor,
                    }}
                  />
                  <div
                    className="chart-bar resolved"
                    style={{
                      height: `${ticketVolumeData.datasets[1].data[index]}%`,
                      backgroundColor: ticketVolumeData.datasets[1].borderColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              Created
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "var(--color-success)" }}
              />
              Resolved
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTopIssues = () => (
    <Card className="top-issues-card">
      <h3>Top Issues This Month</h3>
      <div className="issues-list">
        {[
          { category: "Password Reset", count: 145, percentage: 23 },
          { category: "Software Installation", count: 89, percentage: 14 },
          { category: "Hardware Issues", count: 76, percentage: 12 },
          { category: "Network Connectivity", count: 65, percentage: 10 },
          { category: "Email Problems", count: 43, percentage: 7 },
        ].map((issue, index) => (
          <div key={index} className="issue-item">
            <div className="issue-info">
              <span className="issue-category">{issue.category}</span>
              <span className="issue-count">{issue.count} tickets</span>
            </div>
            <div className="issue-progress">
              <div
                className="progress-bar"
                style={{ width: `${issue.percentage}%` }}
              />
              <span className="percentage">{issue.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderPerformanceMetrics = () => (
    <Card className="performance-card">
      <h3>Team Performance</h3>
      <div className="performance-grid">
        {[
          { name: "John Doe", tickets: 45, avgTime: "3.2h", rating: 4.8 },
          { name: "Jane Smith", tickets: 38, avgTime: "2.9h", rating: 4.9 },
          { name: "Mike Johnson", tickets: 52, avgTime: "4.1h", rating: 4.6 },
          { name: "Sarah Wilson", tickets: 29, avgTime: "3.8h", rating: 4.7 },
        ].map((member, index) => (
          <div key={index} className="performance-item">
            <div className="member-name">{member.name}</div>
            <div className="member-stats">
              <div className="stat">
                <span className="stat-label">Tickets</span>
                <span className="stat-value">{member.tickets}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Avg Time</span>
                <span className="stat-value">{member.avgTime}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Rating</span>
                <span className="stat-value">{member.rating}★</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <PageLayout>
      <div className="reports-page">
        <div className="reports-header">
          <div className="header-content">
            <h1>Reports & Analytics</h1>
            <p>Insights and metrics for your IT support operations</p>
          </div>
          <div className="header-actions">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <Button variant="primary" size="sm">
              Generate Report
            </Button>
          </div>
        </div>

        <div className="reports-sidebar">
          <div className="report-types">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                className={`report-type ${
                  selectedReport === type.id ? "active" : ""
                }`}
                onClick={() => setSelectedReport(type.id)}
              >
                <span className="report-icon">{type.icon}</span>
                <span className="report-name">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="reports-content">
          {selectedReport === "overview" && (
            <>
              <div className="metrics-grid">
                {metrics.map(renderMetricCard)}
              </div>

              <div className="charts-section">{renderChart()}</div>

              <div className="insights-grid">
                {renderTopIssues()}
                {renderPerformanceMetrics()}
              </div>
            </>
          )}

          {selectedReport === "tickets" && (
            <div className="report-placeholder">
              <h2>Ticket Analytics</h2>
              <p>
                Detailed ticket analytics and trends will be displayed here.
              </p>
            </div>
          )}

          {selectedReport === "assets" && (
            <div className="report-placeholder">
              <h2>Asset Reports</h2>
              <p>
                Asset utilization and maintenance reports will be displayed
                here.
              </p>
            </div>
          )}

          {selectedReport === "users" && (
            <div className="report-placeholder">
              <h2>User Analytics</h2>
              <p>User activity and support metrics will be displayed here.</p>
            </div>
          )}

          {selectedReport === "sla" && (
            <div className="report-placeholder">
              <h2>SLA Reports</h2>
              <p>
                Service level agreement performance metrics will be displayed
                here.
              </p>
            </div>
          )}

          {selectedReport === "custom" && (
            <div className="report-placeholder">
              <h2>Custom Reports</h2>
              <p>
                Custom report builder and saved reports will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export { ReportsPage };
