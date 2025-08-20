export type Language = 'en' | 'nl' | 'ar';

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  language: Language;
  practiceResults: PracticeResult[];
}

export interface PracticeResult {
  id: string;
  testId: string;
  score: number;
  date: string;
  category: string;
}

export interface PerformanceMetrics {
  totalTests: number;
  averageScore: number;
  categoryBreakdown: {
    [key: string]: {
      count: number;
      averageScore: number;
    };
  };
}

export interface LanguageStrings {
  // Common
  welcome: string;
  loading: string;
  error: string;
  success: string;
  next: string;
  back: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  close: string;
  yes: string;
  no: string;
  
  // Navigation
  navigation: {
    dashboard: string;
    practice: string;
    exam: string;
    chat: string;
    settings: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    welcomeMessage: string;
    welcomeSubtitle: string;
    startPractice: string;
    performanceTracker: string;
    testsCompleted: string;
    averageScore: string;
    categoryPerformance: string;
    focusAreas: string;
    focusNote: string;
    upgradeToPremium: string;
    upgradeDescription: string;
    upgradeNow: string;
    doingAmazing: string;
    makingProgress: string;
    readyToStart: string;
    woohoo: string;
    youGotThis: string;
    firstWin: string;
  };
  
  // Practice
  practice: {
    title: string;
    startTest: string;
    hazardPerception: string;
    insightPractice: string;
    mandatorySigns: string;
    warningSigns: string;
    prohibitorySigns: string;
    prohibitorySigns2: string;
    trafficLightsSignals: string;
    roadInformation: string;
    signIdentification: string;
    priorityRules: string;
    mandatorySigns2: string;
    premium: string;
    question: string;
    of: string;
    timeLeft: string;
    nextQuestion: string;
    finishTest: string;
    explanation: string;
    listening: string;
    sayABCD: string;
    voiceMode: string;
    mute: string;
    unmute: string;
  };
  
  // Chat
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    emptyState: string;
    typing: string;
  };
  
  // Results
  results: {
    title: string;
    congratulations: string;
    wellDone: string;
    keepPracticing: string;
    score: string;
    correct: string;
    incorrect: string;
    totalQuestions: string;
    percentage: string;
    timeSpent: string;
    backToPractice: string;
    tryAgain: string;
    shareResults: string;
  };
  
  // Language Selection
  languageSelection: {
    title: string;
    subtitle: string;
    english: string;
    dutch: string;
    arabic: string;
  };
  
  // Test Categories
  testCategories: {
    hazardPerception: string;
    insightPractice: string;
    mandatorySigns: string;
    warningSigns: string;
    prohibitorySigns: string;
    prohibitorySigns2: string;
    trafficLightsSignals: string;
    roadInformation: string;
    signIdentification: string;
    priorityRules: string;
    mandatorySigns2: string;
  };
  
  // Voice Commands
  voiceCommands: {
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    first: string;
    second: string;
    third: string;
    fourth: string;
    one: string;
    two: string;
    three: string;
    four: string;
  };
  
  // Progress Tracker
  progressTracker: {
    title: string;
    emptyMessage: string;
    testsCompleted: string;
    averageScore: string;
    dayStreak: string;
    examReady: string;
    recentPerformance: string;
    focusAreas: string;
    strongAreas: string;
    noWeakAreas: string;
    noStrongAreas: string;
    practiceWeakAreas: string;
    takeMockExam: string;
    improving: string;
    declining: string;
  };
} 