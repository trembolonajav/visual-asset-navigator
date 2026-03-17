import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { FPState, FPAction, FPElement, FPWall } from '@/types/floor-plan';

const GRID = 20;
export const snap = (v: number) => Math.round(v / GRID) * GRID;

const initialState: FPState = {
  elements: [],
  walls: [],
  selectedId: null,
  tool: 'select',
  placingTemplateId: null,
  history: [{ elements: [], walls: [] }],
  historyIndex: 0,
};

function pushHistory(state: FPState, elements: FPElement[], walls: FPWall[]): Pick<FPState, 'history' | 'historyIndex'> {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push({ elements: [...elements], walls: [...walls] });
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

function reducer(state: FPState, action: FPAction): FPState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const elements = [...state.elements, action.element];
      return { ...state, elements, selectedId: action.element.id, tool: 'select', placingTemplateId: null, ...pushHistory(state, elements, state.walls) };
    }
    case 'MOVE_ELEMENT': {
      const elements = state.elements.map(e => e.id === action.id ? { ...e, x: action.x, y: action.y } : e);
      return { ...state, elements, ...pushHistory(state, elements, state.walls) };
    }
    case 'ROTATE_ELEMENT': {
      const elements = state.elements.map(e => e.id === action.id ? { ...e, rotation: action.rotation } : e);
      return { ...state, elements, ...pushHistory(state, elements, state.walls) };
    }
    case 'RESIZE_ELEMENT': {
      const elements = state.elements.map(e => e.id === action.id ? { ...e, width: action.width, height: action.height } : e);
      return { ...state, elements, ...pushHistory(state, elements, state.walls) };
    }
    case 'UPDATE_ELEMENT': {
      const elements = state.elements.map(e => e.id === action.id ? { ...e, ...action.changes } : e);
      return { ...state, elements, ...pushHistory(state, elements, state.walls) };
    }
    case 'DELETE_ELEMENT': {
      const elements = state.elements.filter(e => e.id !== action.id);
      return { ...state, elements, selectedId: state.selectedId === action.id ? null : state.selectedId, ...pushHistory(state, elements, state.walls) };
    }
    case 'DUPLICATE_ELEMENT': {
      const src = state.elements.find(e => e.id === action.id);
      if (!src) return state;
      const dup: FPElement = { ...src, id: crypto.randomUUID(), x: src.x + GRID, y: src.y + GRID };
      const elements = [...state.elements, dup];
      return { ...state, elements, selectedId: dup.id, ...pushHistory(state, elements, state.walls) };
    }
    case 'ADD_WALL': {
      const walls = [...state.walls, action.wall];
      return { ...state, walls, ...pushHistory(state, state.elements, walls) };
    }
    case 'DELETE_WALL': {
      const walls = state.walls.filter(w => w.id !== action.id);
      return { ...state, walls, selectedId: state.selectedId === action.id ? null : state.selectedId, ...pushHistory(state, state.elements, walls) };
    }
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'SET_TOOL':
      return { ...state, tool: action.tool, placingTemplateId: action.tool !== 'place' ? null : state.placingTemplateId };
    case 'SET_PLACING':
      return { ...state, placingTemplateId: action.templateId, tool: action.templateId ? 'place' : 'select' };
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const idx = state.historyIndex - 1;
      const snap = state.history[idx];
      return { ...state, elements: [...snap.elements], walls: [...snap.walls], historyIndex: idx, selectedId: null };
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const idx = state.historyIndex + 1;
      const snap = state.history[idx];
      return { ...state, elements: [...snap.elements], walls: [...snap.walls], historyIndex: idx, selectedId: null };
    }
    case 'LOAD':
      return { ...state, elements: action.plan.elements, walls: action.plan.walls, selectedId: null, ...pushHistory(state, action.plan.elements, action.plan.walls) };
    default:
      return state;
  }
}

interface FPContextValue {
  state: FPState;
  dispatch: (action: FPAction) => void;
}

const FPContext = createContext<FPContextValue | null>(null);

export const FloorPlanProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <FPContext.Provider value={{ state, dispatch }}>{children}</FPContext.Provider>;
};

export const useFloorPlan = () => {
  const ctx = useContext(FPContext);
  if (!ctx) throw new Error('useFloorPlan must be used within FloorPlanProvider');
  return ctx;
};
