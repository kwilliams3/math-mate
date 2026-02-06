import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { MathInput } from "@/components/MathInput";
import { SolutionDisplay } from "@/components/SolutionDisplay";
import { HistoryPanel } from "@/components/HistoryPanel";
import { solveMathProblem } from "@/lib/mathSolver";
import { toast } from "sonner";
import { 
  Calculator, 
  Shapes, 
  TrendingUp, 
  PieChart, 
  Sigma,
  BrainCircuit 
} from "lucide-react";

interface HistoryItem {
  id: string;
  problem: string;
  answer: string;
  timestamp: Date;
  category: string;
}

interface Solution {
  steps: { title: string; content: string; formula?: string }[];
  finalAnswer: string;
}

const categories = [
  {
    id: "algebra",
    title: "Algèbre",
    description: "Équations, polynômes, systèmes",
    icon: Calculator,
    color: "primary" as const,
  },
  {
    id: "geometry",
    title: "Géométrie",
    description: "Figures, aires, volumes",
    icon: Shapes,
    color: "secondary" as const,
  },
  {
    id: "calculus",
    title: "Analyse",
    description: "Dérivées, intégrales, limites",
    icon: TrendingUp,
    color: "accent" as const,
  },
  {
    id: "statistics",
    title: "Statistiques",
    description: "Probabilités, moyennes",
    icon: PieChart,
    color: "success" as const,
  },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<string | null>(null);
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSolution(null);
    setCurrentProblem(null);
  };

  const handleSubmit = async (problem: string, image?: string) => {
    if (!selectedCategory) return;

    setIsLoading(true);
    setCurrentProblem(image ? "📷 Problème depuis image" : problem);
    setCurrentSolution(null);

    try {
      const solution = await solveMathProblem(problem, selectedCategory, image);
      setCurrentSolution(solution);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        problem,
        answer: solution.finalAnswer,
        timestamp: new Date(),
        category: categories.find((c) => c.id === selectedCategory)?.title || "",
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
      
      toast.success("Problème résolu avec succès !");
    } catch (error) {
      console.error("Error solving problem:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la résolution");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setIsHistoryOpen(false);
    // Could implement restoring the solution from history
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onHistoryClick={() => setIsHistoryOpen(true)} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <BrainCircuit className="w-4 h-4" />
            Résolution par IA
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Résolvez</span> vos problèmes
            <br />mathématiques
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entrez votre problème et obtenez une solution détaillée étape par étape
            grâce à l'intelligence artificielle.
          </p>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Choisissez une catégorie
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                onClick={() => handleCategorySelect(category.id)}
                isSelected={selectedCategory === category.id}
              />
            ))}
          </div>
        </section>

        {/* Input Section */}
        {selectedCategory && (
          <section className="mb-10">
            <MathInput onSubmit={handleSubmit} isLoading={isLoading} />
          </section>
        )}

        {/* Solution Display */}
        {currentProblem && currentSolution && (
          <section className="mb-10">
            <SolutionDisplay
              problem={currentProblem}
              steps={currentSolution.steps}
              finalAnswer={currentSolution.finalAnswer}
            />
          </section>
        )}

        {/* Empty state when no category selected */}
        {!selectedCategory && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center animate-float">
              <Sigma className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Prêt à résoudre ?</h3>
            <p className="text-muted-foreground">
              Sélectionnez une catégorie pour commencer
            </p>
          </div>
        )}
      </main>

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectItem={handleHistorySelect}
      />
    </div>
  );
}
