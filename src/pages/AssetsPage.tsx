import React, { useState, useEffect } from "react";
import { Loader } from "../components/common";
import type { Asset, AssetType, AssetStatus } from "../types";
import { AssetType as AT, AssetStatus as AS } from "../types";
import "../styles/assets.css";

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockAssets: Asset[] = [
      {
        id: "1",
        name: "Dell OptiPlex 7090",
        type: AT.DESKTOP,
        status: AS.ACTIVE,
        serialNumber: "DL7090-001",
        model: "OptiPlex 7090",
        manufacturer: "Dell",
        purchaseDate: new Date("2023-01-15"),
        warrantyExpiry: new Date("2026-01-15"),
        location: "Office 101",
        assignedTo: "john.doe@company.com",
        value: 899.99,
        specifications: {
          processor: "Intel i7-11700",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          os: "Windows 11 Pro",
        },
        maintenanceHistory: [],
        notes: "Primary workstation",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2023-01-15"),
      },
      {
        id: "2",
        name: "Dell XPS 13",
        type: AT.LAPTOP,
        status: AS.ACTIVE,
        serialNumber: "DPTX13-001",
        model: "XPS 13 9310",
        manufacturer: "Dell",
        purchaseDate: new Date("2022-01-15"),
        warrantyExpiry: new Date("2025-01-15"),
        location: "Office",
        assignedTo: "john.doe@company.com",
        value: 1499.99,
        specifications: {
          processor: "Intel i7-1185G7",
          memory: "16GB LPDDR4x",
          storage: "512GB SSD",
          os: "Windows 11 Pro",
        },
        maintenanceHistory: [],
        notes: "Primary workstation for John Doe",
        createdAt: new Date("2023-01-15T10:00:00Z"),
        updatedAt: new Date("2023-01-15T10:00:00Z"),
      },
      {
        id: "3",
        name: 'MacBook Pro 16"',
        type: AT.LAPTOP,
        status: AS.ACTIVE,
        serialNumber: "MBP16-002",
        model: 'MacBook Pro 16"',
        manufacturer: "Apple",
        purchaseDate: new Date("2023-03-20"),
        warrantyExpiry: new Date("2026-03-20"),
        location: "Remote",
        assignedTo: "jane.smith@company.com",
        value: 2499.99,
        specifications: {
          processor: "Apple M2 Pro",
          memory: "32GB",
          storage: "1TB SSD",
          os: "macOS Ventura",
        },
        maintenanceHistory: [],
        notes: "Development machine",
        createdAt: new Date("2023-03-20T14:30:00Z"),
        updatedAt: new Date("2023-03-20T14:30:00Z"),
      },
      {
        id: "4",
        name: "HP ProLiant DL380",
        type: AT.SERVER,
        status: AS.ACTIVE,
        serialNumber: "HP380-003",
        model: "ProLiant DL380 Gen10",
        manufacturer: "HP",
        purchaseDate: new Date("2022-08-10"),
        warrantyExpiry: new Date("2025-08-10"),
        location: "Data Center",
        value: 4999.99,
        specifications: {
          processor: "Intel Xeon Silver 4214",
          memory: "64GB DDR4",
          storage: "2x 1TB SSD RAID",
          os: "Ubuntu Server 22.04",
        },
        maintenanceHistory: [],
        notes: "Production web server",
        createdAt: new Date("2022-08-10T09:00:00Z"),
        updatedAt: new Date("2022-08-10T09:00:00Z"),
      },
      {
        id: "5",
        name: "Canon ImageRunner 2630",
        type: AT.PRINTER,
        status: AS.MAINTENANCE,
        serialNumber: "CAN2630-004",
        model: "ImageRunner 2630",
        manufacturer: "Canon",
        purchaseDate: new Date("2022-05-12"),
        warrantyExpiry: new Date("2024-05-12"),
        location: "Print Room",
        value: 1299.99,
        specifications: {
          type: "Multifunction Printer",
          speed: "30 ppm",
          resolution: "1200x1200 dpi",
          connectivity: "Ethernet, WiFi",
        },
        maintenanceHistory: [],
        notes: "Currently under maintenance - paper jam issue",
        createdAt: new Date("2022-05-12T11:00:00Z"),
        updatedAt: new Date("2024-01-15T16:00:00Z"),
      },
      {
        id: "6",
        name: "Lenovo ThinkPad X1",
        type: AT.LAPTOP,
        status: AS.DISPOSED,
        serialNumber: "LNV-X1-005",
        model: "ThinkPad X1 Carbon",
        manufacturer: "Lenovo",
        purchaseDate: new Date("2019-11-20"),
        warrantyExpiry: new Date("2022-11-20"),
        location: "Storage",
        value: 1599.99,
        specifications: {
          processor: "Intel i7-8565U",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          os: "Windows 10 Pro",
        },
        maintenanceHistory: [],
        notes: "End of life - disposed due to hardware failure",
        createdAt: new Date("2019-11-20T13:00:00Z"),
        updatedAt: new Date("2024-01-10T10:00:00Z"),
      },
    ];

    setTimeout(() => {
      setAssets(mockAssets);
      setFilteredAssets(mockAssets);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter assets based on search and filters
  useEffect(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((asset) => asset.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((asset) => asset.status === statusFilter);
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, typeFilter, statusFilter]);

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case AS.ACTIVE:
        return <span className="compact-badge success">Active</span>;
      case AS.INACTIVE:
        return <span className="compact-badge">Inactive</span>;
      case AS.MAINTENANCE:
        return <span className="compact-badge warning">Maintenance</span>;
      case AS.DISPOSED:
        return <span className="compact-badge error">Disposed</span>;
      default:
        return <span className="compact-badge">{status}</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const isWarrantyExpiringSoon = (warrantyExpiry: Date) => {
    const now = new Date();
    const threeMonthsFromNow = new Date(
      now.getTime() + 90 * 24 * 60 * 60 * 1000
    );
    return warrantyExpiry <= threeMonthsFromNow;
  };

  const handleCreateAsset = () => {
    console.log("Create asset");
  };

  const handleViewAsset = (assetId: string) => {
    console.log("View asset", assetId);
  };

  const handleEditAsset = (assetId: string) => {
    console.log("Edit asset", assetId);
  };

  if (loading) {
    return <Loader centered text="Loading assets..." minHeight="60vh" />;
  }

  return (
    <>
      <div className="compact-header">
        <h1>Asset Management</h1>
        <div className="actions-container">
          <button className="compact-btn primary" onClick={handleCreateAsset}>
            Add Asset
          </button>
          <button className="compact-btn">Export</button>
        </div>
      </div>

      <div className="compact-stats">
        <div className="compact-stat-card">
          <div className="compact-stat-value">{assets.length}</div>
          <div className="compact-stat-label">Total Assets</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">
            {assets.filter((a) => a.status === AS.ACTIVE).length}
          </div>
          <div className="compact-stat-label">Active</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">
            {assets.filter((a) => a.status === AS.MAINTENANCE).length}
          </div>
          <div className="compact-stat-label">Maintenance</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">
            {
              assets.filter(
                (a) =>
                  a.warrantyExpiry && isWarrantyExpiringSoon(a.warrantyExpiry)
              ).length
            }
          </div>
          <div className="compact-stat-label">Warranty Expiring</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">
            {formatCurrency(
              assets.reduce((sum, asset) => sum + asset.value, 0)
            )}
          </div>
          <div className="compact-stat-label">Total Value</div>
        </div>
      </div>

      <div className="actions-container">
        <input
          type="search"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="compact-search"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as AssetType | "all")}
          className="compact-btn"
        >
          <option value="all">All Types</option>
          <option value={AT.DESKTOP}>Desktop</option>
          <option value={AT.LAPTOP}>Laptop</option>
          <option value={AT.SERVER}>Server</option>
          <option value={AT.PRINTER}>Printer</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as AssetStatus | "all")
          }
          className="compact-btn"
        >
          <option value="all">All Statuses</option>
          <option value={AS.ACTIVE}>Active</option>
          <option value={AS.INACTIVE}>Inactive</option>
          <option value={AS.MAINTENANCE}>Maintenance</option>
          <option value={AS.DISPOSED}>Disposed</option>
        </select>
      </div>

      <div className="compact-card">
        <h3>Assets ({filteredAssets.length})</h3>
        <table className="compact-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Location</th>
              <th>Assigned To</th>
              <th>Warranty</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id}>
                <td>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{asset.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {asset.manufacturer} {asset.model}
                    </div>
                  </div>
                </td>
                <td>{asset.type}</td>
                <td>{asset.serialNumber}</td>
                <td>{getStatusBadge(asset.status)}</td>
                <td>{asset.location}</td>
                <td>{asset.assignedTo || "Unassigned"}</td>
                <td>
                  {asset.warrantyExpiry && (
                    <span
                      className={`warranty-status ${
                        isWarrantyExpiringSoon(asset.warrantyExpiry)
                          ? "expiring"
                          : ""
                      }`}
                    >
                      {asset.warrantyExpiry.toLocaleDateString()}
                    </span>
                  )}
                </td>
                <td>{formatCurrency(asset.value)}</td>
                <td>
                  <div className="actions-container">
                    <button
                      className="compact-btn"
                      onClick={() => handleViewAsset(asset.id)}
                    >
                      View
                    </button>
                    <button
                      className="compact-btn"
                      onClick={() => handleEditAsset(asset.id)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
