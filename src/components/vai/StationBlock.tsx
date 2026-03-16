import { motion } from 'framer-motion';
import { Station, Asset } from '@/types/vai';
import { StatusDot } from './StatusDot';
import { AssetIcon } from './AssetIcon';
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

export const StationBlock = ({ station, assets, selected = false, onClick }: StationBlockProps) => {
  const hasIssue = assets.some(a => a.status === 'missing' || a.status === 'maintenance');

  return (
    <motion.div
      layout
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className={cn(
        'absolute rounded-xl vai-transition cursor-pointer select-none',
        assets.length > 0
          ? 'border-2 border-solid'
          : 'border-2 border-dashed',
        selected
          ? 'border-primary bg-primary/5 shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]'
          : hasIssue
            ? 'border-accent/50 bg-accent/5'
            : 'border-vai-station-border bg-card/80 hover:border-primary/40',
      )}
      style={{
        left: station.x,
        top: station.y,
        width: station.width,
        height: station.height,
      }}
    >
      {/* Label */}
      <span className="absolute -top-2.5 left-3 px-1.5 bg-background text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
        {station.label}
      </span>

      {/* Asset icons grid */}
      <div className="p-3 pt-4 flex flex-wrap gap-2">
        {assets.map(asset => (
          <div
            key={asset.id}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/80 text-xs"
            title={`${asset.name} — ${asset.tag}`}
          >
            <AssetIcon type={asset.type} size={12} />
            <StatusDot status={asset.status} />
          </div>
        ))}
        {assets.length === 0 && (
          <span className="text-xs text-muted-foreground italic">Vazio</span>
        )}
      </div>

      {/* Type indicator */}
      <span className="absolute bottom-1.5 right-2.5 text-[9px] text-muted-foreground/60 uppercase tracking-wider">
        {typeLabels[station.type] || station.type}
      </span>
    </motion.div>
  );
};
