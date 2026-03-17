import React, { useEffect, useState } from 'react'

interface SideNavProps {
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

const sections = [
  { id: 'context', label: 'Context' },
  { id: 'overview', label: 'Overview' },
  { id: 'purpose-scope', label: 'Purpose and Scope' },
  { id: 'core-components', label: 'Core Components' },
  { id: 'roles-responsibilities', label: 'Roles and Responsibilities' },
  { id: 'byod', label: '5.1 BYOD (Bring Your Own Device)' },
  { id: 'byod-procedure', label: '5.1.1 BYOD Procedure' },
  { id: 'byod-responsibilities', label: '5.1.2 BYOD Responsibilities' },
  { id: 'fyod', label: '5.2 FYOD (Finance Your Own Device)' },
  { id: 'fyod-procedure', label: '5.2.1 FYOD Procedure' },
  { id: 'fyod-responsibilities', label: '5.2.2 FYOD Responsibilities' },
  { id: 'hyod', label: '5.2.3 HYOD (Hold Your Own Device)' },
  { id: 'hyod-procedure', label: '5.2.4 HYOD Procedure' },
  { id: 'hyod-responsibilities', label: '5.2.5 HYOD Responsibilities' },
  { id: 'guiding-principles', label: 'Guiding Principles and Controls' },
  { id: 'tools-resources', label: 'Tools and Resources' },
  { id: 'kpis', label: 'Key Performance Indicators (KPIs)' },
  { id: 'review-schedule', label: 'Review and Update Schedule' },
]

export function SideNav({ activeSection, onSectionClick }: SideNavProps) {
  const [currentSection, setCurrentSection] = useState(activeSection || 'context')

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
    <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto filter-sidebar-scroll">
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

