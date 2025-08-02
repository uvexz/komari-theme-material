import { Node, NodeStatus, PublicSettings } from '../types';

const API_BASE = '/api';

export const api = {
  async getNodes(): Promise<Node[]> {
    const response = await fetch(`${API_BASE}/nodes`);
    const data = await response.json();
    return data.status === 'success' ? data.data : [];
  },

  async getNodeStatus(uuid: string): Promise<NodeStatus[]> {
    const response = await fetch(`${API_BASE}/recent/${uuid}`);
    const data = await response.json();
    return data.status === 'success' ? data.data : [];
  },

  async getPublicSettings(): Promise<PublicSettings | null> {
    try {
      const response = await fetch(`${API_BASE}/public`);
      const data = await response.json();
      return data.status === 'success' ? data.data : null;
    } catch (error) {
      console.error('Failed to fetch public settings:', error);
      return null;
    }
  },

  createWebSocket(): WebSocket {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}${API_BASE}/clients`);
    return ws;
  },
};