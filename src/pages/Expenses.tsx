
import { FinanceProvider } from "@/context/FinanceContext";
import PageHeader from "@/components/shared/PageHeader";
import AddExpenseForm from "@/components/expenses/AddExpenseForm";
import ExpensesList from "@/components/expenses/ExpensesList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const Expenses = () => {
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
              title="Expenses"
              description="Manage and track your expenses"
              actions={<AddExpenseForm />}
            />
          </div>
          
          <ExpensesList />
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Expenses;
