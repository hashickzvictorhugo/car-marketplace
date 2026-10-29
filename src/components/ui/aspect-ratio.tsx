"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 16 / 9, children, ...props }, ref) => {
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })

    React.useEffect(() => {
      const updateDimensions = () => {
        if (ref.current) {
          const { width } = ref.current.getBoundingClientRect()
          setDimensions({ width, height: width / ratio })
        }
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }, [ratio])

    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{ aspectRatio: ratio }}
        {...props}
      >
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement, {
              className: cn("absolute inset-0 w-full h-full", (children as React.ReactElement).props.className),
            })
          : children}
      </div>
    )
  }
)
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }