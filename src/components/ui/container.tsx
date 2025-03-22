import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ContainerProps {
    children: ReactNode
    className?: string
}

export function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn("mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8", className)}>
            {children}
        </div>
    )
} 