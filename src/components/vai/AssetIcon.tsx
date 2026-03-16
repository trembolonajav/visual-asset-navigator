import { AssetType } from '@/types/vai';
import { Monitor, Laptop, Keyboard, Mouse, Phone, Printer, Server, Armchair, Cable } from 'lucide-react';

const iconMap: Record<AssetType, React.ElementType> = {
  computer: Laptop,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  phone: Phone,
  printer: Printer,
  rack: Server,
  chair: Armchair,
  dock: Cable,
};

export const AssetIcon = ({ type, size = 16 }: { type: AssetType; size?: number }) => {
  const Icon = iconMap[type] || Laptop;
  return <Icon size={size} className="text-muted-foreground" />;
};
