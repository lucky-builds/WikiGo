import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300 dark:focus:ring-offset-slate-950 classic:focus:ring-blue-600",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 classic:bg-blue-600 classic:hover:bg-blue-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 classic:bg-slate-200 classic:hover:bg-slate-300",
        destructive:
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-600 dark:hover:bg-red-700 classic:bg-red-600 classic:hover:bg-red-700",
        outline: "text-slate-950 dark:text-gray-200 classic:text-slate-900 classic:border-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

