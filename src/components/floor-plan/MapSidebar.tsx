import { Room, Station, Asset } from '@/types/vai';
import { cn } from '@/lib/utils';
import { Building2, ChevronDown, ChevronRight, MapPin, Package, AlertTriangle, CheckCircle2, Wrench, LogOut } from 'lucide-react';

interface MapSidebarProps {
  rooms: Room[];
  activeRoomId: string;
  onSelectRoom: (id: string) => void;
  stations: Station[];
  assets: Asset[];
  onSwitchToBuilder: () => void;
}

export const MapSidebar = ({ rooms, activeRoomId, onSelectRoom, stations, assets, onSwitchToBuilder }: MapSidebarProps) => {
  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const stats = {
    total: assets.length,
    active: assets.filter(a => a.status === 'active').length,
    missing: assets.filter(a => a.status === 'missing').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
  };

  const departments = [...new Set(stations.map(s => s.department).filter(Boolean) as string[])];

  // Group rooms by floor
  const floors = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  return (
    <aside className="w-[220px] h-full border-r border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Building2 size={13} className="text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-[13px] tracking-tight">VAI</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Visual Asset Inventory</p>
          </div>
        </div>
        <div className="mt-2.5 px-2 py-1.5 rounded-md bg-secondary/50">
          <p className="text-[10px] font-medium">Administrador VAI</p>
          <p className="text-[9px] text-muted-foreground">admin@vai.local</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="px-4 py-3 border-b border-border">
          <p className="vai-label mb-2">Resumo</p>
          <div className="grid grid-cols-2 gap-2">
            <StatCard icon={<Package size={11} />} value={stats.total} label="Total" />
            <StatCard icon={<CheckCircle2 size={11} />} value={stats.active} label="Ativos" color="text-success" />
            <StatCard icon={<AlertTriangle size={11} />} value={stats.missing} label="Ausentes" color="text-accent" />
            <StatCard icon={<Wrench size={11} />} value={stats.maintenance} label="Manutenção" color="text-warning" />
          </div>
        </div>

        {/* Departments */}
        <div className="px-4 py-3 border-b border-border">
          <p className="vai-label mb-2">Departamentos</p>
          <div className="flex flex-wrap gap-1">
            {departments.map(dep => (
              <span key={dep} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-medium uppercase tracking-wider">
                {dep}
              </span>
            ))}
          </div>
        </div>

        {/* Location Tree */}
        <div className="px-4 py-3">
          <p className="vai-label mb-2">Localização</p>
          <div className="space-y-0.5">
            {activeRoom && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                <MapPin size={10} />
                <span>{activeRoom.unit}</span>
              </div>
            )}
            {Object.entries(floors).map(([floor, floorRooms]) => (
              <div key={floor} className="space-y-0.5">
                <div className="flex items-center gap-1.5 px-1 py-1 text-[10px] text-muted-foreground">
                  <MapPin size={9} />
                  <span className="font-medium">{floor}</span>
                </div>
                {floorRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room.id)}
                    className={cn(
                      'w-full flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] vai-transition text-left',
                      room.id === activeRoomId
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground/70 hover:bg-secondary/60'
                    )}
                  >
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full flex-shrink-0',
                      room.id === activeRoomId ? 'bg-primary' : 'bg-muted-foreground/30'
                    )} />
                    <span className="truncate">{room.name}</span>
                    <ChevronRight size={10} className="ml-auto text-muted-foreground/40 flex-shrink-0" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

const StatCard = ({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color?: string }) => (
  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/40">
    <span className={cn('flex-shrink-0', color || 'text-muted-foreground')}>{icon}</span>
    <div>
      <p className="text-sm font-bold leading-none">{value}</p>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  </div>
);
