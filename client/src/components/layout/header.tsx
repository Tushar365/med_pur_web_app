import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
  title: string;
  action?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

export default function Header({ title, action }: HeaderProps) {
  const today = new Date();

  return (
    <div className="md:flex md:items-center md:justify-between mb-6">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:truncate">
          {title}
        </h2>
        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            <span>Today, <time dateTime={format(today, "yyyy-MM-dd")}>{format(today, "MMMM d, yyyy")}</time></span>
          </div>
        </div>
      </div>
      {action && (
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={action.onClick} className="inline-flex items-center">
            {action.icon}
            <span className="ml-2">{action.label}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
