// Simple study scheduler with Coach, Tracker, and Progress features

export interface StudySession {
  id: string;
  startTime: Date;
  endTime: Date;
  questionsAnswered: number;
  performance: number;
  topics: string[];
}

export interface CoachRecommendation {
  message: string;
  nextTopic: string;
  priority: 'high' | 'medium' | 'low';
}

export interface StudyTracker {
  totalStudyTime: number; // in minutes
  remainingTime: number; // in minutes
  isActive: boolean;
  startDate?: Date;
}

export interface StudyProgress {
  percentage: number;
  topicsCompleted: string[];
  weakAreas: string[];
  strongAreas: string[];
}

export interface PracticeSession {
  topic: string;
  questionsAnswered: number;
  totalQuestions: number;
  startTime: Date;
  isComplete: boolean;
  sessionId: string;
}

export interface StudyPattern {
  optimalTimeSlots: string[]; // ['09:00', '14:00', '20:00']
  averageSessionLength: number; // minutes
  preferredDays: string[]; // ['monday', 'wednesday', 'friday']
  performanceByTime: Record<string, number>; // time -> performance score
}

export interface StudyRecommendation {
  type: 'reminder' | 'optimal_time' | 'knowledge_decay' | 'exam_prep';
  priority: 'high' | 'medium' | 'low';
  message: string;
  suggestedTime: Date;
  estimatedDuration: number;
  topics: string[];
}

export interface StudyPreferences {
  notifications: boolean;
  optimalTimeReminders: boolean;
  knowledgeDecayAlerts: boolean;
  examDate?: string;
  preferredStudyTimes: string[];
  dailyGoal: number; // minutes
}

class StudyScheduler {
  private sessions: StudySession[] = [];
  private patterns: StudyPattern | null = null;
  private preferences: StudyPreferences = {
    notifications: true,
    optimalTimeReminders: true,
    knowledgeDecayAlerts: true,
    preferredStudyTimes: ['09:00', '14:00', '20:00'],
    dailyGoal: 30
  };
  private tracker: StudyTracker = {
    totalStudyTime: 0,
    remainingTime: 120, // 2 hours in minutes (simplified)
    isActive: false
  };
  private progress: StudyProgress = {
    percentage: 0,
    topicsCompleted: [],
    weakAreas: [],
    strongAreas: []
  };
  private activeSessions: PracticeSession[] = [];

  async initialize(): Promise<void> {
    await this.loadData();
    await this.analyzePatterns();
    this.updateProgress();
  }

  // Coach: Get smart study recommendations
  getCoachRecommendation(): CoachRecommendation {
    if (this.sessions.length === 0) {
      return {
        message: "Start studying",
        nextTopic: "Traffic Signs",
        priority: 'high'
      };
    }

    // Check if user is returning after a break
    const lastSession = this.sessions[this.sessions.length - 1];
    const daysSinceLastSession = (Date.now() - new Date(lastSession.startTime).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastSession > 1) {
      return {
        message: "Welcome back",
        nextTopic: this.getNextTopic(),
        priority: 'high'
      };
    }

    if (lastSession.performance < 70) {
      return {
        message: "Focus weak areas",
        nextTopic: this.getWeakestTopic(),
        priority: 'high'
      };
    }

    if (this.progress.percentage < 50) {
      return {
        message: "Keep studying",
        nextTopic: this.getNextTopic(),
        priority: 'medium'
      };
    }

    if (this.tracker.remainingTime < 240) { // Less than 4 hours remaining
      return {
        message: "Almost done",
        nextTopic: this.getWeakestTopic(),
        priority: 'high'
      };
    }

    return {
      message: "Great progress",
      nextTopic: this.getNextTopic(),
      priority: 'low'
    };
  }

  // Tracker: Start study session
  startStudy(): void {
    this.tracker.isActive = true;
    this.tracker.startDate = new Date();
  }

  // Tracker: Get study time info
  getTracker(): StudyTracker {
    return { ...this.tracker };
  }

  // Progress: Get current study progress
  getProgress(): StudyProgress {
    return { ...this.progress };
  }

  // Practice Session Management
  startPracticeSession(topic: string, totalQuestions: number): string {
    const sessionId = Date.now().toString();
    const session: PracticeSession = {
      topic,
      questionsAnswered: 0,
      totalQuestions,
      startTime: new Date(),
      isComplete: false,
      sessionId
    };
    
    this.activeSessions.push(session);
    this.saveData();
    return sessionId;
  }

  updatePracticeSession(sessionId: string, questionsAnswered: number): void {
    const session = this.activeSessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.questionsAnswered = questionsAnswered;
      // Save immediately but use async to avoid blocking UI
      this.saveDataAsync();
    }
  }

  completePracticeSession(sessionId: string, performance?: number): void {
    const session = this.activeSessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.isComplete = true;
      
      // Update study time
      const sessionDuration = (Date.now() - new Date(session.startTime).getTime()) / (1000 * 60);
      this.tracker.totalStudyTime += sessionDuration;
      this.tracker.remainingTime = Math.max(0, this.tracker.remainingTime - sessionDuration);
      
      // Create a study session record with performance data
      if (performance !== undefined) {
        const studySession: StudySession = {
          id: sessionId,
          startTime: session.startTime,
          endTime: new Date(),
          questionsAnswered: session.questionsAnswered,
          performance: performance,
          topics: [session.topic]
        };
        this.sessions.push(studySession);
      }
      
      // Mark topic as completed
      if (!this.progress.topicsCompleted.includes(session.topic)) {
        this.progress.topicsCompleted.push(session.topic);
      }
      
      this.updateProgress();
      this.saveData();
    }
  }

  getIncompleteSession(): PracticeSession | null {
    return this.activeSessions.find(session => !session.isComplete) || null;
  }

  getActiveSession(sessionId: string): PracticeSession | null {
    return this.activeSessions.find(s => s.sessionId === sessionId) || null;
  }

  // Check if user has completed their 24-hour prep
  isPrepComplete(): boolean {
    return this.tracker.remainingTime <= 0;
  }

  // Get completion status message
  getCompletionStatus(): string {
    if (this.isPrepComplete()) {
      return "24-hour prep complete";
    }
    
    if (this.tracker.remainingTime < 60) { // Less than 1 hour
      return "Almost done with prep";
    }
    
    if (this.progress.percentage >= 70) {
      return "Great prep progress";
    }
    
    if (this.progress.percentage >= 50) {
      return "Halfway there! Keep building your 24-hour prep";
    }
    
    if (this.progress.percentage >= 25) {
      return "Great start! Every minute counts toward your 24-hour prep";
    }
    
    if (this.progress.percentage > 0) {
      return "Keep going! Every minute counts toward your 24-hour prep";
    }
    
    return "";
  }

  // Progress: Update progress after session
  private updateProgress(): void {
    if (this.sessions.length === 0) {
      this.progress.percentage = 0;
      // Set default areas for new users
      this.progress.weakAreas = ["Traffic Signs"];
      this.progress.strongAreas = [];
      return;
    }

    // Calculate progress based on time completion (24-hour prep)
    this.progress.percentage = Math.round((this.tracker.totalStudyTime / 120) * 100);
    
    // Update weak and strong areas
    this.updateTopicAnalysis();
  }

  private getWeakestTopic(): string {
    const topicPerformance: Record<string, number[]> = {};
    
    this.sessions.forEach(session => {
      session.topics.forEach(topic => {
        if (!topicPerformance[topic]) topicPerformance[topic] = [];
        topicPerformance[topic].push(session.performance);
      });
    });

    let weakestTopic = "Traffic Signs";
    let lowestScore = 100;

    Object.entries(topicPerformance).forEach(([topic, scores]) => {
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (avgScore < lowestScore) {
        lowestScore = avgScore;
        weakestTopic = topic;
      }
    });

    return weakestTopic;
  }

  private getNextTopic(): string {
    const allTopics = [
      "Traffic Signs", "Priority Rules", "Hazard Perception", "Speed & Safety",
      "Road Signs", "Parking Rules", "Motorway Rules", "Roundabout Rules",
      "Vehicle Knowledge", "Environmental Zones", "Technology & Safety",
      "Alcohol & Drugs", "Fatigue & Rest", "Emergency Procedures",
      "Insight Practice", "Bicycle Interactions", "Tram Interactions",
      "Pedestrian Crossings", "Construction Zones", "Weather Conditions"
    ];
    
    const completedTopics = this.progress.topicsCompleted;
    const nextTopic = allTopics.find(topic => !completedTopics.includes(topic));
    
    return nextTopic || "Traffic Signs";
  }

  // Get estimated time for a topic
  getTopicTimeEstimate(topic: string): string {
    const timeEstimates: Record<string, string> = {
      "Traffic Signs": "~20 min", // 160 questions (40+40+40+40) = ~20 min
      "Priority Rules": "~15 min", // 92 questions (32+60) = ~15 min
      "Hazard Perception": "~20 min", // 40 questions = ~20 min
      "Speed & Safety": "~20 min", // 120 questions (60+60) = ~20 min
      "Road Signs": "~20 min", // 160 questions (40+40+40+40) = ~20 min
      "Parking Rules": "~30 min", // 60 questions = ~30 min
      "Motorway Rules": "~30 min", // 60 questions = ~30 min
      "Roundabout Rules": "~30 min", // 60 questions = ~30 min
      "Vehicle Knowledge": "~44 min", // 88 questions (40+48) = ~44 min
      "Environmental Zones": "~15 min", // 30 questions = ~15 min
      "Technology & Safety": "~20 min", // 40 questions = ~20 min
      "Alcohol & Drugs": "~24 min", // 48 questions = ~24 min
      "Fatigue & Rest": "~24 min", // 48 questions = ~24 min
      "Emergency Procedures": "~24 min", // 48 questions = ~24 min
      "Insight Practice": "~20 min", // 40 questions = ~20 min
      "Bicycle Interactions": "~40 min", // 80 questions = ~40 min
      "Tram Interactions": "~20 min", // 40 questions = ~20 min
      "Pedestrian Crossings": "~10 min", // 20 questions = ~10 min
      "Construction Zones": "~16 min", // 32 questions = ~16 min
      "Weather Conditions": "~8 min" // 16 questions = ~8 min
    };
    
    return timeEstimates[topic] || "~20 min";
  }

  private updateTopicAnalysis(): void {
    const topicPerformance: Record<string, number[]> = {};
    
    this.sessions.forEach(session => {
      session.topics.forEach(topic => {
        if (!topicPerformance[topic]) topicPerformance[topic] = [];
        topicPerformance[topic].push(session.performance);
      });
    });

    this.progress.weakAreas = [];
    this.progress.strongAreas = [];

    Object.entries(topicPerformance).forEach(([topic, scores]) => {
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (avgScore < 70) {
        this.progress.weakAreas.push(topic);
      } else if (avgScore >= 80) {
        this.progress.strongAreas.push(topic);
      }
    });
  }

  // Track a study session
  async trackSession(session: Omit<StudySession, 'id'>): Promise<void> {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString()
    };
    
    this.sessions.push(newSession);
    
    // Update tracker with session time (simplified)
    const sessionDuration = Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60));
    this.tracker.totalStudyTime += sessionDuration;
    this.tracker.remainingTime = Math.max(0, 120 - this.tracker.totalStudyTime);
    
    // Update progress
    this.updateProgress();
    
    await this.saveData();
    await this.analyzePatterns();
  }

  // Get study recommendations
  async getRecommendations(): Promise<StudyRecommendation[]> {
    const recommendations: StudyRecommendation[] = [];
    
    // Check for knowledge decay
    const decayRecommendation = this.checkKnowledgeDecay();
    if (decayRecommendation) {
      recommendations.push(decayRecommendation);
    }

    // Check for optimal timing
    const timingRecommendation = this.checkOptimalTiming();
    if (timingRecommendation) {
      recommendations.push(timingRecommendation);
    }

    // Check for daily goal
    const goalRecommendation = this.checkDailyGoal();
    if (goalRecommendation) {
      recommendations.push(goalRecommendation);
    }

    return recommendations.sort((a, b) => this.getPriorityScore(b) - this.getPriorityScore(a));
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<StudyPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    await this.saveData();
  }

  // Get current preferences
  getPreferences(): StudyPreferences {
    return { ...this.preferences };
  }

  // Get study streak
  getStudyStreak(): number {
    const today = new Date();
    
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      const hasSession = this.sessions.some(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.toDateString() === currentDate.toDateString();
      });
      
      if (hasSession) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Private methods

  private async loadData(): Promise<void> {
    try {
      const stored = localStorage.getItem('studySchedulerData');
      if (stored) {
        const data = JSON.parse(stored);
        this.sessions = data.sessions?.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime)
        })) || [];
        this.preferences = { ...this.preferences, ...data.preferences };
        this.tracker = { ...this.tracker, ...data.tracker };
        this.progress = { ...this.progress, ...data.progress };
        this.activeSessions = data.activeSessions?.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime)
        })) || [];
      }
        } catch (error) {
          // Error loading study scheduler data
        }
  }

  private async saveData(): Promise<void> {
    try {
      const data = {
        sessions: this.sessions,
        preferences: this.preferences,
        tracker: this.tracker,
        progress: this.progress,
        activeSessions: this.activeSessions,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('studySchedulerData', JSON.stringify(data));
    } catch (error) {
      // Error saving study scheduler data
    }
  }

  private saveDataAsync(): void {
    // Use setTimeout to make save non-blocking
    setTimeout(() => {
      this.saveData().catch(() => {});
    }, 0);
  }

  private async analyzePatterns(): Promise<void> {
    if (this.sessions.length < 3) return; // Need at least 3 sessions

    // Analyze optimal times
    const timePerformance: Record<string, number[]> = {};
    this.sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours().toString().padStart(2, '0');
      if (!timePerformance[hour]) timePerformance[hour] = [];
      timePerformance[hour].push(session.performance);
    });

    const optimalTimeSlots = Object.entries(timePerformance)
      .map(([hour, performances]) => ({
        hour,
        averagePerformance: performances.reduce((sum, p) => sum + p, 0) / performances.length
      }))
      .sort((a, b) => b.averagePerformance - a.averagePerformance)
      .slice(0, 3)
      .map(item => `${item.hour}:00`);

    // Calculate average session length
    const sessionLengths = this.sessions.map(session => {
      const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
      return Math.round(duration / (1000 * 60)); // Convert to minutes
    });
    const averageSessionLength = Math.round(
      sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length
    );

    this.patterns = {
      optimalTimeSlots,
      averageSessionLength,
      preferredDays: ['monday', 'wednesday', 'friday'], // Default
      performanceByTime: Object.fromEntries(
        Object.entries(timePerformance).map(([hour, performances]) => [
          hour,
          performances.reduce((sum, p) => sum + p, 0) / performances.length
        ])
      )
    };
  }

  private checkKnowledgeDecay(): StudyRecommendation | null {
    if (!this.preferences.knowledgeDecayAlerts) return null;

    const lastSession = this.sessions[this.sessions.length - 1];
    if (!lastSession) return null;

    const daysSinceLastSession = (Date.now() - new Date(lastSession.startTime).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastSession > 2) {
      // Simple reminder without complex AI analysis
      const message = 'Knowledge fading - practice needed';
      
      return {
        type: 'knowledge_decay',
        priority: 'high',
        message,
        suggestedTime: new Date(),
        estimatedDuration: 15,
        topics: []
      };
    }

    return null;
  }

  private checkOptimalTiming(): StudyRecommendation | null {
    if (!this.preferences.optimalTimeReminders || !this.patterns) return null;

    const currentHour = new Date().getHours().toString().padStart(2, '0');
    const isOptimalTime = this.patterns.optimalTimeSlots.some(time => time.startsWith(currentHour));

    if (isOptimalTime) {
      // Simple optimal time reminder
      const message = 'Optimal study time - practice now';
      
      return {
        type: 'optimal_time',
        priority: 'medium',
        message,
        suggestedTime: new Date(),
        estimatedDuration: this.patterns.averageSessionLength,
        topics: []
      };
    }

    return null;
  }

  private checkDailyGoal(): StudyRecommendation | null {
    const today = new Date().toDateString();
    const todaySessions = this.sessions.filter(session => 
      new Date(session.startTime).toDateString() === today
    );

    const totalMinutes = todaySessions.reduce((sum, session) => {
      const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
      return sum + Math.round(duration / (1000 * 60));
    }, 0);

    if (totalMinutes < this.preferences.dailyGoal) {
      const remainingMinutes = this.preferences.dailyGoal - totalMinutes;
      const message = `${remainingMinutes} min to reach daily goal!`;
      
      return {
        type: 'reminder',
        priority: 'medium',
        message,
        suggestedTime: new Date(),
        estimatedDuration: remainingMinutes,
        topics: []
      };
    }

    return null;
  }

  private getPriorityScore(recommendation: StudyRecommendation): number {
    const priorityScores = { high: 3, medium: 2, low: 1 };
    return priorityScores[recommendation.priority];
  }
}

export const studyScheduler = new StudyScheduler();
