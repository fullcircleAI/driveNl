// Analytics utility for Theory24 app
// Tracks user behavior and app performance

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

class Analytics {
  private isEnabled: boolean = false;
  private userId: string | null = null;

  constructor() {
    // Check if analytics is enabled (you can add environment variable)
    this.isEnabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
    
    // Initialize user ID
    this.userId = this.getUserId();
  }

  private getUserId(): string {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  // Track page views
  trackPageView(page: string): void {
    if (!this.isEnabled) return;
    
    console.log('📊 Page View:', page);
    this.sendEvent({
      action: 'page_view',
      category: 'navigation',
      label: page
    });
  }

  // Track user actions
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;
    
    console.log('📊 Event:', event);
    this.sendEvent(event);
  }

  // Track test completion
  trackTestCompletion(testType: string, score: number, timeSpent: number): void {
    if (!this.isEnabled) return;
    
    this.trackEvent({
      action: 'test_completed',
      category: 'learning',
      label: testType,
      value: score
    });

    this.trackEvent({
      action: 'time_spent',
      category: 'learning',
      label: testType,
      value: timeSpent
    });
  }

  // Track language selection
  trackLanguageSelection(language: string): void {
    if (!this.isEnabled) return;
    
    this.trackEvent({
      action: 'language_selected',
      category: 'preferences',
      label: language
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string): void {
    if (!this.isEnabled) return;
    
    this.trackEvent({
      action: 'feature_used',
      category: 'engagement',
      label: feature
    });
  }

  // Track errors
  trackError(error: string, context?: string): void {
    if (!this.isEnabled) return;
    
    this.trackEvent({
      action: 'error_occurred',
      category: 'errors',
      label: error + (context ? ` - ${context}` : '')
    });
  }

  // Track user feedback
  trackFeedback(rating: number, comment?: string): void {
    if (!this.isEnabled) return;
    
    this.trackEvent({
      action: 'feedback_submitted',
      category: 'feedback',
      label: comment ? 'with_comment' : 'rating_only',
      value: rating
    });
  }

  // Send event to analytics service
  private sendEvent(event: AnalyticsEvent): void {
    // In a real implementation, you would send this to your analytics service
    // For now, we'll just log it and store locally
    
    const eventData = {
      ...event,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store locally for debugging
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(eventData);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));

    // Send to external analytics service (Google Analytics, Mixpanel, etc.)
    this.sendToExternalService(eventData);
  }

  // Send to external analytics service
  private sendToExternalService(eventData: any): void {
    // Google Analytics 4 example
    if (typeof gtag !== 'undefined') {
      gtag('event', eventData.action, {
        event_category: eventData.category,
        event_label: eventData.label,
        value: eventData.value
      });
    }

    // Mixpanel example
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track(eventData.action, {
        category: eventData.category,
        label: eventData.label,
        value: eventData.value
      });
    }

    // Custom analytics endpoint
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      }).catch(error => {
        console.error('Analytics error:', error);
      });
    }
  }

  // Get analytics data for debugging
  getAnalyticsData(): any[] {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  }

  // Clear analytics data
  clearAnalyticsData(): void {
    localStorage.removeItem('analytics_events');
    localStorage.removeItem('analytics_user_id');
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('analytics_enabled', enabled.toString());
  }

  // Check if analytics is enabled
  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export types
export type { AnalyticsEvent };
