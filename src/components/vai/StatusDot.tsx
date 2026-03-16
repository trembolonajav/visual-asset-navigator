import { AssetStatus } from '@/types/vai';
import { cn } from '@/lib/utils';

const statusColors: Record<AssetStatus, string> = {
  active: 'bg-vai-status-active',
  maintenance: 'bg-vai-status-maintenance',
  missing: 'bg-vai-status-missing animate-pulse-missing',
  transit: 'bg-vai-status-transit',
};

const statusLabels: Record<AssetStatus, string> = {
  active: 'Ativo',
  maintenance: 'Manutenção',
  missing: 'Ausente',
  transit: 'Em Trânsito',
};

export const StatusDot = ({ status, showLabel = false }: { status: AssetStatus; showLabel?: boolean }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={cn('w-2 h-2 rounded-full flex-shrink-0', statusColors[status])} />
    {showLabel && <span className="text-xs text-muted-foreground">{statusLabels[status]}</span>}
  </span>
);
