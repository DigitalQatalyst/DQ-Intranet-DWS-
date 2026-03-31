import React, { useEffect, useState } from 'react'

interface SideNavProps {
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

const sections = [
  { id: 'document-control', label: 'Document Control' },
  { id: 'policy-objective', label: 'Policy Objective' },
  { id: 'scope', label: 'Scope' },
  { id: 'definitions', label: 'Definitions' },
  { id: 'mandatory-login-times', label: 'Mandatory Working Room Login Times' },
  { id: 'wr-attendance', label: 'WR Attendance Requirements' },
  { id: 'physical-office', label: 'Physical Office Late Arrival Governance' },
  { id: 'roles-responsibilities', label: 'Roles & Responsibilities' },
  { id: 'salary-deductions', label: 'Salary Deductions – Late WR Login' },
  { id: 'late-30-minutes', label: 'Late Beyond 30 Minutes' },
  { id: 'late-physical-arrival', label: 'Late Physical Arrival' },
  { id: 'no-exception', label: 'No-Exception Clause' },
  { id: 'cultural-alignment', label: 'Cultural Alignment' },
  { id: 'policy-acknowledgment', label: 'Policy Acknowledgment' },
  { id: 'policy-review', label: 'Policy Review & Amendments' },
]

export function SideNav({ activeSection, onSectionClick }: SideNavProps) {
  const [currentSection, setCurrentSection] = useState(activeSection || 'document-control')

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


