import React, { useState } from 'react';
import { MockExam } from './MockExam';
import { MockExamResults } from './MockExamResults';
import { MockExamBio } from './MockExamBio';
import type { Question } from '../types';

export const MockExamPage: React.FC = () => {
  const [examState, setExamState] = useState<'bio' | 'exam' | 'results'>('bio');
  const [examData, setExamData] = useState<{
    score: number;
    total: number;
    timeSpent: number;
    questions: Question[];
    selectedAnswers: { [key: string]: string };
  } | null>(null);

  const handleExamComplete = (
    score: number, 
    total: number, 
    timeSpent: number, 
    questions: Question[], 
    selectedAnswers: { [key: string]: string }
  ) => {
    setExamData({
      score,
      total,
      timeSpent,
      questions,
      selectedAnswers
    });
    setExamState('results');
  };

  const handleRetry = () => {
    setExamState('bio');
    setExamData(null);
  };

  const startExam = () => {
    setExamState('exam');
  };

  if (examState === 'bio') {
    return (
      <MockExamBio onStartExam={startExam} />
    );
  }

  if (examState === 'exam') {
    return (
      <MockExam onComplete={handleExamComplete} />
    );
  }

  if (examState === 'results' && examData) {
    return (
      <MockExamResults
        score={examData.score}
        total={examData.total}
        timeSpent={examData.timeSpent}
        questions={examData.questions}
        selectedAnswers={examData.selectedAnswers}
        onRetry={handleRetry}
      />
    );
  }

  return <div>Loading...</div>;
}; 