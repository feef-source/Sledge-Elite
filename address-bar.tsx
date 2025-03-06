import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface AddressBarProps {
  url: string;
  onNavigate: (url: string) => void;
}

export default function AddressBar({ url, onNavigate }: AddressBarProps) {
  const [inputValue, setInputValue] = useState(url);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    let targetUrl = inputValue.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }
    onNavigate(targetUrl);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10"
          placeholder="Enter URL..."
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <Button type="submit">Go</Button>
    </form>
  );
}