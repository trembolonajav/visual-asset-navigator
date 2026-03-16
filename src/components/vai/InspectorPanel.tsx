import { X, User, MapPin, Clock, History, ChevronRight } from 'lucide-react';
import { Asset, Station } from '@/types/vai';
import { AssetIcon } from './AssetIcon';
import { StatusDot } from './StatusDot';
import { AssetItem } from './AssetItem';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
          className="w-[320px] h-full border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="vai-label">Inspetor</p>
            <button onClick={onClose} className="p-1 rounded hover:bg-secondary vai-transition">
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Asset detail */}
            {selectedAsset && (
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <AssetIcon type={selectedAsset.type} size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{selectedAsset.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{selectedAsset.tag}</p>
                  </div>
                </div>

                <StatusDot status={selectedAsset.status} showLabel />

                <div className="space-y-3">
                  {selectedAsset.serial && (
                    <DetailRow icon={<span className="text-[10px] font-mono">S/N</span>} label="Serial" value={selectedAsset.serial} />
                  )}
                  {selectedAsset.custodian && (
                    <DetailRow icon={<User size={12} />} label="Responsável" value={selectedAsset.custodian} />
                  )}
                  {locationPath && (
                    <DetailRow icon={<MapPin size={12} />} label="Localização" value={locationPath} />
                  )}
                  {selectedAsset.lastVerified && (
                    <DetailRow icon={<Clock size={12} />} label="Última verificação" value={selectedAsset.lastVerified} />
                  )}
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="vai-label mb-2 flex items-center gap-1">
                    <History size={10} /> Histórico
                  </p>
                  <div className="space-y-2">
                    <HistoryItem action="Verificado por @marcos_it" time="2h atrás" />
                    <HistoryItem action="Movido para Estação 01" time="5d atrás" />
                    <HistoryItem action="Cadastrado no sistema" time="30d atrás" />
                  </div>
                </div>
              </div>
            )}

            {/* Station detail (when no asset selected) */}
            {selectedStation && !selectedAsset && (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm">{selectedStation.label}</h3>
                  {locationPath && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {locationPath}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{stationAssets.length} ativo(s)</span>
                  {stationAssets.some(a => a.status === 'missing') && (
                    <span className="text-accent font-medium">⚠ Item ausente</span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="vai-label mb-1">Ativos na estação</p>
                  {stationAssets.map(asset => (
                    <AssetItem key={asset.id} asset={asset} compact onClick={() => onSelectAsset(asset)} />
                  ))}
                  {stationAssets.length === 0 && (
                    <p className="text-xs text-muted-foreground italic py-2">Nenhum ativo vinculado</p>
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
  <div className="flex items-start gap-2">
    <span className="mt-0.5 text-muted-foreground">{icon}</span>
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  </div>
);

const HistoryItem = ({ action, time }: { action: string; time: string }) => (
  <div className="flex items-center gap-2 text-xs">
    <div className="w-1.5 h-1.5 rounded-full bg-border flex-shrink-0" />
    <span className="flex-1 text-foreground/70">{action}</span>
    <span className="text-muted-foreground text-[10px]">{time}</span>
  </div>
);
