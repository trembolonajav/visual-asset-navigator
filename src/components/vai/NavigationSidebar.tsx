import { Building2, ChevronRight, Layers, MapPin, AlertTriangle, LayoutGrid, Package, CircleAlert } from 'lucide-react';
import { Room } from '@/types/vai';
import { cn } from '@/lib/utils';

interface NavigationSidebarProps {
  rooms: Room[];
  activeRoomId: string;
  onSelectRoom: (id: string) => void;
  stats: { total: number; active: number; missing: number; maintenance: number; unassigned: number };
  departments: string[];
}

export const NavigationSidebar = ({ rooms, activeRoomId, onSelectRoom, stats, departments }: NavigationSidebarProps) => {
  const unit = rooms[0]?.unit || 'Sede Central';
  const floors = [...new Set(rooms.map(r => r.floor))];

  return (
    <aside className="w-[272px] h-full border-r border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid size={15} className="text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight">VAI</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Visual Asset Intelligence</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 pt-4 pb-2">
        <p className="vai-label px-1 mb-2">Resumo</p>
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Total" value={stats.total} icon={<Package size={11} />} />
          <StatCard label="Ativos" value={stats.active} icon={<span className="w-2 h-2 rounded-full bg-success" />} />
          <StatCard label="Ausentes" value={stats.missing} icon={<CircleAlert size={11} />} accent={stats.missing > 0} />
          <StatCard label="Manutenção" value={stats.maintenance} icon={<span className="w-2 h-2 rounded-full bg-warning" />} />
        </div>
      </div>

      {/* Departments */}
      {departments.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <p className="vai-label px-1 mb-2">Departamentos</p>
          <div className="flex flex-wrap gap-1.5 px-1">
            {departments.map(d => (
              <span key={d} className="px-2 py-1 rounded-md bg-secondary text-[10px] font-medium text-secondary-foreground uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation tree */}
      <div className="flex-1 overflow-y-auto px-4 py-3 border-t border-border">
        <p className="vai-label px-1 mb-2">Localização</p>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
            <Building2 size={12} />
            <span className="font-medium">{unit}</span>
          </div>

          {floors.map(floor => {
            const floorRooms = rooms.filter(r => r.floor === floor);
            return (
              <div key={floor} className="ml-2">
                <div className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-muted-foreground">
                  <Layers size={11} />
                  <span className="font-medium">{floor}</span>
                </div>
                {floorRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 ml-2 rounded-lg text-xs vai-transition text-left',
                      activeRoomId === room.id
                        ? 'bg-primary/8 text-primary font-semibold'
                        : 'text-foreground/70 hover:bg-secondary'
                    )}
                  >
                    <MapPin size={11} className="flex-shrink-0" />
                    <span className="truncate">{room.name}</span>
                    <ChevronRight size={10} className="ml-auto opacity-30" />
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert footer */}
      {stats.missing > 0 && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-accent/8 text-xs">
            <AlertTriangle size={13} className="text-accent flex-shrink-0" />
            <span className="text-accent font-semibold">{stats.missing} ativo(s) ausente(s)</span>
          </div>
        </div>
      )}
    </aside>
  );
};

const StatCard = ({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent?: boolean }) => (
  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/60">
    <span className={cn('text-muted-foreground', accent && 'text-accent')}>{icon}</span>
    <div>
      <p className={cn('text-base font-bold tabular-nums leading-none', accent && 'text-accent')}>{value}</p>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  </div>
);
