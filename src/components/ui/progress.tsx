import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all relative"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      {/* Робот на краю полосы */}
      <div 
        className="absolute right-1 top-1/2 -translate-y-1/2 text-sm animate-bounce z-10 bg-white/90 rounded-full px-1 shadow-sm"
        style={{ 
          animationDuration: '2s',
          animationDelay: '0.5s'
        }}
      >
        🤖
      </div>
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }