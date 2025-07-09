import React, { useState } from "react";

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const userStats = [
    { label: "Total Users", value: 247, status: "info" },
    { label: "Active Users", value: 231, status: "success" },
    { label: "Inactive Users", value: 16, status: "warning" },
    { label: "Admins", value: 5, status: "primary" },
  ];

  const departments = [
    "Sales",
    "Marketing",
    "IT",
    "HR",
    "Finance",
    "Operations",
    "Legal",
    "R&D",
  ];

  const users = [
    {
      id: "1",
      username: "john.doe",
      email: "john.doe@company.com",
      firstName: "John",
      lastName: "Doe",
      role: "User",
      department: "Sales",
      manager: "jane.smith@company.com",
      phone: "+1-555-0123",
      location: "New York, NY",
      isActive: true,
      lastLogin: "2024-01-15T10:30:00Z",
      ticketsCreated: 12,
      ticketsResolved: 8,
    },
    {
      id: "2",
      username: "jane.smith",
      email: "jane.smith@company.com",
      firstName: "Jane",
      lastName: "Smith",
      role: "Manager",
      department: "Sales",
      manager: "admin@company.com",
      phone: "+1-555-0124",
      location: "New York, NY",
      isActive: true,
      lastLogin: "2024-01-15T09:15:00Z",
      ticketsCreated: 5,
      ticketsResolved: 25,
    },
    {
      id: "3",
      username: "mike.johnson",
      email: "mike.johnson@company.com",
      firstName: "Mike",
      lastName: "Johnson",
      role: "Technician",
      department: "IT",
      manager: "alice.wilson@company.com",
      phone: "+1-555-0125",
      location: "San Francisco, CA",
      isActive: true,
      lastLogin: "2024-01-15T11:45:00Z",
      ticketsCreated: 3,
      ticketsResolved: 47,
    },
    {
      id: "4",
      username: "sarah.brown",
      email: "sarah.brown@company.com",
      firstName: "Sarah",
      lastName: "Brown",
      role: "User",
      department: "Marketing",
      manager: "bob.davis@company.com",
      phone: "+1-555-0126",
      location: "Chicago, IL",
      isActive: false,
      lastLogin: "2024-01-10T14:20:00Z",
      ticketsCreated: 8,
      ticketsResolved: 2,
    },
    {
      id: "5",
      username: "alice.wilson",
      email: "alice.wilson@company.com",
      firstName: "Alice",
      lastName: "Wilson",
      role: "Admin",
      department: "IT",
      manager: "admin@company.com",
      phone: "+1-555-0127",
      location: "San Francisco, CA",
      isActive: true,
      lastLogin: "2024-01-15T08:00:00Z",
      ticketsCreated: 1,
      ticketsResolved: 89,
    },
    {
      id: "6",
      username: "bob.davis",
      email: "bob.davis@company.com",
      firstName: "Bob",
      lastName: "Davis",
      role: "Manager",
      department: "Marketing",
      manager: "admin@company.com",
      phone: "+1-555-0128",
      location: "Chicago, IL",
      isActive: true,
      lastLogin: "2024-01-15T09:30:00Z",
      ticketsCreated: 4,
      ticketsResolved: 18,
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "#ef4444";
      case "manager":
        return "#8b5cf6";
      case "technician":
        return "#10b981";
      case "user":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "#10b981" : "#6b7280";
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="compact-page">
      {/* Header */}
      <div className="compact-header">
        <h1>User Management</h1>
        <div className="compact-actions">
          <div className="compact-search">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="compact-search-input"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="compact-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="technician">Technician</option>
            <option value="user">User</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="compact-select"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept.toLowerCase()}>
                {dept}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="compact-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="compact-btn compact-btn-primary">Add User</button>
        </div>
      </div>

      {/* User Stats */}
      <div className="compact-grid compact-grid-4">
        {userStats.map((stat, index) => (
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

      {/* User Overview */}
      <div className="compact-grid compact-grid-2">
        <div className="compact-card">
          <h3>Users by Role</h3>
          <div className="compact-role-chart">
            {[
              { role: "User", count: 195, color: "#3b82f6" },
              { role: "Technician", count: 28, color: "#10b981" },
              { role: "Manager", count: 19, color: "#8b5cf6" },
              { role: "Admin", count: 5, color: "#ef4444" },
            ].map((item, index) => (
              <div key={index} className="compact-role-item">
                <div className="compact-role-info">
                  <span
                    className="compact-role-dot"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="compact-role-name">{item.role}</span>
                </div>
                <div className="compact-role-bar">
                  <div
                    className="compact-role-fill"
                    style={{
                      width: `${(item.count / 247) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
                <span className="compact-role-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="compact-card">
          <h3>Users by Department</h3>
          <div className="compact-department-chart">
            {[
              { dept: "Sales", count: 45 },
              { dept: "IT", count: 38 },
              { dept: "Marketing", count: 32 },
              { dept: "HR", count: 28 },
              { dept: "Finance", count: 25 },
              { dept: "Operations", count: 22 },
              { dept: "Legal", count: 12 },
              { dept: "R&D", count: 45 },
            ].map((item, index) => (
              <div key={index} className="compact-department-item">
                <span className="compact-department-name">{item.dept}</span>
                <div className="compact-department-bar">
                  <div
                    className="compact-department-fill"
                    style={{ width: `${(item.count / 45) * 100}%` }}
                  ></div>
                </div>
                <span className="compact-department-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="compact-card">
        <h3>All Users</h3>
        <div className="compact-table-container">
          <table className="compact-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="compact-user-info">
                      <div className="compact-user-avatar">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div className="compact-user-details">
                        <div className="compact-user-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="compact-user-email">{user.email}</div>
                        <div className="compact-user-location">
                          {user.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="compact-role-badge"
                      style={{ color: getRoleColor(user.role) }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{user.department}</td>
                  <td>
                    <span
                      className="compact-status-dot"
                      style={{ color: getStatusColor(user.isActive) }}
                    >
                      ● {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="compact-last-login">
                      {formatLastLogin(user.lastLogin)}
                    </div>
                  </td>
                  <td>
                    <div className="compact-ticket-stats">
                      <span className="compact-ticket-created">
                        Created: {user.ticketsCreated}
                      </span>
                      <span className="compact-ticket-resolved">
                        Resolved: {user.ticketsResolved}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="compact-actions">
                      <button className="compact-btn compact-btn-sm compact-btn-primary">
                        View
                      </button>
                      <button className="compact-btn compact-btn-sm compact-btn-secondary">
                        Edit
                      </button>
                      <button className="compact-btn compact-btn-sm compact-btn-danger">
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { UsersPage };
export default UsersPage;
