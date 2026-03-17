import React from 'react';

// All SVG renders draw within 0,0 → w,h bounds
// Stroke and fill use CSS variables for theming

interface SVGProps {
  w: number;
  h: number;
}

const s = 'hsl(var(--foreground))';         // stroke color
const sL = 'hsl(var(--foreground) / 0.3)';  // light stroke
const f = 'hsl(var(--card))';               // fill (white)
const fS = 'hsl(var(--foreground) / 0.06)'; // subtle fill

const renders: Record<string, (p: SVGProps) => React.ReactNode> = {
  // ── Estrutura ──
  'door-single': ({ w, h }) => (
    <g>
      <rect x={0} y={0} width={w} height={h} fill={f} stroke="none" />
      <line x1={0} y1={h/2} x2={w*0.1} y2={h/2} stroke={s} strokeWidth={2} />
      <line x1={w*0.1} y1={h/2} x2={w*0.9} y2={h/2} stroke={s} strokeWidth={1.5} />
      <path d={`M ${w*0.1} ${h/2} A ${w*0.8} ${w*0.8} 0 0 0 ${w*0.9} ${h*0.5 - w*0.3}`} fill="none" stroke={sL} strokeWidth={1} strokeDasharray="3 2" />
    </g>
  ),
  'door-double': ({ w, h }) => (
    <g>
      <rect x={0} y={0} width={w} height={h} fill={f} stroke="none" />
      <line x1={0} y1={h/2} x2={w/2} y2={h/2} stroke={s} strokeWidth={1.5} />
      <line x1={w/2} y1={h/2} x2={w} y2={h/2} stroke={s} strokeWidth={1.5} />
      <path d={`M ${w*0.05} ${h/2} A ${w*0.45} ${w*0.45} 0 0 0 ${w*0.5} ${h*0.5 - w*0.2}`} fill="none" stroke={sL} strokeWidth={1} strokeDasharray="3 2" />
      <path d={`M ${w*0.95} ${h/2} A ${w*0.45} ${w*0.45} 0 0 1 ${w*0.5} ${h*0.5 - w*0.2}`} fill="none" stroke={sL} strokeWidth={1} strokeDasharray="3 2" />
    </g>
  ),
  'door-sliding': ({ w, h }) => (
    <g>
      <rect x={0} y={0} width={w} height={h} fill={f} stroke="none" />
      <line x1={0} y1={h/2} x2={w} y2={h/2} stroke={sL} strokeWidth={1} strokeDasharray="4 2" />
      <line x1={w*0.1} y1={h*0.3} x2={w*0.55} y2={h*0.3} stroke={s} strokeWidth={2} />
      <line x1={w*0.45} y1={h*0.7} x2={w*0.9} y2={h*0.7} stroke={s} strokeWidth={2} />
    </g>
  ),
  'window': ({ w, h }) => (
    <g>
      <rect x={0} y={h*0.15} width={w} height={h*0.7} fill={f} stroke={s} strokeWidth={2} />
      <line x1={w*0.15} y1={h*0.5} x2={w*0.85} y2={h*0.5} stroke={s} strokeWidth={1} />
      <line x1={0} y1={h*0.15} x2={0} y2={h*0.85} stroke={s} strokeWidth={3} />
      <line x1={w} y1={h*0.15} x2={w} y2={h*0.85} stroke={s} strokeWidth={3} />
    </g>
  ),
  'pillar': ({ w, h }) => (
    <rect x={1} y={1} width={w-2} height={h-2} fill={s} stroke={s} strokeWidth={1} rx={2} />
  ),
  'stair': ({ w, h }) => {
    const steps = 10;
    const stepH = h / steps;
    return (
      <g>
        <rect x={0} y={0} width={w} height={h} fill={f} stroke={s} strokeWidth={1.5} rx={2} />
        {Array.from({ length: steps - 1 }, (_, i) => (
          <line key={i} x1={4} y1={stepH * (i + 1)} x2={w - 4} y2={stepH * (i + 1)} stroke={sL} strokeWidth={0.8} />
        ))}
        <line x1={w/2} y1={4} x2={w/2} y2={h - 4} stroke={sL} strokeWidth={0.5} strokeDasharray="2 2" />
      </g>
    );
  },
  'partition': ({ w, h }) => (
    <rect x={0} y={0} width={w} height={h} fill={s} stroke={s} strokeWidth={1} rx={1} opacity={0.4} />
  ),

  // ── Escritório ──
  'desk': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={3} />
      <line x1={6} y1={h - 8} x2={w - 6} y2={h - 8} stroke={sL} strokeWidth={1} />
    </g>
  ),
  'desk-l': ({ w, h }) => (
    <g>
      <path d={`M 1 1 L ${w-1} 1 L ${w-1} ${h*0.45} L ${w*0.45} ${h*0.45} L ${w*0.45} ${h-1} L 1 ${h-1} Z`} fill={f} stroke={s} strokeWidth={1.5} />
      <line x1={8} y1={h - 10} x2={w*0.45 - 8} y2={h - 10} stroke={sL} strokeWidth={1} />
      <line x1={w - 10} y1={8} x2={w - 10} y2={h*0.45 - 8} stroke={sL} strokeWidth={1} />
    </g>
  ),
  'workstation': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={3} />
      <line x1={6} y1={h - 8} x2={w - 6} y2={h - 8} stroke={sL} strokeWidth={1} />
      {/* monitor indicator */}
      <rect x={w*0.35} y={6} width={w*0.3} height={4} fill={s} rx={1} opacity={0.3} />
    </g>
  ),
  'chair-office': ({ w, h }) => (
    <g>
      <circle cx={w/2} cy={h/2 + 2} r={w*0.38} fill={f} stroke={s} strokeWidth={1.2} />
      <path d={`M ${w*0.2} ${h*0.25} Q ${w/2} ${h*0.05} ${w*0.8} ${h*0.25}`} fill="none" stroke={s} strokeWidth={1.5} />
    </g>
  ),
  'meeting-table': ({ w, h }) => (
    <rect x={2} y={2} width={w-4} height={h-4} fill={f} stroke={s} strokeWidth={1.5} rx={h*0.3} />
  ),
  'cabinet': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={2} />
      <line x1={w/2} y1={4} x2={w/2} y2={h-4} stroke={sL} strokeWidth={0.8} />
    </g>
  ),
  'file-cabinet': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={2} />
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1={4} y1={h*p} x2={w-4} y2={h*p} stroke={sL} strokeWidth={0.8} />
      ))}
    </g>
  ),
  'reception-counter': ({ w, h }) => (
    <g>
      <path d={`M 1 ${h-1} L 1 ${h*0.3} Q 1 1 ${h*0.3} 1 L ${w - h*0.3} 1 Q ${w-1} 1 ${w-1} ${h*0.3} L ${w-1} ${h-1} Z`} fill={f} stroke={s} strokeWidth={1.5} />
      <path d={`M 8 ${h-1} L 8 ${h*0.35} Q 8 8 ${h*0.35} 8 L ${w - h*0.35} 8 Q ${w-8} 8 ${w-8} ${h*0.35} L ${w-8} ${h-1}`} fill="none" stroke={sL} strokeWidth={0.8} />
    </g>
  ),
  'partition-baia': ({ w, h }) => (
    <rect x={0} y={0} width={w} height={h} fill={s} stroke={s} strokeWidth={1} rx={1} opacity={0.35} />
  ),

  // ── Recepção / Sala ──
  'sofa-2': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={4} />
      <rect x={4} y={4} width={w-8} height={h*0.3} fill={fS} stroke={sL} strokeWidth={0.8} rx={3} />
      <line x1={w/2} y1={h*0.35} x2={w/2} y2={h-6} stroke={sL} strokeWidth={0.8} />
    </g>
  ),
  'sofa-3': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={4} />
      <rect x={4} y={4} width={w-8} height={h*0.3} fill={fS} stroke={sL} strokeWidth={0.8} rx={3} />
      {[1/3, 2/3].map(p => (
        <line key={p} x1={w*p} y1={h*0.35} x2={w*p} y2={h-6} stroke={sL} strokeWidth={0.8} />
      ))}
    </g>
  ),
  'armchair': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={6} />
      <rect x={5} y={5} width={w-10} height={h*0.3} fill={fS} stroke={sL} strokeWidth={0.8} rx={3} />
      <rect x={3} y={h*0.3} width={w*0.15} height={h*0.55} fill={fS} stroke={sL} strokeWidth={0.8} rx={2} />
      <rect x={w - w*0.15 - 3} y={h*0.3} width={w*0.15} height={h*0.55} fill={fS} stroke={sL} strokeWidth={0.8} rx={2} />
    </g>
  ),
  'coffee-table': ({ w, h }) => (
    <rect x={2} y={2} width={w-4} height={h-4} fill={f} stroke={s} strokeWidth={1.2} rx={4} />
  ),
  'bookshelf': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={2} />
      {[0.2, 0.4, 0.6, 0.8].map(p => (
        <line key={p} x1={w*p} y1={3} x2={w*p} y2={h-3} stroke={sL} strokeWidth={0.6} />
      ))}
    </g>
  ),

  // ── Banheiro ──
  'toilet': ({ w, h }) => (
    <g>
      <rect x={w*0.2} y={1} width={w*0.6} height={h*0.3} fill={f} stroke={s} strokeWidth={1.2} rx={2} />
      <ellipse cx={w/2} cy={h*0.6} rx={w*0.4} ry={h*0.35} fill={f} stroke={s} strokeWidth={1.2} />
    </g>
  ),
  'sink': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.2} rx={3} />
      <ellipse cx={w/2} cy={h*0.55} rx={w*0.3} ry={h*0.3} fill={fS} stroke={s} strokeWidth={1} />
    </g>
  ),
  'shower': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={3} />
      <circle cx={w/2} cy={h/2} r={Math.min(w, h) * 0.15} fill={fS} stroke={s} strokeWidth={1} />
      <line x1={1} y1={1} x2={w-1} y2={h-1} stroke={sL} strokeWidth={0.8} />
    </g>
  ),

  // ── Cozinha ──
  'counter': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={2} />
      <line x1={6} y1={h*0.35} x2={w-6} y2={h*0.35} stroke={sL} strokeWidth={0.8} />
    </g>
  ),
  'fridge': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={3} />
      <line x1={4} y1={h*0.45} x2={w-4} y2={h*0.45} stroke={s} strokeWidth={1} />
      <circle cx={w-8} cy={h*0.25} r={1.5} fill={s} />
      <circle cx={w-8} cy={h*0.65} r={1.5} fill={s} />
    </g>
  ),
  'stove': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={2} />
      {[[0.3, 0.35], [0.7, 0.35], [0.3, 0.65], [0.7, 0.65]].map(([px, py], i) => (
        <circle key={i} cx={w*px} cy={h*py} r={Math.min(w,h)*0.12} fill="none" stroke={s} strokeWidth={1} />
      ))}
    </g>
  ),
  'dining-table': ({ w, h }) => (
    <rect x={2} y={2} width={w-4} height={h-4} fill={f} stroke={s} strokeWidth={1.5} rx={4} />
  ),

  // ── Complementos ──
  'printer': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={3} />
      <rect x={w*0.15} y={h*0.15} width={w*0.7} height={h*0.35} fill={fS} stroke={sL} strokeWidth={0.8} rx={2} />
    </g>
  ),
  'rack-server': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={2} />
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.85].map(p => (
        <line key={p} x1={4} y1={h*p} x2={w-4} y2={h*p} stroke={sL} strokeWidth={0.6} />
      ))}
      <line x1={w/2} y1={3} x2={w/2} y2={h-3} stroke={sL} strokeWidth={0.4} />
    </g>
  ),
  'plant': ({ w, h }) => (
    <g>
      <circle cx={w/2} cy={h/2} r={w*0.42} fill={fS} stroke={s} strokeWidth={1.2} />
      <circle cx={w/2} cy={h/2} r={w*0.18} fill={f} stroke={s} strokeWidth={1} />
    </g>
  ),
  'tv': ({ w, h }) => (
    <g>
      <rect x={1} y={1} width={w-2} height={h-2} fill={s} stroke={s} strokeWidth={1} rx={1} opacity={0.6} />
    </g>
  ),
};

export const renderFurniture = (templateId: string, w: number, h: number): React.ReactNode => {
  const render = renders[templateId];
  if (!render) {
    return <rect x={1} y={1} width={w-2} height={h-2} fill={f} stroke={s} strokeWidth={1.5} rx={3} />;
  }
  return render({ w, h });
};
