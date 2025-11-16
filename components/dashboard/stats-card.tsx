import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  iconColor?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  description,
  iconColor = "text-blue-600",
  className,
}: StatsCardProps) {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-green-600";
    if (changeType === "negative") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("border-0 shadow-lg hover:shadow-xl transition-all", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
              {change && (
                <p className={cn("text-sm font-medium", getChangeColor())}>
                  {change}
                </p>
              )}
              {description && (
                <p className="text-xs text-gray-500 mt-2">{description}</p>
              )}
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", 
              iconColor === "text-orange-600" && "bg-gradient-to-br from-orange-50 to-orange-100",
              iconColor === "text-blue-600" && "bg-gradient-to-br from-blue-50 to-blue-100",
              iconColor === "text-green-600" && "bg-gradient-to-br from-green-50 to-green-100",
              iconColor === "text-red-600" && "bg-gradient-to-br from-red-50 to-red-100",
              iconColor === "text-purple-600" && "bg-gradient-to-br from-purple-50 to-purple-100",
              iconColor === "text-yellow-600" && "bg-gradient-to-br from-yellow-50 to-yellow-100",
              !iconColor && "bg-gradient-to-br from-blue-50 to-blue-100"
            )}>
              <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

