import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Clock, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Clock, label: "Histórico", path: "/history" },
  { icon: BarChart3, label: "Análise", path: "/analytics" },
  { icon: User, label: "Perfil", path: "/profile" },
];

interface BottomNavProps {
  onAddTransaction?: () => void;
}

export function BottomNav({ onAddTransaction }: BottomNavProps) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-2xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Floating Add Button */}
        <div className="relative -mt-8">
          <Button
            size="icon-lg"
            className="rounded-full shadow-button"
            onClick={onAddTransaction}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-2xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
