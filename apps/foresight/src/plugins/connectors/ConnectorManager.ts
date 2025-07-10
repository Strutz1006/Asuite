import type { DataConnector, ConnectorConfig } from '../types';

export class ConnectorManager {
  private connectors: Map<string, DataConnector> = new Map();
  private configs: Map<string, ConnectorConfig> = new Map();

  registerConnector(connector: DataConnector): void {
    this.connectors.set(connector.id, connector);
  }

  unregisterConnector(connectorId: string): void {
    this.connectors.delete(connectorId);
    this.configs.delete(connectorId);
  }

  async configureConnector(config: ConnectorConfig): Promise<void> {
    const connector = this.connectors.get(config.id);
    if (!connector) {
      throw new Error(`Connector ${config.id} not found`);
    }

    if (!connector.validateConfig(config.config)) {
      throw new Error(`Invalid configuration for connector ${config.id}`);
    }

    this.configs.set(config.id, config);
    
    if (config.enabled) {
      await connector.connect(config.config);
    }
  }

  async syncConnector(connectorId: string, direction: 'import' | 'export' | 'bidirectional'): Promise<void> {
    const connector = this.connectors.get(connectorId);
    const config = this.configs.get(connectorId);
    
    if (!connector || !config || !config.enabled) {
      throw new Error(`Connector ${connectorId} not available or not configured`);
    }

    await connector.sync(direction);
  }

  getConnector(connectorId: string): DataConnector | undefined {
    return this.connectors.get(connectorId);
  }

  getConnectorConfig(connectorId: string): ConnectorConfig | undefined {
    return this.configs.get(connectorId);
  }

  getAllConnectors(): DataConnector[] {
    return Array.from(this.connectors.values());
  }

  getActiveConnectors(): { connector: DataConnector; config: ConnectorConfig }[] {
    return Array.from(this.configs.entries())
      .filter(([_, config]) => config.enabled)
      .map(([id, config]) => ({
        connector: this.connectors.get(id)!,
        config
      }))
      .filter(({ connector }) => connector);
  }
}

export const connectorManager = new ConnectorManager();