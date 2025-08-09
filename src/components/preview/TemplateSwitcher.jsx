/**
 * Template switcher component for selecting resume templates
 * Provides a dropdown with radio options for Classic and Modern templates
 */

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Check } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

const TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'Single-column, traditional layout' },
  { id: 'modern', name: 'Modern', description: 'Two-column with accent colors' },
];

/**
 * TemplateSwitcher component
 */
export function TemplateSwitcher() {
  const [open, setOpen] = useState(false);
  const template = useEditorStore(state => state.template);
  const setTemplate = useEditorStore(state => state.setTemplate);

  const currentTemplate = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];

  const handleTemplateChange = (templateId) => {
    setTemplate(templateId);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="btn btn-secondary btn-md flex items-center gap-2"
          aria-label="Select template"
        >
          <span className="font-medium">{currentTemplate.name}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[240px] z-50"
          align="end"
          sideOffset={8}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
              Choose Template
            </div>
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleTemplateChange(tmpl.id)}
                className={`w-full flex items-start gap-3 px-3 py-2 text-left rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset ${
                  template === tmpl.id ? 'bg-accent/10' : ''
                }`}
                role="radio"
                aria-checked={template === tmpl.id}
              >
                <div className="flex items-center justify-center w-4 h-4 mt-0.5 flex-shrink-0">
                  {template === tmpl.id && (
                    <Check className="h-3 w-3 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">
                    {tmpl.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {tmpl.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
