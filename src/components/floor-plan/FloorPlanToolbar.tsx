import { MousePointer2, Minus, Plus, RotateCcw, Undo2, Redo2, PenTool, Grid3X3, ArrowLeft, Save, Eye } from 'lucide-react';
import { useFloorPlan } from '@/hooks/use-floor-plan-store';
import { EditorMode } from '@/types/floor-plan';
import { Room } from '@/types/vai';
import { cn } from '@/lib/utils';

interface FloorPlanToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  room?: Room;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const FloorPlanToolbar = ({ mode, onModeChange, room, zoom, onZoomIn, onZoomOut, onReset }: FloorPlanToolbarProps) => {
  const { state, dispatch } = useFloorPlan();
  const isBuilder = mode === 'estrutura';

  return (
    <div className="border-b border-border bg-card flex flex-col flex-shrink-0">
      {/* Top header */}
      <div className="h-11 flex items-center px-3 gap-3 border-b border-border/50">
        {isBuilder && (
          <button
            onClick={() => onModeChange('mapa')}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground vai-transition"
          >
            <ArrowLeft size={13} />
          </button>
        )}
        <span className="text-[13px] font-semibold tracking-tight">{room?.name || 'Sala'}</span>

        {/* Mode tabs */}
        <div className="flex items-center gap-0.5 ml-4 bg-secondary/60 rounded-lg p-0.5">
          <ModeTab label="Mapa Operacional" active={mode === 'mapa'} onClick={() => onModeChange('mapa')} />
          <ModeTab label="Editar Estrutura" active={mode === 'estrutura'} onClick={() => onModeChange('estrutura')} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isBuilder && (
            <>
              <span className="text-[10px] text-muted-foreground/50 font-mono">
                Rascunho atualizado
              </span>
              <span className="text-[10px] text-muted-foreground/40">•</span>
              <span className="text-[10px] text-muted-foreground/50">Administrador VAI</span>
              <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 vai-transition">
                Publicar alterações
              </button>
            </>
          )}
          {!isBuilder && (
            <button
              onClick={() => onModeChange('estrutura')}
              className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-[11px] font-medium hover:bg-secondary/80 vai-transition flex items-center gap-1.5"
            >
              <PenTool size={11} />
              Editar estrutura
            </button>
          )}
        </div>
      </div>

      {/* Tool bar */}
      <div className="h-10 flex items-center px-2 gap-0.5">
        {isBuilder ? (
          <>
            <ToolBtn icon={<MousePointer2 size={14} />} active={state.tool === 'select'} onClick={() => dispatch({ type: 'SET_TOOL', tool: 'select' })} tooltip="Selecionar (V)" />
            <ToolBtn icon={<PenTool size={14} />} active={state.tool === 'wall'} onClick={() => dispatch({ type: 'SET_TOOL', tool: 'wall' })} tooltip="Desenhar parede (W)" />
            <Div />
            <ToolBtn icon={<Undo2 size={14} />} onClick={() => dispatch({ type: 'UNDO' })} disabled={state.historyIndex <= 0} tooltip="Desfazer (⌘Z)" />
            <ToolBtn icon={<Redo2 size={14} />} onClick={() => dispatch({ type: 'REDO' })} disabled={state.historyIndex >= state.history.length - 1} tooltip="Refazer (⌘⇧Z)" />
          </>
        ) : (
          <span className="text-[10px] text-muted-foreground/50 px-2">Visualização</span>
        )}

        <Div />
        <ToolBtn icon={<Minus size={14} />} onClick={onZoomOut} tooltip="Diminuir zoom" />
        <span className="px-2 text-[11px] font-mono text-muted-foreground tabular-nums min-w-[44px] text-center select-none">
          {Math.round(zoom * 100)}%
        </span>
        <ToolBtn icon={<Plus size={14} />} onClick={onZoomIn} tooltip="Aumentar zoom" />
        <ToolBtn icon={<RotateCcw size={13} />} onClick={onReset} tooltip="Resetar vista" />

        <div className="ml-auto flex items-center gap-3 pr-2">
          {isBuilder && (
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Grid3X3 size={11} />
              Grid: 20px
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
            {state.elements.length} ativos · {state.walls.length} paredes
          </span>
        </div>
      </div>
    </div>
  );
};

const Div = () => <div className="w-px h-5 bg-border mx-1" />;

const ModeTab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-3 py-1 rounded-md text-[11px] font-medium vai-transition',
      active
        ? 'bg-card text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    )}
  >
    {label}
  </button>
);

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
