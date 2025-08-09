/**
 * AppShell component - Main application layout with responsive sidebar
 * Manages the overall layout structure with TopBar, Sidebar, and main content area
 * Handles mobile responsive behavior with dialog-based sidebar
 */

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

/**
 * @typedef {Object} AppShellProps
 * @property {React.ReactNode} children - Main content to render
 */

/**
 * AppShell component
 * @param {AppShellProps} props
 */
export function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* TopBar */}
      <TopBar onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Dialog */}
        <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <Dialog.Content className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden focus:outline-none">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Dialog.Close asChild>
                  <button
                    className="btn btn-ghost btn-sm"
                    aria-label="Close sidebar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>
              <div className="h-full overflow-y-auto">
                <Sidebar />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
