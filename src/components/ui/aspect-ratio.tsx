"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 16 / 9, children, ...props }, ref) => {
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })
    const elementRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const updateDimensions = () => {
        if (elementRef.current) {
          const { width } = elementRef.current.getBoundingClientRect()
          setDimensions({ width, height: width / ratio })
        }
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }, [ratio])

    return (
      <div
        ref={(el) => { elementRef.current = el; if (ref) ref.current = el }}
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