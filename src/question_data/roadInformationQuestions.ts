import type { Question } from '../types';

export const roadInformationQuestions: Question[] = [
  {
    id: 'q-road-1',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-1o1', text: 'Motorway' },
      { id: 'q-road-1o2', text: 'Expressway' },
      { id: 'q-road-1o3', text: 'Highway' }
    ],
    correctAnswerId: 'q-road-1o1',
    explanation: 'This sign indicates the beginning of a motorway, which has specific rules and restrictions.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-1.png',
    imageHint: 'motorway'
  },
  {
    id: 'q-road-2',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-2o1', text: 'End of motorway' },
      { id: 'q-road-2o2', text: 'Motorway ahead' },
      { id: 'q-road-2o3', text: 'Motorway junction' }
    ],
    correctAnswerId: 'q-road-2o1',
    explanation: 'This sign indicates the end of a motorway section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-2.png',
    imageHint: 'end motorway'
  },
  {
    id: 'q-road-3',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-3o1', text: 'Expressway' },
      { id: 'q-road-3o2', text: 'Highway' },
      { id: 'q-road-3o3', text: 'Main road' }
    ],
    correctAnswerId: 'q-road-3o1',
    explanation: 'This sign indicates the beginning of an expressway, which has specific rules and restrictions.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-3.png',
    imageHint: 'expressway'
  },
  {
    id: 'q-road-4',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-4o1', text: 'End of expressway' },
      { id: 'q-road-4o2', text: 'Expressway ahead' },
      { id: 'q-road-4o3', text: 'Expressway junction' }
    ],
    correctAnswerId: 'q-road-4o1',
    explanation: 'This sign indicates the end of an expressway section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-4.png',
    imageHint: 'end expressway'
  },
  {
    id: 'q-road-5',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-5o1', text: 'Tunnel' },
      { id: 'q-road-5o2', text: 'Bridge' },
      { id: 'q-road-5o3', text: 'Underpass' }
    ],
    correctAnswerId: 'q-road-5o1',
    explanation: 'This sign indicates the beginning of a tunnel.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-5.png',
    imageHint: 'tunnel'
  },
  {
    id: 'q-road-6',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-6o1', text: 'End of tunnel' },
      { id: 'q-road-6o2', text: 'Tunnel ahead' },
      { id: 'q-road-6o3', text: 'Tunnel junction' }
    ],
    correctAnswerId: 'q-road-6o1',
    explanation: 'This sign indicates the end of a tunnel section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-6.png',
    imageHint: 'end tunnel'
  },
  {
    id: 'q-road-7',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-7o1', text: 'Bridge' },
      { id: 'q-road-7o2', text: 'Tunnel' },
      { id: 'q-road-7o3', text: 'Underpass' }
    ],
    correctAnswerId: 'q-road-7o1',
    explanation: 'This sign indicates the beginning of a bridge.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-7.png',
    imageHint: 'bridge'
  },
  {
    id: 'q-road-8',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-8o1', text: 'End of bridge' },
      { id: 'q-road-8o2', text: 'Bridge ahead' },
      { id: 'q-road-8o3', text: 'Bridge junction' }
    ],
    correctAnswerId: 'q-road-8o1',
    explanation: 'This sign indicates the end of a bridge section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-8.png',
    imageHint: 'end bridge'
  },
  {
    id: 'q-road-9',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-9o1', text: 'Underpass' },
      { id: 'q-road-9o2', text: 'Tunnel' },
      { id: 'q-road-9o3', text: 'Bridge' }
    ],
    correctAnswerId: 'q-road-9o1',
    explanation: 'This sign indicates the beginning of an underpass.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-9.png',
    imageHint: 'underpass'
  },
  {
    id: 'q-road-10',
    text: 'Identify the road sign:',
    options: [
      { id: 'q-road-10o1', text: 'End of underpass' },
      { id: 'q-road-10o2', text: 'Underpass ahead' },
      { id: 'q-road-10o3', text: 'Underpass junction' }
    ],
    correctAnswerId: 'q-road-10o1',
    explanation: 'This sign indicates the end of an underpass section.',
    subject: 'Road Information',
    imageUrl: '/images/signs/road information/q-road-10.png',
    imageHint: 'end underpass'
  }
]; 