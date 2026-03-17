import { FurnitureTemplate, FurnitureCategory } from '@/types/floor-plan';

export const furnitureTemplates: FurnitureTemplate[] = [
  // Estrutura
  { id: 'door-single', name: 'Porta Simples', category: 'estrutura', width: 80, height: 16, icon: 'DoorOpen' },
  { id: 'door-double', name: 'Porta Dupla', category: 'estrutura', width: 140, height: 16, icon: 'DoorOpen' },
  { id: 'door-sliding', name: 'Porta de Correr', category: 'estrutura', width: 100, height: 12, icon: 'ArrowLeftRight' },
  { id: 'window', name: 'Janela', category: 'estrutura', width: 100, height: 12, icon: 'Square' },
  { id: 'pillar', name: 'Pilar', category: 'estrutura', width: 24, height: 24, icon: 'Square' },
  { id: 'stair', name: 'Escada', category: 'estrutura', width: 100, height: 200, icon: 'ArrowUp' },
  { id: 'partition', name: 'Divisória', category: 'estrutura', width: 120, height: 8, icon: 'Minus' },

  // Escritório
  { id: 'desk', name: 'Mesa Reta', category: 'escritorio', width: 120, height: 60, icon: 'Monitor' },
  { id: 'desk-l', name: 'Mesa em L', category: 'escritorio', width: 160, height: 120, icon: 'Monitor' },
  { id: 'workstation', name: 'Estação de Trabalho', category: 'escritorio', width: 140, height: 70, icon: 'Monitor' },
  { id: 'chair-office', name: 'Cadeira Office', category: 'escritorio', width: 44, height: 44, icon: 'Armchair' },
  { id: 'meeting-table', name: 'Mesa de Reunião', category: 'escritorio', width: 200, height: 100, icon: 'Users' },
  { id: 'cabinet', name: 'Armário', category: 'escritorio', width: 80, height: 45, icon: 'Archive' },
  { id: 'file-cabinet', name: 'Arquivo', category: 'escritorio', width: 44, height: 60, icon: 'FileBox' },
  { id: 'reception-counter', name: 'Balcão Recepção', category: 'escritorio', width: 200, height: 60, icon: 'ConciergeBell' },
  { id: 'partition-baia', name: 'Divisória de Baia', category: 'escritorio', width: 140, height: 8, icon: 'Minus' },

  // Recepção / Sala
  { id: 'sofa-2', name: 'Sofá 2 Lugares', category: 'recepcao', width: 140, height: 70, icon: 'Sofa' },
  { id: 'sofa-3', name: 'Sofá 3 Lugares', category: 'recepcao', width: 200, height: 70, icon: 'Sofa' },
  { id: 'armchair', name: 'Poltrona', category: 'recepcao', width: 70, height: 70, icon: 'Armchair' },
  { id: 'coffee-table', name: 'Mesa de Centro', category: 'recepcao', width: 100, height: 50, icon: 'Square' },
  { id: 'bookshelf', name: 'Estante', category: 'recepcao', width: 120, height: 35, icon: 'Library' },

  // Banheiro
  { id: 'toilet', name: 'Vaso Sanitário', category: 'banheiro', width: 40, height: 55, icon: 'Bath' },
  { id: 'sink', name: 'Pia / Lavatório', category: 'banheiro', width: 50, height: 40, icon: 'Droplets' },
  { id: 'shower', name: 'Box / Chuveiro', category: 'banheiro', width: 90, height: 90, icon: 'ShowerHead' },

  // Cozinha
  { id: 'counter', name: 'Bancada Reta', category: 'cozinha', width: 180, height: 60, icon: 'CookingPot' },
  { id: 'fridge', name: 'Geladeira', category: 'cozinha', width: 60, height: 65, icon: 'Refrigerator' },
  { id: 'stove', name: 'Fogão / Cooktop', category: 'cozinha', width: 60, height: 55, icon: 'Flame' },
  { id: 'dining-table', name: 'Mesa de Jantar', category: 'cozinha', width: 140, height: 80, icon: 'UtensilsCrossed' },

  // Complementos
  { id: 'printer', name: 'Impressora', category: 'complementos', width: 50, height: 50, icon: 'Printer' },
  { id: 'rack-server', name: 'Rack / Armário Técnico', category: 'complementos', width: 60, height: 80, icon: 'Server' },
  { id: 'plant', name: 'Planta Decorativa', category: 'complementos', width: 30, height: 30, icon: 'TreePine' },
  { id: 'tv', name: 'Televisão', category: 'complementos', width: 100, height: 8, icon: 'Tv' },
];

export const categoryLabels: Record<FurnitureCategory, string> = {
  estrutura: 'Estrutura',
  escritorio: 'Escritório',
  recepcao: 'Sala / Recepção',
  banheiro: 'Banheiro',
  cozinha: 'Cozinha / Copa',
  complementos: 'Complementos',
};

export const categoryOrder: FurnitureCategory[] = [
  'estrutura',
  'escritorio',
  'recepcao',
  'banheiro',
  'cozinha',
  'complementos',
];

export const getTemplate = (id: string) => furnitureTemplates.find(t => t.id === id);
