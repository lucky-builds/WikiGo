import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-400 classic:ring-offset-white classic:focus-visible:ring-black classic:border-2",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 classic:bg-white classic:text-black classic:border-black classic:hover:bg-black classic:hover:text-white",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-600 dark:hover:bg-red-700 classic:bg-white classic:text-black classic:border-black classic:hover:bg-black classic:hover:text-white",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 classic:border-black classic:bg-white classic:hover:bg-black classic:hover:text-white classic:text-black",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 classic:bg-white classic:text-black classic:border-black classic:hover:bg-black classic:hover:text-white classic:border-2",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-gray-800 dark:text-gray-200 classic:hover:bg-black classic:hover:text-white classic:text-black",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-gray-200 classic:text-black classic:visited:text-black classic:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

