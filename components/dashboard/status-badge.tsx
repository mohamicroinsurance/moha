import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("approved") || statusLower.includes("active") || statusLower.includes("resolved")) {
      return "default";
    }
    if (statusLower.includes("pending") || statusLower.includes("in review") || statusLower.includes("under review")) {
      return "secondary";
    }
    if (statusLower.includes("rejected") || statusLower.includes("expired")) {
      return "destructive";
    }
    return "outline";
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("approved") || statusLower.includes("active") || statusLower.includes("resolved")) {
      return "bg-green-100 text-green-800 hover:bg-green-100";
    }
    if (statusLower.includes("pending") || statusLower.includes("in review") || statusLower.includes("under review")) {
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    }
    if (statusLower.includes("rejected") || statusLower.includes("expired")) {
      return "bg-red-100 text-red-800 hover:bg-red-100";
    }
    if (statusLower.includes("new")) {
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
    if (statusLower.includes("converted")) {
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    }
    return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  return (
    <Badge 
      variant={variant || getStatusVariant(status)} 
      className={cn("font-medium", getStatusColor(status), className)}
    >
      {status}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityColor = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    if (priorityLower === "critical" || priorityLower === "high") {
      return "bg-red-100 text-red-800 hover:bg-red-100";
    }
    if (priorityLower === "medium") {
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    }
    return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", getPriorityColor(priority), className)}
    >
      {priority}
    </Badge>
  );
}

