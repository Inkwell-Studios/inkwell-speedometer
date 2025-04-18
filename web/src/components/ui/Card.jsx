import React, { forwardRef } from 'react'

export const Card = forwardRef(function Card({ className = '', children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`
        bg-gradient-to-b
        from-black/90
        to-black/75
        border
        border-white/10
        rounded-2xl
        shadow-2xl
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  )
})

export const CardHeader = forwardRef(function CardHeader({ className = '', children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`
        p-6
        border-b
        border-white/10
        bg-white/5
        rounded-t-2xl
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  )
})

export const CardContent = forwardRef(function CardContent({ className = '', children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`
        p-6
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  )
})

export const CardFooter = forwardRef(function CardFooter({ className = '', children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`
        p-6
        border-t
        border-white/10
        bg-black/40
        rounded-b-2xl
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  )
}) 