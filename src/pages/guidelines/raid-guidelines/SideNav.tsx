import React, { useEffect, useState } from 'react'

interface SideNavProps {
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

const sections = [
  { id: 'context', label: 'Context' },
  { id: 'value-stream', label: 'Value Stream' },
  { id: 'lean-governance', label: 'Lean Governance & Risk Management' },
  { id: 'risk-identification', label: 'Risk Identification, Mitigation & Escalation' },
  { id: 'risk-identification-guidelines', label: 'Risk Identification Guidelines' },
  { id: 'risk-mitigation-guidelines', label: 'Risk Mitigation Guidelines' },
  { id: 'risk-escalation-guidelines', label: 'Risk Escalation Guidelines' },
  { id: 'risk-types', label: 'Risk Types' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'assumptions-guidelines', label: 'Assumptions Guidelines' },
  { id: 'example-assumptions', label: 'Example Assumptions That Often Lead to Risk' },
  { id: 'issues', label: 'Issues' },
  { id: 'issues-guidelines', label: 'Issues Guidelines' },
  { id: 'example-issues', label: 'Example Issues Impact' },
  { id: 'dependency', label: 'Dependency' },
  { id: 'dependency-guidelines', label: 'Dependency Guidelines' },
  { id: 'example-dependencies', label: 'Example of Dependencies that becomes Risks' },
  { id: 'risk-register', label: 'Risk Register' },
  { id: 'raid-item-name', label: 'RAID Item Name' },
  { id: 'assign-raid-owner', label: 'Assign RAID Owner' },
  { id: 'raid-state', label: 'RAID State' },
  { id: 'raid-description', label: 'RAID Description' },
  { id: 'raid-impact', label: 'RAID Items or Impact' },
  { id: 'raid-action-needed', label: 'RAID Action needed' },
  { id: 'raid-analysis', label: 'RAID Analysis' },
  { id: 'raid-timeline', label: 'RAID Timeline' },
]

export function SideNav({ activeSection, onSectionClick }: SideNavProps) {
  const [currentSection, setCurrentSection] = useState(activeSection || 'context')

  // Scroll spy: automatically detect which section is in view
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

