import { useState, useCallback, useRef } from 'react';
import { Station, Asset, Zone } from '@/types/vai';
import { StationBlock } from './StationBlock';
import { ZoneBlock } from './ZoneBlock';
import { CanvasToolbar } from './CanvasToolbar';

interface SpatialCanvasProps {
  stations: Station[];
  assets: Asset[];
  zones: Zone[];
  selectedStationId?: string | null;
  onSelectStation: (id: string | null) => void;
  roomLabel?: string;
}

export const SpatialCanvas = ({ stations, assets, zones, selectedStationId, onSelectStation, roomLabel }: SpatialCanvasProps) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.min(2, Math.max(0.25, z + delta)));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const getStationAssets = (stationId: string) => assets.filter(a => a.stationId === stationId);

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative overflow-hidden vai-canvas-grid"
      onWheel={handleWheel}
      onMouseDown={(e) => {
        handleMouseDown(e);
        if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-inner')) {
          onSelectStation(null);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      {/* Room label */}
      {roomLabel && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg vai-surface text-xs font-semibold text-foreground tracking-tight">
            {roomLabel}
          </span>
        </div>
      )}

      <div
        className="canvas-inner absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* Zones */}
        {zones.map(zone => (
          <ZoneBlock key={zone.id} zone={zone} />
        ))}

        {/* Stations */}
        {stations.map(station => (
          <StationBlock
            key={station.id}
            station={station}
            assets={getStationAssets(station.id)}
            selected={selectedStationId === station.id}
            onClick={() => onSelectStation(station.id)}
          />
        ))}
      </div>

      <CanvasToolbar
        zoom={zoom}
        onZoomIn={() => setZoom(z => Math.min(2, z + 0.15))}
        onZoomOut={() => setZoom(z => Math.max(0.25, z - 0.15))}
        onReset={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
      />
    </div>
  );
};
