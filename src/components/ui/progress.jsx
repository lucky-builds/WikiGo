import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-slate-200",
      "dark:bg-gray-800",
      "classic:bg-slate-300 classic:h-3",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-full transition-all",
        "bg-slate-900 dark:bg-gray-600",
        "classic:bg-blue-600"
      )}
      style={{ width: `${value || 0}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }

