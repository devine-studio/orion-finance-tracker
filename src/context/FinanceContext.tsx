
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Budget, 
  CategorySummary, 
  ExpenseCategory, 
  TimeSeriesData, 
  Transaction
} from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Helper function to generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 15);

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
  isLoading: boolean;
}

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch transactions and budgets from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setTransactions([]);
        setBudgets([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        if (transactionsError) throw transactionsError;

        // Fetch budgets
        const { data: budgetsData, error: budgetsError } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id);

        if (budgetsError) throw budgetsError;

        // Transform data to match our types
        const formattedTransactions: Transaction[] = transactionsData.map(t => ({
          id: t.id,
          amount: Number(t.amount),
          category: t.category as ExpenseCategory,
          description: t.description || '',
          date: new Date(t.date),
        }));

        // Calculate spent amount for each budget category
        const formattedBudgets: Budget[] = budgetsData.map(b => {
          const categoryTransactions = formattedTransactions.filter(t => t.category === b.category);
          const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
          
          return {
            id: b.id,
            category: b.category as ExpenseCategory,
            amount: Number(b.amount),
            spent,
            period: b.period as 'monthly' | 'weekly',
          };
        });

        setTransactions(formattedTransactions);
        setBudgets(formattedBudgets);
      } catch (error: any) {
        toast.error(`Error loading data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Transaction functions
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newTransaction: Transaction = {
        id: data.id,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update budget spent amount
      const budget = budgets.find(b => b.category === transaction.category);
      if (budget) {
        updateBudget(budget.id, { spent: budget.spent + transaction.amount });
      }
    } catch (error: any) {
      toast.error(`Error adding transaction: ${error.message}`);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Update budget spent amount
      const budget = budgets.find(b => b.category === transaction.category);
      if (budget) {
        updateBudget(budget.id, { spent: budget.spent - transaction.amount });
      }
    } catch (error: any) {
      toast.error(`Error deleting transaction: ${error.message}`);
    }
  };

  // Budget functions
  const addBudget = async (budget: Omit<Budget, 'id' | 'spent'>) => {
    if (!user) return;
    
    try {
      // Calculate current spending in this category
      const categoryTransactions = transactions.filter(t => t.category === budget.category);
      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Add to Supabase
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          category: budget.category,
          amount: budget.amount,
          period: budget.period,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newBudget: Budget = {
        id: data.id,
        category: budget.category,
        amount: budget.amount,
        spent,
        period: budget.period,
      };
      
      setBudgets(prev => [...prev, newBudget]);
    } catch (error: any) {
      toast.error(`Error adding budget: ${error.message}`);
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    if (!user) return;
    
    try {
      // First update local state for immediate feedback
      setBudgets(prev => 
        prev.map(budget => 
          budget.id === id ? { ...budget, ...updates } : budget
        )
      );

      // Only update amount in Supabase if it was changed
      // (we don't store 'spent' in the database)
      if (updates.amount !== undefined) {
        const { error } = await supabase
          .from('budgets')
          .update({ amount: updates.amount })
          .eq('id', id);

        if (error) throw error;
      }
    } catch (error: any) {
      toast.error(`Error updating budget: ${error.message}`);
    }
  };

  const deleteBudget = async (id: string) => {
    if (!user) return;
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBudgets(prev => prev.filter(budget => budget.id !== id));
    } catch (error: any) {
      toast.error(`Error deleting budget: ${error.message}`);
    }
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
    isLoading,
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
