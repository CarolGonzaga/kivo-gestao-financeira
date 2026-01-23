import { useState } from "react";
import { MoreVertical, Pencil, Trash2, Globe } from "lucide-react";
import { Transaction, categoryLabels, categoryIcons, currencySymbols } from "@/types/finance";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const formatCurrency = (value: number, currency: string = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-card group">
      {/* Category Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg">
        {categoryIcons[transaction.category]}
      </div>

      {/* Description and Category */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">
            {transaction.description}
          </p>
          {transaction.isForeignCurrency && (
            <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {categoryLabels[transaction.category]} •{" "}
          {formatDistanceToNow(new Date(transaction.date), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        {transaction.isForeignCurrency && transaction.originalAmount && transaction.originalCurrency ? (
          <>
            <p className="text-xs text-muted-foreground">
              {currencySymbols[transaction.originalCurrency]}{" "}
              {transaction.originalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p
              className={`font-semibold tabular-nums ${
                isIncome ? "text-success" : "text-foreground"
              }`}
            >
              {isIncome ? "+" : "-"} {formatCurrency(transaction.convertedAmount || transaction.amount)}
            </p>
          </>
        ) : (
          <p
            className={`font-semibold tabular-nums ${
              isIncome ? "text-success" : "text-foreground"
            }`}
          >
            {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
          </p>
        )}
      </div>

      {/* Actions Menu */}
      {(onEdit || onDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(transaction)}
                className="cursor-pointer"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(transaction)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
