'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!beamsRef.current) return

    const listener = (e: MouseEvent) => {
      const bounds = beamsRef.current!.getBoundingClientRect()
      const x = e.clientX - bounds.left
      const y = e.clientY - bounds.top
      beamsRef.current!.style.setProperty('--x', `${x}px`)
      beamsRef.current!.style.setProperty('--y', `${y}px`)
    }

    beamsRef.current.addEventListener('mousemove', listener)
    return () => beamsRef.current?.removeEventListener('mousemove', listener)
  }, [])

  return (
    <div
      ref={beamsRef}
      className={cn(
        'absolute inset-0 overflow-hidden [--x:0px] [--y:0px]',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-amber-300/20 to-yellow-200/20 opacity-50 h-[calc(100%+200px)] -top-[100px] blur-[100px] transform-gpu" />
    </div>
  )
}
