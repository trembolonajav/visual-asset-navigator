import { motion } from 'framer-motion';
import { Station, Asset } from '@/types/vai';
import { StatusDot } from './StatusDot';
import { AssetIcon } from './AssetIcon';
import { User, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationBlockProps {
  station: Station;
  assets: Asset[];
  selected?: boolean;
  onClick?: () => void;
}

const typeLabels: Record<string, string> = {
  desk: 'Mesa',
  counter: 'Balcão',
  'rack-cabinet': 'Rack',
  'printer-station': 'Impressora',
  wall: 'Parede',
  door: 'Porta',
};

type StationStatus = 'ok' | 'warning' | 'empty';

const getStationStatus = (assets: Asset[]): StationStatus => {
  if (assets.length === 0) return 'empty';
  if (assets.some(a => a.status === 'missing' || a.status === 'maintenance')) return 'warning';
  return 'ok';
};

export const StationBlock = ({ station, assets, selected = false, onClick }: StationBlockProps) => {
  const status = getStationStatus(assets);

  return (
    <motion.div
      layout
      whileHover={{ y: -1, boxShadow: '0 4px 12px -2px hsl(220 20% 10% / 0.08)' }}
      whileTap={{ scale: 0.99 }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className={cn(
        'absolute rounded-lg vai-transition cursor-pointer select-none flex flex-col overflow-hidden',
        'border bg-card',
        selected
          ? 'border-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.12)] z-10'
          : status === 'warning'
            ? 'border-accent/40'
            : 'border-border hover:border-primary/30',
      )}
      style={{
        left: station.x,
        top: station.y,
        width: station.width,
        height: station.height,
      }}
    >
      {/* Header */}
      <div className={cn(
        'px-3 py-2 border-b flex items-center justify-between gap-2',
        selected ? 'border-primary/10 bg-primary/[0.03]' : 'border-border',
      )}>
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn(
            'text-[11px] font-semibold tracking-tight truncate',
            selected ? 'text-primary' : 'text-foreground',
          )}>
            {station.label}
          </span>
          <span className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-wider flex-shrink-0">
            {typeLabels[station.type] || station.type}
          </span>
        </div>
        {status === 'warning' && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 animate-pulse-missing" />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-3 py-2 flex flex-col gap-1.5 min-h-0">
        {/* Custodian & Department */}
        {(station.custodian || station.department) && (
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            {station.custodian && (
              <span className="flex items-center gap-1 truncate">
                <User size={9} className="flex-shrink-0" />
                <span className="truncate">{station.custodian}</span>
              </span>
            )}
            {station.department && (
              <span className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-medium uppercase tracking-wider flex-shrink-0">
                {station.department}
              </span>
            )}
          </div>
        )}

        {/* Asset icons */}
        <div className="flex flex-wrap gap-1">
          {assets.map(asset => (
            <div
              key={asset.id}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/60 text-[10px]"
              title={`${asset.name} — ${asset.tag}`}
            >
              <AssetIcon type={asset.type} size={10} />
              <StatusDot status={asset.status} />
            </div>
          ))}
        </div>

        {assets.length === 0 && (
          <span className="text-[10px] text-muted-foreground/50 italic">Sem ativos</span>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-border/50 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Package size={9} />
          {assets.length}
        </span>
        {status === 'ok' && assets.length > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
};
