import { Asset, Station, Room, Zone } from '@/types/vai';

export const mockZones: Zone[] = [
  { id: 'z1', label: 'TI', x: 40, y: 40, width: 480, height: 360, roomId: 'r1' },
  { id: 'z2', label: 'Impressão & Infra', x: 540, y: 40, width: 200, height: 360, roomId: 'r1' },
];

export const mockAssets: Asset[] = [
  { id: 'a1', name: 'MacBook Pro 14"', type: 'computer', tag: 'PAT-2024-001', serial: 'C02X1234', status: 'active', custodian: 'Ana Silva', department: 'TI', stationId: 's1', lastVerified: '2h atrás' },
  { id: 'a2', name: 'Monitor Dell 27"', type: 'monitor', tag: 'PAT-2024-002', serial: 'D4X5678', status: 'active', custodian: 'Ana Silva', department: 'TI', stationId: 's1', lastVerified: '2h atrás' },
  { id: 'a3', name: 'Monitor Dell 27"', type: 'monitor', tag: 'PAT-2024-003', serial: 'D4X5679', status: 'active', custodian: 'Ana Silva', department: 'TI', stationId: 's1', lastVerified: '2h atrás' },
  { id: 'a4', name: 'Dock Station USB-C', type: 'dock', tag: 'PAT-2024-004', status: 'active', custodian: 'Ana Silva', department: 'TI', stationId: 's1', lastVerified: '2h atrás' },
  { id: 'a5', name: 'Teclado Magic Keyboard', type: 'keyboard', tag: 'PAT-2024-005', status: 'active', custodian: 'Ana Silva', department: 'TI', stationId: 's1', lastVerified: '2h atrás' },
  { id: 'a6', name: 'Mouse MX Master 3', type: 'mouse', tag: 'PAT-2024-006', status: 'active', custodian: 'Ana Silva', department: 'TI', stationId: 's1', lastVerified: '2h atrás' },
  { id: 'a7', name: 'Dell Optiplex 7090', type: 'computer', tag: 'PAT-2024-007', serial: 'SVC9012', status: 'active', custodian: 'Carlos Mendes', department: 'TI', stationId: 's2', lastVerified: '1d atrás' },
  { id: 'a8', name: 'Monitor LG 24"', type: 'monitor', tag: 'PAT-2024-008', status: 'active', custodian: 'Carlos Mendes', department: 'TI', stationId: 's2', lastVerified: '1d atrás' },
  { id: 'a9', name: 'Telefone IP Cisco', type: 'phone', tag: 'PAT-2024-009', status: 'maintenance', custodian: 'Carlos Mendes', department: 'TI', stationId: 's2', lastVerified: '3d atrás' },
  { id: 'a10', name: 'Impressora HP LaserJet', type: 'printer', tag: 'PAT-2024-010', status: 'active', department: 'Infra', stationId: 's4', lastVerified: '5d atrás' },
  { id: 'a11', name: 'MacBook Air M2', type: 'computer', tag: 'PAT-2024-011', status: 'missing', custodian: 'João Costa', department: 'TI', lastVerified: '7d atrás' },
  { id: 'a12', name: 'Monitor Samsung 32"', type: 'monitor', tag: 'PAT-2024-012', status: 'transit', department: 'TI', lastVerified: '1d atrás' },
  { id: 'a13', name: 'Dell Latitude 5530', type: 'computer', tag: 'PAT-2024-013', serial: 'LAT3456', status: 'active', custodian: 'Maria Rocha', department: 'TI', stationId: 's3', lastVerified: '4h atrás' },
  { id: 'a14', name: 'Monitor Dell 24"', type: 'monitor', tag: 'PAT-2024-014', status: 'active', custodian: 'Maria Rocha', department: 'TI', stationId: 's3', lastVerified: '4h atrás' },
  { id: 'a15', name: 'Telefone IP Grandstream', type: 'phone', tag: 'PAT-2024-015', status: 'active', custodian: 'Maria Rocha', department: 'TI', stationId: 's3', lastVerified: '4h atrás' },
];

export const mockStations: Station[] = [
  { id: 's1', label: 'Estação 01', x: 60, y: 80, width: 220, height: 140, type: 'desk', assets: ['a1','a2','a3','a4','a5','a6'], roomId: 'r1', custodian: 'Ana Silva', department: 'TI', zoneId: 'z1' },
  { id: 's2', label: 'Estação 02', x: 300, y: 80, width: 220, height: 140, type: 'desk', assets: ['a7','a8','a9'], roomId: 'r1', custodian: 'Carlos Mendes', department: 'TI', zoneId: 'z1' },
  { id: 's3', label: 'Estação 03', x: 60, y: 260, width: 220, height: 140, type: 'desk', assets: ['a13','a14','a15'], roomId: 'r1', custodian: 'Maria Rocha', department: 'TI', zoneId: 'z1' },
  { id: 's4', label: 'Impressora', x: 560, y: 80, width: 160, height: 120, type: 'printer-station', assets: ['a10'], roomId: 'r1', department: 'Infra', zoneId: 'z2' },
  { id: 's5', label: 'Rack TI', x: 560, y: 240, width: 160, height: 160, type: 'rack-cabinet', assets: [], roomId: 'r1', department: 'Infra', zoneId: 'z2' },
];

export const mockRooms: Room[] = [
  { id: 'r1', name: 'Sala 101 — TI', floor: '1º Andar', sector: 'Setor A', unit: 'Sede Central', stations: ['s1','s2','s3','s4','s5'], zones: ['z1','z2'] },
  { id: 'r2', name: 'Sala 102 — Administrativo', floor: '1º Andar', sector: 'Setor A', unit: 'Sede Central', stations: [] },
  { id: 'r3', name: 'Sala 201 — Diretoria', floor: '2º Andar', sector: 'Setor B', unit: 'Sede Central', stations: [] },
];

export const unassignedAssets = mockAssets.filter(a => !a.stationId);
