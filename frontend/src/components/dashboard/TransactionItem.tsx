import { Transaction, categoryLabels, categoryIcons } from "@/types/finance";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-card">
      {/* Category Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg">
        {categoryIcons[transaction.category]}
      </div>

      {/* Description and Category */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {categoryLabels[transaction.category]} •{" "}
          {formatDistanceToNow(new Date(transaction.date), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      </div>

      {/* Amount */}
      <p
        className={`font-semibold tabular-nums ${
          isIncome ? "text-success" : "text-foreground"
        }`}
      >
        {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}
