import { Asset, Station, Room } from '@/types/vai';
import { FPElement } from '@/types/floor-plan';
import { mockStations, mockAssets, mockZones } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { useFloorPlan } from '@/hooks/use-floor-plan-store';
import { AssetIcon } from '@/components/vai/AssetIcon';
import { X, User, Package, MapPin, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StationOverlayProps {
  element: FPElement;
  station: Station;
  assets: Asset[];
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const typeLabels: Record<string, string> = {
  desk: 'MESA', 'desk-l': 'MESA', workstation: 'MESA', bancada: 'BANCADA',
  'dual-station': 'MESA', 'operation-desk': 'MESA', 'meeting-table': 'REUNIÃO',
  'reception-counter': 'RECEPÇÃO', 'rack-cabinet': 'RACK', 'printer-station': 'IMPRESSORA',
  printer: 'IMPRESSORA', 'rack-server': 'RACK', cabinet: 'ARMÁRIO',
};

type StationStatus = 'ok' | 'alert' | 'empty';

const getStatus = (assets: Asset[]): StationStatus => {
  if (assets.length === 0) return 'empty';
  if (assets.some(a => a.status === 'missing' || a.status === 'maintenance')) return 'alert';
  return 'ok';
};

export const StationOverlay = ({ element, station, assets, selected, onClick }: StationOverlayProps) => {
  const status = getStatus(assets);
  const typeLabel = typeLabels[station.type] || typeLabels[element.templateId] || 'POSIÇÃO';
  const capacity = station.capacity || assets.length;
  const pad = 10;
  const headerH = 28;
  const footerH = 22;
  const totalW = Math.max(element.width + pad * 2, 160);
  const totalH = element.height + pad * 2 + headerH + footerH;
  const offsetX = -(totalW - element.width) / 2;
  const offsetY = -headerH - pad;

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
    >
      {/* Container background */}
      <rect
        x={element.x + offsetX}
        y={element.y + offsetY}
        width={totalW}
        height={totalH}
        rx={8}
        fill="hsl(var(--card))"
        stroke={selected ? 'hsl(var(--primary))' : status === 'alert' ? 'hsl(var(--accent))' : 'hsl(var(--border))'}
        strokeWidth={selected ? 2 : 1}
        opacity={1}
      />
      {selected && (
        <rect
          x={element.x + offsetX - 2}
          y={element.y + offsetY - 2}
          width={totalW + 4}
          height={totalH + 4}
          rx={10}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={1}
          strokeOpacity={0.15}
        />
      )}

      {/* Header: type badge + name + status */}
      <foreignObject
        x={element.x + offsetX}
        y={element.y + offsetY}
        width={totalW}
        height={headerH}
      >
        <div className="flex items-center gap-1.5 px-2.5 h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span className={cn(
            'text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
            selected ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
          )}>
            {typeLabel}
          </span>
          <span className="text-[10px] font-semibold text-foreground truncate flex-1">
            {station.label}
          </span>
          <span className={cn(
            'w-2 h-2 rounded-full flex-shrink-0',
            status === 'ok' ? 'bg-success' : status === 'alert' ? 'bg-accent animate-pulse-missing' : 'bg-muted-foreground/30'
          )} />
        </div>
      </foreignObject>

      {/* Custodian line */}
      {station.custodian && (
        <foreignObject
          x={element.x + offsetX}
          y={element.y + offsetY + headerH - 6}
          width={totalW}
          height={14}
        >
          <div className="flex items-center gap-1 px-2.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            <User size={8} className="text-muted-foreground flex-shrink-0" />
            <span className="text-[9px] text-muted-foreground truncate">{station.custodian}</span>
          </div>
        </foreignObject>
      )}

      {/* Footer: asset count + department + status */}
      <foreignObject
        x={element.x + offsetX}
        y={element.y + element.height + pad - 2}
        width={totalW}
        height={footerH}
      >
        <div className="flex items-center justify-between px-2.5 h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
          <div className="flex items-center gap-1.5">
            <Package size={9} className="text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground font-mono">{assets.length}/{capacity} ativos</span>
          </div>
          <div className="flex items-center gap-1.5">
            {station.department && (
              <span className="text-[8px] font-medium uppercase tracking-wider text-muted-foreground/70 px-1 py-0.5 rounded bg-secondary/80">
                {station.department}
              </span>
            )}
            <span className={cn(
              'text-[9px] font-semibold',
              status === 'ok' ? 'text-success' : status === 'alert' ? 'text-accent' : 'text-muted-foreground/50'
            )}>
              {status === 'ok' ? 'OK' : status === 'alert' ? 'ALERTA' : 'VAZIO'}
            </span>
          </div>
        </div>
      </foreignObject>

      {/* Progress bar */}
      <rect
        x={element.x + offsetX + 10}
        y={element.y + element.height + pad + footerH - 6}
        width={totalW - 20}
        height={2}
        rx={1}
        fill="hsl(var(--secondary))"
      />
      {assets.length > 0 && (
        <rect
          x={element.x + offsetX + 10}
          y={element.y + element.height + pad + footerH - 6}
          width={(totalW - 20) * (assets.length / capacity)}
          height={2}
          rx={1}
          fill={status === 'ok' ? 'hsl(var(--success))' : 'hsl(var(--accent))'}
        />
      )}
    </g>
  );
};
