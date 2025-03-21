import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import Header from "@/components/layout/header";
import CustomerTable from "@/components/customers/customer-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomerForm from "@/components/customers/customer-form";

export default function CustomersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCustomer = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileSidebar />
        <main className="flex-1 p-4 pt-16 md:pt-0 md:p-6 lg:p-8 overflow-y-auto pb-10">
          <Header 
            title="Customer Management" 
            action={{
              label: "Add Customer",
              icon: <Plus className="h-4 w-4" />,
              onClick: handleAddCustomer
            }}
          />

          <div className="mt-6">
            <CustomerTable />
          </div>

          {/* Add Customer Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new customer.
                </DialogDescription>
              </DialogHeader>
              <CustomerForm onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
