import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import Header from "@/components/layout/header";
import InventoryTable from "@/components/inventory/inventory-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InventoryForm from "@/components/inventory/inventory-form";

export default function InventoryPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddProduct = () => {
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
            title="Inventory Management" 
            action={{
              label: "Add Product",
              icon: <Plus className="h-4 w-4" />,
              onClick: handleAddProduct
            }}
          />

          <div className="mt-6">
            <InventoryTable />
          </div>

          {/* Add Product Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new product to your inventory.
                </DialogDescription>
              </DialogHeader>
              <InventoryForm onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
