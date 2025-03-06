import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Tab {
  id: string;
  url: string;
  loading: boolean;
  error: string | null;
}

interface TabProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export default function Tab({ tab, isActive, onSelect, onClose }: TabProps) {
  // Get the display title from the URL
  const displayTitle = tab.url 
    ? new URL(tab.url.startsWith('http') ? tab.url : `https://${tab.url}`).hostname
    : 'New Tab';

  return (
    <div
      className={cn(
        "group flex items-center gap-1 px-3 py-2 cursor-pointer border-r border-border",
        "hover:bg-muted/50 transition-colors rounded-t-lg",
        isActive ? "bg-background" : "bg-muted/30"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-2 w-2 rounded-full",
          isActive ? "bg-primary" : "bg-transparent"
        )} />
        <span className="max-w-[120px] truncate text-sm">
          {tab.loading ? 'Loading...' : displayTitle}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}