export type TransactionType = "income" | "expense";
export type TransactionCategory = 
  | "food"
  | "transport"
  | "entertainment"
  | "shopping"
  | "bills"
  | "health"
  | "education"
  | "salary"
  | "investment"
  | "other";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalBalance: number;
  todayIncome: number;
  todayExpense: number;
  monthIncome: number;
  monthExpense: number;
}

export const categoryLabels: Record<TransactionCategory, string> = {
  food: "Alimentação",
  transport: "Transporte",
  entertainment: "Lazer",
  shopping: "Compras",
  bills: "Contas",
  health: "Saúde",
  education: "Educação",
  salary: "Salário",
  investment: "Investimento",
  other: "Outros",
};

export const categoryIcons: Record<TransactionCategory, string> = {
  food: "🍔",
  transport: "🚗",
  entertainment: "🎬",
  shopping: "🛍️",
  bills: "📄",
  health: "🏥",
  education: "📚",
  salary: "💰",
  investment: "📈",
  other: "📌",
};
