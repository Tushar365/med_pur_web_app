import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  changeValue?: number;
  changeLabel?: string;
  changeDirection?: 'up' | 'down';
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  changeValue,
  changeLabel,
  changeDirection = 'up'
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={cn("rounded-md p-3", iconBgColor)}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-bold text-gray-900">
                  {value}
                </div>
                {changeValue !== undefined && changeLabel && (
                  <div className={cn(
                    "flex items-center text-sm",
                    changeDirection === 'up' ? "text-green-600" : "text-red-600"
                  )}>
                    {changeDirection === 'up' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span>{changeValue}%</span>
                    <span className="ml-1 text-gray-500">{changeLabel}</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
