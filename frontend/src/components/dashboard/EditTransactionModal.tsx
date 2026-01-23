import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Globe } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Transaction,
  TransactionCategory, 
  TransactionType, 
  categoryLabels, 
  categoryIcons,
  Currency,
  currencyLabels,
  currencySymbols,
  Account,
  accountTypeIcons,
} from "@/types/finance";

const transactionSchema = z.object({
  description: z.string().trim().min(1, "Descrição é obrigatória").max(100),
  amount: z.string().min(1, "Valor é obrigatório"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  accountId: z.string().min(1, "Conta é obrigatória"),
  isForeignCurrency: z.boolean().default(false),
  originalCurrency: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  accounts: Account[];
  onUpdate: (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => Promise<void>;
}

export function EditTransactionModal({ 
  isOpen, 
  onClose, 
  transaction,
  accounts,
  onUpdate 
}: EditTransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>(transaction.type);
  const [isForeignCurrency, setIsForeignCurrency] = useState(transaction.isForeignCurrency);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction.description,
      amount: transaction.isForeignCurrency 
        ? transaction.originalAmount?.toString().replace(".", ",") 
        : transaction.amount.toString().replace(".", ","),
      type: transaction.type,
      category: transaction.category,
      accountId: transaction.accountId,
      isForeignCurrency: transaction.isForeignCurrency,
      originalCurrency: transaction.originalCurrency,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedType(transaction.type);
      setIsForeignCurrency(transaction.isForeignCurrency);
      reset({
        description: transaction.description,
        amount: transaction.isForeignCurrency 
          ? transaction.originalAmount?.toString().replace(".", ",") 
          : transaction.amount.toString().replace(".", ","),
        type: transaction.type,
        category: transaction.category,
        accountId: transaction.accountId,
        isForeignCurrency: transaction.isForeignCurrency,
        originalCurrency: transaction.originalCurrency,
      });
    }
  }, [isOpen, transaction, reset]);

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    try {
      const amount = parseFloat(data.amount.replace(",", "."));
      
      // Mock conversion rate (in real app, this would come from backend)
      const mockConversionRate = data.originalCurrency === "USD" ? 4.95 : 
                                  data.originalCurrency === "EUR" ? 5.35 : 
                                  data.originalCurrency === "GBP" ? 6.25 : 1;
      
      await onUpdate(transaction.id, {
        description: data.description,
        amount: data.isForeignCurrency ? amount * mockConversionRate : amount,
        type: data.type as TransactionType,
        category: data.category as TransactionCategory,
        accountId: data.accountId,
        isForeignCurrency: data.isForeignCurrency,
        originalAmount: data.isForeignCurrency ? amount : undefined,
        originalCurrency: data.isForeignCurrency ? (data.originalCurrency as Currency) : undefined,
        convertedAmount: data.isForeignCurrency ? amount * mockConversionRate : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
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

  const currencies: Currency[] = ["USD", "EUR", "GBP", "JPY", "ARS", "CAD", "AUD", "CHF"];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-t-3xl bg-card p-6 pb-safe-bottom animate-slide-in-bottom max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Editar transação</h2>
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

          {/* Account Selection */}
          <div className="space-y-2">
            <Label>Conta</Label>
            <Select 
              defaultValue={transaction.accountId}
              onValueChange={(value) => setValue("accountId", value)}
            >
              <SelectTrigger className={errors.accountId ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <span className="flex items-center gap-2">
                      <span>{accountTypeIcons[account.type]}</span>
                      {account.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-destructive">{errors.accountId.message}</p>
            )}
          </div>

          {/* Foreign Currency Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="foreign-currency-edit" className="text-sm cursor-pointer">
                Moeda estrangeira
              </Label>
            </div>
            <Switch
              id="foreign-currency-edit"
              checked={isForeignCurrency}
              onCheckedChange={(checked) => {
                setIsForeignCurrency(checked);
                setValue("isForeignCurrency", checked);
              }}
            />
          </div>

          {/* Currency Selection (conditional) */}
          {isForeignCurrency && (
            <div className="space-y-2 animate-fade-in">
              <Label>Moeda</Label>
              <Select 
                defaultValue={transaction.originalCurrency}
                onValueChange={(value) => setValue("originalCurrency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono">{currencySymbols[currency]}</span>
                        {currencyLabels[currency]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount-edit">
              Valor {isForeignCurrency && watch("originalCurrency") ? `(${currencySymbols[watch("originalCurrency") as Currency] || ""})` : "(R$)"}
            </Label>
            <Input
              id="amount-edit"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              className={`text-2xl font-bold h-14 ${errors.amount ? "border-destructive" : ""}`}
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
            {isForeignCurrency && (
              <p className="text-xs text-muted-foreground">
                * O valor será convertido para BRL automaticamente
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description-edit">Descrição</Label>
            <Input
              id="description-edit"
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
            <Select 
              defaultValue={transaction.category}
              onValueChange={(value) => setValue("category", value)}
            >
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
              "Salvar alterações"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
