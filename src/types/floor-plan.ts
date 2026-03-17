export type FPTool = 'select' | 'wall' | 'place';

export type FurnitureCategory =
  | 'estrutura'
  | 'escritorio'
  | 'recepcao'
  | 'banheiro'
  | 'cozinha'
  | 'complementos';

export interface FurnitureTemplate {
  id: string;
  name: string;
  category: FurnitureCategory;
  width: number;   // in canvas units (1 unit = 20px ≈ 0.5m)
  height: number;
  icon: string;     // lucide icon name for sidebar
}

export interface FPElement {
  id: string;
  templateId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  label?: string;
}

export interface FPWall {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  wallType: 'full' | 'half' | 'drywall';
}

export interface FloorPlan {
  id: string;
  name: string;
  gridSize: number;
  elements: FPElement[];
  walls: FPWall[];
}

export interface FPCamera {
  x: number;
  y: number;
  zoom: number;
}

export type FPAction =
  | { type: 'ADD_ELEMENT'; element: FPElement }
  | { type: 'MOVE_ELEMENT'; id: string; x: number; y: number }
  | { type: 'ROTATE_ELEMENT'; id: string; rotation: number }
  | { type: 'RESIZE_ELEMENT'; id: string; width: number; height: number }
  | { type: 'UPDATE_ELEMENT'; id: string; changes: Partial<FPElement> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'DUPLICATE_ELEMENT'; id: string }
  | { type: 'ADD_WALL'; wall: FPWall }
  | { type: 'DELETE_WALL'; id: string }
  | { type: 'SELECT'; id: string | null }
  | { type: 'SET_TOOL'; tool: FPTool }
  | { type: 'SET_PLACING'; templateId: string | null }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD'; plan: FloorPlan };

export interface FPState {
  elements: FPElement[];
  walls: FPWall[];
  selectedId: string | null;
  tool: FPTool;
  placingTemplateId: string | null;
  history: { elements: FPElement[]; walls: FPWall[] }[];
  historyIndex: number;
}
