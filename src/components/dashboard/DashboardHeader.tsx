
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";

const DashboardHeader = () => {
  const { getTotalSpent, getTotalBudget } = useFinance();
  const totalSpent = getTotalSpent();
  const totalBudget = getTotalBudget();
  const remaining = totalBudget - totalSpent;
  const savingsRate = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ArrowDownCircle className="mr-2 h-4 w-4 text-destructive" />
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Budget Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ArrowUpCircle className="mr-2 h-4 w-4 text-secondary" />
            <div className="text-2xl font-bold">${remaining.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Savings Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-primary" />
            <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;
