import { SolutionStep } from "./SolutionStep";
import { Button } from "@/components/ui/button";
import { Copy, Download, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";

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
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    const text = `Problème: ${problem}\n\n${steps
      .map((s, i) => `Étape ${i + 1}: ${s.title}\n${s.content}${s.formula ? `\n${s.formula}` : ""}`)
      .join("\n\n")}\n\nRéponse finale: ${finalAnswer}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Solution copiée !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let yPosition = 20;

      // Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(99, 102, 241); // Primary color
      doc.text("MathSolver", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // Subtitle
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Résolution étape par étape", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 20;

      // Problem section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Problème", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(12);
      doc.setFont("courier", "normal");
      const problemLines = doc.splitTextToSize(problem, maxWidth);
      doc.text(problemLines, margin, yPosition);
      yPosition += problemLines.length * 6 + 15;

      // Steps
      steps.forEach((step, index) => {
        // Check if we need a new page
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(99, 102, 241);
        doc.text(`Étape ${index + 1}: ${step.title}`, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const contentLines = doc.splitTextToSize(step.content, maxWidth);
        doc.text(contentLines, margin, yPosition);
        yPosition += contentLines.length * 5 + 5;

        if (step.formula) {
          doc.setFont("courier", "normal");
          doc.setTextColor(0, 0, 0);
          const formulaLines = doc.splitTextToSize(step.formula, maxWidth);
          doc.text(formulaLines, margin, yPosition);
          yPosition += formulaLines.length * 5 + 10;
        } else {
          yPosition += 5;
        }
      });

      // Final answer box
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      yPosition += 10;
      doc.setFillColor(99, 102, 241);
      doc.roundedRect(margin - 5, yPosition - 5, maxWidth + 10, 35, 3, 3, "F");

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Réponse finale", pageWidth / 2, yPosition + 8, { align: "center" });

      doc.setFontSize(16);
      doc.setFont("courier", "bold");
      const answerLines = doc.splitTextToSize(finalAnswer, maxWidth - 20);
      doc.text(answerLines, pageWidth / 2, yPosition + 22, { align: "center" });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Généré par MathSolver - Page ${i}/${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      const filename = `mathsolver-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      toast.success("PDF téléchargé !");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setDownloading(false);
    }
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
          <Button variant="glass" size="sm" onClick={handleDownloadPDF} disabled={downloading}>
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PDF
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
