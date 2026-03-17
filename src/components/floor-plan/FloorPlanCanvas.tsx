import { useRef, useState, useCallback, useEffect } from 'react';
import { useFloorPlan, snap } from '@/hooks/use-floor-plan-store';
import { getTemplate } from '@/data/furniture-library';
import { renderFurniture } from './FurnitureSVG';
import { FPCamera, FPElement } from '@/types/floor-plan';

const GRID = 20;
const CANVAS_SIZE = 4000;

export const FloorPlanCanvas = () => {
  const { state, dispatch } = useFloorPlan();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [camera, setCamera] = useState<FPCamera>({ x: 0, y: 0, zoom: 1 });
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [panning, setPanning] = useState<{ startX: number; startY: number; camX: number; camY: number } | null>(null);
  const [wallStart, setWallStart] = useState<{ x: number; y: number } | null>(null);
  const [mouseWorld, setMouseWorld] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

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
        return {
          zoom: newZoom,
          x: mx - (mx - c.x) * ratio,
          y: my - (my - c.y) * ratio,
        };
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
        setWallStart(snapped); // chain walls
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

    // select tool — click on empty area deselects
    if (state.tool === 'select') {
      // Check if we clicked an element (handled by element click)
      // This is the canvas background click
      dispatch({ type: 'SELECT', id: null });
    }
  }, [camera, state.tool, state.placingTemplateId, wallStart, screenToWorld, dispatch, state.elements.length]);

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

    if (dragging) {
      const x = snap(world.x - dragging.offsetX);
      const y = snap(world.y - dragging.offsetY);
      dispatch({ type: 'MOVE_ELEMENT', id: dragging.id, x, y });
      return;
    }

    if (state.tool === 'place' && state.placingTemplateId) {
      const tmpl = getTemplate(state.placingTemplateId);
      if (tmpl) {
        setGhostPos({ x: snap(world.x - tmpl.width / 2), y: snap(world.y - tmpl.height / 2) });
      }
    }
  }, [panning, dragging, state.tool, state.placingTemplateId, screenToWorld, dispatch]);

  const handleMouseUp = useCallback(() => {
    if (dragging) setDragging(null);
    if (panning) setPanning(null);
  }, [dragging, panning]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, el: FPElement) => {
    e.stopPropagation();
    if (state.tool !== 'select') return;
    dispatch({ type: 'SELECT', id: el.id });
    const world = screenToWorld(e.clientX, e.clientY);
    setDragging({ id: el.id, offsetX: world.x - el.x, offsetY: world.y - el.y });
  }, [state.tool, dispatch, screenToWorld]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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
  }, [state.selectedId, state.elements, state.walls, dispatch]);

  const cursorStyle = state.tool === 'wall' ? 'crosshair' : state.tool === 'place' ? 'copy' : (panning ? 'grabbing' : 'default');
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
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <pattern id="fp-grid-dots" width={GRID} height={GRID} patternUnits="userSpaceOnUse" patternTransform={`translate(${camera.x % (GRID * camera.zoom)}, ${camera.y % (GRID * camera.zoom)}) scale(${camera.zoom})`}>
            <circle cx={GRID / 2} cy={GRID / 2} r={0.8} fill="hsl(var(--vai-grid-dot))" />
          </pattern>
        </defs>

        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#fp-grid-dots)" />

        {/* World transform */}
        <g transform={`translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`}>

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
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SELECT', id: wall.id }); }}
                />
                {isSelected && (
                  <>
                    <circle cx={wall.x1} cy={wall.y1} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={2} />
                    <circle cx={wall.x2} cy={wall.y2} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={2} />
                  </>
                )}
              </g>
            );
          })}

          {/* Wall drawing preview */}
          {state.tool === 'wall' && wallStart && (
            <g>
              <line
                x1={wallStart.x} y1={wallStart.y}
                x2={mouseWorld.x} y2={mouseWorld.y}
                stroke="hsl(var(--primary))"
                strokeWidth={10}
                strokeOpacity={0.3}
                strokeLinecap="round"
              />
              <line
                x1={wallStart.x} y1={wallStart.y}
                x2={mouseWorld.x} y2={mouseWorld.y}
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                strokeDasharray="6 3"
              />
              <circle cx={wallStart.x} cy={wallStart.y} r={4} fill="hsl(var(--primary))" />
              <circle cx={mouseWorld.x} cy={mouseWorld.y} r={4} fill="hsl(var(--primary))" fillOpacity={0.5} />
              {/* Length label */}
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
            return (
              <g
                key={el.id}
                transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation}, ${el.width / 2}, ${el.height / 2})`}
                className="cursor-pointer"
                onMouseDown={(e) => handleElementMouseDown(e, el)}
              >
                {/* Selection highlight */}
                {isSelected && (
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
                {/* Element render */}
                {renderFurniture(el.templateId, el.width, el.height)}
                {/* Selection handles */}
                {isSelected && (
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

          {/* Ghost preview for placing */}
          {state.tool === 'place' && ghostTemplate && ghostPos && (
            <g transform={`translate(${ghostPos.x}, ${ghostPos.y})`} opacity={0.4}>
              {renderFurniture(ghostTemplate.id, ghostTemplate.width, ghostTemplate.height)}
              <rect
                x={-1} y={-1}
                width={ghostTemplate.width + 2} height={ghostTemplate.height + 2}
                fill="hsl(var(--primary))"
                fillOpacity={0.05}
                stroke="hsl(var(--primary))"
                strokeWidth={1}
                strokeDasharray="4 2"
                rx={3}
              />
            </g>
          )}

          {/* Wall tool crosshair at cursor */}
          {state.tool === 'wall' && (
            <g>
              <line x1={mouseWorld.x - 8} y1={mouseWorld.y} x2={mouseWorld.x + 8} y2={mouseWorld.y} stroke="hsl(var(--primary))" strokeWidth={0.8} strokeOpacity={0.5} />
              <line x1={mouseWorld.x} y1={mouseWorld.y - 8} x2={mouseWorld.x} y2={mouseWorld.y + 8} stroke="hsl(var(--primary))" strokeWidth={0.8} strokeOpacity={0.5} />
            </g>
          )}
        </g>
      </svg>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-card/80 backdrop-blur-sm border border-border text-[10px] font-mono text-muted-foreground tabular-nums">
        {Math.round(camera.zoom * 100)}%
      </div>
    </div>
  );
};
