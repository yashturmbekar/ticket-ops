import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaUser,
  FaUsers,
  FaUserTie,
  FaUserShield,
} from "react-icons/fa";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { PageLayout } from "../components/common/PageLayout";
import type { User, UserRole } from "../types";
import { UserRole as UR, Permission } from "../types";
import "../styles/users.css";

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | "all"
  >("all");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        username: "john.doe",
        email: "john.doe@company.com",
        firstName: "John",
        lastName: "Doe",
        role: UR.USER,
        department: "Sales",
        manager: "jane.smith@company.com",
        phone: "+1-555-0123",
        location: "New York, NY",
        isActive: true,
        lastLogin: new Date("2024-01-15T10:30:00Z"),
        permissions: [Permission.TICKET_VIEW, Permission.TICKET_CREATE],
        avatar: "https://via.placeholder.com/40x40",
        createdAt: new Date("2023-01-15T09:00:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      },
      {
        id: "2",
        username: "jane.smith",
        email: "jane.smith@company.com",
        firstName: "Jane",
        lastName: "Smith",
        role: UR.IT_STAFF,
        department: "IT",
        phone: "+1-555-0124",
        location: "New York, NY",
        isActive: true,
        lastLogin: new Date("2024-01-15T16:45:00Z"),
        permissions: [
          Permission.TICKET_VIEW,
          Permission.TICKET_CREATE,
          Permission.TICKET_UPDATE,
          Permission.TICKET_ASSIGN,
          Permission.ASSET_VIEW,
        ],
        avatar: "https://via.placeholder.com/40x40",
        createdAt: new Date("2023-02-01T10:00:00Z"),
        updatedAt: new Date("2024-01-15T16:45:00Z"),
      },
      {
        id: "3",
        username: "bob.johnson",
        email: "bob.johnson@company.com",
        firstName: "Bob",
        lastName: "Johnson",
        role: UR.MANAGER,
        department: "Marketing",
        phone: "+1-555-0125",
        location: "San Francisco, CA",
        isActive: true,
        lastLogin: new Date("2024-01-14T14:20:00Z"),
        permissions: [
          Permission.TICKET_VIEW,
          Permission.TICKET_CREATE,
          Permission.REPORT_VIEW,
        ],
        avatar: "https://via.placeholder.com/40x40",
        createdAt: new Date("2023-01-10T08:00:00Z"),
        updatedAt: new Date("2024-01-14T14:20:00Z"),
      },
      {
        id: "4",
        username: "admin",
        email: "admin@company.com",
        firstName: "System",
        lastName: "Administrator",
        role: UR.ADMIN,
        department: "IT",
        phone: "+1-555-0100",
        location: "New York, NY",
        isActive: true,
        lastLogin: new Date("2024-01-15T17:00:00Z"),
        permissions: [Permission.ADMIN_SYSTEM],
        avatar: "https://via.placeholder.com/40x40",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-15T17:00:00Z"),
      },
      {
        id: "5",
        username: "sarah.davis",
        email: "sarah.davis@company.com",
        firstName: "Sarah",
        lastName: "Davis",
        role: UR.USER,
        department: "Design",
        manager: "bob.johnson@company.com",
        phone: "+1-555-0126",
        location: "Los Angeles, CA",
        isActive: false,
        lastLogin: new Date("2024-01-10T09:15:00Z"),
        permissions: [Permission.TICKET_VIEW, Permission.TICKET_CREATE],
        avatar: "https://via.placeholder.com/40x40",
        createdAt: new Date("2023-03-15T11:00:00Z"),
        updatedAt: new Date("2024-01-10T09:15:00Z"),
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.department === departmentFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) =>
        statusFilter === "active" ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, departmentFilter, statusFilter]);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UR.ADMIN:
        return <FaUserShield />;
      case UR.IT_STAFF:
        return <FaUserTie />;
      case UR.MANAGER:
        return <FaUsers />;
      case UR.USER:
        return <FaUser />;
      default:
        return <FaUser />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UR.ADMIN:
        return "role-admin";
      case UR.IT_STAFF:
        return "role-it-staff";
      case UR.MANAGER:
        return "role-manager";
      case UR.USER:
        return "role-user";
      default:
        return "role-user";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "status-active" : "status-inactive";
  };

  const getUniqueValues = (key: keyof User) => {
    const values = users.map((user) => user[key] as string).filter(Boolean);
    return [...new Set(values)];
  };

  const handleCreateUser = () => {
    // TODO: Implement create user modal
    console.log("Create user");
  };

  const handleViewUser = (userId: string) => {
    // TODO: Navigate to user details
    console.log("View user", userId);
  };

  const handleEditUser = (userId: string) => {
    // TODO: Open edit user modal
    console.log("Edit user", userId);
  };

  const handleDeleteUser = (userId: string) => {
    // TODO: Implement delete confirmation
    console.log("Delete user", userId);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-spinner">Loading users...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="users-page">
        <div className="page-header">
          <h1>Users</h1>
        </div>

        <div className="users-header">
          <div className="users-actions">
            <Button
              variant="primary"
              icon={<FaPlus />}
              onClick={handleCreateUser}
            >
              Add User
            </Button>
          </div>

          <div className="users-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as UserRole | "all")
              }
            >
              <option value="all">All Roles</option>
              <option value={UR.ADMIN}>Admin</option>
              <option value={UR.IT_STAFF}>IT Staff</option>
              <option value={UR.MANAGER}>Manager</option>
              <option value={UR.USER}>User</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {getUniqueValues("department").map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "active" | "inactive" | "all")
              }
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="users-stats">
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{users.length}</p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Active Users</h3>
              <p className="stat-number">
                {users.filter((u) => u.isActive).length}
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>IT Staff</h3>
              <p className="stat-number">
                {users.filter((u) => u.role === UR.IT_STAFF).length}
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Departments</h3>
              <p className="stat-number">
                {getUniqueValues("department").length}
              </p>
            </div>
          </Card>
        </div>

        <Card className="users-table">
          <div className="table-header">
            <h3>Users ({filteredUsers.length})</h3>
            <Button variant="secondary" icon={<FaFilter />}>
              More Filters
            </Button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.firstName} />
                          ) : (
                            <FaUser />
                          )}
                        </div>
                        <div className="user-details">
                          <span className="user-name">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`role-badge ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </div>
                    </td>
                    <td>{user.department}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(
                          user.isActive
                        )}`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{user.location}</td>
                    <td>
                      {user.lastLogin ? (
                        <span className="last-login">
                          {user.lastLogin.toLocaleString()}
                        </span>
                      ) : (
                        <span className="never-logged-in">Never</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaEye />}
                          onClick={() => handleViewUser(user.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaEdit />}
                          onClick={() => handleEditUser(user.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaTrash />}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};
