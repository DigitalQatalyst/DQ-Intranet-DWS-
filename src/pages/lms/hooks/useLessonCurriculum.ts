import { useMemo, useEffect, Dispatch, SetStateAction } from 'react';
import { COURSE_STARTED_PREFIX, arePreviousLessonsCompleted } from '../utils/lessonStorage';

export type LessonItem = {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  order: number;
  isLocked?: boolean;
  type: string;
  moduleId?: string;
  videoUrl?: string;
  content?: string;
};

function findParentModuleId(curriculum: any[], lessonId: string): string | undefined {
  return curriculum.find((item: any) => {
    const inTopics = item.topics?.some((t: any) => t.lessons?.some((l: any) => l.id === lessonId));
    const inLessons = item.lessons?.some((l: any) => l.id === lessonId);
    return inTopics || inLessons;
  })?.id;
}

function flattenCurriculum(curriculum: any[]): LessonItem[] {
  const lessons: LessonItem[] = [];
  [...curriculum].sort((a: any, b: any) => a.order - b.order).forEach((item: any) => {
    item.lessons?.sort((a: any, b: any) => a.order - b.order).forEach((lesson: any) => {
      lessons.push({ ...lesson, moduleId: item.id });
    });
    item.topics?.sort((a: any, b: any) => a.order - b.order).forEach((topic: any) => {
      topic.lessons?.sort((a: any, b: any) => a.order - b.order).forEach((lesson: any) => {
        lessons.push({ ...lesson, moduleId: topic.id });
      });
    });
  });
  return lessons;
}

export function useLessonCurriculum(
  course: any,
  lessonId: string | undefined,
  courseSlug: string | undefined,
  setExpandedModules: Dispatch<SetStateAction<Set<string>>>
) {
  useEffect(() => {
    if (courseSlug && globalThis.window !== undefined) {
      localStorage.setItem(`${COURSE_STARTED_PREFIX}${courseSlug}`, 'true');
    }
  }, [courseSlug]);

  useEffect(() => {
    if (!lessonId || !course?.curriculum) return;
    const parentModuleId = findParentModuleId(course.curriculum, lessonId);
    if (parentModuleId) {
      setExpandedModules(prev => {
        const next = new Set(prev);
        next.add(parentModuleId);
        return next;
      });
    }
  }, [lessonId, course]);

  const allLessons = useMemo((): LessonItem[] => {
    if (!course?.curriculum) return [];
    return flattenCurriculum(course.curriculum);
  }, [course]);

  const currentLesson = useMemo(() => allLessons.find(l => l.id === lessonId), [allLessons, lessonId]);
  const currentLessonIndex = useMemo(() => allLessons.findIndex(l => l.id === lessonId), [allLessons, lessonId]);

  const isLocked = useMemo(() => {
    if (!currentLesson || currentLesson.isLocked === false) return false;
    return !arePreviousLessonsCompleted(allLessons, currentLesson.id);
  }, [currentLesson, allLessons]);

  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  const isFinalAssessmentLesson = currentLesson?.type === 'final-assessment';

  return { allLessons, currentLesson, currentLessonIndex, isLocked, previousLesson, nextLesson, isFinalAssessmentLesson };
}
