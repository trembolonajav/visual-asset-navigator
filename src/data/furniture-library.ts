import { FurnitureTemplate, FurnitureCategory } from '@/types/floor-plan';

export const furnitureTemplates: FurnitureTemplate[] = [
  // ── Arquitetura ──
  { id: 'door-single', name: 'Porta Simples', category: 'arquitetura', width: 80, height: 16, icon: 'DoorOpen' },
  { id: 'door-double', name: 'Porta Dupla', category: 'arquitetura', width: 140, height: 16, icon: 'DoorOpen' },
  { id: 'door-sliding', name: 'Porta de Correr', category: 'arquitetura', width: 100, height: 12, icon: 'ArrowLeftRight' },
  { id: 'window', name: 'Janela Técnica', category: 'arquitetura', width: 100, height: 12, icon: 'Square' },
  { id: 'pillar', name: 'Pilar', category: 'arquitetura', width: 24, height: 24, icon: 'Square' },
  { id: 'stair', name: 'Escada', category: 'arquitetura', width: 100, height: 200, icon: 'ArrowUp' },
  { id: 'partition', name: 'Divisória', category: 'arquitetura', width: 120, height: 8, icon: 'Minus' },

  // ── Estações de Trabalho ──
  { id: 'desk', name: 'Mesa Técnica', category: 'estacoes', width: 120, height: 60, icon: 'Monitor', canBeBase: true },
  { id: 'desk-l', name: 'Mesa em L', category: 'estacoes', width: 160, height: 120, icon: 'Monitor', canBeBase: true },
  { id: 'workstation', name: 'Estação de Trabalho', category: 'estacoes', width: 140, height: 70, icon: 'Monitor', canBeBase: true },
  { id: 'bancada', name: 'Bancada de Suporte', category: 'estacoes', width: 160, height: 50, icon: 'Monitor', canBeBase: true },
  { id: 'dual-station', name: 'Estação Dual', category: 'estacoes', width: 240, height: 70, icon: 'Monitor', canBeBase: true },
  { id: 'operation-desk', name: 'Mesa de Operação', category: 'estacoes', width: 180, height: 80, icon: 'Monitor', canBeBase: true },
  { id: 'meeting-table', name: 'Mesa de Reunião', category: 'estacoes', width: 200, height: 100, icon: 'Users', canBeBase: true },
  { id: 'reception-counter', name: 'Balcão Recepção', category: 'estacoes', width: 200, height: 60, icon: 'ConciergeBell', canBeBase: true },
  { id: 'partition-baia', name: 'Divisória de Baia', category: 'estacoes', width: 140, height: 8, icon: 'Minus' },
  { id: 'cabinet', name: 'Armário', category: 'estacoes', width: 80, height: 45, icon: 'Archive', canBeBase: true },
  { id: 'file-cabinet', name: 'Gaveteiro', category: 'estacoes', width: 44, height: 60, icon: 'FileBox' },
  { id: 'chair-office', name: 'Cadeira Office', category: 'estacoes', width: 44, height: 44, icon: 'Armchair' },
  { id: 'chair-guest', name: 'Cadeira Apoio', category: 'estacoes', width: 40, height: 40, icon: 'Armchair' },

  // ── Dispositivos ──
  { id: 'pc-desktop', name: 'PC Desktop', category: 'dispositivos', width: 20, height: 40, icon: 'Cpu' },
  { id: 'notebook', name: 'Notebook', category: 'dispositivos', width: 32, height: 24, icon: 'Laptop' },
  { id: 'monitor-device', name: 'Monitor', category: 'dispositivos', width: 40, height: 20, icon: 'Monitor' },
  { id: 'printer', name: 'Impressora', category: 'dispositivos', width: 50, height: 50, icon: 'Printer', canBeBase: true },
  { id: 'rack-server', name: 'Rack / Armário Técnico', category: 'dispositivos', width: 60, height: 80, icon: 'Server', canBeBase: true },
  { id: 'switch-network', name: 'Switch de Rede', category: 'dispositivos', width: 44, height: 16, icon: 'Network' },
  { id: 'router', name: 'Roteador', category: 'dispositivos', width: 30, height: 20, icon: 'Wifi' },
  { id: 'phone-ip', name: 'Telefone IP', category: 'dispositivos', width: 24, height: 28, icon: 'Phone' },

  // ── Complementos ──
  { id: 'sofa-2', name: 'Sofá 2 Lugares', category: 'complementos', width: 140, height: 70, icon: 'Sofa' },
  { id: 'sofa-3', name: 'Sofá 3 Lugares', category: 'complementos', width: 200, height: 70, icon: 'Sofa' },
  { id: 'armchair', name: 'Poltrona', category: 'complementos', width: 70, height: 70, icon: 'Armchair' },
  { id: 'coffee-table', name: 'Mesa de Centro', category: 'complementos', width: 100, height: 50, icon: 'Square' },
  { id: 'bookshelf', name: 'Estante', category: 'complementos', width: 120, height: 35, icon: 'Library' },
  { id: 'plant', name: 'Planta Decorativa', category: 'complementos', width: 30, height: 30, icon: 'TreePine' },
  { id: 'tv', name: 'Televisão', category: 'complementos', width: 100, height: 8, icon: 'Tv' },
];

export const categoryLabels: Record<FurnitureCategory, string> = {
  arquitetura: 'Arquitetura',
  estacoes: 'Estações de Trabalho',
  dispositivos: 'Dispositivos',
  complementos: 'Complementos',
};

export const categoryOrder: FurnitureCategory[] = [
  'arquitetura',
  'estacoes',
  'dispositivos',
  'complementos',
];

export const getTemplate = (id: string) => furnitureTemplates.find(t => t.id === id);
