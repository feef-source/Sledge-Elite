import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, Home } from "lucide-react";

interface NavigationProps {
  onNavigate: (url: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const reload = () => {
    window.location.reload();
  };

  const goHome = () => {
    onNavigate("https://www.google.com");
  };

  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" onClick={goBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={goForward}>
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={reload}>
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={goHome}>
        <Home className="h-4 w-4" />
      </Button>
    </div>
  );
}
