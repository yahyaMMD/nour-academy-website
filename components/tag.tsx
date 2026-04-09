import { cn } from "@/lib/utils"
import React, { HTMLAttributes } from "react"

export const Tag = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className, children } = props
  return (
    <div
      className={cn(
        "inline-flex border border-dentalPurple gap-2 text-dentalPurple px-3 py-1 rounded-full uppercase items-center",
        className
      )}
    >
      <span>&#10038;</span>
      <span className="text-sm">{children}</span>
    </div>
  )
}
