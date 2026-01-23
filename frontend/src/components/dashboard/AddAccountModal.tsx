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
import { Account, accountTypeLabels, accountTypeIcons } from "@/types/finance";

const accountSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(50),
  type: z.enum(["checking", "savings", "wallet", "investment", "other"]),
  initialBalance: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const accountColors = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
];

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Account, "id" | "createdAt" | "balance"> & { initialBalance: number }) => Promise<void>;
}

export function AddAccountModal({ isOpen, onClose, onAdd }: AddAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(accountColors[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      type: "checking",
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    setIsLoading(true);
    try {
      await onAdd({
        name: data.name,
        type: data.type,
        color: selectedColor,
        icon: accountTypeIcons[data.type],
        initialBalance: data.initialBalance 
          ? parseFloat(data.initialBalance.replace(",", ".")) 
          : 0,
      });
      reset();
      setSelectedColor(accountColors[0]);
      onClose();
    } catch (error) {
      console.error("Error adding account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-t-3xl bg-card p-6 pb-safe-bottom animate-slide-in-bottom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Nova conta</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da conta</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Conta Principal"
              className={errors.name ? "border-destructive" : ""}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo de conta</Label>
            <Select 
              defaultValue="checking"
              onValueChange={(value) => setValue("type", value as Account["type"])}
            >
              <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(accountTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{accountTypeIcons[key as Account["type"]]}</span>
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialBalance">Saldo inicial (opcional)</Label>
            <Input
              id="initialBalance"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              {...register("initialBalance")}
            />
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex gap-2 flex-wrap">
              {accountColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-primary"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
                Criando...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
