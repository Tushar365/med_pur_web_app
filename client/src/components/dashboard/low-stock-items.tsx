import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function LowStockItems() {
  const { data: lowStockItems, isLoading } = useQuery({
    queryKey: ["/api/products/low-stock"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Low Stock Items</CardTitle>
          <Button variant="secondary" size="sm">Restock All</Button>
        </CardHeader>
        <CardContent className="border-t border-gray-200">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {Array(3).fill(0).map((_, i) => (
                <li key={i} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Skeleton className="h-10 w-10 rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div>
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If there's no low stock items or it's empty
  if (!lowStockItems || lowStockItems.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Low Stock Items</CardTitle>
          <Button variant="link" asChild>
            <Link href="/inventory">View Inventory</Link>
          </Button>
        </CardHeader>
        <CardContent className="border-t border-gray-200">
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-green-600 mb-1 font-medium">All items are well stocked</p>
            <p className="text-gray-500 mb-4 text-sm">There are no items below the threshold level</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStockBadgeColor = (stock: number, threshold: number) => {
    const ratio = stock / threshold;
    if (ratio < 0.5) return "bg-red-100 text-red-800";
    if (ratio < 1) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Low Stock Items</CardTitle>
        <Button variant="secondary" size="sm">Restock All</Button>
      </CardHeader>
      <CardContent className="border-t border-gray-200">
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {lowStockItems.slice(0, 5).map((item: any) => (
              <li key={item.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded bg-primary-100 flex items-center justify-center">
                      <Pill className="text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <div>
                    <Badge variant="outline" className={getStockBadgeColor(item.stock, item.lowStockThreshold)}>
                      {item.stock} left
                    </Badge>
                  </div>
                  <div>
                    <Button size="sm" variant="outline">Order</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/inventory">View all</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
