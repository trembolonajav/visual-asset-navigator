export type AssetStatus = 'active' | 'maintenance' | 'missing' | 'transit';

export type AssetType = 'computer' | 'monitor' | 'keyboard' | 'mouse' | 'dock' | 'phone' | 'printer' | 'rack' | 'chair';

export type FurnitureType = 'desk' | 'counter' | 'rack-cabinet' | 'printer-station' | 'wall' | 'door';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  tag: string; // patrimônio
  serial?: string;
  status: AssetStatus;
  custodian?: string;
  stationId?: string;
  lastVerified?: string;
  history?: HistoryEntry[];
}

export interface HistoryEntry {
  date: string;
  action: string;
  by: string;
  from?: string;
  to?: string;
}

export interface Station {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: FurnitureType;
  assets: string[]; // asset IDs
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  sector: string;
  unit: string;
  stations: string[];
}

export interface CanvasElement {
  id: string;
  type: 'station' | 'furniture';
  x: number;
  y: number;
  width: number;
  height: number;
  data: Station;
}
