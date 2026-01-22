import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface SummaryCardProps {
  type: "income" | "expense";
  label: string;
  amount: number;
  isLoading?: boolean;
}

export function SummaryCard({ type, label, amount, isLoading }: SummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const isIncome = type === "income";

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-4 shadow-card">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-4 shadow-card">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isIncome ? "bg-success-light" : "bg-destructive/10"
          }`}
        >
          {isIncome ? (
            <ArrowUpCircle className="h-4 w-4 text-success" />
          ) : (
            <ArrowDownCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p
        className={`mt-2 text-xl font-semibold ${
          isIncome ? "text-success" : "text-destructive"
        }`}
      >
        {isIncome ? "+" : "-"} {formatCurrency(amount)}
      </p>
    </div>
  );
}
