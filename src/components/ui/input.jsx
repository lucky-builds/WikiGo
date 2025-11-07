import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-400 dark:placeholder:text-gray-400",
        "classic:border-black classic:bg-white classic:text-black classic:ring-offset-white classic:focus-visible:ring-black classic:placeholder:text-black classic:border-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

