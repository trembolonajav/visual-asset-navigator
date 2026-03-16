import { motion } from 'framer-motion';
import { Asset } from '@/types/vai';
import { AssetIcon } from './AssetIcon';
import { StatusDot } from './StatusDot';
import { cn } from '@/lib/utils';

interface AssetItemProps {
  asset: Asset;
  compact?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const AssetItem = ({ asset, compact = false, selected = false, onClick }: AssetItemProps) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      'flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer vai-transition',
      selected
        ? 'bg-primary/8 ring-1 ring-primary/20'
        : 'hover:bg-secondary',
    )}
  >
    <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
      <AssetIcon type={asset.type} size={compact ? 13 : 14} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn('truncate font-medium', compact ? 'text-xs' : 'text-sm')}>{asset.name}</p>
      {!compact && <p className="text-[11px] text-muted-foreground font-mono">{asset.tag}</p>}
    </div>
    <StatusDot status={asset.status} />
  </motion.div>
);
