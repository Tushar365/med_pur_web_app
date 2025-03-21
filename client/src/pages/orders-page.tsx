import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import Header from "@/components/layout/header";
import OrderTable from "@/components/orders/order-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OrderForm from "@/components/orders/order-form";

export default function OrdersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddOrder = () => {
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
            title="Order Management" 
            action={{
              label: "New Order",
              icon: <Plus className="h-4 w-4" />,
              onClick: handleAddOrder
            }}
          />

          <div className="mt-6">
            <OrderTable />
          </div>

          {/* Add Order Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new customer order.
                </DialogDescription>
              </DialogHeader>
              <OrderForm onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
