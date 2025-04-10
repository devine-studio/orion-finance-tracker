
import React, { createContext, useContext, useState } from 'react';
import { 
  Budget, 
  CategorySummary, 
  ExpenseCategory, 
  TimeSeriesData, 
  Transaction
} from '@/lib/types';

// Helper function to generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 15);

// Initial sample data
const initialTransactions: Transaction[] = [
  {
    id: generateId(),
    amount: 12.99,
    category: 'food',
    description: 'Lunch at Cafe',
    date: new Date('2025-04-09'),
  },
  {
    id: generateId(),
    amount: 35.50,
    category: 'transport',
    description: 'Uber ride',
    date: new Date('2025-04-08'),
  },
  {
    id: generateId(),
    amount: 850,
    category: 'housing',
    description: 'Monthly rent',
    date: new Date('2025-04-01'),
  },
  {
    id: generateId(),
    amount: 45.75,
    category: 'utilities',
    description: 'Electricity bill',
    date: new Date('2025-04-05'),
  },
  {
    id: generateId(),
    amount: 19.99,
    category: 'entertainment',
    description: 'Movie tickets',
    date: new Date('2025-04-07'),
  },
];

const initialBudgets: Budget[] = [
  {
    id: generateId(),
    category: 'food',
    amount: 400,
    spent: 245.25,
    period: 'monthly',
  },
  {
    id: generateId(),
    category: 'transport',
    amount: 200,
    spent: 98.50,
    period: 'monthly',
  },
  {
    id: generateId(),
    category: 'housing',
    amount: 1200,
    spent: 1200,
    period: 'monthly',
  },
  {
    id: generateId(),
    category: 'entertainment',
    amount: 150,
    spent: 87.99,
    period: 'monthly',
  },
];

// Category information
export const categoryInfo: Record<ExpenseCategory, { name: string, color: string }> = {
  food: { name: 'Food & Dining', color: 'expense-food' },
  transport: { name: 'Transportation', color: 'expense-transport' },
  housing: { name: 'Housing', color: 'expense-housing' },
  utilities: { name: 'Utilities', color: 'expense-utilities' },
  entertainment: { name: 'Entertainment', color: 'expense-entertainment' },
  health: { name: 'Healthcare', color: 'expense-health' },
  education: { name: 'Education', color: 'expense-education' },
  shopping: { name: 'Shopping', color: 'expense-shopping' },
  other: { name: 'Other', color: 'expense-other' },
};

// Context interface
interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getCategorySpending: () => CategorySummary[];
  getSpendingOverTime: () => TimeSeriesData[];
  getTotalSpent: () => number;
  getTotalBudget: () => number;
}

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update budget spent amount
    const budget = budgets.find(b => b.category === transaction.category);
    if (budget) {
      updateBudget(budget.id, { spent: budget.spent + transaction.amount });
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    setTransactions(prev => prev.filter(t => t.id !== id));
    
    // Update budget spent amount
    const budget = budgets.find(b => b.category === transaction.category);
    if (budget) {
      updateBudget(budget.id, { spent: budget.spent - transaction.amount });
    }
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    // Calculate current spending in this category
    const categoryTransactions = transactions.filter(t => t.category === budget.category);
    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const newBudget = { ...budget, id: generateId(), spent };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.id === id ? { ...budget, ...updates } : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  // Analytics functions
  const getTotalSpent = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + budget.amount, 0);
  };

  const getCategorySpending = (): CategorySummary[] => {
    const totalSpent = getTotalSpent();
    
    // Group transactions by category
    const spendingByCategory = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);
    
    // Convert to array and calculate percentages
    return Object.entries(spendingByCategory).map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalSpent ? (amount / totalSpent) * 100 : 0,
    }));
  };

  const getSpendingOverTime = (): TimeSeriesData[] => {
    // Get last 7 days
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Group transactions by date
    const spendingByDate = transactions.reduce((acc, transaction) => {
      const date = transaction.date.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Create time series data
    return dates.map(date => ({
      date,
      amount: spendingByDate[date] || 0,
    }));
  };

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getCategorySpending,
    getSpendingOverTime,
    getTotalSpent,
    getTotalBudget,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
