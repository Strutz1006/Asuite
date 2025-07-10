import React from 'react';
import type { 
  Plugin, 
  PluginManifest, 
  PluginContext, 
  HookRegistry, 
  PluginSettings, 
  PluginStorage,
  ForesightAPI 
} from './types';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private activePlugins: Set<string> = new Set();
  private hooks: HookRegistry;
  private foresightApi: ForesightAPI;

  constructor() {
    this.hooks = this.createHookRegistry();
    this.foresightApi = this.createForesightAPI();
  }

  private createHookRegistry(): HookRegistry {
    const actions = new Map<string, Function[]>();
    const filters = new Map<string, Function[]>();
    const components = new Map<string, React.ComponentType>();

    return {
      addAction: (name: string, callback: Function) => {
        if (!actions.has(name)) actions.set(name, []);
        actions.get(name)!.push(callback);
      },
      
      addFilter: (name: string, callback: Function) => {
        if (!filters.has(name)) filters.set(name, []);
        filters.get(name)!.push(callback);
      },
      
      addComponent: (name: string, component: React.ComponentType) => {
        components.set(name, component);
      },
      
      executeAction: (name: string, ...args: any[]) => {
        const actionCallbacks = actions.get(name) || [];
        actionCallbacks.forEach(callback => {
          try {
            callback(...args);
          } catch (error) {
            console.error(`Error executing action ${name}:`, error);
          }
        });
      },
      
      applyFilters: (name: string, value: any, ...args: any[]) => {
        const filterCallbacks = filters.get(name) || [];
        return filterCallbacks.reduce((currentValue, callback) => {
          try {
            return callback(currentValue, ...args);
          } catch (error) {
            console.error(`Error applying filter ${name}:`, error);
            return currentValue;
          }
        }, value);
      },
      
      renderComponent: (name: string, props?: any) => {
        const Component = components.get(name);
        return Component ? React.createElement(Component, props) : null;
      }
    };
  }

  private createForesightAPI(): ForesightAPI {
    return {
      scenarios: {
        list: async () => {
          // Mock implementation - would integrate with actual scenario service
          return [];
        },
        get: async (id: string) => {
          // Mock implementation
          return { id, name: 'Sample Scenario' };
        },
        create: async (data: any) => {
          // Mock implementation
          return { ...data, id: Date.now().toString() };
        },
        update: async (id: string, data: any) => {
          // Mock implementation
          return { ...data, id };
        },
        delete: async (_id: string) => {
          // Mock implementation
        }
      },
      insights: {
        generate: async (scenarioId: string) => {
          // Mock implementation
          return { scenarioId, insights: [] };
        },
        list: async () => {
          // Mock implementation
          return [];
        }
      },
      recommendations: {
        generate: async (_scenarioId: string) => {
          // Mock implementation
          return [];
        }
      },
      notifications: {
        show: (message: string, type = 'info' as const) => {
          // Mock implementation - would integrate with notification system
          console.log(`[${type.toUpperCase()}] ${message}`);
        }
      }
    };
  }

  private createPluginSettings(pluginId: string): PluginSettings {
    const storageKey = `plugin_settings_${pluginId}`;
    
    return {
      get: (key: string, defaultValue?: any) => {
        const settings = JSON.parse(localStorage.getItem(storageKey) || '{}');
        return settings[key] ?? defaultValue;
      },
      
      set: (key: string, value: any) => {
        const settings = JSON.parse(localStorage.getItem(storageKey) || '{}');
        settings[key] = value;
        localStorage.setItem(storageKey, JSON.stringify(settings));
      },
      
      getAll: () => {
        return JSON.parse(localStorage.getItem(storageKey) || '{}');
      }
    };
  }

  private createPluginStorage(pluginId: string): PluginStorage {
    const storageKey = `plugin_data_${pluginId}`;
    
    return {
      get: async (key: string) => {
        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
        return data[key];
      },
      
      set: async (key: string, value: any) => {
        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
        data[key] = value;
        localStorage.setItem(storageKey, JSON.stringify(data));
      },
      
      remove: async (key: string) => {
        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
        delete data[key];
        localStorage.setItem(storageKey, JSON.stringify(data));
      },
      
      clear: async () => {
        localStorage.removeItem(storageKey);
      }
    };
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    const { id } = plugin.manifest;
    
    if (this.plugins.has(id)) {
      throw new Error(`Plugin ${id} is already registered`);
    }

    // Validate plugin permissions
    if (!this.validatePluginPermissions(plugin.manifest)) {
      throw new Error(`Plugin ${id} has invalid permissions`);
    }

    this.plugins.set(id, plugin);

    // Initialize plugin with context
    const context: PluginContext = {
      foresightApi: this.foresightApi,
      hooks: this.hooks,
      settings: this.createPluginSettings(id),
      storage: this.createPluginStorage(id)
    };

    await plugin.initialize(context);
  }

  async activatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (this.activePlugins.has(pluginId)) {
      return; // Already active
    }

    await plugin.activate();
    this.activePlugins.add(pluginId);
  }

  async deactivatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (!this.activePlugins.has(pluginId)) {
      return; // Already inactive
    }

    await plugin.deactivate();
    this.activePlugins.delete(pluginId);
  }

  unregisterPlugin(pluginId: string): void {
    if (this.activePlugins.has(pluginId)) {
      this.deactivatePlugin(pluginId);
    }
    this.plugins.delete(pluginId);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins)
      .map(id => this.plugins.get(id))
      .filter(Boolean) as Plugin[];
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getHooks(): HookRegistry {
    return this.hooks;
  }

  private validatePluginPermissions(manifest: PluginManifest): boolean {
    // Basic validation - in a real app, this would be more comprehensive
    return manifest.permissions.every(permission => 
      typeof permission.resource === 'string' && 
      Array.isArray(permission.actions)
    );
  }
}

export const pluginManager = new PluginManager();