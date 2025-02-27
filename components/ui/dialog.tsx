import * as React from "react"
import { Dialog as HeadlessDialog } from "@headlessui/react"
import { cn } from "@/lib/utils"

const Dialog = HeadlessDialog

const DialogContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <HeadlessDialog.Panel
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </HeadlessDialog.Panel>
  )
}

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mb-4 flex flex-col space-y-1.5", className)}
    {...props}
  />
)

const DialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <HeadlessDialog.Title
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
)

export { Dialog, DialogContent, DialogHeader, DialogTitle } 