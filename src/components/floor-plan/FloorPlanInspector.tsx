import { useMemo } from 'react';
import { X, RotateCw, Copy, Trash2, Lock, Unlock, MapPin, User, Package, CheckCircle2, AlertTriangle, Wrench, Link2, Unlink } from 'lucide-react';
import { useFloorPlan } from '@/hooks/use-floor-plan-store';
import { getTemplate } from '@/data/furniture-library';
import { renderFurniture } from './FurnitureSVG';
import { AssetIcon } from '@/components/vai/AssetIcon';
import { EditorMode } from '@/types/floor-plan';
import { Station, Asset, Room } from '@/types/vai';
import { mockStations, mockAssets, mockRooms, mockZones } from '@/data/mock-data';
import { cn } from '@/lib/utils';

interface FloorPlanInspectorProps {
  mode: EditorMode;
}

export const FloorPlanInspector = ({ mode }: FloorPlanInspectorProps) => {
  const { state, dispatch } = useFloorPlan();

  const selectedEl = state.elements.find(e => e.id === state.selectedId);
  const selectedWall = state.walls.find(w => w.id === state.selectedId);

  // Get station data for selected element
  const stationData = useMemo(() => {
    if (!selectedEl?.stationId) return null;
    const station = mockStations.find(s => s.id === selectedEl.stationId);
    if (!station) return null;
    const assets = mockAssets.filter(a => a.stationId === station.id);
    const room = mockRooms.find(r => r.id === station.roomId);
    const zone = mockZones.find(z => z.id === station.zoneId);
    return { station, assets, room, zone };
  }, [selectedEl]);

  const isMapMode = mode === 'mapa';

  // Empty state
  if (!selectedEl && !selectedWall) {
    return (
      <aside className="w-[280px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        <div className="px-4 py-3.5 border-b border-border">
          <p className="vai-label">{isMapMode ? 'Estação' : 'Propriedades'}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isMapMode ? 'Painel contextual da seleção atual' : 'Selecione um elemento'}
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-xs text-muted-foreground/50 text-center">
            {isMapMode
              ? 'Clique em uma estação para ver seus detalhes'
              : 'Selecione um elemento para ver suas propriedades'
            }
          </p>
        </div>
      </aside>
    );
  }

  // Map mode with station selected
  if (isMapMode && selectedEl && stationData) {
    const { station, assets, room, zone } = stationData;
    const status = getStationStatus(assets);
    const capacity = station.capacity || assets.length;
    const locationPath = room
      ? [room.unit, room.floor, room.sector, room.name, station.label].join(' > ')
      : station.label;

    return (
      <aside className="w-[300px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="vai-label">Estação</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Painel contextual da seleção atual</p>
          </div>
          <button onClick={() => dispatch({ type: 'SELECT', id: null })} className="p-1 rounded-md hover:bg-secondary vai-transition">
            <X size={13} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Station name + location */}
          <div className="px-4 py-4 border-b border-border">
            <h2 className="text-base font-bold tracking-tight">{station.label}</h2>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{locationPath}</p>
          </div>

          {/* Position */}
          <div className="px-4 py-3 border-b border-border">
            <p className="vai-label mb-3">Posição Operacional</p>
            <div className="grid grid-cols-2 gap-3">
              <InfoBlock icon={<User size={12} />} label="Responsável" value={station.custodian || 'Sem responsável'} />
              <InfoBlock icon={<MapPin size={12} />} label="Departamento" value={station.department || '—'} />
            </div>
            <div className="mt-3">
              <InfoBlock
                icon={<Package size={12} />}
                label="Ocupação"
                value={`${assets.length}/${capacity}`}
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">⚙ {assets.length} ativo(s)</span>
                <span className={cn(
                  'text-[10px] font-semibold flex items-center gap-1',
                  status === 'ok' ? 'text-success' : status === 'alert' ? 'text-accent' : 'text-muted-foreground/50'
                )}>
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    status === 'ok' ? 'bg-success' : status === 'alert' ? 'bg-accent' : 'bg-muted-foreground/30'
                  )} />
                  {status === 'ok' ? 'Tudo OK' : status === 'alert' ? 'Atenção' : 'Vazio'}
                </span>
              </div>
            </div>
          </div>

          {/* Assets */}
          <div className="px-4 py-3 border-b border-border">
            <p className="vai-label mb-3">Ativos Vinculados</p>
            {assets.length === 0 ? (
              <p className="text-[10px] text-muted-foreground/50 italic">Nenhum ativo vinculado</p>
            ) : (
              <div className="space-y-1">
                {assets.map(asset => (
                  <div key={asset.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-secondary/40 vai-transition">
                    <AssetIcon type={asset.type} size={14} />
                    <span className="text-[11px] font-medium flex-1 truncate">{asset.name}</span>
                    <span className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      asset.status === 'active' ? 'bg-success' :
                      asset.status === 'maintenance' ? 'bg-warning' :
                      asset.status === 'missing' ? 'bg-destructive' : 'bg-primary'
                    )} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit station */}
          <div className="px-4 py-3">
            <p className="vai-label mb-3">Editar Estação</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Nome</label>
                <input
                  type="text"
                  value={station.label}
                  readOnly
                  className="w-full mt-1 px-2.5 py-1.5 rounded-md bg-secondary/60 border-0 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Tipo</label>
                <select className="w-full mt-1 px-2.5 py-1.5 rounded-md bg-secondary/60 border-0 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30">
                  <option>Estação</option>
                  <option>Rack</option>
                  <option>Impressora</option>
                  <option>Bancada</option>
                </select>
              </div>
              <p className="text-[9px] text-muted-foreground/50 leading-relaxed">
                O tipo define base sugerida, dimensões e capacidade. Se nenhuma base for escolhida, o sistema cria uma base padrão.
              </p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Builder mode — Wall selected
  if (selectedWall && !isMapMode) {
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

  // Builder mode — Element selected
  if (!selectedEl) return null;
  const tmpl = getTemplate(selectedEl.templateId);
  const previewScale = Math.min(60 / selectedEl.width, 60 / selectedEl.height) * 0.85;

  return (
    <aside className="w-[280px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
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

        {/* Physical base toggle */}
        {tmpl?.canBeBase && (
          <div className="p-3 rounded-lg border border-border bg-secondary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 size={12} className={selectedEl.isPhysicalBase ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-[11px] font-medium">Base Física</span>
              </div>
              <button
                onClick={() => {
                  if (selectedEl.isPhysicalBase) {
                    dispatch({ type: 'UNMARK_BASE', id: selectedEl.id });
                  } else {
                    dispatch({ type: 'MARK_AS_BASE', id: selectedEl.id, stationId: `st-${Date.now()}` });
                  }
                }}
                className={cn(
                  'px-2 py-1 rounded text-[10px] font-medium vai-transition',
                  selectedEl.isPhysicalBase
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                )}
              >
                {selectedEl.isPhysicalBase ? 'Vinculada' : 'Vincular'}
              </button>
            </div>
            {selectedEl.isPhysicalBase && selectedEl.stationId && (
              <p className="text-[9px] text-muted-foreground mt-1.5">
                Estação: {mockStations.find(s => s.id === selectedEl.stationId)?.label || selectedEl.stationId}
              </p>
            )}
          </div>
        )}

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

function getStationStatus(assets: Asset[]): 'ok' | 'alert' | 'empty' {
  if (assets.length === 0) return 'empty';
  if (assets.some(a => a.status === 'missing' || a.status === 'maintenance')) return 'alert';
  return 'ok';
}

const InfoBlock = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</span>
    <div>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-[12px] font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

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
      destructive ? 'text-destructive hover:bg-destructive/10' : 'text-foreground/70 hover:bg-secondary/60',
    )}
  >
    {icon}
    {label}
  </button>
);
