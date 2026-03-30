import { BookOpen, HelpCircle, FileText, CheckCircle, Play } from 'lucide-react';

export const getLessonTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return Play;
    case 'guide': return BookOpen;
    case 'quiz': return HelpCircle;
    case 'workshop': return FileText;
    case 'assignment': return FileText;
    case 'reading': return FileText;
    case 'final-assessment': return CheckCircle;
    default: return BookOpen;
  }
};

export const getLessonTypeLabel = (type: string) => {
  switch (type) {
    case 'video': return 'Video';
    case 'guide': return 'Guide';
    case 'quiz': return 'Quiz';
    case 'workshop': return 'Workshop';
    case 'assignment': return 'Assignment';
    case 'reading': return 'Reading';
    case 'final-assessment': return 'Final Assessment';
    default: return type;
  }
};

export const isCourseCompleted = (
  nextLesson: any,
  isVideoCompleted: boolean,
  quiz: any,
  quizPassed: boolean,
  courseQuiz: any,
  isFinalAssessmentLesson: boolean
) => !nextLesson && isVideoCompleted && (!quiz || quizPassed) && !courseQuiz && !isFinalAssessmentLesson;
