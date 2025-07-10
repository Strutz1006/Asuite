export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  permissions: PluginPermission[];
  entryPoint: string;
  hooks: PluginHook[];
  settings?: PluginSetting[];
}

export interface PluginPermission {
  resource: string;
  actions: string[];
}

export interface PluginHook {
  name: string;
  type: 'action' | 'filter' | 'component';
  target: string;
}

export interface PluginSetting {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  default?: any;
  options?: { label: string; value: any }[];
  required?: boolean;
}

export interface PluginContext {
  foresightApi: ForesightAPI;
  hooks: HookRegistry;
  settings: PluginSettings;
  storage: PluginStorage;
}

export interface ForesightAPI {
  scenarios: {
    list: () => Promise<any[]>;
    get: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<void>;
  };
  insights: {
    generate: (scenarioId: string) => Promise<any>;
    list: () => Promise<any[]>;
  };
  recommendations: {
    generate: (scenarioId: string) => Promise<any[]>;
  };
  notifications: {
    show: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  };
}

export interface HookRegistry {
  addAction: (name: string, callback: Function) => void;
  addFilter: (name: string, callback: Function) => void;
  addComponent: (name: string, component: React.ComponentType) => void;
  executeAction: (name: string, ...args: any[]) => void;
  applyFilters: (name: string, value: any, ...args: any[]) => any;
  renderComponent: (name: string, props?: any) => React.ReactElement | null;
}

export interface PluginSettings {
  get: (key: string, defaultValue?: any) => any;
  set: (key: string, value: any) => void;
  getAll: () => Record<string, any>;
}

export interface PluginStorage {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export interface Plugin {
  manifest: PluginManifest;
  initialize: (context: PluginContext) => Promise<void>;
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
  getComponent?: (name: string) => React.ComponentType | null;
}

export interface ConnectorConfig {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'spreadsheet';
  config: Record<string, any>;
  enabled: boolean;
}

export interface DataConnector {
  id: string;
  name: string;
  type: string;
  connect: (config: Record<string, any>) => Promise<void>;
  disconnect: () => Promise<void>;
  sync: (direction: 'import' | 'export' | 'bidirectional') => Promise<void>;
  getSchema: () => Promise<any>;
  validateConfig: (config: Record<string, any>) => boolean;
}