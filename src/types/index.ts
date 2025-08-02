export interface Node {
  uuid: string;
  name: string;
  cpu_name: string;
  virtualization: string;
  arch: string;
  cpu_cores: number;
  os: string;
  gpu_name: string;
  region: string;
  mem_total: number;
  swap_total: number;
  disk_total: number;
  weight: number;
  price: number;
  billing_cycle: number;
  currency: string;
  expired_at: string | null;
  group: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface NodeStatus {
  cpu: {
    usage: number;
  };
  ram: {
    total: number;
    used: number;
  };
  swap: {
    total: number;
    used: number;
  };
  load: {
    load1: number;
    load5: number;
    load15: number;
  };
  disk: {
    total: number;
    used: number;
  };
  network: {
    up: number;
    down: number;
    totalUp: number;
    totalDown: number;
  };
  connections: {
    tcp: number;
    udp: number;
  };
  uptime: number;
  process: number;
  message: string;
  updated_at: string;
}

export interface PublicSettings {
  allow_cors: boolean;
  custom_body: string;
  custom_head: string;
  description: string;
  disable_password_login: boolean;
  oauth_enable: boolean;
  ping_record_preserve_time: number;
  record_enabled: boolean;
  record_preserve_time: number;
  sitename: string;
}

export type ViewMode = 'grid' | 'table';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'blue' | 'red' | 'yellow' | 'green' | 'cyan' | 'indigo' | 'purple';