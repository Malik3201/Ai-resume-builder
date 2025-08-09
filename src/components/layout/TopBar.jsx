/**
 * TopBar component - Application header with title and mobile sidebar toggle
 * Displays app branding, template switcher, and mobile navigation controls
 */

import { Menu } from 'lucide-react';
import { TemplateSwitcher } from '../preview/TemplateSwitcher';

/**
 * @typedef {Object} TopBarProps
 * @property {function} onToggleSidebar - Callback to toggle sidebar visibility on mobile
 */

/**
 * TopBar component
 * @param {TopBarProps} props
 */
export function TopBar({ onToggleSidebar }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 no-print">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          {/* Mobile sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-sm lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* App title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">AR</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              AI Resume Builder
            </h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <TemplateSwitcher />
          <button className="btn btn-secondary btn-md">
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
