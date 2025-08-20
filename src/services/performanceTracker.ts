import { dataPersistence } from './dataPersistence';

export interface QuestionPerformance {
  questionId: string;
  subject: string;
  correctCount: number;
  totalAttempts: number;
  averageTimeSpent: number;
  lastAttempted: string;
  masteryLevel: number; // 0-100
}

export interface TopicMastery {
  subject: string;
  masteryLevel: number;
  questionCount: number;
  weakQuestions: string[];
  strongQuestions: string[];
}

export interface LearningRecommendation {
  priority: 'high' | 'medium' | 'low';
  subject: string;
  reason: string;
  suggestedQuestions: string[];
}

export interface AdaptiveQuestion {
  questionId: string;
  priority: number;
  reason: string;
}

class PerformanceTracker {
  private performanceCache: Map<string, QuestionPerformance> = new Map();
  private topicMasteryCache: Map<string, TopicMastery> = new Map();

  // Initialize performance tracking
  async initialize(): Promise<void> {
    await this.loadPerformanceData();
  }

  // Track a single question attempt
  async trackQuestionAttempt(
    questionId: string,
    subject: string,
    isCorrect: boolean,
    timeSpent: number
  ): Promise<void> {
    const existing = this.performanceCache.get(questionId) || {
      questionId,
      subject,
      correctCount: 0,
      totalAttempts: 0,
      averageTimeSpent: 0,
      lastAttempted: new Date().toISOString(),
      masteryLevel: 0
    };

    // Update performance data
    existing.totalAttempts += 1;
    existing.correctCount += isCorrect ? 1 : 0;
    existing.lastAttempted = new Date().toISOString();
    
    // Update average time
    const totalTime = existing.averageTimeSpent * (existing.totalAttempts - 1) + timeSpent;
    existing.averageTimeSpent = totalTime / existing.totalAttempts;
    
    // Calculate mastery level (0-100)
    existing.masteryLevel = Math.round((existing.correctCount / existing.totalAttempts) * 100);

    this.performanceCache.set(questionId, existing);
    await this.savePerformanceData();
    await this.updateTopicMastery(subject);
  }

  // Get mastery level for a specific question
  getQuestionMastery(questionId: string): number {
    const performance = this.performanceCache.get(questionId);
    return performance?.masteryLevel || 0;
  }

  // Get topic mastery for a subject
  getTopicMastery(subject: string): TopicMastery {
    return this.topicMasteryCache.get(subject) || {
      subject,
      masteryLevel: 0,
      questionCount: 0,
      weakQuestions: [],
      strongQuestions: []
    };
  }

  // Get all topic mastery levels
  getAllTopicMastery(): TopicMastery[] {
    return Array.from(this.topicMasteryCache.values());
  }

  // Get personalized learning recommendations
  getLearningRecommendations(): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = [];
    const topicMasteries = this.getAllTopicMastery();

    // Sort topics by mastery level (lowest first)
    const sortedTopics = topicMasteries.sort((a, b) => a.masteryLevel - b.masteryLevel);

    // High priority: Topics with mastery < 60%
    const weakTopics = sortedTopics.filter(topic => topic.masteryLevel < 60);
    weakTopics.forEach(topic => {
      recommendations.push({
        priority: 'high',
        subject: topic.subject,
        reason: `Focus on ${topic.subject} - you're struggling with this topic`,
        suggestedQuestions: topic.weakQuestions.slice(0, 5)
      });
    });

    // Medium priority: Topics with mastery 60-80%
    const mediumTopics = sortedTopics.filter(topic => topic.masteryLevel >= 60 && topic.masteryLevel < 80);
    mediumTopics.forEach(topic => {
      recommendations.push({
        priority: 'medium',
        subject: topic.subject,
        reason: `Improve ${topic.subject} - you're doing well but can get better`,
        suggestedQuestions: topic.weakQuestions.slice(0, 3)
      });
    });

    // Low priority: Topics with mastery > 80%
    const strongTopics = sortedTopics.filter(topic => topic.masteryLevel >= 80);
    strongTopics.forEach(topic => {
      recommendations.push({
        priority: 'low',
        subject: topic.subject,
        reason: `Maintain ${topic.subject} - you're excelling in this area`,
        suggestedQuestions: topic.strongQuestions.slice(0, 2)
      });
    });

    return recommendations;
  }

  // Get adaptive question selection for a practice session
  getAdaptiveQuestions(
    allQuestions: any[],
    targetCount: number = 10
  ): AdaptiveQuestion[] {
    const adaptiveQuestions: AdaptiveQuestion[] = [];

    // Calculate priority scores for each question
    allQuestions.forEach(question => {
      const mastery = this.getQuestionMastery(question.id);
      const topicMastery = this.getTopicMastery(question.subject);
      
      // Priority factors:
      // 1. Low question mastery (higher priority)
      // 2. Low topic mastery (higher priority)
      // 3. Recent attempts (lower priority for spacing)
      
      const questionPriority = 100 - mastery; // Lower mastery = higher priority
      const topicPriority = 100 - topicMastery.masteryLevel;
      const recencyFactor = this.getRecencyFactor(question.id);
      
      const totalPriority = (questionPriority * 0.6) + (topicPriority * 0.3) + (recencyFactor * 0.1);
      
      adaptiveQuestions.push({
        questionId: question.id,
        priority: totalPriority,
        reason: this.getPriorityReason(mastery, topicMastery.masteryLevel)
      });
    });

    // Sort by priority and return top questions
    return adaptiveQuestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, targetCount);
  }

  // Get weak areas for focus
  getWeakAreas(): string[] {
    const topicMasteries = this.getAllTopicMastery();
    return topicMasteries
      .filter(topic => topic.masteryLevel < 70)
      .map(topic => topic.subject);
  }

  // Get strong areas
  getStrongAreas(): string[] {
    const topicMasteries = this.getAllTopicMastery();
    return topicMasteries
      .filter(topic => topic.masteryLevel >= 80)
      .map(topic => topic.subject);
  }

  // Private methods

  private async loadPerformanceData(): Promise<void> {
    try {
      const stored = localStorage.getItem('performanceData');
      if (stored) {
        const data = JSON.parse(stored);
        this.performanceCache = new Map(Object.entries(data.performance));
        this.topicMasteryCache = new Map(Object.entries(data.topics));
      }
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  }

  private async savePerformanceData(): Promise<void> {
    try {
      const data = {
        performance: Object.fromEntries(this.performanceCache),
        topics: Object.fromEntries(this.topicMasteryCache),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('performanceData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving performance data:', error);
    }
  }

  private async updateTopicMastery(subject: string): Promise<void> {
    const questions = Array.from(this.performanceCache.values())
      .filter(q => q.subject === subject);

    if (questions.length === 0) return;

    const totalMastery = questions.reduce((sum, q) => sum + q.masteryLevel, 0);
    const averageMastery = totalMastery / questions.length;

    const weakQuestions = questions
      .filter(q => q.masteryLevel < 60)
      .map(q => q.questionId);

    const strongQuestions = questions
      .filter(q => q.masteryLevel >= 80)
      .map(q => q.questionId);

    this.topicMasteryCache.set(subject, {
      subject,
      masteryLevel: Math.round(averageMastery),
      questionCount: questions.length,
      weakQuestions,
      strongQuestions
    });
  }

  private getRecencyFactor(questionId: string): number {
    const performance = this.performanceCache.get(questionId);
    if (!performance) return 50; // Neutral for new questions

    const lastAttempt = new Date(performance.lastAttempted);
    const daysSince = (Date.now() - lastAttempt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Higher factor for questions not attempted recently
    return Math.min(100, Math.max(0, daysSince * 10));
  }

  private getPriorityReason(questionMastery: number, topicMastery: number): string {
    if (questionMastery < 50) return 'You often struggle with this question';
    if (questionMastery < 70) return 'You sometimes get this wrong';
    if (topicMastery < 60) return 'This topic needs more practice';
    if (topicMastery < 80) return 'Good progress, keep practicing';
    return 'Maintaining strong performance';
  }
}

export const performanceTracker = new PerformanceTracker(); 