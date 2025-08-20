import { performanceTracker } from './performanceTracker';
import type { Question } from '../types';

export interface SmartQuestionSet {
  questions: Question[];
  isPersonalized: boolean;
  focusAreas: string[];
  estimatedDifficulty: 'easy' | 'medium' | 'hard';
      examReadinessScore: number; // 0-100, Dutch driving theory readiness
  learningPath: LearningPath;
}

export interface LearningPath {
  currentStage: 'beginner' | 'intermediate' | 'advanced' | 'exam-ready';
  nextMilestone: string;
  estimatedWeeksToExam: number;
  focusTopics: string[];
  confidence: number;
}

export interface DutchDrivingStandard {
  category: string;
  weight: number; // Importance in exam (0-100)
  minQuestions: number; // Minimum questions needed
  masteryThreshold: number; // Score needed to pass this category
}

// Official Dutch Driving Theory Standards (based on actual exam structure)
const DUTCH_DRIVING_STANDARDS: DutchDrivingStandard[] = [
  { category: 'Traffic Lights & Signals', weight: 20, minQuestions: 8, masteryThreshold: 80 },
  { category: 'Priority Rules', weight: 18, minQuestions: 6, masteryThreshold: 85 },
  { category: 'Warning Signs', weight: 15, minQuestions: 6, masteryThreshold: 80 },
  { category: 'Prohibitory Signs', weight: 12, minQuestions: 5, masteryThreshold: 80 },
  { category: 'Mandatory Signs', weight: 10, minQuestions: 4, masteryThreshold: 80 },
  { category: 'Road Information', weight: 8, minQuestions: 3, masteryThreshold: 75 },
  // Critical CBR Content
  { category: 'Alcohol & Drugs', weight: 25, minQuestions: 8, masteryThreshold: 90 },
  { category: 'Fatigue & Rest', weight: 20, minQuestions: 6, masteryThreshold: 85 },
  { category: 'Vehicle Documentation', weight: 15, minQuestions: 5, masteryThreshold: 80 },
  { category: 'Emergency Procedures', weight: 18, minQuestions: 6, masteryThreshold: 85 },
  // New Content Categories
  { category: 'Speed Limits', weight: 12, minQuestions: 4, masteryThreshold: 80 },
  { category: 'Road Markings', weight: 10, minQuestions: 4, masteryThreshold: 80 },
  { category: 'Expanded Priority Rules', weight: 15, minQuestions: 5, masteryThreshold: 85 },
  { category: 'Motorway Rules', weight: 12, minQuestions: 4, masteryThreshold: 80 },
  { category: 'Vehicle Categories', weight: 8, minQuestions: 3, masteryThreshold: 75 },
  { category: 'Parking Rules', weight: 10, minQuestions: 4, masteryThreshold: 80 },
  { category: 'Environmental Zones', weight: 6, minQuestions: 3, masteryThreshold: 75 },
  { category: 'Technology & Safety', weight: 5, minQuestions: 2, masteryThreshold: 70 }
];

class SmartQuestionSelector {
  // Get personalized question set for a practice session
  async getPersonalizedQuestions(
    allQuestions: Question[],
    targetCount: number = 10,
    subject?: string
  ): Promise<SmartQuestionSet> {
    // Check if user has enabled personalized learning
    const personalizedEnabled = localStorage.getItem('personalizedLearning');
    if (personalizedEnabled === 'false') {
      return this.getBalancedQuestions(allQuestions, targetCount, subject);
    }

    // Initialize performance tracker if needed
    await performanceTracker.initialize();

    // Filter by subject if specified
    const availableQuestions = subject 
      ? allQuestions.filter(q => q.subject === subject)
      : allQuestions;

    // Get adaptive question priorities
    const adaptiveQuestions = performanceTracker.getAdaptiveQuestions(availableQuestions, targetCount);
    
    // Get the actual question objects
    const selectedQuestions = adaptiveQuestions.map(adaptive => {
      const question = availableQuestions.find(q => q.id === adaptive.questionId);
      return question!;
    });

    // Determine focus areas
    const weakAreas = performanceTracker.getWeakAreas();
    const focusAreas = subject ? [subject] : this.getDutchDrivingPriorityAreas(weakAreas);

    // Estimate difficulty based on user's current mastery
    const estimatedDifficulty = this.estimateDifficulty(selectedQuestions);

    // Calculate Dutch driving theory readiness score
    const examReadinessScore = await this.calculateExamReadiness();

    // Generate personalized learning path
    const learningPath = this.generateLearningPath(examReadinessScore, weakAreas);

    return {
      questions: selectedQuestions,
      isPersonalized: true,
      focusAreas,
      estimatedDifficulty,
      examReadinessScore,
      learningPath
    };
  }

  // Get balanced question set (mix of easy, medium, hard)
  getBalancedQuestions(
    allQuestions: Question[],
    targetCount: number = 10,
    subject?: string
  ): SmartQuestionSet {
    const availableQuestions = subject 
      ? allQuestions.filter(q => q.subject === subject)
      : allQuestions;

    // Simple balanced selection (not personalized)
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, targetCount);

    const examReadinessScore = 50; // Default score for non-personalized
    const learningPath = this.generateLearningPath(examReadinessScore, []);

    return {
      questions: selectedQuestions,
      isPersonalized: false,
      focusAreas: subject ? [subject] : [],
      estimatedDifficulty: 'medium',
      examReadinessScore,
      learningPath
    };
  }

  // Get next question based on current performance
  getNextQuestion(
    allQuestions: Question[],
    currentQuestionId: string,
    wasCorrect: boolean,
    timeSpent: number
  ): Question | null {
    // Track the current question performance
    const currentQuestion = allQuestions.find(q => q.id === currentQuestionId);
    if (currentQuestion) {
      performanceTracker.trackQuestionAttempt(
        currentQuestionId,
        currentQuestion.subject,
        wasCorrect,
        timeSpent
      );
    }

    // Get personalized next question based on CBR standards
    const adaptiveQuestions = performanceTracker.getAdaptiveQuestions(allQuestions, 5);
    
    // Find the highest priority question that's not the current one
    const nextQuestionId = adaptiveQuestions.find(q => q.questionId !== currentQuestionId)?.questionId;
    
    if (nextQuestionId) {
      return allQuestions.find(q => q.id === nextQuestionId) || null;
    }

    // Fallback to random selection
    const remainingQuestions = allQuestions.filter(q => q.id !== currentQuestionId);
    return remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)] || null;
  }

  // Get practice recommendations
  async getPracticeRecommendations(): Promise<{
    weakAreas: string[];
    strongAreas: string[];
    recommendations: any[];
    dutchDrivingPriorities: string[];
  }> {
    await performanceTracker.initialize();
    
    const weakAreas = performanceTracker.getWeakAreas();
    const strongAreas = performanceTracker.getStrongAreas();
    const dutchDrivingPriorities = this.getDutchDrivingPriorityAreas(weakAreas);
    
    return {
      weakAreas,
      strongAreas,
      recommendations: performanceTracker.getLearningRecommendations(),
      dutchDrivingPriorities
    };
  }

  // Get Dutch driving theory priority areas (most important for passing)
  private getDutchDrivingPriorityAreas(weakAreas: string[]): string[] {
    // Sort weak areas by Dutch driving theory importance
    const prioritizedAreas = weakAreas.sort((a, b) => {
      const aStandard = DUTCH_DRIVING_STANDARDS.find(s => s.category === a);
      const bStandard = DUTCH_DRIVING_STANDARDS.find(s => s.category === b);
      
      if (!aStandard && !bStandard) return 0;
      if (!aStandard) return 1;
      if (!bStandard) return -1;
      
      return bStandard.weight - aStandard.weight; // Higher weight = higher priority
    });

    return prioritizedAreas.slice(0, 3); // Top 3 priority areas
  }

  // Calculate Dutch driving theory readiness score (0-100)
  private async calculateExamReadiness(): Promise<number> {
    const topicMasteries = performanceTracker.getAllTopicMastery();
    
    if (topicMasteries.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    DUTCH_DRIVING_STANDARDS.forEach(standard => {
      const topicMastery = topicMasteries.find(t => t.subject === standard.category);
      if (topicMastery) {
        const masteryScore = topicMastery.masteryLevel;
        const weightedScore = (masteryScore / 100) * standard.weight;
        totalScore += weightedScore;
        totalWeight += standard.weight;
      }
    });

    if (totalWeight === 0) return 0;
    return Math.round((totalScore / totalWeight) * 100);
  }

  // Generate personalized learning path
  private generateLearningPath(examReadinessScore: number, weakAreas: string[]): LearningPath {
    let currentStage: 'beginner' | 'intermediate' | 'advanced' | 'exam-ready';
    let nextMilestone: string;
    let estimatedWeeksToExam: number;
    let confidence: number;

    if (examReadinessScore >= 85) {
      currentStage = 'exam-ready';
      nextMilestone = 'You\'re ready for the Dutch driving theory exam!';
      estimatedWeeksToExam = 0;
      confidence = 0.95;
    } else if (examReadinessScore >= 70) {
      currentStage = 'advanced';
      nextMilestone = 'Master remaining weak areas';
      estimatedWeeksToExam = 2;
      confidence = 0.8;
    } else if (examReadinessScore >= 50) {
      currentStage = 'intermediate';
      nextMilestone = 'Build confidence in core topics';
      estimatedWeeksToExam = 4;
      confidence = 0.6;
    } else {
      currentStage = 'beginner';
      nextMilestone = 'Learn fundamental road rules';
      estimatedWeeksToExam = 6;
      confidence = 0.4;
    }

    const focusTopics = weakAreas.slice(0, 3);

    return {
      currentStage,
      nextMilestone,
      estimatedWeeksToExam,
      focusTopics,
      confidence
    };
  }

  // Estimate difficulty of a question set
  private estimateDifficulty(questions: Question[]): 'easy' | 'medium' | 'hard' {
    if (questions.length === 0) return 'medium';

    const averageMastery = questions.reduce((sum, q) => {
      return sum + performanceTracker.getQuestionMastery(q.id);
    }, 0) / questions.length;

    if (averageMastery >= 70) return 'easy';
    if (averageMastery >= 40) return 'medium';
    return 'hard';
  }

  // Check if user has enough data for personalization
  hasEnoughData(): boolean {
    const topicMasteries = performanceTracker.getAllTopicMastery();
    const totalQuestions = topicMasteries.reduce((sum, topic) => sum + topic.questionCount, 0);
    
    // Require at least 10 questions attempted for personalization
    return totalQuestions >= 10;
  }

  // Get personalized practice focus
  getPracticeFocus(): {
    primaryFocus: string;
    secondaryFocus: string[];
    confidence: number;
    dutchDrivingImportance: number;
  } {
    const weakAreas = performanceTracker.getWeakAreas();
    const strongAreas = performanceTracker.getStrongAreas();
    
    const primaryFocus = weakAreas[0] || 'General Practice';
    const secondaryFocus = weakAreas.slice(1, 3);
    const confidence = this.hasEnoughData() ? 0.8 : 0.3;

    // Get importance of primary focus
    const dutchDrivingStandard = DUTCH_DRIVING_STANDARDS.find(s => s.category === primaryFocus);
    const dutchDrivingImportance = dutchDrivingStandard ? dutchDrivingStandard.weight : 50;

    return {
      primaryFocus,
      secondaryFocus,
      confidence,
      dutchDrivingImportance
    };
  }

  // Get Dutch driving theory standards for a specific category
  getDutchDrivingStandard(category: string): DutchDrivingStandard | null {
    return DUTCH_DRIVING_STANDARDS.find(s => s.category === category) || null;
  }

  // Get all Dutch driving theory standards
  getAllDutchDrivingStandards(): DutchDrivingStandard[] {
    return DUTCH_DRIVING_STANDARDS;
  }
}

export const smartQuestionSelector = new SmartQuestionSelector(); 