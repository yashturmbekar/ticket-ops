import { AssetType } from "../types";

export const ASSET_TYPE_LABELS = {
  [AssetType.DESKTOP]: "Desktop Computer",
  [AssetType.LAPTOP]: "Laptop Computer",
  [AssetType.SERVER]: "Server",
  [AssetType.NETWORK_DEVICE]: "Network Device",
  [AssetType.PRINTER]: "Printer",
  [AssetType.PHONE]: "Phone",
  [AssetType.TABLET]: "Tablet",
  [AssetType.MONITOR]: "Monitor",
  [AssetType.SOFTWARE]: "Software",
  [AssetType.LICENSE]: "License",
  [AssetType.OTHER]: "Other",
} as const;

export const ASSET_TYPE_ICONS = {
  [AssetType.DESKTOP]: "FaDesktop",
  [AssetType.LAPTOP]: "FaLaptop",
  [AssetType.SERVER]: "FaServer",
  [AssetType.NETWORK_DEVICE]: "FaNetworkWired",
  [AssetType.PRINTER]: "FaPrint",
  [AssetType.PHONE]: "FaPhone",
  [AssetType.TABLET]: "FaTabletAlt",
  [AssetType.MONITOR]: "FaTv",
  [AssetType.SOFTWARE]: "FaCode",
  [AssetType.LICENSE]: "FaKey",
  [AssetType.OTHER]: "FaBox",
} as const;

export const ASSET_TYPE_COLORS = {
  [AssetType.DESKTOP]: "#007bff",
  [AssetType.LAPTOP]: "#28a745",
  [AssetType.SERVER]: "#dc3545",
  [AssetType.NETWORK_DEVICE]: "#6f42c1",
  [AssetType.PRINTER]: "#fd7e14",
  [AssetType.PHONE]: "#20c997",
  [AssetType.TABLET]: "#17a2b8",
  [AssetType.MONITOR]: "#ffc107",
  [AssetType.SOFTWARE]: "#e83e8c",
  [AssetType.LICENSE]: "#6c757d",
  [AssetType.OTHER]: "#343a40",
} as const;

export const ASSET_TYPE_CATEGORIES = {
  hardware: [
    AssetType.DESKTOP,
    AssetType.LAPTOP,
    AssetType.SERVER,
    AssetType.NETWORK_DEVICE,
    AssetType.PRINTER,
    AssetType.PHONE,
    AssetType.TABLET,
    AssetType.MONITOR,
  ],
  software: [AssetType.SOFTWARE, AssetType.LICENSE],
  other: [AssetType.OTHER],
} as const;
