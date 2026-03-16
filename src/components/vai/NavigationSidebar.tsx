import { Building2, ChevronRight, Layers, LayoutGrid, MapPin, Package, AlertTriangle } from 'lucide-react';
import { Room } from '@/types/vai';
import { cn } from '@/lib/utils';

interface NavigationSidebarProps {
  rooms: Room[];
  activeRoomId: string;
  onSelectRoom: (id: string) => void;
  stats: { total: number; active: number; missing: number; unassigned: number };
}

export const NavigationSidebar = ({ rooms, activeRoomId, onSelectRoom, stats }: NavigationSidebarProps) => {
  // Group rooms by unit > floor > sector
  const unit = rooms[0]?.unit || 'Sede Central';
  const floors = [...new Set(rooms.map(r => r.floor))];

  return (
    <aside className="w-[260px] h-full border-r border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid size={14} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight">VAI</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Visual Asset Intelligence</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px bg-border mx-4 mt-4 rounded-lg overflow-hidden">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Ativos" value={stats.active} />
        <StatCard label="Ausentes" value={stats.missing} accent />
        <StatCard label="Sem local" value={stats.unassigned} />
      </div>

      {/* Navigation tree */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="vai-label px-2 mb-2">Localização</p>

        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
            <Building2 size={13} />
            <span className="font-medium">{unit}</span>
          </div>

          {floors.map(floor => {
            const floorRooms = rooms.filter(r => r.floor === floor);
            return (
              <div key={floor} className="ml-3">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                  <Layers size={12} />
                  <span>{floor}</span>
                </div>
                {floorRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 ml-3 rounded-md text-xs vai-transition text-left',
                      activeRoomId === room.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground/70 hover:bg-secondary'
                    )}
                  >
                    <MapPin size={11} />
                    <span className="truncate">{room.name}</span>
                    <ChevronRight size={10} className="ml-auto opacity-40" />
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-accent/10 text-xs">
          <AlertTriangle size={13} className="text-accent flex-shrink-0" />
          <span className="text-accent font-medium">{stats.missing} ativo(s) ausente(s)</span>
        </div>
      </div>
    </aside>
  );
};

const StatCard = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
  <div className="bg-card px-3 py-2.5 text-center">
    <p className={cn('text-lg font-semibold tabular-nums', accent && value > 0 && 'text-accent')}>{value}</p>
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
  </div>
);
