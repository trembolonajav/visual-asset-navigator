import { Asset, Station, Room, Zone } from '@/types/vai';
import { FPElement, FPWall } from '@/types/floor-plan';

// ── Zones ──
export const mockZones: Zone[] = [
  { id: 'z1', label: 'TI', x: 50, y: 50, width: 460, height: 400, roomId: 'r1' },
  { id: 'z2', label: 'Impressão & Infra', x: 530, y: 50, width: 220, height: 400, roomId: 'r1' },
];

// ── Assets ──
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

// ── Stations linked to floor plan elements ──
export const mockStations: Station[] = [
  { id: 's1', label: 'Estação 01', type: 'desk', elementId: 'fp-desk-1', assets: ['a1','a2','a3','a4','a5','a6'], roomId: 'r1', custodian: 'Ana Silva', department: 'TI', zoneId: 'z1', capacity: 6 },
  { id: 's2', label: 'Estação 02', type: 'desk', elementId: 'fp-desk-2', assets: ['a7','a8','a9'], roomId: 'r1', custodian: 'Carlos Mendes', department: 'TI', zoneId: 'z1', capacity: 4 },
  { id: 's3', label: 'Estação 03', type: 'desk', elementId: 'fp-desk-3', assets: ['a13','a14','a15'], roomId: 'r1', custodian: 'Maria Rocha', department: 'TI', zoneId: 'z1', capacity: 4 },
  { id: 's4', label: 'Ponto Impressora', type: 'printer-station', elementId: 'fp-printer', assets: ['a10'], roomId: 'r1', department: 'Infra', zoneId: 'z2', capacity: 1 },
  { id: 's5', label: 'Rack Infra', type: 'rack-cabinet', elementId: 'fp-rack', assets: [], roomId: 'r1', department: 'Infra', zoneId: 'z2', capacity: 8 },
];

// ── Published floor plan for room r1 ──
export const mockPublishedElements: FPElement[] = [
  // Desks (physical bases)
  { id: 'fp-desk-1', templateId: 'desk-l', x: 80, y: 80, width: 160, height: 120, rotation: 0, zIndex: 1, locked: false, isPhysicalBase: true, stationId: 's1' },
  { id: 'fp-desk-2', templateId: 'workstation', x: 300, y: 80, width: 140, height: 70, rotation: 0, zIndex: 2, locked: false, isPhysicalBase: true, stationId: 's2' },
  { id: 'fp-desk-3', templateId: 'desk', x: 80, y: 300, width: 120, height: 60, rotation: 0, zIndex: 3, locked: false, isPhysicalBase: true, stationId: 's3' },
  // Chairs
  { id: 'fp-chair-1', templateId: 'chair-office', x: 120, y: 210, width: 44, height: 44, rotation: 0, zIndex: 10, locked: false },
  { id: 'fp-chair-2', templateId: 'chair-office', x: 350, y: 160, width: 44, height: 44, rotation: 0, zIndex: 11, locked: false },
  { id: 'fp-chair-3', templateId: 'chair-office', x: 120, y: 370, width: 44, height: 44, rotation: 0, zIndex: 12, locked: false },
  // Devices on desks (decorative)
  { id: 'fp-mon-1', templateId: 'monitor-device', x: 100, y: 90, width: 40, height: 20, rotation: 0, zIndex: 20, locked: false },
  { id: 'fp-mon-2', templateId: 'monitor-device', x: 150, y: 90, width: 40, height: 20, rotation: 0, zIndex: 21, locked: false },
  { id: 'fp-mon-3', templateId: 'monitor-device', x: 340, y: 90, width: 40, height: 20, rotation: 0, zIndex: 22, locked: false },
  { id: 'fp-nb-1', templateId: 'notebook', x: 90, y: 310, width: 32, height: 24, rotation: 0, zIndex: 23, locked: false },
  // Printer (physical base)
  { id: 'fp-printer', templateId: 'printer', x: 570, y: 100, width: 50, height: 50, rotation: 0, zIndex: 4, locked: false, isPhysicalBase: true, stationId: 's4' },
  // Rack (physical base)
  { id: 'fp-rack', templateId: 'rack-server', x: 570, y: 220, width: 60, height: 80, rotation: 0, zIndex: 5, locked: false, isPhysicalBase: true, stationId: 's5' },
  // Switch near rack
  { id: 'fp-switch-1', templateId: 'switch-network', x: 575, y: 310, width: 44, height: 16, rotation: 0, zIndex: 24, locked: false },
  // Door
  { id: 'fp-door-1', templateId: 'door-single', x: 360, y: 444, width: 80, height: 16, rotation: 0, zIndex: 30, locked: false },
  // Sofa in waiting area
  { id: 'fp-sofa', templateId: 'sofa-2', x: 260, y: 340, width: 140, height: 70, rotation: 0, zIndex: 6, locked: false },
  { id: 'fp-coffee', templateId: 'coffee-table', x: 290, y: 290, width: 80, height: 40, rotation: 0, zIndex: 7, locked: false },
];

export const mockPublishedWalls: FPWall[] = [
  // Outer walls
  { id: 'w1', x1: 40, y1: 40, x2: 760, y2: 40, thickness: 10, wallType: 'full' },
  { id: 'w2', x1: 760, y1: 40, x2: 760, y2: 460, thickness: 10, wallType: 'full' },
  { id: 'w3', x1: 760, y1: 460, x2: 40, y2: 460, thickness: 10, wallType: 'full' },
  { id: 'w4', x1: 40, y1: 460, x2: 40, y2: 40, thickness: 10, wallType: 'full' },
  // Internal divider
  { id: 'w5', x1: 540, y1: 40, x2: 540, y2: 460, thickness: 8, wallType: 'half' },
  // Window on top wall
  { id: 'w6', x1: 200, y1: 40, x2: 340, y2: 40, thickness: 4, wallType: 'drywall' },
];

// ── Rooms ──
export const mockRooms: Room[] = [
  { id: 'r1', name: 'Sala 101 — TI', floor: '1º Andar', sector: 'Setor A', unit: 'Sede Central', stations: ['s1','s2','s3','s4','s5'], zones: ['z1','z2'] },
  { id: 'r2', name: 'Sala 102 — Administrativo', floor: '1º Andar', sector: 'Setor A', unit: 'Sede Central', stations: [] },
  { id: 'r3', name: 'Sala 201 — Diretoria', floor: '2º Andar', sector: 'Setor B', unit: 'Sede Central', stations: [] },
];

export const unassignedAssets = mockAssets.filter(a => !a.stationId);

// Helper to get published floor plan for a room
export const getPublishedFloorPlan = (roomId: string) => {
  if (roomId === 'r1') {
    return { elements: mockPublishedElements, walls: mockPublishedWalls };
  }
  return { elements: [], walls: [] };
};
