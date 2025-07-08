import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaDesktop,
  FaLaptop,
  FaServer,
  FaPrint,
} from "react-icons/fa";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { PageLayout } from "../components/common/PageLayout";
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
        notes: "Primary workstation for John Doe",
        createdAt: new Date("2023-01-15T10:00:00Z"),
        updatedAt: new Date("2023-01-15T10:00:00Z"),
      },
      {
        id: "2",
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
        id: "3",
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
        id: "4",
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
        id: "5",
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

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case AT.DESKTOP:
        return <FaDesktop />;
      case AT.LAPTOP:
        return <FaLaptop />;
      case AT.SERVER:
        return <FaServer />;
      case AT.PRINTER:
        return <FaPrint />;
      default:
        return <FaDesktop />;
    }
  };

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case AS.ACTIVE:
        return "status-active";
      case AS.INACTIVE:
        return "status-inactive";
      case AS.MAINTENANCE:
        return "status-maintenance";
      case AS.DISPOSED:
        return "status-disposed";
      case AS.LOST:
        return "status-lost";
      case AS.STOLEN:
        return "status-stolen";
      default:
        return "status-active";
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
    // TODO: Implement create asset modal
    console.log("Create asset");
  };

  const handleViewAsset = (assetId: string) => {
    // TODO: Navigate to asset details
    console.log("View asset", assetId);
  };

  const handleEditAsset = (assetId: string) => {
    // TODO: Open edit asset modal
    console.log("Edit asset", assetId);
  };

  const handleDeleteAsset = (assetId: string) => {
    // TODO: Implement delete confirmation
    console.log("Delete asset", assetId);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-spinner">Loading assets...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="assets-page">
        <div className="page-header">
          <h1>Assets</h1>
        </div>

        <div className="assets-header">
          <div className="assets-actions">
            <Button
              variant="primary"
              icon={<FaPlus />}
              onClick={handleCreateAsset}
            >
              Add Asset
            </Button>
          </div>

          <div className="assets-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as AssetType | "all")
              }
            >
              <option value="all">All Types</option>
              <option value={AT.DESKTOP}>Desktop</option>
              <option value={AT.LAPTOP}>Laptop</option>
              <option value={AT.SERVER}>Server</option>
              <option value={AT.PRINTER}>Printer</option>
              <option value={AT.PHONE}>Phone</option>
              <option value={AT.TABLET}>Tablet</option>
              <option value={AT.MONITOR}>Monitor</option>
              <option value={AT.SOFTWARE}>Software</option>
              <option value={AT.LICENSE}>License</option>
              <option value={AT.OTHER}>Other</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as AssetStatus | "all")
              }
            >
              <option value="all">All Statuses</option>
              <option value={AS.ACTIVE}>Active</option>
              <option value={AS.INACTIVE}>Inactive</option>
              <option value={AS.MAINTENANCE}>Maintenance</option>
              <option value={AS.DISPOSED}>Disposed</option>
              <option value={AS.LOST}>Lost</option>
              <option value={AS.STOLEN}>Stolen</option>
            </select>
          </div>
        </div>

        <div className="assets-stats">
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Total Assets</h3>
              <p className="stat-number">{assets.length}</p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Active</h3>
              <p className="stat-number">
                {assets.filter((a) => a.status === AS.ACTIVE).length}
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Maintenance</h3>
              <p className="stat-number">
                {assets.filter((a) => a.status === AS.MAINTENANCE).length}
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Warranty Expiring</h3>
              <p className="stat-number">
                {
                  assets.filter(
                    (a) =>
                      a.warrantyExpiry &&
                      isWarrantyExpiringSoon(a.warrantyExpiry)
                  ).length
                }
              </p>
            </div>
          </Card>
        </div>

        <Card className="assets-table">
          <div className="table-header">
            <h3>Assets ({filteredAssets.length})</h3>
            <Button variant="secondary" icon={<FaFilter />}>
              More Filters
            </Button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Serial Number</th>
                  <th>Assigned To</th>
                  <th>Location</th>
                  <th>Warranty</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <div className="asset-info">
                        <div className="asset-icon">
                          {getAssetIcon(asset.type)}
                        </div>
                        <div className="asset-details">
                          <span className="asset-name">{asset.name}</span>
                          <span className="asset-model">
                            {asset.manufacturer} {asset.model}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="asset-type">{asset.type}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(
                          asset.status
                        )}`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td>{asset.serialNumber}</td>
                    <td>{asset.assignedTo || "Unassigned"}</td>
                    <td>{asset.location}</td>
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
                      <div className="action-buttons">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaEye />}
                          onClick={() => handleViewAsset(asset.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaEdit />}
                          onClick={() => handleEditAsset(asset.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaTrash />}
                          onClick={() => handleDeleteAsset(asset.id)}
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
