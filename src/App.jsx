/**
 * Main App component - AI Resume Builder application
 * Renders the complete application with AppShell layout and PreviewCanvas
 */

import { AppShell } from './components/layout/AppShell';
import { PreviewCanvas } from './components/preview/PreviewCanvas';

function App() {
  return (
    <AppShell>
      <PreviewCanvas />
    </AppShell>
  );
}

export default App;
