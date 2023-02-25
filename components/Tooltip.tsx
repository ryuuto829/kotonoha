import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ReactElement } from 'react'

export default function Tooltip({
  children,
  content,
  keyBinding,
  ...props
}: {
  children: ReactElement
  content: string | ReactElement
  keyBinding?: string | ReactElement
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={350}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={10}
          className="flex items-center rounded-md bg-white/10 h-7 text-sm px-2"
          {...props}
        >
          {content}
          {keyBinding && (
            <span className="inline-flex ml-2 items-center bg-white/10 text-white rounded px-1 h-5 text-sm">
              {keyBinding}
            </span>
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
