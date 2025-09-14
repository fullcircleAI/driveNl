// 24-Hour Study Curriculum - SIMPLE & EFFECTIVE
// Complete 24 hours of study at your own pace - no complexity

export interface StudyBlock {
  blockNumber: number;
  title: string;
  description: string;
  focusArea: string;
  targetQuestions: number;
  targetScore: number;
  completed: boolean;
  currentScore?: number;
  estimatedDuration: number; // in minutes
  completedDate?: Date;
  aiMessage?: string; // Optional AI message for motivation
}

export interface StudyProgress {
  blocksCompleted: number;
  totalBlocks: number;
  progressPercentage: number;
  currentBlock: StudyBlock;
  nextAction: string;
  mockExamPassed: boolean; // Simple pass/fail
  mockExamScore?: number; // Basic score
}

class StudyCurriculum {
  private curriculum: StudyCurriculum | null = null;
  
  // Properties for the curriculum
  public studyBlocks: StudyBlock[] = [];
  public currentBlock: number = 1;
  public isActive: boolean = false;
  public startDate?: Date;
  public completedDate?: Date;

  // Initialize 24-hour study curriculum
  initializeCurriculum(): StudyCurriculum {
    const startDate = new Date();
    this.studyBlocks = this.createStudyBlocks();
    
    // Update instance properties
    this.currentBlock = 1;
    this.isActive = true;
    this.startDate = startDate;
    
    this.curriculum = this;
    
    return this.curriculum!;
  }

  // Start the curriculum (user begins studying)
  startCurriculum(): StudyCurriculum {
    if (!this.curriculum) {
      this.initializeCurriculum();
    }
    
    this.curriculum!.isActive = true;
    this.curriculum!.startDate = new Date();
    
    return this.curriculum!;
  }

  // Create flexible study blocks
  private createStudyBlocks(): StudyBlock[] {
    return [
      // Foundation Blocks (1-8)
      {
        blockNumber: 1,
        title: "Traffic Rules",
        description: "Learn basic traffic rules and signs",
        focusArea: "Traffic Rules & Signs",
        targetQuestions: 30,
        targetScore: 70,
        aiMessage: "Let's start with the basics!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 2,
        title: "Priority Rules",
        description: "Understand right of way",
        focusArea: "Priority & Right of Way",
        targetQuestions: 30,
        targetScore: 70,
        aiMessage: "Priority rules are important!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 3,
        title: "Hazard Perception",
        description: "Recognize dangerous situations",
        focusArea: "Hazard Perception",
        targetQuestions: 25,
        targetScore: 65,
        aiMessage: "Learn to spot hazards!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 4,
        title: "Speed & Safety",
        description: "Speed limits and safety rules",
        focusArea: "Speed & Safety",
        targetQuestions: 25,
        targetScore: 70,
        aiMessage: "Safety first!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 5,
        title: "Practice Test 1",
        description: "Test what you've learned",
        focusArea: "Mixed Topics",
        targetQuestions: 30,
        targetScore: 65,
        aiMessage: "Time for your first test!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 6,
        title: "Review & Improve",
        description: "Fix your mistakes",
        focusArea: "Weak Areas",
        targetQuestions: 25,
        targetScore: 75,
        aiMessage: "Learn from mistakes!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 7,
        title: "More Practice",
        description: "Keep practicing",
        focusArea: "All Topics",
        targetQuestions: 30,
        targetScore: 75,
        aiMessage: "Practice makes perfect!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 8,
        title: "Foundation Review",
        description: "Review everything learned",
        focusArea: "Review",
        targetQuestions: 20,
        targetScore: 80,
        aiMessage: "Great progress!",
        completed: false,
        estimatedDuration: 60
      },
      
      // Building Blocks (9-16)
      {
        blockNumber: 9,
        title: "Morning Review",
        description: "Refresh your memory",
        focusArea: "All Topics",
        targetQuestions: 25,
        targetScore: 75,
        aiMessage: "Let's review what you've learned!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 10,
        title: "Focus on Weak Areas",
        description: "Improve your weak spots",
        focusArea: "Weak Areas",
        targetQuestions: 30,
        targetScore: 80,
        aiMessage: "Focus on improvement!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 11,
        title: "Mock Exam 1",
        description: "Full practice exam",
        focusArea: "Mock Exam",
        targetQuestions: 50,
        targetScore: 70,
        aiMessage: "First full exam!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 12,
        title: "Exam Review",
        description: "Analyze your results",
        focusArea: "Review",
        targetQuestions: 20,
        targetScore: 80,
        aiMessage: "See where you can improve!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 13,
        title: "Targeted Practice",
        description: "Practice your weak areas",
        focusArea: "Weak Areas",
        targetQuestions: 35,
        targetScore: 80,
        aiMessage: "Target your weaknesses!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 14,
        title: "Confidence Building",
        description: "Build your confidence",
        focusArea: "Strong Areas",
        targetQuestions: 25,
        targetScore: 85,
        aiMessage: "Build confidence!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 15,
        title: "Mock Exam 2",
        description: "Second full exam",
        focusArea: "Mock Exam",
        targetQuestions: 50,
        targetScore: 75,
        aiMessage: "Show your improvement!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 16,
        title: "Final Review",
        description: "Last review session",
        focusArea: "All Topics",
        targetQuestions: 30,
        targetScore: 80,
        aiMessage: "Almost there!",
        completed: false,
        estimatedDuration: 60
      },
      
      // Final Blocks (17-24)
      {
        blockNumber: 17,
        title: "Exam Day Prep",
        description: "Get ready for the exam",
        focusArea: "Preparation",
        targetQuestions: 15,
        targetScore: 85,
        aiMessage: "Exam day is here!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 18,
        title: "Light Review",
        description: "Quick review",
        focusArea: "Review",
        targetQuestions: 10,
        targetScore: 90,
        aiMessage: "Stay calm and focused!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 19,
        title: "Mental Prep",
        description: "Prepare your mind",
        focusArea: "Mental Prep",
        targetQuestions: 5,
        targetScore: 95,
        aiMessage: "You're ready!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 20,
        title: "Final Check",
        description: "Last minute check",
        focusArea: "Final Check",
        targetQuestions: 5,
        targetScore: 95,
        aiMessage: "You've got this!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 21,
        title: "Relax",
        description: "Stay relaxed",
        focusArea: "Relaxation",
        targetQuestions: 0,
        targetScore: 100,
        aiMessage: "Stay calm and confident!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 22,
        title: "Exam Time",
        description: "Take your exam",
        focusArea: "Exam",
        targetQuestions: 0,
        targetScore: 100,
        aiMessage: "Go pass that exam!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 23,
        title: "Post-Exam",
        description: "After the exam",
        focusArea: "Complete",
        targetQuestions: 0,
        targetScore: 100,
        aiMessage: "Congratulations!",
        completed: false,
        estimatedDuration: 60
      },
      {
        blockNumber: 24,
        title: "Celebrate",
        description: "You did it!",
        focusArea: "Success",
        targetQuestions: 0,
        targetScore: 100,
        aiMessage: "You passed! Well done!",
        completed: false,
        estimatedDuration: 60
      }
    ];
  }

  // Removed unused createIntensiveOneDayBlocks method - keeping simple approach

  // Get current study progress - SIMPLE VERSION
  getStudyProgress(): StudyProgress {
    if (!this.curriculum) {
      throw new Error('Study curriculum not initialized');
    }

    const completedBlocks = this.studyBlocks.filter(block => block.completed).length;
    const progressPercentage = Math.round((completedBlocks / 24) * 100);
    
    const currentBlock = this.studyBlocks[completedBlocks] || this.studyBlocks[23];
    
    // Simple next action
    const nextAction = this.getSimpleNextAction(completedBlocks);
    
    // Check if user has passed mock exam
    const mockExamResult = this.getMockExamResult();
    
    return {
      blocksCompleted: completedBlocks,
      totalBlocks: 24,
      progressPercentage,
      currentBlock,
      nextAction,
      mockExamPassed: mockExamResult.passed,
      mockExamScore: mockExamResult.score
    };
  }

  // Simple next action - NO COMPLEXITY
  private getSimpleNextAction(completedBlocks: number): string {
    if (completedBlocks >= 24) {
      return "You're ready! Take the mock exam to test your knowledge.";
    } else if (completedBlocks >= 20) {
      return `Continue with Block ${completedBlocks + 1} - You're almost done!`;
    } else if (completedBlocks >= 10) {
      return `Continue with Block ${completedBlocks + 1} - Great progress!`;
    } else {
      return `Continue with Block ${completedBlocks + 1} - Keep going!`;
    }
  }

  // Simple mock exam result - BASIC PASS/FAIL
  private getMockExamResult(): { passed: boolean; score?: number } {
    // Check if user has completed mock exam blocks
    const mockExamBlocks = this.studyBlocks.filter(block => 
      block.focusArea === 'Mock Exam' && block.completed
    );
    
    if (mockExamBlocks.length === 0) {
      return { passed: false };
    }
    
    // Get the latest mock exam score
    const latestMockExam = mockExamBlocks[mockExamBlocks.length - 1];
    const score = latestMockExam.currentScore || 0;
    
    return {
      passed: score >= 70, // 70% is passing
      score: score
    };
  }

  // Complete a study block
  completeStudyBlock(blockNumber: number, score: number): void {
    const block = this.studyBlocks.find(b => b.blockNumber === blockNumber);
    if (block) {
      block.completed = true;
      block.currentScore = score;
      block.completedDate = new Date();
    }
  }

  // Simple exam readiness check
  isExamReady(): boolean {
    const progress = this.getStudyProgress();
    return progress.blocksCompleted >= 20 && progress.mockExamPassed;
  }

  // Simple exam day checklist
  getExamDayChecklist(): string[] {
    return [
      "Bring valid ID",
      "Arrive 15 minutes early",
      "Get a good night's sleep",
      "Stay calm and confident",
      "You've got this!"
    ];
  }
}

export const studyCurriculum = new StudyCurriculum();








