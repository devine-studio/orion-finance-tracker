
// Category types
export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'other';

// Transaction data structure
export interface Transaction {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
}

// Budget data structure
export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly';
}

// Category display information
export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  amount: number;
}
