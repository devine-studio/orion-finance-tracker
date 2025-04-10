
import { useState } from "react";
import { useFinance, categoryInfo } from "@/context/FinanceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseCategory, Transaction } from "@/lib/types";
import { Search, TrashIcon } from "lucide-react";

const ExpensesList = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  
  // Sort and filter transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = 
        categoryFilter === "all" || transaction.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteTransaction(id);
    }
  };

  // Group transactions by date
  const groupByDate = (transactions: Transaction[]) => {
    const grouped: Record<string, Transaction[]> = {};
    
    transactions.forEach((transaction) => {
      const dateStr = transaction.date.toLocaleDateString();
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(transaction);
    });
    
    return Object.entries(grouped).map(([date, items]) => ({
      date,
      transactions: items,
    }));
  };

  const groupedTransactions = groupByDate(filteredTransactions);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as ExpenseCategory | "all")}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryInfo).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {groupedTransactions.length > 0 ? (
          groupedTransactions.map((group) => (
            <div key={group.date} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {group.date}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {group.transactions.map((transaction) => {
                  const category = categoryInfo[transaction.category];
                  
                  return (
                    <Card key={transaction.id} className="expense-card">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className={`w-3 h-3 rounded-full bg-${category.color} mr-3`}
                            title={category.name}
                          />
                          <div>
                            <h4 className="font-medium">{transaction.description}</h4>
                            <p className="text-sm text-muted-foreground">{category.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${transaction.amount.toFixed(2)}</span>
                          <Button
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(transaction.id)}
                            aria-label="Delete transaction"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesList;
