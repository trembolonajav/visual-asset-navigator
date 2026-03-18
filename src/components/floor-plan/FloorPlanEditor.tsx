import { useState, useCallback, useEffect } from 'react';
import { FloorPlanProvider, useFloorPlan } from '@/hooks/use-floor-plan-store';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { FloorPlanLibrary } from './FloorPlanLibrary';
import { FloorPlanInspector } from './FloorPlanInspector';
import { FloorPlanToolbar } from './FloorPlanToolbar';
import { MapSidebar } from './MapSidebar';
import { EditorMode } from '@/types/floor-plan';
import { mockRooms, mockStations, mockAssets, getPublishedFloorPlan } from '@/data/mock-data';

const FloorPlanEditorInner = () => {
  const [mode, setMode] = useState<EditorMode>('mapa');
  const [zoom, setZoom] = useState(1);
  const [activeRoomId, setActiveRoomId] = useState('r1');
  const { dispatch } = useFloorPlan();

  const activeRoom = mockRooms.find(r => r.id === activeRoomId);
  const roomStations = mockStations.filter(s => s.roomId === activeRoomId);
  const roomAssets = mockAssets.filter(a => roomStations.some(s => s.assets.includes(a.id)));

  // Load published floor plan on room change
  useEffect(() => {
    const data = getPublishedFloorPlan(activeRoomId);
    dispatch({ type: 'LOAD', plan: { id: activeRoomId, name: activeRoom?.name || '', gridSize: 20, elements: data.elements, walls: data.walls } });
  }, [activeRoomId, dispatch]);

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(3, z + 0.15)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(0.15, z - 0.15)), []);
  const handleReset = useCallback(() => setZoom(1), []);

  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar: Library in builder, Navigation in map */}
      {mode === 'estrutura' ? (
        <FloorPlanLibrary />
      ) : (
        <MapSidebar
          rooms={mockRooms}
          activeRoomId={activeRoomId}
          onSelectRoom={handleSelectRoom}
          stations={roomStations}
          assets={roomAssets}
          onSwitchToBuilder={() => setMode('estrutura')}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <FloorPlanToolbar
          mode={mode}
          onModeChange={setMode}
          room={activeRoom}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />
        <FloorPlanCanvas mode={mode} />
      </div>

      {/* Inspector */}
      <FloorPlanInspector mode={mode} />
    </div>
  );
};

export const FloorPlanEditor = () => (
  <FloorPlanProvider>
    <FloorPlanEditorInner />
  </FloorPlanProvider>
);
