import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "success";
  onClick: () => void;
  isSelected?: boolean;
}

const colorClasses = {
  primary: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
  accent: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
  success: "bg-success/10 text-success border-success/20 hover:bg-success/20",
};

const iconBgClasses = {
  primary: "bg-primary/20",
  secondary: "bg-secondary/20",
  accent: "bg-accent/20",
  success: "bg-success/20",
};

export function CategoryCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  isSelected,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-3 p-5 rounded-xl border-2 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        colorClasses[color],
        isSelected && "ring-2 ring-offset-2 ring-offset-background"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg transition-transform duration-300 group-hover:scale-110",
          iconBgClasses[color]
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-left">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </button>
  );
}
