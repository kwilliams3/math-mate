import { SolutionStep } from "./SolutionStep";
import { Button } from "@/components/ui/button";
import { Copy, Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Step {
  title: string;
  content: string;
  formula?: string;
}

interface SolutionDisplayProps {
  problem: string;
  steps: Step[];
  finalAnswer: string;
}

export function SolutionDisplay({ problem, steps, finalAnswer }: SolutionDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Problème: ${problem}\n\n${steps
      .map((s, i) => `Étape ${i + 1}: ${s.title}\n${s.content}${s.formula ? `\n${s.formula}` : ""}`)
      .join("\n\n")}\n\nRéponse finale: ${finalAnswer}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Solution copiée !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Solution</h2>
          <p className="text-muted-foreground text-sm mt-1">Résolution étape par étape</p>
        </div>
        <div className="flex gap-2">
          <Button variant="glass" size="sm" onClick={handleCopy}>
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié" : "Copier"}
          </Button>
        </div>
      </div>

      {/* Problem recap */}
      <div className="glass-card rounded-xl p-5 border-l-4 border-primary">
        <p className="text-sm text-muted-foreground mb-1">Problème</p>
        <p className="font-mono text-lg">{problem}</p>
      </div>

      {/* Steps */}
      <div className="pt-4">
        {steps.map((step, index) => (
          <SolutionStep
            key={index}
            stepNumber={index + 1}
            title={step.title}
            content={step.content}
            formula={step.formula}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {/* Final answer */}
      <div className="relative animate-slide-up" style={{ animationDelay: `${steps.length * 100 + 100}ms` }}>
        <div className="absolute -inset-1 gradient-bg rounded-2xl blur-lg opacity-30" />
        <div className="relative gradient-bg rounded-xl p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold text-lg">Réponse finale</span>
          </div>
          <p className="font-mono text-2xl text-center py-3">{finalAnswer}</p>
        </div>
      </div>
    </div>
  );
}
