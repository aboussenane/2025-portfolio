'use client'

import { useEffect, useRef, useState } from 'react'

interface FixedTextProps {
  children: React.ReactNode
}

const FixedText: React.FC<FixedTextProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer: IntersectionObserver = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-full">
      <div className={`${isVisible ? 'fixed' : 'absolute'} top-0 z-40 w-full`}>
        {children}
      </div>
    </div>
  )
}

export default FixedText
