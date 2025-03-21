import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentCustomers() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Customers</CardTitle>
          <Button variant="secondary" size="sm">
            <UserPlus className="mr-1 h-4 w-4" /> Add Customer
          </Button>
        </CardHeader>
        <CardContent className="border-t border-gray-200">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {Array(3).fill(0).map((_, i) => (
                <li key={i} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                    <div className="text-sm text-gray-500">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-8 w-8 rounded-full" />
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

  // If there's no customers data or it's empty
  if (!customers || customers.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Customers</CardTitle>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/customers/new">
              <UserPlus className="mr-1 h-4 w-4" /> Add Customer
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="border-t border-gray-200">
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No customers found</p>
            <Button asChild>
              <Link href="/customers/new">Add New Customer</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Customers</CardTitle>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/customers/new">
            <UserPlus className="mr-1 h-4 w-4" /> Add Customer
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="border-t border-gray-200">
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {customers.slice(0, 5).map((customer: any) => (
              <li key={customer.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {customer.name?.substring(0, 2).toUpperCase() || "??"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {customer.email}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Created</p>
                    <p>{format(new Date(customer.createdAt), 'MMM d')}</p>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/customers/${customer.id}`}>
                        <MoreHorizontal className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/customers">View all</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
