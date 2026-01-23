import { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction, FinancialSummary, TransactionType, Account } from "@/types/finance";

// Mock accounts data
const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Conta Principal",
    type: "checking",
    balance: 5500.00,
    color: "#3B82F6",
    icon: "🏦",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc-2",
    name: "Poupança",
    type: "savings",
    balance: 2500.00,
    color: "#10B981",
    icon: "💰",
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc-3",
    name: "Cofrinho",
    type: "wallet",
    balance: 350.00,
    color: "#F59E0B",
    icon: "👛",
    createdAt: new Date().toISOString(),
  },
];

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Supermercado Extra",
    amount: 234.50,
    type: "expense",
    category: "food",
    accountId: "acc-1",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isForeignCurrency: false,
  },
  {
    id: "2",
    description: "Salário",
    amount: 5500.00,
    type: "income",
    category: "salary",
    accountId: "acc-1",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isForeignCurrency: false,
  },
  {
    id: "3",
    description: "Uber",
    amount: 28.90,
    type: "expense",
    category: "transport",
    accountId: "acc-1",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isForeignCurrency: false,
  },
  {
    id: "4",
    description: "Netflix",
    amount: 39.90,
    type: "expense",
    category: "entertainment",
    accountId: "acc-1",
    date: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isForeignCurrency: false,
  },
  {
    id: "5",
    description: "Freelance Internacional",
    amount: 1200.00,
    type: "income",
    category: "other",
    accountId: "acc-1",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isForeignCurrency: true,
    originalAmount: 250.00,
    originalCurrency: "USD",
    convertedAmount: 1200.00,
  },
  {
    id: "6",
    description: "Conta de luz",
    amount: 145.80,
    type: "expense",
    category: "bills",
    accountId: "acc-2",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isForeignCurrency: false,
  },
  {
    id: "7",
    description: "Compra Amazon",
    amount: 247.30,
    type: "expense",
    category: "shopping",
    accountId: "acc-1",
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    isForeignCurrency: true,
    originalAmount: 50.00,
    originalCurrency: "USD",
    convertedAmount: 247.30,
  },
];

export function useFinance() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    todayIncome: 0,
    todayExpense: 0,
    monthIncome: 0,
    monthExpense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const selectedAccount = useMemo(() => {
    if (!selectedAccountId) return null;
    return accounts.find((acc) => acc.id === selectedAccountId) || null;
  }, [accounts, selectedAccountId]);

  const filteredTransactions = useMemo(() => {
    if (!selectedAccountId) return transactions;
    return transactions.filter((txn) => txn.accountId === selectedAccountId);
  }, [transactions, selectedAccountId]);

  const calculateSummary = useCallback(
    (txns: Transaction[], accountId: string | null): FinancialSummary => {
      const today = new Date().toDateString();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const relevantTxns = accountId
        ? txns.filter((txn) => txn.accountId === accountId)
        : txns;

      let totalBalance = 0;
      let todayIncome = 0;
      let todayExpense = 0;
      let monthIncome = 0;
      let monthExpense = 0;

      relevantTxns.forEach((txn) => {
        const txnDate = new Date(txn.date);
        const isToday = txnDate.toDateString() === today;
        const isThisMonth =
          txnDate.getMonth() === currentMonth &&
          txnDate.getFullYear() === currentYear;

        const amount = txn.isForeignCurrency && txn.convertedAmount 
          ? txn.convertedAmount 
          : txn.amount;

        if (txn.type === "income") {
          totalBalance += amount;
          if (isToday) todayIncome += amount;
          if (isThisMonth) monthIncome += amount;
        } else {
          totalBalance -= amount;
          if (isToday) todayExpense += amount;
          if (isThisMonth) monthExpense += amount;
        }
      });

      return { totalBalance, todayIncome, todayExpense, monthIncome, monthExpense };
    },
    []
  );

  const recalculateAccountBalances = useCallback((txns: Transaction[], accs: Account[]) => {
    return accs.map((account) => {
      const accountTxns = txns.filter((txn) => txn.accountId === account.id);
      let balance = 0;
      accountTxns.forEach((txn) => {
        const amount = txn.isForeignCurrency && txn.convertedAmount 
          ? txn.convertedAmount 
          : txn.amount;
        if (txn.type === "income") {
          balance += amount;
        } else {
          balance -= amount;
        }
      });
      return { ...account, balance };
    });
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const updatedAccounts = recalculateAccountBalances(mockTransactions, mockAccounts);
    setAccounts(updatedAccounts);
    setTransactions(mockTransactions);
    setSummary(calculateSummary(mockTransactions, selectedAccountId));
    setIsLoading(false);
  }, [calculateSummary, recalculateAccountBalances, selectedAccountId]);

  const addAccount = useCallback(
    async (data: Omit<Account, "id" | "createdAt" | "balance"> & { initialBalance: number }) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newAccount: Account = {
        ...data,
        id: `acc-${Date.now()}`,
        balance: data.initialBalance,
        createdAt: new Date().toISOString(),
      };

      setAccounts((prev) => [...prev, newAccount]);
      setIsLoading(false);
      return newAccount;
    },
    []
  );

  const addTransaction = useCallback(
    async (data: Omit<Transaction, "id" | "createdAt">) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTransaction: Transaction = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setTransactions((prev) => {
        const updated = [newTransaction, ...prev];
        setSummary(calculateSummary(updated, selectedAccountId));
        setAccounts((accs) => recalculateAccountBalances(updated, accs));
        return updated;
      });
      setIsLoading(false);
    },
    [calculateSummary, recalculateAccountBalances, selectedAccountId]
  );

  const updateTransaction = useCallback(
    async (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTransactions((prev) => {
        const updated = prev.map((txn) =>
          txn.id === id ? { ...txn, ...data } : txn
        );
        setSummary(calculateSummary(updated, selectedAccountId));
        setAccounts((accs) => recalculateAccountBalances(updated, accs));
        return updated;
      });
      setIsLoading(false);
    },
    [calculateSummary, recalculateAccountBalances, selectedAccountId]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTransactions((prev) => {
        const updated = prev.filter((txn) => txn.id !== id);
        setSummary(calculateSummary(updated, selectedAccountId));
        setAccounts((accs) => recalculateAccountBalances(updated, accs));
        return updated;
      });
      setIsLoading(false);
    },
    [calculateSummary, recalculateAccountBalances, selectedAccountId]
  );

  const selectAccount = useCallback(
    (accountId: string | null) => {
      setSelectedAccountId(accountId);
      setSummary(calculateSummary(transactions, accountId));
    },
    [calculateSummary, transactions]
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Recalculate summary when selectedAccountId changes
  useEffect(() => {
    if (transactions.length > 0) {
      setSummary(calculateSummary(transactions, selectedAccountId));
    }
  }, [selectedAccountId, transactions, calculateSummary]);

  return {
    accounts,
    selectedAccount,
    selectedAccountId,
    selectAccount,
    transactions: filteredTransactions,
    allTransactions: transactions,
    summary,
    isLoading,
    addAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchData,
  };
}
