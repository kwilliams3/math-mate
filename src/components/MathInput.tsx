import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MathInputProps {
  onSubmit: (problem: string) => void;
  isLoading?: boolean;
}

export function MathInput({ onSubmit, isLoading }: MathInputProps) {
  const [problem, setProblem] = useState("");

  const handleSubmit = () => {
    if (problem.trim()) {
      onSubmit(problem.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="relative">
        <div className="absolute -inset-1 gradient-bg rounded-2xl blur-lg opacity-20 animate-pulse-slow" />
        <div className="relative glass-card rounded-xl p-1">
          <Textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Entrez votre problème mathématique ici...&#10;Ex: Résoudre 2x² + 5x - 3 = 0"
            className={cn(
              "min-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              "math-input placeholder:text-muted-foreground/60 p-4"
            )}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="gradient"
          size="lg"
          onClick={handleSubmit}
          disabled={!problem.trim() || isLoading}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? (
            <>
              <RotateCcw className="w-5 h-5 animate-spin" />
              Résolution en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Résoudre
            </>
          )}
        </Button>
        
        {problem && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setProblem("")}
            disabled={isLoading}
          >
            <RotateCcw className="w-5 h-5" />
            Effacer
          </Button>
        )}
      </div>
    </div>
  );
}
