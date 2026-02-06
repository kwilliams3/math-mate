import { Calculator, History, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onHistoryClick: () => void;
  onAuthClick: () => void;
}

export function Header({ onHistoryClick, onAuthClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      onAuthClick();
    }
  };

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
          {user && (
            <Button variant="ghost" size="icon" onClick={onHistoryClick}>
              <History className="w-5 h-5" />
            </Button>
          )}
          
          <Button 
            variant={user ? "ghost" : "gradient"} 
            size={user ? "icon" : "default"}
            onClick={handleAuthAction}
            className="gap-2"
          >
            {user ? (
              <LogOut className="w-5 h-5" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Connexion</span>
              </>
            )}
          </Button>
          
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
              <User className="w-4 h-4" />
              <span className="max-w-[120px] truncate">{user.email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
