
import { useFinance, categoryInfo } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

const RecentTransactions = () => {
  const { transactions, deleteTransaction } = useFinance();

  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentTransactions.length > 0 ? (
          <div className="divide-y">
            {recentTransactions.map((transaction) => {
              const category = categoryInfo[transaction.category];
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`w-3 h-3 rounded-full bg-${category.color}`} 
                      title={category.name}
                    />
                    <div className="space-y-1">
                      <p className="font-medium leading-none">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTransaction(transaction.id)}
                      aria-label="Delete transaction"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No recent transactions
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
