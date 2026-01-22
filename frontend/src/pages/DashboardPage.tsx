import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, ChevronRight } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { AddTransactionModal } from "@/components/dashboard/AddTransactionModal";
import { useAuth } from "@/hooks/useAuth";
import { useFinance } from "@/hooks/useFinance";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { transactions, summary, isLoading, addTransaction } = useFinance();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddTransaction = async (data: Parameters<typeof addTransaction>[0]) => {
    await addTransaction(data);
    toast({
      title: "Transação adicionada!",
      description: "Sua transação foi registrada com sucesso.",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = user?.name.split(" ")[0] || "Usuário";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Veja como estão suas finanças
          </p>
        </div>

        {/* Balance Card */}
        <div className="animate-fade-in-up">
          <BalanceCard balance={summary.totalBalance} isLoading={isLoading} />
        </div>

        {/* Daily Summary */}
        <div className="animate-fade-in-up">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Hoje</h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              type="income"
              label="Entradas"
              amount={summary.todayIncome}
              isLoading={isLoading}
            />
            <SummaryCard
              type="expense"
              label="Saídas"
              amount={summary.todayExpense}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="animate-fade-in-up">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Este mês</h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              type="income"
              label="Entradas"
              amount={summary.monthIncome}
              isLoading={isLoading}
            />
            <SummaryCard
              type="expense"
              label="Saídas"
              amount={summary.monthExpense}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Transações recentes
            </h2>
            <Button variant="ghost" size="sm" className="text-primary -mr-2">
              Ver todas
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <TransactionList
            transactions={transactions.slice(0, 5)}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav onAddTransaction={() => setIsAddModalOpen(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}
