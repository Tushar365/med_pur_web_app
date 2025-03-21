import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ShoppingCart, DollarSign, Users, AlertCircle, Plus } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/dashboard/stats-card";
import RecentOrders from "@/components/dashboard/recent-orders";
import LowStockItems from "@/components/dashboard/low-stock-items";
import RecentCustomers from "@/components/dashboard/recent-customers";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleNewOrder = () => {
    navigate("/orders/new");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileSidebar />
        <main className="flex-1 p-4 pt-16 md:pt-0 md:p-6 lg:p-8 overflow-y-auto pb-10">
          <Header 
            title="Dashboard" 
            action={{
              label: "New Order",
              icon: <Plus className="h-4 w-4" />,
              onClick: handleNewOrder
            }}
          />

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Orders"
              value={isStatsLoading ? "Loading..." : stats?.totalOrders || 0}
              icon={<ShoppingCart className="h-5 w-5 text-primary" />}
              iconBgColor="bg-primary-50"
              changeValue={8.5}
              changeLabel="vs last month"
              changeDirection="up"
            />
            
            <StatsCard 
              title="Revenue"
              value={isStatsLoading ? "Loading..." : formatCurrency(stats?.revenue || 0)}
              icon={<DollarSign className="h-5 w-5 text-teal-500" />}
              iconBgColor="bg-teal-50"
              changeValue={12.3}
              changeLabel="vs last month"
              changeDirection="up"
            />
            
            <StatsCard 
              title="Customers"
              value={isStatsLoading ? "Loading..." : stats?.customers || 0}
              icon={<Users className="h-5 w-5 text-purple-500" />}
              iconBgColor="bg-purple-50"
              changeValue={4.2}
              changeLabel="vs last month"
              changeDirection="up"
            />
            
            <StatsCard 
              title="Low Stock Items"
              value={isStatsLoading ? "Loading..." : stats?.lowStockItems || 0}
              icon={<AlertCircle className="h-5 w-5 text-red-500" />}
              iconBgColor="bg-red-50"
              changeValue={3}
              changeLabel="since yesterday"
              changeDirection="up"
            />
          </div>

          {/* Recent Orders */}
          <RecentOrders />

          {/* Inventory Status and Recent Customers */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <LowStockItems />
            <RecentCustomers />
          </div>
        </main>
      </div>
    </div>
  );
}
