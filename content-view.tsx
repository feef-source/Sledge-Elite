import { AlertCircle, X, Globe2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ContentViewProps {
  url: string;
  loading: boolean;
  error: string | null;
  className?: string;
}

export default function ContentView({ url, loading, error, className }: ContentViewProps) {
  const [showError, setShowError] = useState(true);

  if (error && showError) {
    return (
      <div className={cn("p-4", className)}>
        <Alert variant="destructive" className="bg-destructive/5 relative">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm text-muted-foreground pr-6">
            {error}
            <span className="block mt-1 text-xs opacity-70">
              This might be due to website security policies or SSL certificate requirements.
            </span>
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 absolute top-2 right-2 opacity-70 hover:opacity-100"
            onClick={() => setShowError(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      </div>
    );
  }

  if (!url) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Sledge Pro
          </h1>
          <p className="text-sm bg-gradient-to-r from-primary/80 to-primary/40 bg-clip-text text-transparent transform translate-x-4">
            Made by Sharif
          </p>
          <p className="text-muted-foreground text-sm mt-4">Enter a URL to begin browsing</p>
        </div>
        <Globe2 className="h-20 w-20 text-muted-foreground/20" />
      </div>
    );
  }

  // Ensure the URL is properly encoded and includes protocol
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  const proxyUrl = `/proxy?url=${encodeURIComponent(normalizedUrl)}`;

  return (
    <div className={cn("relative", className)}>
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )}
      <iframe 
        src={proxyUrl}
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        onError={(e) => console.error('iframe error:', e)}
      />
    </div>
  );
}