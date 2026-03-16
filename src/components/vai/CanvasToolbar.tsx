import { ZoomIn, ZoomOut, RotateCcw, MousePointer2, Plus, Square, Minus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CanvasToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const CanvasToolbar = ({ zoom, onZoomIn, onZoomOut, onReset }: CanvasToolbarProps) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-1.5 py-1 rounded-xl vai-surface-elevated z-10">
      {/* Zoom controls */}
      <ToolButton icon={<Minus size={13} />} onClick={onZoomOut} tooltip="Diminuir zoom" />
      <span className="px-2.5 text-[11px] font-mono text-muted-foreground tabular-nums min-w-[42px] text-center select-none">
        {Math.round(zoom * 100)}%
      </span>
      <ToolButton icon={<Plus size={13} />} onClick={onZoomIn} tooltip="Aumentar zoom" />
      <Divider />
      <ToolButton icon={<RotateCcw size={13} />} onClick={onReset} tooltip="Resetar vista" />
      <Divider />

      {/* Future edit mode toggle */}
      <ToolButton
        icon={<MousePointer2 size={13} />}
        active={!editMode}
        onClick={() => setEditMode(false)}
        tooltip="Selecionar"
      />
      <ToolButton
        icon={<Square size={13} />}
        active={editMode}
        onClick={() => setEditMode(true)}
        tooltip="Editar layout (em breve)"
      />
    </div>
  );
};

const Divider = () => <div className="w-px h-4 bg-border mx-0.5" />;

const ToolButton = ({ icon, onClick, active, tooltip }: { icon: React.ReactNode; onClick: () => void; active?: boolean; tooltip?: string }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={cn(
      'w-7 h-7 flex items-center justify-center rounded-lg vai-transition',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
    )}
  >
    {icon}
  </button>
);
