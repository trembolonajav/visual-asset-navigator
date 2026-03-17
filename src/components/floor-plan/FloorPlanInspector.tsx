import { X, RotateCw, Copy, Trash2, Lock, Unlock } from 'lucide-react';
import { useFloorPlan } from '@/hooks/use-floor-plan-store';
import { getTemplate } from '@/data/furniture-library';
import { renderFurniture } from './FurnitureSVG';
import { cn } from '@/lib/utils';

export const FloorPlanInspector = () => {
  const { state, dispatch } = useFloorPlan();

  const selectedEl = state.elements.find(e => e.id === state.selectedId);
  const selectedWall = state.walls.find(w => w.id === state.selectedId);

  if (!selectedEl && !selectedWall) {
    return (
      <aside className="w-[280px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        <div className="px-4 py-3.5 border-b border-border">
          <p className="vai-label">Propriedades</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-xs text-muted-foreground/50 text-center">Selecione um elemento para ver suas propriedades</p>
        </div>
      </aside>
    );
  }

  if (selectedWall) {
    const dx = selectedWall.x2 - selectedWall.x1;
    const dy = selectedWall.y2 - selectedWall.y1;
    const len = Math.round(Math.sqrt(dx * dx + dy * dy));
    return (
      <aside className="w-[280px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
          <p className="vai-label">Parede</p>
          <button onClick={() => dispatch({ type: 'SELECT', id: null })} className="p-1 rounded-md hover:bg-secondary vai-transition">
            <X size={13} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <PropRow label="Comprimento" value={`${len}px`} />
          <PropRow label="Espessura" value={`${selectedWall.thickness}px`} />
          <PropRow label="Tipo" value={selectedWall.wallType === 'full' ? 'Sólida' : selectedWall.wallType === 'half' ? 'Meia Parede' : 'Drywall'} />
          <PropRow label="Início" value={`${selectedWall.x1}, ${selectedWall.y1}`} />
          <PropRow label="Fim" value={`${selectedWall.x2}, ${selectedWall.y2}`} />

          <button
            onClick={() => dispatch({ type: 'DELETE_WALL', id: selectedWall.id })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 vai-transition"
          >
            <Trash2 size={12} /> Excluir parede
          </button>
        </div>
      </aside>
    );
  }

  if (!selectedEl) return null;
  const tmpl = getTemplate(selectedEl.templateId);
  const previewScale = Math.min(60 / selectedEl.width, 60 / selectedEl.height) * 0.85;

  return (
    <aside className="w-[280px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <p className="vai-label">Propriedades</p>
        <button onClick={() => dispatch({ type: 'SELECT', id: null })} className="p-1 rounded-md hover:bg-secondary vai-transition">
          <X size={13} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Preview + name */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg bg-secondary/60 flex items-center justify-center flex-shrink-0">
            <svg width={60} height={60}>
              <g transform={`translate(${(60 - selectedEl.width * previewScale) / 2}, ${(60 - selectedEl.height * previewScale) / 2}) scale(${previewScale})`}>
                {renderFurniture(selectedEl.templateId, selectedEl.width, selectedEl.height)}
              </g>
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{tmpl?.name || selectedEl.templateId}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">{tmpl?.category || 'Elemento'}</p>
          </div>
        </div>

        {/* Position */}
        <div>
          <p className="vai-label mb-2">Posição</p>
          <div className="grid grid-cols-2 gap-2">
            <PropInput label="X" value={selectedEl.x} onChange={v => dispatch({ type: 'UPDATE_ELEMENT', id: selectedEl.id, changes: { x: v } })} />
            <PropInput label="Y" value={selectedEl.y} onChange={v => dispatch({ type: 'UPDATE_ELEMENT', id: selectedEl.id, changes: { y: v } })} />
          </div>
        </div>

        {/* Size */}
        <div>
          <p className="vai-label mb-2">Dimensões</p>
          <div className="grid grid-cols-2 gap-2">
            <PropInput label="L" value={selectedEl.width} onChange={v => dispatch({ type: 'RESIZE_ELEMENT', id: selectedEl.id, width: v, height: selectedEl.height })} />
            <PropInput label="A" value={selectedEl.height} onChange={v => dispatch({ type: 'RESIZE_ELEMENT', id: selectedEl.id, width: selectedEl.width, height: v })} />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <p className="vai-label mb-2">Rotação</p>
          <PropInput label="°" value={selectedEl.rotation} onChange={v => dispatch({ type: 'ROTATE_ELEMENT', id: selectedEl.id, rotation: v })} />
        </div>

        {/* Actions */}
        <div className="space-y-1.5">
          <p className="vai-label mb-2">Ações</p>
          <ActionButton icon={<RotateCw size={12} />} label="Rotacionar 90°" onClick={() => dispatch({ type: 'ROTATE_ELEMENT', id: selectedEl.id, rotation: (selectedEl.rotation + 90) % 360 })} />
          <ActionButton icon={<Copy size={12} />} label="Duplicar" onClick={() => dispatch({ type: 'DUPLICATE_ELEMENT', id: selectedEl.id })} />
          <ActionButton icon={selectedEl.locked ? <Lock size={12} /> : <Unlock size={12} />} label={selectedEl.locked ? 'Desbloquear' : 'Bloquear'} onClick={() => dispatch({ type: 'UPDATE_ELEMENT', id: selectedEl.id, changes: { locked: !selectedEl.locked } })} />
          <ActionButton icon={<Trash2 size={12} />} label="Excluir" destructive onClick={() => dispatch({ type: 'DELETE_ELEMENT', id: selectedEl.id })} />
        </div>
      </div>
    </aside>
  );
};

const PropRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[11px] text-muted-foreground">{label}</span>
    <span className="text-[11px] font-mono font-medium">{value}</span>
  </div>
);

const PropInput = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[10px] font-mono text-muted-foreground w-3 text-right flex-shrink-0">{label}</span>
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="flex-1 px-2 py-1.5 rounded-md bg-secondary/60 border-0 text-xs font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/30 w-full"
    />
  </div>
);

const ActionButton = ({ icon, label, onClick, destructive }: { icon: React.ReactNode; label: string; onClick: () => void; destructive?: boolean }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium vai-transition',
      destructive
        ? 'text-destructive hover:bg-destructive/10'
        : 'text-foreground/70 hover:bg-secondary/60',
    )}
  >
    {icon}
    {label}
  </button>
);
