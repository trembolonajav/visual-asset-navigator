import { motion } from 'framer-motion';
import { Asset } from '@/types/vai';
import { AssetIcon } from './AssetIcon';
import { StatusDot } from './StatusDot';

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
    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer vai-transition ${
      selected ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-secondary'
    }`}
  >
    <AssetIcon type={asset.type} size={compact ? 14 : 16} />
    <div className="flex-1 min-w-0">
      <p className={`truncate font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{asset.name}</p>
      {!compact && <p className="text-xs text-muted-foreground font-mono">{asset.tag}</p>}
    </div>
    <StatusDot status={asset.status} />
  </motion.div>
);
