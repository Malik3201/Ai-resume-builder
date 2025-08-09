/**
 * Main App component - AI Resume Builder application
 * Handles routing between main editor and print pages
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { PreviewCanvas } from './components/preview/PreviewCanvas';
import { PrintPage } from './pages/print/[id]';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main editor route */}
        <Route 
          path="/" 
          element={
            <AppShell>
              <PreviewCanvas />
            </AppShell>
          } 
        />
        
        {/* Print page route for PDF generation */}
        <Route path="/print/:id" element={<PrintPage />} />
      </Routes>
    </Router>
  );
}

export default App;
