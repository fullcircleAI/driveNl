import type { Question } from '../types';

export const environmentalZonesQuestions: Question[] = [
  {
    id: 'q-ez-1',
    text: 'What is a "milieuzone" (environmental zone) in the Netherlands?',
    options: [
      { id: 'q-ez-1o1', text: 'A nature reserve area' },
      { id: 'q-ez-1o2', text: 'A city center with restricted vehicle access' },
      { id: 'q-ez-1o3', text: 'A parking area for electric vehicles' },
      { id: 'q-ez-1o4', text: 'A bicycle-only zone' }
    ],
    correctAnswerId: 'q-ez-1o2',
    explanation: 'A "milieuzone" (environmental zone) is a city center area where certain vehicles are restricted from entering to improve air quality and reduce pollution.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-2',
    text: 'Which vehicles are typically restricted in environmental zones?',
    options: [
      { id: 'q-ez-2o1', text: 'All vehicles' },
      { id: 'q-ez-2o2', text: 'Diesel vehicles and older cars' },
      { id: 'q-ez-2o3', text: 'Electric vehicles only' },
      { id: 'q-ez-2o4', text: 'Motorcycles only' }
    ],
    correctAnswerId: 'q-ez-2o2',
    explanation: 'Environmental zones typically restrict diesel vehicles and older cars that do not meet current emission standards to improve air quality.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-3',
    text: 'What sign indicates the entrance to an environmental zone?',
    options: [
      { id: 'q-ez-3o1', text: 'A red circle with "MILIEUZONE"' },
      { id: 'q-ez-3o2', text: 'A blue circle with "MILIEUZONE"' },
      { id: 'q-ez-3o3', text: 'A green circle with "MILIEUZONE"' },
      { id: 'q-ez-3o4', text: 'A yellow triangle with "MILIEUZONE"' }
    ],
    correctAnswerId: 'q-ez-3o1',
    explanation: 'The entrance to an environmental zone is marked with a red circle containing "MILIEUZONE" to indicate restricted access.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-4',
    text: 'What sign indicates the exit from an environmental zone?',
    options: [
      { id: 'q-ez-4o1', text: 'A red circle with "MILIEUZONE" and a diagonal line' },
      { id: 'q-ez-4o2', text: 'A blue circle with "MILIEUZONE" and a diagonal line' },
      { id: 'q-ez-4o3', text: 'A green circle with "MILIEUZONE" and a diagonal line' },
      { id: 'q-ez-4o4', text: 'A yellow triangle with "MILIEUZONE" and a diagonal line' }
    ],
    correctAnswerId: 'q-ez-4o1',
    explanation: 'The exit from an environmental zone is marked with a red circle containing "MILIEUZONE" with a diagonal line through it.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-5',
    text: 'What is the penalty for entering an environmental zone with a restricted vehicle?',
    options: [
      { id: 'q-ez-5o1', text: 'No penalty' },
      { id: 'q-ez-5o2', text: 'A warning letter' },
      { id: 'q-ez-5o3', text: 'A fine of €95' },
      { id: 'q-ez-5o4', text: 'Vehicle confiscation' }
    ],
    correctAnswerId: 'q-ez-5o3',
    explanation: 'Entering an environmental zone with a restricted vehicle typically results in a fine of €95.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-6',
    text: 'Which vehicles are usually exempt from environmental zone restrictions?',
    options: [
      { id: 'q-ez-6o1', text: 'All vehicles' },
      { id: 'q-ez-6o2', text: 'Emergency vehicles and electric vehicles' },
      { id: 'q-ez-6o3', text: 'Only electric vehicles' },
      { id: 'q-ez-6o4', text: 'Only emergency vehicles' }
    ],
    correctAnswerId: 'q-ez-6o2',
    explanation: 'Emergency vehicles and electric vehicles are usually exempt from environmental zone restrictions as they have low or zero emissions.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-7',
    text: 'What is the purpose of environmental zones?',
    options: [
      { id: 'q-ez-7o1', text: 'To reduce traffic congestion' },
      { id: 'q-ez-7o2', text: 'To improve air quality and reduce pollution' },
      { id: 'q-ez-7o3', text: 'To increase parking spaces' },
      { id: 'q-ez-7o4', text: 'To reduce noise pollution' }
    ],
    correctAnswerId: 'q-ez-7o2',
    explanation: 'Environmental zones are designed to improve air quality and reduce pollution by restricting high-emission vehicles from entering certain areas.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-8',
    text: 'How can you check if your vehicle is allowed in an environmental zone?',
    options: [
      { id: 'q-ez-8o1', text: 'By checking the vehicle registration document' },
      { id: 'q-ez-8o2', text: 'By checking the environmental zone website' },
      { id: 'q-ez-8o3', text: 'By asking a police officer' },
      { id: 'q-ez-8o4', text: 'All of the above' }
    ],
    correctAnswerId: 'q-ez-8o4',
    explanation: 'You can check if your vehicle is allowed in an environmental zone by checking the vehicle registration document, the environmental zone website, or asking a police officer.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-9',
    text: 'What does a "Zero Emission Zone" sign indicate?',
    options: [
      { id: 'q-ez-9o1', text: 'Only electric vehicles are allowed' },
      { id: 'q-ez-9o2', text: 'No vehicles are allowed' },
      { id: 'q-ez-9o3', text: 'Only bicycles are allowed' },
      { id: 'q-ez-9o4', text: 'Only pedestrians are allowed' }
    ],
    correctAnswerId: 'q-ez-9o1',
    explanation: 'A "Zero Emission Zone" sign indicates that only electric vehicles and other zero-emission vehicles are allowed in that area.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-10',
    text: 'What is the typical operating time for environmental zones?',
    options: [
      { id: 'q-ez-10o1', text: '24 hours a day, 7 days a week' },
      { id: 'q-ez-10o2', text: 'Only during business hours' },
      { id: 'q-ez-10o3', text: 'Only during weekends' },
      { id: 'q-ez-10o4', text: 'Only during rush hours' }
    ],
    correctAnswerId: 'q-ez-10o1',
    explanation: 'Environmental zones typically operate 24 hours a day, 7 days a week, with restrictions in place at all times.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-11',
    text: 'What should you do if you need to enter an environmental zone with a restricted vehicle?',
    options: [
      { id: 'q-ez-11o1', text: 'Enter anyway and pay the fine' },
      { id: 'q-ez-11o2', text: 'Apply for a temporary exemption' },
      { id: 'q-ez-11o3', text: 'Park outside and walk' },
      { id: 'q-ez-11o4', text: 'All of the above' }
    ],
    correctAnswerId: 'q-ez-11o4',
    explanation: 'If you need to enter an environmental zone with a restricted vehicle, you can apply for a temporary exemption, park outside and walk, or use alternative transportation.',
    subject: 'Environmental Zones'
  },
  {
    id: 'q-ez-12',
    text: 'What is the main benefit of environmental zones for residents?',
    options: [
      { id: 'q-ez-12o1', text: 'Reduced traffic congestion' },
      { id: 'q-ez-12o2', text: 'Improved air quality and health' },
      { id: 'q-ez-12o3', text: 'More parking spaces' },
      { id: 'q-ez-12o4', text: 'Lower fuel prices' }
    ],
    correctAnswerId: 'q-ez-12o2',
    explanation: 'The main benefit of environmental zones for residents is improved air quality and health due to reduced vehicle emissions in the area.',
    subject: 'Environmental Zones'
  }
];
