import { X, User, MapPin, Clock, History, Building, Package, ChevronLeft } from 'lucide-react';
import { Asset, Station } from '@/types/vai';
import { AssetIcon } from './AssetIcon';
import { StatusDot } from './StatusDot';
import { AssetItem } from './AssetItem';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InspectorPanelProps {
  selectedStation?: Station | null;
  selectedAsset?: Asset | null;
  stationAssets?: Asset[];
  onClose: () => void;
  onSelectAsset: (asset: Asset) => void;
  locationPath?: string;
}

export const InspectorPanel = ({
  selectedStation,
  selectedAsset,
  stationAssets = [],
  onClose,
  onSelectAsset,
  locationPath,
}: InspectorPanelProps) => {
  const show = !!(selectedStation || selectedAsset);

  const statusSummary = {
    active: stationAssets.filter(a => a.status === 'active').length,
    warning: stationAssets.filter(a => a.status === 'missing' || a.status === 'maintenance').length,
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
          className="w-[340px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              {selectedAsset && (
                <button
                  onClick={() => onSelectAsset(null as unknown as Asset)}
                  className="p-1 rounded-md hover:bg-secondary vai-transition text-muted-foreground"
                >
                  <ChevronLeft size={14} />
                </button>
              )}
              <p className="vai-label">
                {selectedAsset ? 'Detalhe do Ativo' : 'Estação'}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary vai-transition">
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Asset detail */}
            {selectedAsset && (
              <div className="p-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <AssetIcon type={selectedAsset.type} size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm leading-tight">{selectedAsset.name}</h3>
                    <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{selectedAsset.tag}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusDot status={selectedAsset.status} showLabel />
                  {selectedAsset.department && (
                    <span className="px-2 py-0.5 rounded bg-secondary text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {selectedAsset.department}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedAsset.serial && (
                    <DetailRow icon={<span className="text-[9px] font-mono font-medium">S/N</span>} label="Serial" value={selectedAsset.serial} />
                  )}
                  {selectedAsset.custodian && (
                    <DetailRow icon={<User size={12} />} label="Responsável" value={selectedAsset.custodian} />
                  )}
                  {selectedAsset.department && (
                    <DetailRow icon={<Building size={12} />} label="Departamento" value={selectedAsset.department} />
                  )}
                  {locationPath && (
                    <DetailRow icon={<MapPin size={12} />} label="Localização" value={locationPath} />
                  )}
                  {selectedAsset.lastVerified && (
                    <DetailRow icon={<Clock size={12} />} label="Última verificação" value={selectedAsset.lastVerified} />
                  )}
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="vai-label mb-3 flex items-center gap-1.5">
                    <History size={10} /> Histórico
                  </p>
                  <div className="space-y-2.5">
                    <HistoryItem action="Verificado por @marcos_it" time="2h atrás" />
                    <HistoryItem action="Movido para Estação 01" time="5d atrás" />
                    <HistoryItem action="Cadastrado no sistema" time="30d atrás" />
                  </div>
                </div>
              </div>
            )}

            {/* Station detail */}
            {selectedStation && !selectedAsset && (
              <div className="p-5 space-y-5">
                <div>
                  <h3 className="font-bold text-sm">{selectedStation.label}</h3>
                  {locationPath && (
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {locationPath}
                    </p>
                  )}
                </div>

                {/* Station meta */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedStation.custodian && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60">
                      <User size={11} className="text-muted-foreground" />
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Responsável</p>
                        <p className="text-xs font-medium leading-tight">{selectedStation.custodian}</p>
                      </div>
                    </div>
                  )}
                  {selectedStation.department && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60">
                      <Building size={11} className="text-muted-foreground" />
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Depto.</p>
                        <p className="text-xs font-medium leading-tight">{selectedStation.department}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status summary */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Package size={11} />
                    {stationAssets.length} ativo(s)
                  </span>
                  {statusSummary.warning > 0 && (
                    <span className="flex items-center gap-1 text-accent font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-missing" />
                      {statusSummary.warning} alerta(s)
                    </span>
                  )}
                  {statusSummary.active > 0 && statusSummary.warning === 0 && (
                    <span className="flex items-center gap-1 text-success font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Tudo OK
                    </span>
                  )}
                </div>

                {/* Assets list */}
                <div className="space-y-1">
                  <p className="vai-label mb-1.5">Ativos na estação</p>
                  {stationAssets.map(asset => (
                    <AssetItem key={asset.id} asset={asset} compact onClick={() => onSelectAsset(asset)} />
                  ))}
                  {stationAssets.length === 0 && (
                    <p className="text-xs text-muted-foreground/50 italic py-2">Nenhum ativo vinculado</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2.5">
    <span className="mt-0.5 text-muted-foreground flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const HistoryItem = ({ action, time }: { action: string; time: string }) => (
  <div className="flex items-center gap-2.5 text-xs">
    <div className="w-1.5 h-1.5 rounded-full bg-border flex-shrink-0" />
    <span className="flex-1 text-foreground/70">{action}</span>
    <span className="text-muted-foreground text-[10px] font-mono">{time}</span>
  </div>
);
