import { useState, useEffect, useCallback } from "react";
import { Transaction, FinancialSummary, TransactionType } from "@/types/finance";

// Mock data - replace with API calls
const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Supermercado Extra",
    amount: 234.50,
    type: "expense",
    category: "food",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    description: "Salário",
    amount: 5500.00,
    type: "income",
    category: "salary",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    description: "Uber",
    amount: 28.90,
    type: "expense",
    category: "transport",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    description: "Netflix",
    amount: 39.90,
    type: "expense",
    category: "entertainment",
    date: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "5",
    description: "Freelance",
    amount: 1200.00,
    type: "income",
    category: "other",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "6",
    description: "Conta de luz",
    amount: 145.80,
    type: "expense",
    category: "bills",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    todayIncome: 0,
    todayExpense: 0,
    monthIncome: 0,
    monthExpense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateSummary = useCallback((txns: Transaction[]): FinancialSummary => {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let totalBalance = 0;
    let todayIncome = 0;
    let todayExpense = 0;
    let monthIncome = 0;
    let monthExpense = 0;

    txns.forEach((txn) => {
      const txnDate = new Date(txn.date);
      const isToday = txnDate.toDateString() === today;
      const isThisMonth = txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;

      if (txn.type === "income") {
        totalBalance += txn.amount;
        if (isToday) todayIncome += txn.amount;
        if (isThisMonth) monthIncome += txn.amount;
      } else {
        totalBalance -= txn.amount;
        if (isToday) todayExpense += txn.amount;
        if (isThisMonth) monthExpense += txn.amount;
      }
    });

    return { totalBalance, todayIncome, todayExpense, monthIncome, monthExpense };
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTransactions(mockTransactions);
    setSummary(calculateSummary(mockTransactions));
    setIsLoading(false);
  }, [calculateSummary]);

  const addTransaction = useCallback(async (
    data: Omit<Transaction, "id" | "createdAt">
  ) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newTransaction: Transaction = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setTransactions((prev) => {
      const updated = [newTransaction, ...prev];
      setSummary(calculateSummary(updated));
      return updated;
    });
    setIsLoading(false);
  }, [calculateSummary]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    summary,
    isLoading,
    addTransaction,
    refetch: fetchTransactions,
  };
}
