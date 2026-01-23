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
import { EditTransactionModal } from "@/components/dashboard/EditTransactionModal";
import { AddAccountModal } from "@/components/dashboard/AddAccountModal";
import { AccountSelector } from "@/components/dashboard/AccountSelector";
import { DeleteConfirmDialog } from "@/components/dashboard/DeleteConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { useFinance } from "@/hooks/useFinance";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types/finance";

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { user, logout } = useAuth();
  const { 
    accounts,
    selectedAccount,
    selectedAccountId,
    selectAccount,
    transactions, 
    summary, 
    isLoading, 
    addAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();
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

  const handleUpdateTransaction = async (id: string, data: Parameters<typeof updateTransaction>[1]) => {
    await updateTransaction(id, data);
    setEditingTransaction(null);
    toast({
      title: "Transação atualizada!",
      description: "Sua transação foi atualizada com sucesso.",
    });
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    await deleteTransaction(deletingTransaction.id);
    setDeletingTransaction(null);
    setIsDeleting(false);
    toast({
      title: "Transação excluída!",
      description: "Sua transação foi removida com sucesso.",
    });
  };

  const handleAddAccount = async (data: Parameters<typeof addAccount>[0]) => {
    await addAccount(data);
    toast({
      title: "Conta criada!",
      description: "Sua nova conta foi adicionada com sucesso.",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = user?.name.split(" ")[0] || "Usuário";

  const isAllAccountsSelected = selectedAccountId === null;

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

        {/* Account Selector */}
        <div className="animate-fade-in-up">
          <AccountSelector
            accounts={accounts}
            selectedAccount={selectedAccount}
            isAllSelected={isAllAccountsSelected}
            onSelectAccount={(account) => selectAccount(account.id)}
            onSelectAll={() => selectAccount(null)}
            onAddAccount={() => setIsAddAccountModalOpen(true)}
          />
        </div>

        {/* Balance Card */}
        <div className="animate-fade-in-up">
          <BalanceCard 
            balance={isAllAccountsSelected 
              ? accounts.reduce((sum, acc) => sum + acc.balance, 0)
              : selectedAccount?.balance || 0
            } 
            isLoading={isLoading} 
          />
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
            onEdit={setEditingTransaction}
            onDelete={setDeletingTransaction}
          />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav onAddTransaction={() => setIsAddModalOpen(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accounts={accounts}
        defaultAccountId={selectedAccountId || accounts[0]?.id}
        onAdd={handleAddTransaction}
      />

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          accounts={accounts}
          onUpdate={handleUpdateTransaction}
        />
      )}

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAdd={handleAddAccount}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteTransaction}
        isLoading={isDeleting}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir a transação "${deletingTransaction?.description}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
