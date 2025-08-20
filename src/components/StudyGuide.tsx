import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FiBook, FiCheckCircle, FiAlertTriangle, FiInfo, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import './StudyGuide.css';

interface StudyGuideProps {
  onClose: () => void;
}

interface StudyTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: {
    overview: string;
    keyPoints: string[];
    tips: string[];
    examples: string[];
  };
}

const studyTopics: StudyTopic[] = [
  {
    id: 'alcohol-drugs',
    title: 'Alcohol & Drugs',
    icon: <FiAlertTriangle />,
    content: {
      overview: 'Understanding the legal limits and consequences of driving under the influence of alcohol and drugs.',
      keyPoints: [
        'Maximum BAC: 0.05% for experienced drivers, 0.02% for new drivers',
        'Zero tolerance for drugs that affect driving ability',
        'Heavy fines and possible imprisonment for violations',
        '24-hour wait period after drinking before driving',
        'Check medication side effects with doctor/pharmacist'
      ],
      tips: [
        'Designate a sober driver before drinking',
        'Use public transport or taxi after drinking',
        'Never rely on "feeling sober" to drive',
        'Report suspected impaired drivers to police',
        'Keep emergency contacts readily available'
      ],
      examples: [
        'Scenario: You have 2 beers at dinner. Wait 24 hours before driving.',
        'Scenario: Taking cold medication. Check with pharmacist about driving safety.',
        'Scenario: Witness erratic driving. Call 112 and provide vehicle details.'
      ]
    }
  },
  {
    id: 'fatigue-rest',
    title: 'Fatigue & Rest',
    icon: <FiInfo />,
    content: {
      overview: 'Managing driver fatigue and ensuring proper rest for safe driving.',
      keyPoints: [
        'Take breaks every 2 hours on long journeys',
        '15-20 minute breaks for rest and refreshment',
        '7-8 hours sleep before long journeys',
        'Recognize signs of fatigue: yawning, heavy eyelids, drifting',
        'Maximum 8 hours driving per day'
      ],
      tips: [
        'Plan journeys for early morning when fresh',
        'Avoid heavy meals, alcohol, and drowsy medications',
        'Get out and walk during breaks',
        'Pull over immediately if feeling drowsy',
        'Never try to "push through" fatigue'
      ],
      examples: [
        'Scenario: 4-hour journey. Take 2 breaks of 15-20 minutes each.',
        'Scenario: Feeling tired while driving. Pull over and rest immediately.',
        'Scenario: Long work day. Consider postponing non-essential travel.'
      ]
    }
  },
  {
    id: 'vehicle-documentation',
    title: 'Vehicle Documentation',
    icon: <FiBook />,
    content: {
      overview: 'Required documents and legal obligations for vehicle ownership and operation.',
      keyPoints: [
        'Carry: driving license, registration, insurance, APK certificate',
        'APK required: new cars after 3 years, then annually',
        'Transfer ownership within 14 days of purchase',
        'Update address changes at municipality',
        'Report lost/stolen documents to police'
      ],
      tips: [
        'Keep documents in a safe, accessible location',
        'Make copies of important documents',
        'Set reminders for APK renewal dates',
        'Check insurance coverage regularly',
        'Keep emergency contact information updated'
      ],
      examples: [
        'Scenario: Buying used car. Transfer ownership within 14 days at RDW.',
        'Scenario: Moving house. Update both license and registration addresses.',
        'Scenario: Lost license. Report to police and apply for replacement.'
      ]
    }
  },
  {
    id: 'emergency-procedures',
    title: 'Emergency Procedures',
    icon: <FiAlertTriangle />,
    content: {
      overview: 'Proper procedures for handling accidents, breakdowns, and emergency situations.',
      keyPoints: [
        'Emergency number: 112 for life-threatening situations',
        'Stop immediately and check for injuries in accidents',
        'Move to right and slow down for emergency vehicles',
        'Exchange information in minor accidents',
        'Use emergency phones on motorways for breakdowns'
      ],
      tips: [
        'Keep emergency contacts in your phone',
        'Know your exact location when calling for help',
        'Stay calm and follow emergency service instructions',
        'Document accidents with photos when safe',
        'Report all accidents to your insurance company'
      ],
      examples: [
        'Scenario: Minor accident. Exchange names, addresses, and insurance details.',
        'Scenario: Vehicle breakdown on motorway. Exit vehicle and stand behind barrier.',
        'Scenario: Witness hit-and-run. Call police with vehicle description and location.'
      ]
    }
  }
];

export const StudyGuide: React.FC<StudyGuideProps> = ({ onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { t } = useLanguage();

  const selectedTopicData = studyTopics.find(topic => topic.id === selectedTopic);

  return (
    <div className="study-guide-overlay">
      <div className="study-guide-modal">
        <div className="study-guide-header">
          <h2>{t('studyGuide.title', 'Study Guide')}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {!selectedTopic ? (
          <div className="study-guide-topics">
            <p className="study-guide-intro">
              {t('studyGuide.intro', 'Comprehensive learning materials for critical Dutch driving theory topics.')}
            </p>
            
            <div className="topics-grid">
              {studyTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="topic-card"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="topic-icon">{topic.icon}</div>
                  <h3>{topic.title}</h3>
                  <p>{topic.content.overview}</p>
                  <div className="topic-arrow">
                    <FiArrowRight />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="study-guide-content">
            <button 
              className="back-btn"
              onClick={() => setSelectedTopic(null)}
            >
              <FiArrowLeft /> {t('studyGuide.back', 'Back to Topics')}
            </button>

            {selectedTopicData && (
              <div className="topic-content">
                <div className="topic-header">
                  <div className="topic-icon-large">{selectedTopicData.icon}</div>
                  <h2>{selectedTopicData.title}</h2>
                </div>

                <div className="content-section">
                  <h3>{t('studyGuide.overview', 'Overview')}</h3>
                  <p>{selectedTopicData.content.overview}</p>
                </div>

                <div className="content-section">
                  <h3>{t('studyGuide.keyPoints', 'Key Points')}</h3>
                  <ul>
                    {selectedTopicData.content.keyPoints.map((point, index) => (
                      <li key={index}>
                        <FiCheckCircle className="check-icon" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="content-section">
                  <h3>{t('studyGuide.tips', 'Safety Tips')}</h3>
                  <ul>
                    {selectedTopicData.content.tips.map((tip, index) => (
                      <li key={index}>
                        <FiInfo className="info-icon" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="content-section">
                  <h3>{t('studyGuide.examples', 'Practical Examples')}</h3>
                  <div className="examples-list">
                    {selectedTopicData.content.examples.map((example, index) => (
                      <div key={index} className="example-item">
                        <FiAlertTriangle className="example-icon" />
                        <p>{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
