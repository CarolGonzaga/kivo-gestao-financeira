import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  isLoading?: boolean;
}

export function BalanceCard({ balance, isLoading }: BalanceCardProps) {
  const isPositive = balance >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl gradient-primary p-6 text-primary-foreground shadow-lg">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-primary-foreground/20 rounded animate-pulse" />
          <div className="h-10 w-48 bg-primary-foreground/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl gradient-primary p-6 text-primary-foreground shadow-lg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-foreground/10" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-primary-foreground/5" />
      
      <div className="relative z-10">
        <p className="text-sm font-medium text-primary-foreground/80">
          Saldo disponível
        </p>
        <div className="mt-2 flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {formatCurrency(Math.abs(balance))}
          </h2>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              isPositive 
                ? "bg-success/20 text-primary-foreground" 
                : "bg-destructive/20 text-primary-foreground"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "positivo" : "negativo"}
          </div>
        </div>
      </div>
    </div>
  );
}
