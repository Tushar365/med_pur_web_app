import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Pill, 
  Users, 
  ShoppingCart, 
  UserCog,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    closeSidebar();
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { href: "/inventory", label: "Inventory", icon: <Pill className="mr-3 h-5 w-5" /> },
    { href: "/customers", label: "Customers", icon: <Users className="mr-3 h-5 w-5" /> },
    { href: "/orders", label: "Orders", icon: <ShoppingCart className="mr-3 h-5 w-5" /> },
  ];

  const settingsItems = [
    { href: "/account", label: "Account", icon: <UserCog className="mr-3 h-5 w-5" /> },
    { href: "/settings", label: "Preferences", icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
              <Pill />
            </div>
            <h1 className="ml-2 text-xl font-semibold text-gray-800">PharmaFlow</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
        onClick={closeSidebar}
      ></div>

      {/* Mobile sidebar */}
      <aside 
        className={cn(
          "transform fixed z-30 inset-y-0 left-0 w-64 bg-white overflow-y-auto transition duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
                <Pill />
              </div>
              <h1 className="ml-2 text-xl font-semibold text-gray-800">PharmaFlow</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4">
          <div className="mb-4">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</p>
            <div className="mt-2 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      location === item.href 
                        ? "bg-primary-50 text-primary border-l-3 border-primary" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</p>
            <div className="mt-2 space-y-1">
              {settingsItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      location === item.href 
                        ? "bg-primary-50 text-primary border-l-3 border-primary" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {user?.fullName?.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
