import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface SolutionStepProps {
  stepNumber: number;
  title: string;
  content: string;
  formula?: string;
  isLast?: boolean;
}

export function SolutionStep({
  stepNumber,
  title,
  content,
  formula,
  isLast,
}: SolutionStepProps) {
  return (
    <div className="relative animate-slide-up" style={{ animationDelay: `${stepNumber * 100}ms` }}>
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
      )}

      <div className="flex gap-4">
        {/* Step number */}
        <div className="relative z-10 flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-bg text-primary-foreground font-semibold text-sm shadow-md">
            {stepNumber}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              {title}
              <CheckCircle2 className="w-4 h-4 text-success" />
            </h4>
            <p className="text-muted-foreground text-sm mb-3">{content}</p>
            
            {formula && (
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-center text-lg border border-border/50">
                {formula}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
