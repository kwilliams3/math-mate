import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RotateCcw, Camera, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface MathInputProps {
  onSubmit: (problem: string, image?: string) => void;
  isLoading?: boolean;
}

export function MathInput({ onSubmit, isLoading }: MathInputProps) {
  const [problem, setProblem] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (problem.trim() || imagePreview) {
      onSubmit(problem.trim(), imagePreview || undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 10 Mo");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    setProblem("");
    handleRemoveImage();
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="relative">
        <div className="absolute -inset-1 gradient-bg rounded-2xl blur-lg opacity-20 animate-pulse-slow" />
        <div className="relative glass-card rounded-xl p-1">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative p-4 pb-0">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Problème mathématique"
                  className="max-h-48 rounded-lg border border-border/50 object-contain"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <Textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={imagePreview 
              ? "Ajoutez des précisions sur l'image (optionnel)..." 
              : "Entrez votre problème mathématique ici...\nEx: Résoudre 2x² + 5x - 3 = 0"
            }
            className={cn(
              "min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              "math-input placeholder:text-muted-foreground/60 p-4"
            )}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="gradient"
          size="lg"
          onClick={handleSubmit}
          disabled={(!problem.trim() && !imagePreview) || isLoading}
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

        {/* Image Upload Button */}
        <Button
          variant="glass"
          size="lg"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="gap-2"
        >
          <Camera className="w-5 h-5" />
          <span className="hidden sm:inline">Photo</span>
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {(problem || imagePreview) && (
          <Button
            variant="ghost"
            size="lg"
            onClick={handleClear}
            disabled={isLoading}
          >
            <RotateCcw className="w-5 h-5" />
            Effacer
          </Button>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground text-center">
        <Camera className="w-3 h-3 inline mr-1" />
        Prenez une photo d'un problème ou tapez-le directement
      </p>
    </div>
  );
}
