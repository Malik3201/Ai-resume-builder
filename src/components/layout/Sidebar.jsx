/**
 * Sidebar component - Left panel for content editing and theme controls
 * Contains the main editor interface for resume content
 */

import { EditorSidebar } from '../editor/EditorSidebar';

/**
 * Sidebar component with editor interface
 */
export function Sidebar() {
  return (
    <aside className="w-sidebar bg-white border-r border-gray-200 h-full">
      <EditorSidebar />
    </aside>
  );
}
