import { MousePointer2, Minus, Plus, RotateCcw, Undo2, Redo2, PenTool, Grid3X3 } from 'lucide-react';
import { useFloorPlan } from '@/hooks/use-floor-plan-store';
import { cn } from '@/lib/utils';

interface FloorPlanToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const FloorPlanToolbar = ({ zoom, onZoomIn, onZoomOut, onReset }: FloorPlanToolbarProps) => {
  const { state, dispatch } = useFloorPlan();

  return (
    <div className="h-10 border-b border-border bg-card flex items-center px-2 gap-0.5 flex-shrink-0">
      {/* Tool selection */}
      <ToolBtn
        icon={<MousePointer2 size={14} />}
        active={state.tool === 'select'}
        onClick={() => dispatch({ type: 'SET_TOOL', tool: 'select' })}
        tooltip="Selecionar (V)"
      />
      <ToolBtn
        icon={<PenTool size={14} />}
        active={state.tool === 'wall'}
        onClick={() => dispatch({ type: 'SET_TOOL', tool: 'wall' })}
        tooltip="Desenhar parede (W)"
      />

      <Div />

      {/* Undo / Redo */}
      <ToolBtn
        icon={<Undo2 size={14} />}
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={state.historyIndex <= 0}
        tooltip="Desfazer (⌘Z)"
      />
      <ToolBtn
        icon={<Redo2 size={14} />}
        onClick={() => dispatch({ type: 'REDO' })}
        disabled={state.historyIndex >= state.history.length - 1}
        tooltip="Refazer (⌘⇧Z)"
      />

      <Div />

      {/* Zoom */}
      <ToolBtn icon={<Minus size={14} />} onClick={onZoomOut} tooltip="Diminuir zoom" />
      <span className="px-2 text-[11px] font-mono text-muted-foreground tabular-nums min-w-[44px] text-center select-none">
        {Math.round(zoom * 100)}%
      </span>
      <ToolBtn icon={<Plus size={14} />} onClick={onZoomIn} tooltip="Aumentar zoom" />
      <ToolBtn icon={<RotateCcw size={13} />} onClick={onReset} tooltip="Resetar vista" />

      {/* Right side info */}
      <div className="ml-auto flex items-center gap-3 pr-2">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Grid3X3 size={11} />
          Snap: 20px
        </span>
        <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
          {state.elements.length} elem · {state.walls.length} paredes
        </span>
      </div>
    </div>
  );
};

const Div = () => <div className="w-px h-5 bg-border mx-1" />;

const ToolBtn = ({ icon, onClick, active, disabled, tooltip }: {
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={tooltip}
    className={cn(
      'w-8 h-8 flex items-center justify-center rounded-md vai-transition',
      active
        ? 'bg-primary/10 text-primary'
        : disabled
          ? 'text-muted-foreground/30 cursor-not-allowed'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
    )}
  >
    {icon}
  </button>
);
