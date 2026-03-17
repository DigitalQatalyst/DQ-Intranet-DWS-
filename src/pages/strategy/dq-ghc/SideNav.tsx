import React, { useEffect, useState } from 'react'

interface SideNavProps {
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

const sections = [
  { id: 'overview', label: 'Our Foundation & DNA' },
  { id: 'what-is-it', label: 'GHC - What is it' },
  { id: 'why-such-a-framework', label: 'GHC - Why such a framework' },
  { id: 'dq-vision', label: '01. The DQ Vision (Purpose)' },
  { id: 'hov-culture', label: '02. HoV (Culture)' },
  { id: 'persona-identity', label: '03. Persona (Identity)' },
  { id: 'agile-tms', label: '04. Agile TMS' },
  { id: 'agile-sos', label: '05. Agile SoS (Governance)' },
  { id: 'agile-flows', label: '06. Agile Flows (Value Streams)' },
  { id: 'agile-6xd', label: '07. Agile 6xD (Products)' },
  { id: 'in-short', label: 'GHC - In Short' },
]

export function SideNav({ activeSection, onSectionClick }: SideNavProps) {
  const [currentSection, setCurrentSection] = useState(activeSection || 'overview')

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id')
          if (sectionId) {
            setCurrentSection(sectionId)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection)
    }
  }, [activeSection])

  const handleClick = (sectionId: string) => {
    setCurrentSection(sectionId)
    onSectionClick?.(sectionId)
    
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="pr-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Contents
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

