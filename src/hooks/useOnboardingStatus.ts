import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

interface OnboardingStatus {
  daysRemaining: number | null;
  coursesRemaining: number;
  totalCourses: number;
  overallProgress: number;
  isCompleted: boolean;
  isLoading: boolean;
}

const ONBOARDING_DURATION_DAYS = 30; // Standard onboarding period

export function useOnboardingStatus(userId: string | null): OnboardingStatus {
  const [status, setStatus] = useState<OnboardingStatus>({
    daysRemaining: null,
    coursesRemaining: 0,
    totalCourses: 0,
    overallProgress: 0,
    isCompleted: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!userId) {
      // Logged-out users see neutral defaults
      setStatus({
        daysRemaining: null,
        coursesRemaining: 0,
        totalCourses: 0,
        overallProgress: 0,
        isCompleted: false,
        isLoading: false,
      });
      return;
    }

    const fetchOnboardingStatus = async () => {
      try {
        let userData: any = null;
        let courseData: any[] = [];
        let onboardingCourses: any[] = [];

        // Try to fetch user's join date and onboarding data
        // Gracefully handle if table doesn't exist
        try {
          const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('join_date, onboarding_completed_at')
            .eq('user_id', userId)
            .single();
          
          if (!error && data) {
            userData = data;
          }
        } catch (err) {
          // Table might not exist, continue with defaults
          console.debug('user_profiles table not available');
        }

        // Try to fetch course enrollments and completions
        try {
          const { data, error } = await supabaseClient
            .from('course_enrollments')
            .select('course_id, completed_at')
            .eq('user_id', userId);
          
          if (!error && data) {
            courseData = data;
          }
        } catch (err) {
          // Table might not exist, continue with defaults
          console.debug('course_enrollments table not available');
        }

        // Get total onboarding courses (courses with track = 'Onboarding')
        try {
          const { data, error } = await supabaseClient
            .from('lms_courses')
            .select('id')
            .eq('track', 'Onboarding')
            .eq('status', 'live');
          
          if (!error && data) {
            onboardingCourses = data;
          }
        } catch (err) {
          // Table might not exist, continue with defaults
          console.debug('lms_courses table not available');
        }

        // Calculate days remaining
        let daysRemaining: number | null = null;
        if (userData?.join_date) {
          const joinDate = new Date(userData.join_date);
          const today = new Date();
          const daysSinceJoin = Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
          daysRemaining = Math.max(0, ONBOARDING_DURATION_DAYS - daysSinceJoin);
        }

        // Calculate courses remaining
        const totalCourses = onboardingCourses?.length || 0;
        const completedCourses = courseData?.filter(c => c.completed_at !== null).length || 0;
        const coursesRemaining = Math.max(0, totalCourses - completedCourses);

        // Calculate overall progress
        const courseProgress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
        // Combine course progress with time-based progress if join_date exists
        let overallProgress = courseProgress;
        if (userData?.join_date && daysRemaining !== null) {
          const timeProgress = ((ONBOARDING_DURATION_DAYS - daysRemaining) / ONBOARDING_DURATION_DAYS) * 100;
          overallProgress = Math.min(100, (courseProgress * 0.7 + timeProgress * 0.3)); // Weighted average
        }

        const isCompleted = userData?.onboarding_completed_at !== null || overallProgress >= 100;

        setStatus({
          daysRemaining,
          coursesRemaining,
          totalCourses,
          overallProgress: Math.round(overallProgress),
          isCompleted,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching onboarding status:', error);
        // Graceful fallback to defaults
        setStatus({
          daysRemaining: null,
          coursesRemaining: 0,
          totalCourses: 0,
          overallProgress: 0,
          isCompleted: false,
          isLoading: false,
        });
      }
    };

    fetchOnboardingStatus();
  }, [userId]);

  return status;
}
