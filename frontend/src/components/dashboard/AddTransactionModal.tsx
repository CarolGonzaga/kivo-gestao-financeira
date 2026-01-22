import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TransactionCategory, TransactionType, categoryLabels, categoryIcons } from "@/types/finance";

const transactionSchema = z.object({
  description: z.string().trim().min(1, "Descrição é obrigatória").max(100),
  amount: z.string().min(1, "Valor é obrigatório"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string;
  }) => Promise<void>;
}

export function AddTransactionModal({ isOpen, onClose, onAdd }: AddTransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>("expense");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    try {
      await onAdd({
        description: data.description,
        amount: parseFloat(data.amount.replace(",", ".")),
        type: data.type as TransactionType,
        category: data.category as TransactionCategory,
        date: new Date().toISOString(),
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = Object.entries(categoryLabels).filter(([key]) => {
    if (selectedType === "income") {
      return ["salary", "investment", "other"].includes(key);
    }
    return !["salary", "investment"].includes(key);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-t-3xl bg-card p-6 pb-safe-bottom animate-slide-in-bottom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Nova transação</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={selectedType === "expense" ? "default" : "secondary"}
            className="flex-1"
            onClick={() => {
              setSelectedType("expense");
              setValue("type", "expense");
            }}
          >
            Despesa
          </Button>
          <Button
            type="button"
            variant={selectedType === "income" ? "success" : "secondary"}
            className="flex-1"
            onClick={() => {
              setSelectedType("income");
              setValue("type", "income");
            }}
          >
            Receita
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("type")} />

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              className={`text-2xl font-bold h-14 ${errors.amount ? "border-destructive" : ""}`}
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Supermercado"
              className={errors.description ? "border-destructive" : ""}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{categoryIcons[key as TransactionCategory]}</span>
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Salvando...
              </>
            ) : (
              "Salvar transação"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
