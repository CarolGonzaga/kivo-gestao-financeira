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

export type Currency = "BRL" | "USD" | "EUR" | "GBP" | "JPY" | "ARS" | "CAD" | "AUD" | "CHF";

export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "wallet" | "investment" | "other";
  balance: number;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  accountId: string;
  date: string;
  createdAt: string;
  // Foreign currency fields
  isForeignCurrency: boolean;
  originalAmount?: number;
  originalCurrency?: Currency;
  convertedAmount?: number; // Amount in BRL (comes from backend)
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

export const currencyLabels: Record<Currency, string> = {
  BRL: "Real Brasileiro",
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  JPY: "Iene Japonês",
  ARS: "Peso Argentino",
  CAD: "Dólar Canadense",
  AUD: "Dólar Australiano",
  CHF: "Franco Suíço",
};

export const currencySymbols: Record<Currency, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  ARS: "$",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
};

export const accountTypeLabels: Record<Account["type"], string> = {
  checking: "Conta Corrente",
  savings: "Poupança",
  wallet: "Carteira",
  investment: "Investimento",
  other: "Outro",
};

export const accountTypeIcons: Record<Account["type"], string> = {
  checking: "🏦",
  savings: "💰",
  wallet: "👛",
  investment: "📊",
  other: "💳",
};
