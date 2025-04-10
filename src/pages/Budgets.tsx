
import { FinanceProvider } from "@/context/FinanceContext";
import PageHeader from "@/components/shared/PageHeader";
import BudgetForm from "@/components/budgets/BudgetForm";
import BudgetsList from "@/components/budgets/BudgetsList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const Budgets = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/">
                <HomeIcon className="h-4 w-4" />
              </Link>
            </Button>
            <PageHeader
              title="Budgets"
              description="Set and manage your budget goals"
              actions={<BudgetForm />}
            />
          </div>
          
          <BudgetsList />
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Budgets;
