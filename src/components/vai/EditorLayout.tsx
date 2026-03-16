import { useState, useMemo } from 'react';
import { NavigationSidebar } from './NavigationSidebar';
import { SpatialCanvas } from './SpatialCanvas';
import { InspectorPanel } from './InspectorPanel';
import { mockAssets, mockStations, mockRooms, mockZones } from '@/data/mock-data';
import { Asset } from '@/types/vai';

export const EditorLayout = () => {
  const [activeRoomId, setActiveRoomId] = useState('r1');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const activeRoom = mockRooms.find(r => r.id === activeRoomId);
  const roomStations = mockStations.filter(s => s.roomId === activeRoomId);
  const roomZones = mockZones.filter(z => z.roomId === activeRoomId);

  const selectedStation = selectedStationId ? mockStations.find(s => s.id === selectedStationId) : null;
  const stationAssets = selectedStation ? mockAssets.filter(a => a.stationId === selectedStation.id) : [];

  const locationPath = useMemo(() => {
    if (!activeRoom) return '';
    const parts = [activeRoom.unit, activeRoom.floor, activeRoom.sector, activeRoom.name];
    if (selectedStation) parts.push(selectedStation.label);
    return parts.join(' › ');
  }, [activeRoom, selectedStation]);

  const departments = useMemo(() => {
    const deps = new Set(mockStations.map(s => s.department).filter(Boolean) as string[]);
    return [...deps];
  }, []);

  const stats = useMemo(() => ({
    total: mockAssets.length,
    active: mockAssets.filter(a => a.status === 'active').length,
    missing: mockAssets.filter(a => a.status === 'missing').length,
    maintenance: mockAssets.filter(a => a.status === 'maintenance').length,
    unassigned: mockAssets.filter(a => !a.stationId).length,
  }), []);

  const handleSelectStation = (id: string | null) => {
    setSelectedStationId(id);
    setSelectedAsset(null);
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseInspector = () => {
    setSelectedStationId(null);
    setSelectedAsset(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <NavigationSidebar
        rooms={mockRooms}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        stats={stats}
        departments={departments}
      />

      <SpatialCanvas
        stations={roomStations}
        assets={mockAssets}
        zones={roomZones}
        selectedStationId={selectedStationId}
        onSelectStation={handleSelectStation}
        roomLabel={activeRoom?.name}
      />

      <InspectorPanel
        selectedStation={selectedStation}
        selectedAsset={selectedAsset}
        stationAssets={stationAssets}
        onClose={handleCloseInspector}
        onSelectAsset={handleSelectAsset}
        locationPath={locationPath}
      />
    </div>
  );
};
