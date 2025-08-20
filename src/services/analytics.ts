export interface TopicPerformance {
  topic: string;
  averageScore: number;
  testCount: number;
  lastTestDate: string;
}

export interface ProgressAnalytics {
  totalTests: number;
  averageScore: number;
  streak: number;
  examReadiness: number;
  weakTopics: string[];
  strongTopics: string[];
  recentScores: number[];
  topicBreakdown: TopicPerformance[];
}

export const calculateProgressAnalytics = (practiceResults: any[]): ProgressAnalytics => {
  if (!practiceResults?.length) {
    return {
      totalTests: 0,
      averageScore: 0,
      streak: 0,
      examReadiness: 0,
      weakTopics: [],
      strongTopics: [],
      recentScores: [],
      topicBreakdown: []
    };
  }

  // Basic metrics
  const totalTests = practiceResults.length;
  const averageScore = Math.round(
    practiceResults.reduce((sum, result) => sum + result.score, 0) / totalTests
  );

  // Calculate streak
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const testDates = practiceResults.map(result => new Date(result.date).toDateString());
  
  let streak = 0;
  if (testDates.includes(today)) {
    streak = 1;
    let checkDate = yesterday;
    while (testDates.includes(checkDate)) {
      streak++;
      checkDate = new Date(new Date(checkDate).getTime() - 86400000).toDateString();
    }
  }

  // Topic breakdown
  const topicData: { [key: string]: { scores: number[], lastDate: string } } = {};
  
  practiceResults.forEach(result => {
    if (!topicData[result.category]) {
      topicData[result.category] = { scores: [], lastDate: result.date };
    }
    topicData[result.category].scores.push(result.score);
    if (new Date(result.date) > new Date(topicData[result.category].lastDate)) {
      topicData[result.category].lastDate = result.date;
    }
  });

  const topicBreakdown: TopicPerformance[] = Object.entries(topicData).map(([topic, data]) => ({
    topic,
    averageScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    testCount: data.scores.length,
    lastTestDate: data.lastDate
  }));

  // Identify weak and strong topics
  const weakTopics = topicBreakdown
    .filter(t => t.averageScore < 70)
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3)
    .map(t => t.topic);

  const strongTopics = topicBreakdown
    .filter(t => t.averageScore >= 80)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3)
    .map(t => t.topic);

  // Recent scores (last 5 tests)
  const recentScores = practiceResults
    .slice(-5)
    .map(result => result.score)
    .reverse();

  // Calculate exam readiness
  const examReadiness = Math.min(100, Math.round(
    (averageScore * 0.7) + (Math.min(totalTests, 10) * 3)
  ));

  return {
    totalTests,
    averageScore,
    streak,
    examReadiness,
    weakTopics,
    strongTopics,
    recentScores,
    topicBreakdown
  };
};

export const getPerformanceTrend = (recentScores: number[]): 'improving' | 'declining' | 'stable' => {
  if (recentScores.length < 3) return 'stable';
  
  const firstHalf = recentScores.slice(0, Math.ceil(recentScores.length / 2));
  const secondHalf = recentScores.slice(Math.ceil(recentScores.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const difference = secondAvg - firstAvg;
  
  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}; 