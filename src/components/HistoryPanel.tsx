import { X, Clock, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HistoryItem } from "@/lib/historyService";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem?: (id: string) => void;
}

export function HistoryPanel({ isOpen, onClose, history, onSelectItem, onDeleteItem }: HistoryPanelProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Historique</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-64px)]">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun historique</p>
              <p className="text-sm mt-1">Vos résolutions apparaîtront ici</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="w-full text-left glass-card rounded-lg p-4 hover:bg-accent/10 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onSelectItem(item)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="font-mono text-sm truncate">{item.problem}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {item.category}
                      </span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    {onDeleteItem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
                <p className="font-mono text-sm text-success mt-2 truncate">
                  → {item.answer}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
