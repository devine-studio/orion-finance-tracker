
import { useFinance, categoryInfo } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const BudgetProgress = () => {
  const { budgets, isLoading } = useFinance();

  // Sort budgets by percentage spent
  const sortedBudgets = [...budgets].sort((a, b) => {
    const percentA = (a.spent / a.amount) * 100;
    const percentB = (b.spent / b.amount) * 100;
    return percentB - percentA;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedBudgets.length > 0 ? (
          sortedBudgets.map((budget) => {
            const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
            const category = categoryInfo[budget.category];
            
            return (
              <div key={budget.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">
                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${percentage >= 100 ? 'bg-destructive/30' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage}%</span>
                  <span>{budget.period}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No budgets set
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
