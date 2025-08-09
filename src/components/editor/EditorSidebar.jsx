/**
 * Main editor sidebar with content forms
 * Provides tabbed interface with accordion sections for editing resume content
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { HeaderSection } from './sections/HeaderSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { ThemePanel } from './ThemePanel';

/**
 * Accordion component for collapsible sections
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {boolean} props.isOpen - Whether section is open
 * @param {function} props.onToggle - Toggle callback
 * @param {React.ReactNode} props.children - Section content
 */
function AccordionSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
        aria-expanded={isOpen}
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 p-4">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * EditorSidebar component with tabbed content sections
 */
export function EditorSidebar() {
  const [activeTab, setActiveTab] = useState('content');
  const [accordionState, setAccordionState] = useState({
    header: true,
    summary: true,
    experience: true,
    education: false,
  });

  const toggleAccordion = (section) => {
    setAccordionState(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'theme', label: 'Theme' },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && (
          <div className="p-4 space-y-4">
            {/* Header Section */}
            <AccordionSection
              title="Personal Information"
              isOpen={accordionState.header}
              onToggle={() => toggleAccordion('header')}
            >
              <HeaderSection />
            </AccordionSection>

            {/* Summary Section */}
            <AccordionSection
              title="Professional Summary"
              isOpen={accordionState.summary}
              onToggle={() => toggleAccordion('summary')}
            >
              <SummarySection />
            </AccordionSection>

            {/* Experience Section */}
            <AccordionSection
              title="Work Experience"
              isOpen={accordionState.experience}
              onToggle={() => toggleAccordion('experience')}
            >
              <ExperienceSection />
            </AccordionSection>

            {/* Education Section */}
            <AccordionSection
              title="Education"
              isOpen={accordionState.education}
              onToggle={() => toggleAccordion('education')}
            >
              <EducationSection />
            </AccordionSection>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="p-4">
            <ThemePanel />
          </div>
        )}
      </div>
    </div>
  );
}
