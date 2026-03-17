import React, { useEffect, useState } from 'react'

interface SideNavProps {
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'traceability', label: 'Traceability' },
  { id: 'data-management', label: 'Data Management Ownership' },
  { id: 'work-items', label: 'Work Items' },
  { id: 'task-name', label: 'Task Name' },
  { id: 'task-state', label: 'Task State' },
  { id: 'task-progress', label: 'Task Progress' },
  { id: 'task-timeline', label: 'Task Timeline' },
  { id: 'task-context', label: 'Task Context' },
  { id: 'task-purpose', label: 'Task Purpose' },
  { id: 'task-inputs', label: 'Task Inputs' },
  { id: 'task-outputs', label: 'Task Outputs' },
  { id: 'task-approach', label: 'Task Approach' },
  { id: 'task-resources', label: 'Task Related Resources' },
  { id: 'efforts', label: 'Efforts (Count of Checklist)' },
  { id: 'task-checklist', label: 'Task Check-list Items' },
  { id: 'sync-channel-task', label: 'Sync between Channel and Task' },
  { id: 'link-cimd-task', label: 'Link between CIMD and Task' },
]

export function SideNav({ activeSection, onSectionClick }: SideNavProps) {
  const [currentSection, setCurrentSection] = useState(activeSection || 'introduction')

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


