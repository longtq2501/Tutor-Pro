'use client';

import React, { useEffect, useRef } from 'react';
import LessonDetailView from './LessonDetailView';

interface Props {
  lessonId: number;
}

/**
 * Wrapper component that tracks lesson views
 * Automatically increments view count when student opens a lesson
 */
export default function LessonViewWrapper({ lessonId }: Props) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Track view only once per mount
    if (!hasTracked.current) {
      // eslint-disable-next-line react-hooks/immutability
      trackView();
      hasTracked.current = true;
    }
  }, [lessonId]);

  const trackView = async () => {
    try {
      // Backend automatically increments view count when fetching lesson detail
      // So we don't need to call a separate API
      console.log(`📊 Tracking view for lesson ${lessonId}`);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return <LessonDetailView lessonId={lessonId} />;
}