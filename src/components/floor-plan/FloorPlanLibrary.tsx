import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { furnitureTemplates, categoryLabels, categoryOrder } from '@/data/furniture-library';
import { useFloorPlan } from '@/hooks/use-floor-plan-store';
import { renderFurniture } from './FurnitureSVG';
import { cn } from '@/lib/utils';
import { FurnitureCategory } from '@/types/floor-plan';

export const FloorPlanLibrary = () => {
  const { dispatch } = useFloorPlan();
  const [search, setSearch] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<FurnitureCategory>>(new Set(['estrutura', 'escritorio']));

  const filtered = search.trim()
    ? furnitureTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : furnitureTemplates;

  const toggleCat = (cat: FurnitureCategory) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const handleSelect = (templateId: string) => {
    dispatch({ type: 'SET_PLACING', templateId });
  };

  return (
    <aside className="w-[256px] h-full border-r border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid size={13} className="text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-[13px] tracking-tight">VAI Builder</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Planta Baixa 2D</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar elemento..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary/60 border-0 text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {categoryOrder.map(cat => {
          const items = filtered.filter(t => t.category === cat);
          if (items.length === 0) return null;
          const isOpen = expandedCats.has(cat) || search.trim().length > 0;

          return (
            <div key={cat} className="border-b border-border/50">
              <button
                onClick={() => toggleCat(cat)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-secondary/40 vai-transition"
              >
                {isOpen ? <ChevronDown size={12} className="text-muted-foreground" /> : <ChevronRight size={12} className="text-muted-foreground" />}
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">{categoryLabels[cat]}</span>
                <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">{items.length}</span>
              </button>

              {isOpen && (
                <div className="px-2 pb-2 grid grid-cols-2 gap-1">
                  {items.map(tmpl => (
                    <LibraryItem key={tmpl.id} template={tmpl} onSelect={handleSelect} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help */}
      <div className="px-4 py-3 border-t border-border">
        <div className="text-[10px] text-muted-foreground/60 space-y-1">
          <p><kbd className="px-1 py-0.5 rounded bg-secondary text-[9px] font-mono">R</kbd> Rotacionar</p>
          <p><kbd className="px-1 py-0.5 rounded bg-secondary text-[9px] font-mono">Del</kbd> Apagar</p>
          <p><kbd className="px-1 py-0.5 rounded bg-secondary text-[9px] font-mono">⌘D</kbd> Duplicar</p>
          <p><kbd className="px-1 py-0.5 rounded bg-secondary text-[9px] font-mono">Esc</kbd> Cancelar</p>
        </div>
      </div>
    </aside>
  );
};

const LibraryItem = ({ template, onSelect }: { template: (typeof furnitureTemplates)[number]; onSelect: (id: string) => void }) => {
  // Scale SVG preview to fit a thumbnail
  const previewSize = 36;
  const scale = Math.min(previewSize / template.width, previewSize / template.height) * 0.8;

  return (
    <button
      onClick={() => onSelect(template.id)}
      className={cn(
        'flex flex-col items-center gap-1.5 p-2 rounded-lg vai-transition',
        'hover:bg-secondary/60 active:scale-95',
        'border border-transparent hover:border-border/50',
      )}
      title={template.name}
    >
      <svg width={previewSize} height={previewSize} className="flex-shrink-0">
        <g transform={`translate(${(previewSize - template.width * scale) / 2}, ${(previewSize - template.height * scale) / 2}) scale(${scale})`}>
          {renderFurniture(template.id, template.width, template.height)}
        </g>
      </svg>
      <span className="text-[10px] text-foreground/70 leading-tight text-center truncate w-full">{template.name}</span>
    </button>
  );
};
