
import { FinanceProvider } from "@/context/FinanceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExpenseSummary from "@/components/dashboard/ExpenseSummary";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import AddExpenseForm from "@/components/expenses/AddExpenseForm";
import { ArrowRightIcon, HomeIcon, LineChartIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <WalletIcon className="mr-2" /> Budget Tracker
              </h1>
              <p className="text-muted-foreground">Track your expenses and stay on budget</p>
            </div>
            <div className="flex gap-3">
              <AddExpenseForm />
              <Button variant="outline" asChild>
                <Link to="/budgets" className="flex items-center gap-1">
                  <LineChartIcon className="h-4 w-4" /> View Budgets
                </Link>
              </Button>
            </div>
          </header>
          
          <DashboardHeader />
          
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExpenseSummary />
                <BudgetProgress />
              </div>
              <SpendingChart />
              <div className="flex justify-between items-center mt-6 mb-3">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <Button variant="link" asChild>
                  <Link to="/expenses" className="flex items-center">
                    View All <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <RecentTransactions />
            </TabsContent>
            <TabsContent value="expenses" className="mt-6">
              <div className="bg-card rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Transactions</h2>
                  <Button variant="link" asChild>
                    <Link to="/expenses" className="flex items-center">
                      View All <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <RecentTransactions />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Index;
