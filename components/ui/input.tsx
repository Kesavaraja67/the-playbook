import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-primary text-primary placeholder:text-tertiary h-9 w-full min-w-0 rounded-md border-2 border-light px-3 py-1 text-base shadow-sm outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary",
        className
      )}
      {...props}
    />
  )
}

export { Input }
