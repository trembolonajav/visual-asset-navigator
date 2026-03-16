import { Zone } from '@/types/vai';

interface ZoneBlockProps {
  zone: Zone;
}

export const ZoneBlock = ({ zone }: ZoneBlockProps) => (
  <div
    className="absolute vai-zone rounded-xl pointer-events-none"
    style={{
      left: zone.x,
      top: zone.y,
      width: zone.width,
      height: zone.height,
    }}
  >
    <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded bg-background text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
      {zone.label}
    </span>
  </div>
);
