import { AssetStatus } from '@/types/vai';
import { cn } from '@/lib/utils';

const statusColors: Record<AssetStatus, string> = {
  active: 'bg-success',
  maintenance: 'bg-warning',
  missing: 'bg-destructive animate-pulse-missing',
  transit: 'bg-primary',
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
    {showLabel && <span className="text-xs font-medium text-muted-foreground">{statusLabels[status]}</span>}
  </span>
);
