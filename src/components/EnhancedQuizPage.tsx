import React, { useState } from 'react';
import { EnhancedQuiz } from './EnhancedQuiz';
import { EnhancedQuizResults } from './EnhancedQuizResults';
import type { Question } from '../types';

export const EnhancedQuizPage: React.FC = () => {
  const [examState, setExamState] = useState<'exam' | 'results'>('exam');
  const [examData, setExamData] = useState<{
    score: number;
    total: number;
    timeSpent: number;
    questions: Question[];
    selectedAnswers: { [key: string]: string };
    difficulty: string;
  } | null>(null);

  const handleExamComplete = (
    score: number, 
    total: number, 
    timeSpent: number, 
    questions: Question[], 
    selectedAnswers: { [key: string]: string },
    difficulty: string
  ) => {
    setExamData({
      score,
      total,
      timeSpent,
      questions,
      selectedAnswers,
      difficulty
    });
    setExamState('results');
  };

  const handleRetry = () => {
    setExamState('exam');
    setExamData(null);
  };

  if (examState === 'exam') {
    return (
      <EnhancedQuiz onComplete={handleExamComplete} />
    );
  }

  if (examState === 'results' && examData) {
    return (
      <EnhancedQuizResults
        score={examData.score}
        total={examData.total}
        timeSpent={examData.timeSpent}
        questions={examData.questions}
        selectedAnswers={examData.selectedAnswers}
        difficulty={examData.difficulty}
        onRetry={handleRetry}
      />
    );
  }

  return <div>Loading...</div>;
};
