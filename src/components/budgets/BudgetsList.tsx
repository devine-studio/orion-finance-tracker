
import { useFinance, categoryInfo } from "@/context/FinanceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

const BudgetsList = () => {
  const { budgets, deleteBudget } = useFinance();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      deleteBudget(id);
      toast.success("Budget deleted successfully");
    }
  };

  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No budgets found. Create a budget to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {budgets.map((budget) => {
        const category = categoryInfo[budget.category];
        const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
        const isOverBudget = budget.spent > budget.amount;
        
        return (
          <Card key={budget.id} className="expense-card">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full bg-${category.color} mr-2`} 
                    />
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(budget.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>
                    ${budget.spent.toFixed(2)} 
                    <span className="text-muted-foreground"> spent</span>
                  </span>
                  <span className="text-muted-foreground">
                    Budget: ${budget.amount.toFixed(2)}
                  </span>
                </div>
                
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isOverBudget ? 'bg-destructive/30' : ''}`}
                />
                
                <div className="flex justify-between mt-1">
                  <span 
                    className={`text-sm ${isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}`}
                  >
                    {percentage}% 
                    {isOverBudget ? ' Over budget!' : ''}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ${Math.max(budget.amount - budget.spent, 0).toFixed(2)} remaining
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BudgetsList;
