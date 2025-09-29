import type { Question } from '../types';

export const roadInformationQuestions: Question[] = [
  {
    id: 'q-park-lane-1',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-1o1', text: 'Motorway' },
      { id: 'q-park-lane-1o2', text: 'Expressway' },
      { id: 'q-park-lane-1o3', text: 'Highway' }
    ],
    correctAnswerId: 'q-park-lane-1o1',
    explanation: 'This sign indicates the beginning of a motorway, which has specific rules and restrictions.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-1.png',
    imageHint: 'motorway'
  },
  {
    id: 'q-park-lane-2',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-2o1', text: 'Parking' },
      { id: 'q-park-lane-2o2', text: 'Parking area' },
      { id: 'q-park-lane-2o3', text: 'Parking permitted' }
    ],
    correctAnswerId: 'q-park-lane-2o1',
    explanation: 'This blue square sign with white "P" indicates a parking area where vehicles are allowed to park.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-2.png',
    imageHint: 'parking'
  },
  {
    id: 'q-park-lane-3',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-3o1', text: 'Playground' },
      { id: 'q-park-lane-3o2', text: 'Children at play' },
      { id: 'q-park-lane-3o3', text: 'Play area' }
    ],
    correctAnswerId: 'q-park-lane-3o1',
    explanation: 'This blue rectangular sign with red diagonal line warns drivers of a playground area where children may be playing. Drivers should reduce speed and be extra cautious.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-3.png',
    imageHint: 'playground'
  },
  {
    id: 'q-park-lane-4',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-4o1', text: 'Priority over oncoming traffic' },
      { id: 'q-park-lane-4o2', text: 'Right of way over oncoming traffic' },
      { id: 'q-park-lane-4o3', text: 'Priority for oncoming traffic' }
    ],
    correctAnswerId: 'q-park-lane-4o1',
    explanation: 'This blue square sign with red arrow down and white arrow up indicates that you have priority over oncoming traffic in narrow sections.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-4.png',
    imageHint: 'priority oncoming traffic'
  },
  {
    id: 'q-park-lane-5',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-5o1', text: 'Tunnel' },
      { id: 'q-park-lane-5o2', text: 'Bridge' },
      { id: 'q-park-lane-5o3', text: 'Underpass' }
    ],
    correctAnswerId: 'q-park-lane-5o1',
    explanation: 'This sign indicates the beginning of a tunnel.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-5.png',
    imageHint: 'tunnel'
  },
  {
    id: 'q-park-lane-6',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-6o1', text: 'End of tunnel' },
      { id: 'q-park-lane-6o2', text: 'Tunnel ahead' },
      { id: 'q-park-lane-6o3', text: 'Tunnel junction' }
    ],
    correctAnswerId: 'q-park-lane-6o1',
    explanation: 'This sign indicates the end of a tunnel section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-6.png',
    imageHint: 'end tunnel'
  },
  {
    id: 'q-park-lane-7',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-7o1', text: 'Bridge' },
      { id: 'q-park-lane-7o2', text: 'Tunnel' },
      { id: 'q-park-lane-7o3', text: 'Underpass' }
    ],
    correctAnswerId: 'q-park-lane-7o1',
    explanation: 'This sign indicates the beginning of a bridge.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-7.png',
    imageHint: 'bridge'
  },
  {
    id: 'q-park-lane-8',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-8o1', text: 'End of bridge' },
      { id: 'q-park-lane-8o2', text: 'Bridge ahead' },
      { id: 'q-park-lane-8o3', text: 'Bridge junction' }
    ],
    correctAnswerId: 'q-park-lane-8o1',
    explanation: 'This sign indicates the end of a bridge section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-8.png',
    imageHint: 'end bridge'
  },
  {
    id: 'q-park-lane-9',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-9o1', text: 'Underpass' },
      { id: 'q-park-lane-9o2', text: 'Tunnel' },
      { id: 'q-park-lane-9o3', text: 'Bridge' }
    ],
    correctAnswerId: 'q-park-lane-9o1',
    explanation: 'This sign indicates the beginning of an underpass.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-9.png',
    imageHint: 'underpass'
  },
  {
    id: 'q-park-lane-10',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-park-lane-10o1', text: 'End of underpass' },
      { id: 'q-park-lane-10o2', text: 'Underpass ahead' },
      { id: 'q-park-lane-10o3', text: 'Underpass junction' }
    ],
    correctAnswerId: 'q-park-lane-10o1',
    explanation: 'This sign indicates the end of an underpass section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-park-lane-10.png',
    imageHint: 'end underpass'
  }
]; 