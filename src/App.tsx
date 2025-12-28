import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DiagnosticDashboard } from './pages/DiagnosticDashboard';

/**
 * App Component
 * Main application shell with React Router configuration
 * Routes: "/" for Landing, "/dashboard" for DiagnosticDashboard
 * Requirements: 1.3
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DiagnosticDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
