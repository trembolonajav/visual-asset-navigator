import { useState, useCallback } from 'react';
import { FloorPlanProvider } from '@/hooks/use-floor-plan-store';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { FloorPlanLibrary } from './FloorPlanLibrary';
import { FloorPlanInspector } from './FloorPlanInspector';
import { FloorPlanToolbar } from './FloorPlanToolbar';

const FloorPlanEditorInner = () => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(3, z + 0.15)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(0.15, z - 0.15)), []);
  const handleReset = useCallback(() => setZoom(1), []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <FloorPlanLibrary />
      <div className="flex-1 flex flex-col min-w-0">
        <FloorPlanToolbar
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />
        <FloorPlanCanvas />
      </div>
      <FloorPlanInspector />
    </div>
  );
};

export const FloorPlanEditor = () => (
  <FloorPlanProvider>
    <FloorPlanEditorInner />
  </FloorPlanProvider>
);
