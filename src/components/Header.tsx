import { Calculator, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onHistoryClick: () => void;
}

export function Header({ onHistoryClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <Calculator className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">MathSolver</h1>
            <p className="text-xs text-muted-foreground">Résolution intelligente</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onHistoryClick}>
            <History className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
