import { useState, useEffect, useRef } from 'react';
import {
  getLessonProgress, saveLessonProgress,
  isLessonCompleted, markLessonCompleted,
} from '../utils/lessonStorage';

export function useVideoProgress(params: {
  currentLesson: any;
  course: any;
  courseSlug: string | undefined;
  user: any;
  quiz: any;
  quizPassed: boolean;
  markLessonCompletedMutation: any;
  updateVideoProgressMutation: any;
  dbLessonProgress: any;
  lessonId: string | undefined;
  onVideoEnded: (ended: boolean) => void;
}) {
  const {
    currentLesson, course, courseSlug, user, quiz, quizPassed,
    markLessonCompletedMutation, updateVideoProgressMutation,
    dbLessonProgress, lessonId, onVideoEnded,
  } = params;

  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastProgressSyncRef = useRef<number>(0);
  const lastProgressValueRef = useRef<number>(0);

  useEffect(() => {
    if (lessonId) {
      setVideoProgress(getLessonProgress(lessonId));
      setIsVideoCompleted(isLessonCompleted(lessonId));
    }
  }, [lessonId]);

  useEffect(() => {
    if (!dbLessonProgress || !lessonId) return;
    const localProgress = getLessonProgress(lessonId);
    const localCompleted = isLessonCompleted(lessonId);

    if (dbLessonProgress.progress_percentage > localProgress) {
      setVideoProgress(dbLessonProgress.progress_percentage);
      saveLessonProgress(lessonId, dbLessonProgress.progress_percentage);
    }
    if (dbLessonProgress.status === 'completed' && !localCompleted) {
      setIsVideoCompleted(true);
      markLessonCompleted(lessonId);
    }
  }, [dbLessonProgress, lessonId]);

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || !currentLesson) return;
    const video = videoRef.current;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
    saveLessonProgress(currentLesson.id, progress);

    if (progress >= 90 && !isVideoCompleted && !quiz) {
      setIsVideoCompleted(true);
      markLessonCompleted(currentLesson.id);
      if (user && course?.id) {
        markLessonCompletedMutation.mutate({
          lessonId: currentLesson.id, courseId: course.id, courseSlug: courseSlug || '',
        });
      }
    }

    const now = Date.now();
    const timeDelta = now - lastProgressSyncRef.current;
    const progressDelta = Math.abs(progress - lastProgressValueRef.current);
    if (user && course?.id && (timeDelta > 10000 || progressDelta >= 5)) {
      updateVideoProgressMutation.mutate({
        lessonId: currentLesson.id, courseId: course.id, courseSlug: courseSlug || '',
        progressPercentage: progress, hasQuiz: !!quiz, quizPassed: !!quizPassed,
      });
      lastProgressSyncRef.current = now;
      lastProgressValueRef.current = progress;
    }
  };

  const handleVideoEnded = () => {
    if (!currentLesson) return;
    if (!quiz) {
      setIsVideoCompleted(true);
      markLessonCompleted(currentLesson.id);
    }
    setVideoProgress(100);
    saveLessonProgress(currentLesson.id, 100);
    onVideoEnded(true);
  };

  const handleVideoPlay = () => setIsVideoPlaying(true);
  const handleVideoPause = () => setIsVideoPlaying(false);

  const markContentCompleted = () => {
    if (!currentLesson) return;
    setIsVideoCompleted(true);
    markLessonCompleted(currentLesson.id);
    setVideoProgress(100);
    saveLessonProgress(currentLesson.id, 100);
    if (user && course?.id) {
      markLessonCompletedMutation.mutate({
        lessonId: currentLesson.id, courseId: course.id, courseSlug: courseSlug || '',
      });
    }
  };

  return {
    videoProgress, isVideoCompleted, isVideoPlaying, videoRef,
    handleVideoTimeUpdate, handleVideoEnded, handleVideoPlay, handleVideoPause,
    markContentCompleted,
  };
}
