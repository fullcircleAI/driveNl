import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Dashboard } from './components/Dashboard';
import { LanguageSelection } from './components/LanguageSelection';
import { Practice } from './components/Practice';
import { PracticeTest } from './components/PracticeTest';
import { Settings } from './components/Settings';
import { QuizSelectionPage } from './components/QuizSelectionPage';
import { MockExam } from './components/MockExam';

function App() {
  const { user } = useAuthStore();
  
  const needsLanguageSelection = user && !user.language;
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={needsLanguageSelection ? "/language" : "/dashboard"} replace />} />
        <Route path="/dashboard" element={needsLanguageSelection ? <Navigate to="/language" replace /> : <Dashboard />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/:testType" element={<PracticeTest />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/quiz-selection" element={<QuizSelectionPage />} />
        <Route path="/quiz/:quizId" element={<MockExam />} />
      </Routes>
    </Router>
  );
}

export default App;
