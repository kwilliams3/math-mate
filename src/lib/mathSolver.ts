interface Step {
  title: string;
  content: string;
  formula?: string;
}

interface Solution {
  steps: Step[];
  finalAnswer: string;
}

// Simulated math solver - In production, this would connect to a real math engine or AI
export function solveMathProblem(problem: string, category: string): Promise<Solution> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      const solution = generateSolution(problem, category);
      resolve(solution);
    }, 1500);
  });
}

function generateSolution(problem: string, category: string): Solution {
  const lowerProblem = problem.toLowerCase();

  // Detect equation type and generate appropriate solution
  if (lowerProblem.includes("x²") || lowerProblem.includes("x^2") || lowerProblem.includes("x2")) {
    return solveQuadratic(problem);
  }

  if (lowerProblem.includes("x") && (lowerProblem.includes("=") || lowerProblem.includes("+"))) {
    return solveLinear(problem);
  }

  if (lowerProblem.includes("dérivée") || lowerProblem.includes("derivee") || lowerProblem.includes("derivative")) {
    return solveDerivative(problem);
  }

  if (lowerProblem.includes("intégrale") || lowerProblem.includes("integrale") || lowerProblem.includes("integral")) {
    return solveIntegral(problem);
  }

  if (category === "geometry" || lowerProblem.includes("aire") || lowerProblem.includes("périmètre") || lowerProblem.includes("volume")) {
    return solveGeometry(problem);
  }

  // Default algebraic solution
  return solveGeneric(problem);
}

function solveQuadratic(problem: string): Solution {
  return {
    steps: [
      {
        title: "Identification de l'équation",
        content: "On identifie une équation du second degré de la forme ax² + bx + c = 0",
        formula: "ax² + bx + c = 0",
      },
      {
        title: "Calcul du discriminant",
        content: "On calcule le discriminant Δ = b² - 4ac pour déterminer la nature des solutions",
        formula: "Δ = b² - 4ac = 25 + 24 = 49",
      },
      {
        title: "Analyse du discriminant",
        content: "Δ > 0, donc l'équation admet deux solutions réelles distinctes",
        formula: "Δ = 49 > 0",
      },
      {
        title: "Application de la formule quadratique",
        content: "On utilise la formule x = (-b ± √Δ) / 2a pour trouver les solutions",
        formula: "x = (-5 ± √49) / 4 = (-5 ± 7) / 4",
      },
      {
        title: "Calcul des solutions",
        content: "On calcule les deux valeurs de x",
        formula: "x₁ = (-5 + 7) / 4 = 0.5  |  x₂ = (-5 - 7) / 4 = -3",
      },
    ],
    finalAnswer: "x₁ = 0.5  et  x₂ = -3",
  };
}

function solveLinear(problem: string): Solution {
  return {
    steps: [
      {
        title: "Identification de l'équation",
        content: "On identifie une équation linéaire de la forme ax + b = c",
        formula: "ax + b = c",
      },
      {
        title: "Isoler les termes en x",
        content: "On regroupe tous les termes contenant x d'un côté de l'équation",
        formula: "ax = c - b",
      },
      {
        title: "Résolution",
        content: "On divise par le coefficient de x pour isoler la variable",
        formula: "x = (c - b) / a",
      },
    ],
    finalAnswer: "x = 5",
  };
}

function solveDerivative(problem: string): Solution {
  return {
    steps: [
      {
        title: "Identification de la fonction",
        content: "On identifie la fonction à dériver et on repère les termes",
        formula: "f(x) = xⁿ + ...",
      },
      {
        title: "Application des règles de dérivation",
        content: "On applique la règle: (xⁿ)' = n·xⁿ⁻¹ à chaque terme",
        formula: "(xⁿ)' = n·xⁿ⁻¹",
      },
      {
        title: "Calcul terme par terme",
        content: "On dérive chaque terme séparément puis on additionne",
        formula: "f'(x) = n·xⁿ⁻¹ + ...",
      },
    ],
    finalAnswer: "f'(x) = 2x + 3",
  };
}

function solveIntegral(problem: string): Solution {
  return {
    steps: [
      {
        title: "Identification de la fonction",
        content: "On identifie la fonction à intégrer",
        formula: "∫f(x)dx",
      },
      {
        title: "Application de la règle d'intégration",
        content: "On applique la règle: ∫xⁿdx = xⁿ⁺¹/(n+1) + C",
        formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C",
      },
      {
        title: "Calcul de la primitive",
        content: "On intègre chaque terme et on ajoute la constante d'intégration",
        formula: "F(x) = xⁿ⁺¹/(n+1) + C",
      },
    ],
    finalAnswer: "F(x) = x³/3 + x²/2 + C",
  };
}

function solveGeometry(problem: string): Solution {
  return {
    steps: [
      {
        title: "Identification de la figure",
        content: "On identifie le type de figure géométrique et ses propriétés",
      },
      {
        title: "Formule appropriée",
        content: "On sélectionne la formule correspondant au calcul demandé",
        formula: "Aire = π × r²  ou  Périmètre = 2πr",
      },
      {
        title: "Application numérique",
        content: "On substitue les valeurs connues dans la formule",
        formula: "Résultat = valeur calculée",
      },
    ],
    finalAnswer: "Aire ≈ 78.54 unités²",
  };
}

function solveGeneric(problem: string): Solution {
  return {
    steps: [
      {
        title: "Analyse du problème",
        content: "On analyse l'énoncé pour identifier les données et l'inconnue",
      },
      {
        title: "Mise en équation",
        content: "On traduit le problème en langage mathématique",
      },
      {
        title: "Résolution",
        content: "On applique les méthodes appropriées pour trouver la solution",
      },
      {
        title: "Vérification",
        content: "On vérifie que la solution satisfait les conditions du problème",
      },
    ],
    finalAnswer: "Solution trouvée",
  };
}
