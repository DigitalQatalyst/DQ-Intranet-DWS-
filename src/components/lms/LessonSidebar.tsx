import React from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, Lock, Clock, X } from 'lucide-react';
import { getLessonTypeIcon } from '../../pages/lms/utils/lessonHelpers';
import { isLessonCompleted, arePreviousLessonsCompleted } from '../../pages/lms/utils/lessonStorage';
import type { LessonItem } from '../../pages/lms/hooks/useLessonCurriculum';

interface LessonSidebarProps {
  course: any;
  lessonId: string | undefined;
  courseSlug: string | undefined;
  allLessons: LessonItem[];
  expandedModules: Set<string>;
  setExpandedModules: React.Dispatch<React.SetStateAction<Set<string>>>;
  navigate: (path: string) => void;
  setSidebarOpen: (v: boolean) => void;
  sidebarOpen: boolean;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  course, lessonId, courseSlug, allLessons, expandedModules,
  setExpandedModules, navigate, setSidebarOpen, sidebarOpen,
}) => {
  const toggleExpand = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const getModuleLessons = (item: any): any[] => {
    if (item.topics?.length) {
      return item.topics
        .sort((a: any, b: any) => a.order - b.order)
        .flatMap((t: any) => t.lessons || []);
    }
    return item.lessons || [];
  };

  return (
    <aside
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Course Outline</h2>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-600 hover:text-gray-900">
          <X size={20} />
        </button>
      </div>
      <div className="p-4 space-y-2">
        {course?.curriculum?.sort((a: any, b: any) => a.order - b.order).map((item: any, index: number) => {
          const moduleLessons = getModuleLessons(item).sort((a: any, b: any) => a.order - b.order);
          const isExpanded = expandedModules.has(item.id);
          const isFinalAssessmentModule = moduleLessons.some((l: any) => l.type === 'final-assessment');

          return (
            <div key={item.id} className={`mb-3 ${isFinalAssessmentModule ? 'mt-6' : ''}`}>
              <div
                onClick={() => toggleExpand(item.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isFinalAssessmentModule ? 'text-blue-600' : 'text-gray-700'}`}>
                    {isFinalAssessmentModule ? 'FINAL ASSESSMENT' : `MODULE ${index + 1}`}
                  </span>
                  {!isFinalAssessmentModule && (
                    <span className="text-xs text-gray-400">({moduleLessons.length})</span>
                  )}
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>

              {isExpanded && (
                <div className="mt-1 space-y-1 pl-2">
                  {moduleLessons.map((lesson: any) => {
                    const globalIndex = allLessons.findIndex(l => l.id === lesson.id) + 1;
                    const isCurrent = lesson.id === lessonId;
                    const completed = isLessonCompleted(lesson.id);
                    const lessonIsLocked = lesson.isLocked === false
                      ? false
                      : !arePreviousLessonsCompleted(allLessons, lesson.id);
                    const canAccess = !lessonIsLocked;
                    const LessonIcon = getLessonTypeIcon(lesson.type);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          if (canAccess) {
                            navigate(`/lms/${courseSlug}/lesson/${lesson.id}`);
                            if (window.innerWidth < 1024) setSidebarOpen(false);
                          }
                        }}
                        disabled={!canAccess}
                        className={`w-full text-left p-2 pl-3 rounded-lg transition-all flex items-start gap-3 ${isCurrent
                          ? 'bg-blue-50 border border-blue-200 shadow-sm'
                          : canAccess
                            ? 'hover:bg-gray-50 border border-transparent'
                            : 'opacity-60 cursor-not-allowed'
                          }`}
                      >
                        <div className={`mt-0.5 flex-shrink-0 ${isCurrent ? 'text-blue-600' : completed ? 'text-green-500' : 'text-gray-400'}`}>
                          {completed ? <CheckCircle2 size={16} /> : lessonIsLocked ? <Lock size={16} /> : <LessonIcon size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium leading-snug flex gap-1 ${isCurrent ? 'text-blue-900' : 'text-gray-700'}`}>
                            <span className="opacity-70">{globalIndex}.</span>
                            <span>{lesson.title}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                            {lesson.duration && (
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{lesson.duration}{/^\d+$/.test(lesson.duration) ? ' min' : ''}</span>
                              </div>
                            )}
                            {isCurrent && <span className="text-blue-600 font-semibold">• Now Playing</span>}
                            {lessonIsLocked && <span className="text-yellow-600 ml-1">• Locked</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
