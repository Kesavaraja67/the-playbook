import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-tertiary text-primary placeholder:text-tertiary flex field-sizing-content min-h-16 w-full rounded-md border border-light px-3 py-2 text-base shadow-sm outline-none transition-[border-color,box-shadow,transform,color] duration-200 ease-out focus-visible:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:shadow-md focus-visible:scale-[1.01] motion-reduce:transition-none motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
