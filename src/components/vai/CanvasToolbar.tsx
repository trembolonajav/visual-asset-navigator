import { ZoomIn, ZoomOut, Maximize2, MousePointer2, Hand, RotateCcw } from 'lucide-react';

interface CanvasToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const CanvasToolbar = ({ zoom, onZoomIn, onZoomOut, onReset }: CanvasToolbarProps) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-xl vai-surface-elevated z-10">
    <ToolButton icon={<ZoomOut size={14} />} onClick={onZoomOut} />
    <span className="px-2 text-xs font-mono text-muted-foreground tabular-nums min-w-[40px] text-center">
      {Math.round(zoom * 100)}%
    </span>
    <ToolButton icon={<ZoomIn size={14} />} onClick={onZoomIn} />
    <div className="w-px h-4 bg-border mx-1" />
    <ToolButton icon={<RotateCcw size={14} />} onClick={onReset} />
  </div>
);

const ToolButton = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground vai-transition"
  >
    {icon}
  </button>
);
