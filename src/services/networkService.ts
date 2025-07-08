import type { NetworkDevice, DeviceType, DeviceStatus } from "../types";
import { apiService } from "./api";

export interface NetworkAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  type:
    | "offline"
    | "high_latency"
    | "packet_loss"
    | "configuration_change"
    | "security_issue";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface NetworkMetrics {
  deviceId: string;
  timestamp: Date;
  uptime: number;
  responseTime: number;
  packetLoss: number;
  cpuUsage?: number;
  memoryUsage?: number;
  interfaceStats?: Array<{
    interfaceName: string;
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    errors: number;
  }>;
}

export interface NetworkScanResult {
  ipAddress: string;
  hostname?: string;
  macAddress?: string;
  deviceType?: DeviceType;
  manufacturer?: string;
  openPorts: number[];
  lastSeen: Date;
  isNew: boolean;
}

export interface NetworkConfiguration {
  deviceId: string;
  configType: "startup" | "running" | "backup";
  configuration: string;
  timestamp: Date;
  version: string;
  checksum: string;
}

class NetworkService {
  private baseUrl = "/network";

  // Device management
  async getDevices(): Promise<NetworkDevice[]> {
    const response = await apiService.get<NetworkDevice[]>(
      `${this.baseUrl}/devices`
    );
    return response.data;
  }

  async getDeviceById(id: string): Promise<NetworkDevice> {
    const response = await apiService.get<NetworkDevice>(
      `${this.baseUrl}/devices/${id}`
    );
    return response.data;
  }

  async createDevice(
    device: Omit<NetworkDevice, "id">
  ): Promise<NetworkDevice> {
    const response = await apiService.post<NetworkDevice>(
      `${this.baseUrl}/devices`,
      device
    );
    return response.data;
  }

  async updateDevice(
    id: string,
    device: Partial<NetworkDevice>
  ): Promise<NetworkDevice> {
    const response = await apiService.put<NetworkDevice>(
      `${this.baseUrl}/devices/${id}`,
      device
    );
    return response.data;
  }

  async deleteDevice(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/devices/${id}`);
  }

  // Device monitoring
  async pingDevice(
    id: string
  ): Promise<{ success: boolean; responseTime?: number; error?: string }> {
    const response = await apiService.post<{
      success: boolean;
      responseTime?: number;
      error?: string;
    }>(`${this.baseUrl}/devices/${id}/ping`);
    return response.data;
  }

  async getDeviceStatus(id: string): Promise<{
    status: DeviceStatus;
    uptime: number;
    lastSeen: Date;
    responseTime: number;
    packetLoss: number;
  }> {
    const response = await apiService.get<{
      status: DeviceStatus;
      uptime: number;
      lastSeen: Date;
      responseTime: number;
      packetLoss: number;
    }>(`${this.baseUrl}/devices/${id}/status`);
    return response.data;
  }

  async getDeviceMetrics(
    id: string,
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h"
  ): Promise<NetworkMetrics[]> {
    const response = await apiService.get<NetworkMetrics[]>(
      `${this.baseUrl}/devices/${id}/metrics?range=${timeRange}`
    );
    return response.data;
  }

  // Network scanning
  async scanNetwork(subnet: string): Promise<NetworkScanResult[]> {
    const response = await apiService.post<NetworkScanResult[]>(
      `${this.baseUrl}/scan`,
      { subnet }
    );
    return response.data;
  }

  async discoverDevices(): Promise<NetworkScanResult[]> {
    const response = await apiService.post<NetworkScanResult[]>(
      `${this.baseUrl}/discover`
    );
    return response.data;
  }

  // Alerts management
  async getAlerts(): Promise<NetworkAlert[]> {
    const response = await apiService.get<NetworkAlert[]>(
      `${this.baseUrl}/alerts`
    );
    return response.data;
  }

  async getActiveAlerts(): Promise<NetworkAlert[]> {
    const response = await apiService.get<NetworkAlert[]>(
      `${this.baseUrl}/alerts/active`
    );
    return response.data;
  }

  async acknowledgeAlert(id: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/alerts/${id}/acknowledge`);
  }

  async resolveAlert(id: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/alerts/${id}/resolve`);
  }

  // Configuration management
  async getDeviceConfiguration(
    deviceId: string,
    type: "startup" | "running" | "backup" = "running"
  ): Promise<NetworkConfiguration> {
    const response = await apiService.get<NetworkConfiguration>(
      `${this.baseUrl}/devices/${deviceId}/config/${type}`
    );
    return response.data;
  }

  async saveDeviceConfiguration(
    deviceId: string,
    configuration: string
  ): Promise<void> {
    await apiService.post(`${this.baseUrl}/devices/${deviceId}/config/save`, {
      configuration,
    });
  }

  async backupDeviceConfiguration(
    deviceId: string
  ): Promise<NetworkConfiguration> {
    const response = await apiService.post<NetworkConfiguration>(
      `${this.baseUrl}/devices/${deviceId}/config/backup`
    );
    return response.data;
  }

  async restoreDeviceConfiguration(
    deviceId: string,
    configurationId: string
  ): Promise<void> {
    await apiService.post(
      `${this.baseUrl}/devices/${deviceId}/config/restore`,
      { configurationId }
    );
  }

  async getConfigurationHistory(
    deviceId: string
  ): Promise<NetworkConfiguration[]> {
    const response = await apiService.get<NetworkConfiguration[]>(
      `${this.baseUrl}/devices/${deviceId}/config/history`
    );
    return response.data;
  }

  // Network monitoring dashboard
  async getNetworkOverview(): Promise<{
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    activeAlerts: number;
    avgResponseTime: number;
    networkHealth: number;
    topologyMap: Array<{
      deviceId: string;
      deviceName: string;
      deviceType: DeviceType;
      status: DeviceStatus;
      connections: string[];
      position: { x: number; y: number };
    }>;
  }> {
    const response = await apiService.get<{
      totalDevices: number;
      onlineDevices: number;
      offlineDevices: number;
      activeAlerts: number;
      avgResponseTime: number;
      networkHealth: number;
      topologyMap: Array<{
        deviceId: string;
        deviceName: string;
        deviceType: DeviceType;
        status: DeviceStatus;
        connections: string[];
        position: { x: number; y: number };
      }>;
    }>(`${this.baseUrl}/overview`);
    return response.data;
  }

  async getNetworkTopology(): Promise<{
    nodes: Array<{
      id: string;
      name: string;
      type: DeviceType;
      status: DeviceStatus;
      ipAddress: string;
      position: { x: number; y: number };
    }>;
    links: Array<{
      source: string;
      target: string;
      type: "ethernet" | "wireless" | "fiber";
      status: "active" | "inactive" | "degraded";
    }>;
  }> {
    const response = await apiService.get<{
      nodes: Array<{
        id: string;
        name: string;
        type: DeviceType;
        status: DeviceStatus;
        ipAddress: string;
        position: { x: number; y: number };
      }>;
      links: Array<{
        source: string;
        target: string;
        type: "ethernet" | "wireless" | "fiber";
        status: "active" | "inactive" | "degraded";
      }>;
    }>(`${this.baseUrl}/topology`);
    return response.data;
  }

  // Bandwidth monitoring
  async getBandwidthUsage(
    deviceId?: string,
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h"
  ): Promise<
    Array<{
      timestamp: Date;
      bytesIn: number;
      bytesOut: number;
      utilization: number;
    }>
  > {
    const params = new URLSearchParams({ range: timeRange });
    if (deviceId) params.append("deviceId", deviceId);

    const response = await apiService.get<
      Array<{
        timestamp: Date;
        bytesIn: number;
        bytesOut: number;
        utilization: number;
      }>
    >(`${this.baseUrl}/bandwidth?${params}`);
    return response.data;
  }

  // Security monitoring
  async getSecurityEvents(): Promise<
    Array<{
      id: string;
      deviceId: string;
      eventType:
        | "intrusion_attempt"
        | "unauthorized_access"
        | "malware_detected"
        | "suspicious_activity";
      severity: "low" | "medium" | "high" | "critical";
      description: string;
      sourceIp: string;
      targetIp: string;
      timestamp: Date;
      investigated: boolean;
    }>
  > {
    const response = await apiService.get<
      Array<{
        id: string;
        deviceId: string;
        eventType:
          | "intrusion_attempt"
          | "unauthorized_access"
          | "malware_detected"
          | "suspicious_activity";
        severity: "low" | "medium" | "high" | "critical";
        description: string;
        sourceIp: string;
        targetIp: string;
        timestamp: Date;
        investigated: boolean;
      }>
    >(`${this.baseUrl}/security/events`);
    return response.data;
  }

  async markSecurityEventInvestigated(id: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/security/events/${id}/investigated`);
  }

  // Performance monitoring
  async getPerformanceMetrics(): Promise<{
    networkLatency: number;
    packetLoss: number;
    jitter: number;
    bandwidth: number;
    throughput: number;
    errorRate: number;
    availability: number;
  }> {
    const response = await apiService.get<{
      networkLatency: number;
      packetLoss: number;
      jitter: number;
      bandwidth: number;
      throughput: number;
      errorRate: number;
      availability: number;
    }>(`${this.baseUrl}/performance`);
    return response.data;
  }
}

export const networkService = new NetworkService();
