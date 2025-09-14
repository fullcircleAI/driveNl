# 🚗 DriveNL

A comprehensive bilingual (English/Dutch) Dutch driving theory learning application with practice tests, mock exams, progress tracking, and voice support.

## ✨ Features

- **📚 Practice Tests** - 12+ test categories covering all theory topics
- **🎯 Mock Exam** - Real exam simulation with 25 questions and 30-minute timer
- **📊 Progress Tracking** - Comprehensive analytics with weak/strong area identification
- **🌍 Bilingual Support** - Full English and Dutch translations
- **🎤 Voice Integration** - Text-to-speech and voice command support
- **📱 Mobile Optimized** - Responsive design for all devices
- **☁️ Cloud Sync** - Save progress across all devices
- **💎 Premium Features** - All features available for free

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drivenl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase (Optional - for cloud sync)**
   
   Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── PracticeTest.tsx # Practice test interface
│   ├── ProgressTracker.tsx # Progress analytics
│   └── ...
├── services/            # Business logic
│   ├── dataPersistence.ts # Cloud data management
│   ├── analytics.ts     # Progress calculations
│   └── authService.ts   # Authentication
├── config/              # Configuration files
│   └── firebase.ts      # Firebase setup
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # User authentication
│   └── LanguageContext.tsx # Language management
└── i18n/               # Internationalization
    └── strings.ts      # Bilingual strings
```

## 🔧 Data Persistence

The app supports two modes of data storage:

### **Cloud Mode (Recommended)**
- User creates an account
- Data synced across all devices
- Real-time progress updates
- Automatic backup

### **Local Mode (Fallback)**
- Anonymous usage
- Data stored in browser localStorage
- No cross-device sync
- Data lost if browser is cleared

## 🎯 Test Categories

1. **Free Test** - Introduction to theory
2. **Hazard Perception** - Recognizing dangerous situations
3. **Insight Practice** - Understanding traffic scenarios
4. **Mandatory Signs** - Required traffic signs
5. **Warning Signs** - Warning traffic signs
6. **Prohibitory Signs** - Prohibited actions
7. **Traffic Lights & Signals** - Traffic control systems
8. **Road Information** - Road markings and information
9. **Sign Identification** - Traffic sign recognition
10. **Priority Rules** - Right of way rules
11. **Mock Exam** - Full exam simulation

## 📊 Progress Analytics

- **Total Tests Completed** - Number of practice tests taken
- **Average Score** - Overall performance percentage
- **Day Streak** - Consecutive days of practice
- **Exam Readiness** - Estimated readiness for real exam
- **Weak Areas** - Topics needing improvement
- **Strong Areas** - Well-mastered topics
- **Performance Trends** - Progress over time

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

## 🔒 Privacy & Security

- User data is stored securely in Firebase
- No personal information required
- GDPR compliant data deletion
- Local-only mode available for privacy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ for Dutch driving theory students**
