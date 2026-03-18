import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useFloorPlan, snap } from '@/hooks/use-floor-plan-store';
import { getTemplate } from '@/data/furniture-library';
import { renderFurniture } from './FurnitureSVG';
import { StationOverlay } from './StationOverlay';
import { FPCamera, FPElement, EditorMode } from '@/types/floor-plan';
import { Station, Asset, Zone } from '@/types/vai';
import { mockStations, mockAssets, mockZones } from '@/data/mock-data';

const GRID = 20;

interface FloorPlanCanvasProps {
  mode: EditorMode;
}

export const FloorPlanCanvas = ({ mode }: FloorPlanCanvasProps) => {
  const { state, dispatch } = useFloorPlan();
  const containerRef = useRef<HTMLDivElement>(null);

  const [camera, setCamera] = useState<FPCamera>({ x: 0, y: 0, zoom: 1 });
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [panning, setPanning] = useState<{ startX: number; startY: number; camX: number; camY: number } | null>(null);
  const [wallStart, setWallStart] = useState<{ x: number; y: number } | null>(null);
  const [mouseWorld, setMouseWorld] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

  const isMapMode = mode === 'mapa';

  // Get stations/assets for overlay in map mode
  const stationMap = useMemo(() => {
    const map = new Map<string, { station: Station; assets: Asset[] }>();
    mockStations.forEach(st => {
      map.set(st.id, { station: st, assets: mockAssets.filter(a => a.stationId === st.id) });
    });
    return map;
  }, []);

  // Get zones for current room
  const zones = useMemo(() => mockZones, []);

  const screenToWorld = useCallback((sx: number, sy: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (sx - rect.left - camera.x) / camera.zoom,
      y: (sy - rect.top - camera.y) / camera.zoom,
    };
  }, [camera]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = containerRef.current!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setCamera(c => {
        const newZoom = Math.min(3, Math.max(0.15, c.zoom + delta));
        const ratio = newZoom / c.zoom;
        return { zoom: newZoom, x: mx - (mx - c.x) * ratio, y: my - (my - c.y) * ratio };
      });
    } else {
      setCamera(c => ({ ...c, x: c.x - e.deltaX, y: c.y - e.deltaY }));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setPanning({ startX: e.clientX, startY: e.clientY, camX: camera.x, camY: camera.y });
      return;
    }
    if (e.button !== 0) return;

    if (isMapMode) {
      // In map mode, click on empty deselects
      dispatch({ type: 'SELECT', id: null });
      return;
    }

    const world = screenToWorld(e.clientX, e.clientY);
    const snapped = { x: snap(world.x), y: snap(world.y) };

    if (state.tool === 'wall') {
      if (!wallStart) {
        setWallStart(snapped);
      } else {
        dispatch({
          type: 'ADD_WALL',
          wall: { id: crypto.randomUUID(), x1: wallStart.x, y1: wallStart.y, x2: snapped.x, y2: snapped.y, thickness: 10, wallType: 'full' },
        });
        setWallStart(snapped);
      }
      return;
    }

    if (state.tool === 'place' && state.placingTemplateId) {
      const tmpl = getTemplate(state.placingTemplateId);
      if (!tmpl) return;
      const el: FPElement = {
        id: crypto.randomUUID(),
        templateId: tmpl.id,
        x: snap(world.x - tmpl.width / 2),
        y: snap(world.y - tmpl.height / 2),
        width: tmpl.width,
        height: tmpl.height,
        rotation: 0,
        zIndex: state.elements.length,
        locked: false,
      };
      dispatch({ type: 'ADD_ELEMENT', element: el });
      return;
    }

    if (state.tool === 'select') {
      dispatch({ type: 'SELECT', id: null });
    }
  }, [camera, state.tool, state.placingTemplateId, wallStart, screenToWorld, dispatch, state.elements.length, isMapMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const world = screenToWorld(e.clientX, e.clientY);
    setMouseWorld({ x: snap(world.x), y: snap(world.y) });

    if (panning) {
      setCamera(c => ({
        ...c,
        x: panning.camX + (e.clientX - panning.startX),
        y: panning.camY + (e.clientY - panning.startY),
      }));
      return;
    }

    if (dragging && !isMapMode) {
      const x = snap(world.x - dragging.offsetX);
      const y = snap(world.y - dragging.offsetY);
      dispatch({ type: 'MOVE_ELEMENT', id: dragging.id, x, y });
      return;
    }

    if (state.tool === 'place' && state.placingTemplateId && !isMapMode) {
      const tmpl = getTemplate(state.placingTemplateId);
      if (tmpl) {
        setGhostPos({ x: snap(world.x - tmpl.width / 2), y: snap(world.y - tmpl.height / 2) });
      }
    }
  }, [panning, dragging, state.tool, state.placingTemplateId, screenToWorld, dispatch, isMapMode]);

  const handleMouseUp = useCallback(() => {
    if (dragging) setDragging(null);
    if (panning) setPanning(null);
  }, [dragging, panning]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, el: FPElement) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT', id: el.id });
    if (isMapMode) return; // No dragging in map mode
    if (state.tool !== 'select') return;
    const world = screenToWorld(e.clientX, e.clientY);
    setDragging({ id: el.id, offsetX: world.x - el.x, offsetY: world.y - el.y });
  }, [state.tool, dispatch, screenToWorld, isMapMode]);

  const handleStationClick = useCallback((e: React.MouseEvent, el: FPElement) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT', id: el.id });
  }, [dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isMapMode) return; // No keyboard shortcuts in map mode
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedId) {
          const isWall = state.walls.some(w => w.id === state.selectedId);
          dispatch({ type: isWall ? 'DELETE_WALL' : 'DELETE_ELEMENT', id: state.selectedId! });
        }
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'SELECT', id: null });
        dispatch({ type: 'SET_TOOL', tool: 'select' });
        setWallStart(null);
        setGhostPos(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (state.selectedId && state.elements.some(el => el.id === state.selectedId)) {
          dispatch({ type: 'DUPLICATE_ELEMENT', id: state.selectedId });
        }
      }
      if (e.key === 'r' && state.selectedId) {
        const el = state.elements.find(el => el.id === state.selectedId);
        if (el) dispatch({ type: 'ROTATE_ELEMENT', id: el.id, rotation: (el.rotation + 90) % 360 });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.selectedId, state.elements, state.walls, dispatch, isMapMode]);

  const cursorStyle = isMapMode
    ? (panning ? 'grabbing' : 'default')
    : state.tool === 'wall' ? 'crosshair' : state.tool === 'place' ? 'copy' : (panning ? 'grabbing' : 'default');
  const ghostTemplate = state.placingTemplateId ? getTemplate(state.placingTemplateId) : null;

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-[hsl(var(--vai-canvas))]"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: cursorStyle }}
    >
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <pattern id="fp-grid-dots" width={GRID} height={GRID} patternUnits="userSpaceOnUse" patternTransform={`translate(${camera.x % (GRID * camera.zoom)}, ${camera.y % (GRID * camera.zoom)}) scale(${camera.zoom})`}>
            <circle cx={GRID / 2} cy={GRID / 2} r={0.8} fill="hsl(var(--vai-grid-dot))" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#fp-grid-dots)" />

        <g transform={`translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`}>

          {/* Zones (map mode) */}
          {isMapMode && zones.map(zone => (
            <g key={zone.id}>
              <rect
                x={zone.x} y={zone.y}
                width={zone.width} height={zone.height}
                rx={8}
                fill="hsl(var(--vai-zone-bg) / 0.03)"
                stroke="hsl(var(--vai-zone-bg) / 0.12)"
                strokeWidth={1}
                strokeDasharray="6 3"
              />
              <text
                x={zone.x + 12} y={zone.y + 18}
                fill="hsl(var(--vai-zone-bg) / 0.35)"
                fontSize={12}
                fontWeight={600}
                fontFamily="Inter, sans-serif"
                letterSpacing="0.05em"
              >
                {zone.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Walls */}
          {state.walls.map(wall => {
            const dx = wall.x2 - wall.x1;
            const dy = wall.y2 - wall.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len === 0) return null;
            const nx = -dy / len * wall.thickness / 2;
            const ny = dx / len * wall.thickness / 2;
            const isSelected = state.selectedId === wall.id;
            return (
              <g key={wall.id}>
                <polygon
                  points={`${wall.x1 + nx},${wall.y1 + ny} ${wall.x2 + nx},${wall.y2 + ny} ${wall.x2 - nx},${wall.y2 - ny} ${wall.x1 - nx},${wall.y1 - ny}`}
                  fill="hsl(var(--foreground))"
                  fillOpacity={wall.wallType === 'drywall' ? 0.25 : wall.wallType === 'half' ? 0.4 : 0.85}
                  stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
                  strokeWidth={isSelected ? 2 : 0.5}
                  className={!isMapMode ? 'cursor-pointer' : ''}
                  onClick={(e) => { if (!isMapMode) { e.stopPropagation(); dispatch({ type: 'SELECT', id: wall.id }); } }}
                />
                {isSelected && !isMapMode && (
                  <>
                    <circle cx={wall.x1} cy={wall.y1} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={2} />
                    <circle cx={wall.x2} cy={wall.y2} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={2} />
                  </>
                )}
              </g>
            );
          })}

          {/* Wall drawing preview */}
          {!isMapMode && state.tool === 'wall' && wallStart && (
            <g>
              <line
                x1={wallStart.x} y1={wallStart.y} x2={mouseWorld.x} y2={mouseWorld.y}
                stroke="hsl(var(--primary))" strokeWidth={10} strokeOpacity={0.3} strokeLinecap="round"
              />
              <line
                x1={wallStart.x} y1={wallStart.y} x2={mouseWorld.x} y2={mouseWorld.y}
                stroke="hsl(var(--primary))" strokeWidth={1.5} strokeDasharray="6 3"
              />
              <circle cx={wallStart.x} cy={wallStart.y} r={4} fill="hsl(var(--primary))" />
              <circle cx={mouseWorld.x} cy={mouseWorld.y} r={4} fill="hsl(var(--primary))" fillOpacity={0.5} />
              {(() => {
                const dx = mouseWorld.x - wallStart.x;
                const dy = mouseWorld.y - wallStart.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const midX = (wallStart.x + mouseWorld.x) / 2;
                const midY = (wallStart.y + mouseWorld.y) / 2;
                return (
                  <text x={midX} y={midY - 10} textAnchor="middle" fill="hsl(var(--primary))" fontSize={11} fontFamily="JetBrains Mono, monospace" fontWeight={500}>
                    {Math.round(len)}px
                  </text>
                );
              })()}
            </g>
          )}

          {/* Elements */}
          {[...state.elements].sort((a, b) => a.zIndex - b.zIndex).map(el => {
            const isSelected = state.selectedId === el.id;
            const isBase = el.isPhysicalBase && el.stationId;

            // In map mode, physical bases get station overlay instead of raw render
            if (isMapMode && isBase) {
              const stData = stationMap.get(el.stationId!);
              if (stData) {
                return (
                  <g key={el.id}>
                    {/* Element SVG (inside station container) */}
                    <g transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation}, ${el.width / 2}, ${el.height / 2})`}>
                      {renderFurniture(el.templateId, el.width, el.height)}
                    </g>
                    {/* Station overlay */}
                    <StationOverlay
                      element={el}
                      station={stData.station}
                      assets={stData.assets}
                      selected={isSelected}
                      onClick={(e) => handleStationClick(e, el)}
                    />
                  </g>
                );
              }
            }

            return (
              <g
                key={el.id}
                transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation}, ${el.width / 2}, ${el.height / 2})`}
                className={!isMapMode ? 'cursor-pointer' : ''}
                onMouseDown={(e) => handleElementMouseDown(e, el)}
              >
                {/* Physical base indicator in builder mode */}
                {!isMapMode && isBase && (
                  <rect
                    x={-5} y={-5}
                    width={el.width + 10} height={el.height + 10}
                    fill="hsl(var(--primary) / 0.04)"
                    stroke="hsl(var(--primary) / 0.2)"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                    rx={6}
                  />
                )}
                {/* Selection highlight */}
                {isSelected && !isMapMode && (
                  <rect
                    x={-3} y={-3}
                    width={el.width + 6} height={el.height + 6}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    rx={4}
                  />
                )}
                {renderFurniture(el.templateId, el.width, el.height)}
                {/* Selection handles */}
                {isSelected && !isMapMode && (
                  <>
                    {[[0, 0], [el.width, 0], [0, el.height], [el.width, el.height]].map(([hx, hy], i) => (
                      <rect
                        key={i}
                        x={hx - 3} y={hy - 3}
                        width={6} height={6}
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--primary))"
                        strokeWidth={1.5}
                        rx={1}
                      />
                    ))}
                  </>
                )}
              </g>
            );
          })}

          {/* Ghost preview */}
          {!isMapMode && state.tool === 'place' && ghostTemplate && ghostPos && (
            <g transform={`translate(${ghostPos.x}, ${ghostPos.y})`} opacity={0.4}>
              {renderFurniture(ghostTemplate.id, ghostTemplate.width, ghostTemplate.height)}
              <rect
                x={-1} y={-1}
                width={ghostTemplate.width + 2} height={ghostTemplate.height + 2}
                fill="hsl(var(--primary))" fillOpacity={0.05}
                stroke="hsl(var(--primary))" strokeWidth={1} strokeDasharray="4 2" rx={3}
              />
            </g>
          )}

          {/* Wall tool crosshair */}
          {!isMapMode && state.tool === 'wall' && (
            <g>
              <line x1={mouseWorld.x - 8} y1={mouseWorld.y} x2={mouseWorld.x + 8} y2={mouseWorld.y} stroke="hsl(var(--primary))" strokeWidth={0.8} strokeOpacity={0.5} />
              <line x1={mouseWorld.x} y1={mouseWorld.y - 8} x2={mouseWorld.x} y2={mouseWorld.y + 8} stroke="hsl(var(--primary))" strokeWidth={0.8} strokeOpacity={0.5} />
            </g>
          )}
        </g>
      </svg>

      {/* Status bar */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3">
        {isMapMode && (
          <div className="px-2.5 py-1 rounded-md bg-card/90 backdrop-blur-sm border border-border text-[10px] text-muted-foreground">
            {mockAssets.filter(a => a.status === 'missing').length > 0 && (
              <span className="text-accent font-medium">
                ⚠ {mockAssets.filter(a => a.status === 'missing').length} ativo(s) ausente(s)
              </span>
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-card/80 backdrop-blur-sm border border-border text-[10px] font-mono text-muted-foreground tabular-nums">
        {Math.round(camera.zoom * 100)}%
      </div>
    </div>
  );
};
