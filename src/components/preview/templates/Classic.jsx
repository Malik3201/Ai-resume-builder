/**
 * Classic resume template - Single-column layout with generous whitespace
 * Professional design with all-caps section headings and subtle typography
 */

import { formatDateRange, formatContactLine } from '../../../lib/utils/format';

/**
 * Classic template component
 * @param {Object} props
 * @param {import('../../../lib/schema/resume').ResumeDoc} props.doc - Resume document
 */
export function Classic({ doc }) {
  // Helper functions to get sections and blocks
  const getSection = (type) => doc.sections.find(s => s.type === type);
  const getBlock = (section, type) => section?.blocks.find(b => b.type === type);

  const headerSection = getSection('header');
  const headerBlock = getBlock(headerSection, 'header');
  const summarySection = getSection('summary');
  const summaryBlock = getBlock(summarySection, 'summary');
  const experienceSection = getSection('experience');
  const skillsSection = getSection('skills');
  const skillsBlock = getBlock(skillsSection, 'skills');

  const theme = doc.theme || {};
  const fontScale = theme.fontScale || 1;

  return (
    <div 
      className="font-serif text-gray-900 leading-relaxed" 
      style={{ 
        fontFamily: `var(--font-family, ${theme.fontFamily})`,
        lineHeight: `var(--line-height, ${theme.lineHeight || 1.5})`,
      }}
    >
      {/* Header */}
      {headerBlock && (
        <header className="text-center avoid-break" style={{ marginBottom: `${theme.spacing?.sectionY || 20}px` }}>
          <h1 
            className="font-bold text-gray-900 mb-2 tracking-wide"
            style={{ fontSize: `calc(2.25rem * var(--font-scale, ${fontScale}))` }}
          >
            {headerBlock.fields.name}
          </h1>
          {headerBlock.fields.title && (
            <p 
              className="text-gray-700 mb-3 font-medium"
              style={{ fontSize: `calc(1.125rem * var(--font-scale, ${fontScale}))` }}
            >
              {headerBlock.fields.title}
            </p>
          )}
          <p 
            className="text-gray-600"
            style={{ fontSize: `calc(0.875rem * var(--font-scale, ${fontScale}))` }}
          >
            {formatContactLine(headerBlock.fields)}
          </p>
        </header>
      )}

      {/* Summary */}
      {summaryBlock && summaryBlock.fields.content && (
        <section className="avoid-break" style={{ marginBottom: `${theme.spacing?.sectionY || 20}px` }}>
          <h2 
            className="text-gray-900 font-semibold mb-3 uppercase tracking-widest pb-1"
            style={{ 
              fontSize: `calc(1rem * var(--font-scale, ${fontScale}))`,
              borderBottomColor: `var(--accent, ${theme.colors?.accent || 'hsl(221 83% 53%)'})`,
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid'
            }}
          >
            Professional Summary
          </h2>
          <p 
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: `calc(0.875rem * var(--font-scale, ${fontScale}))` }}
          >
            {summaryBlock.fields.content}
          </p>
        </section>
      )}

      {/* Experience */}
      {experienceSection && experienceSection.blocks.length > 0 && (
        <section className="mb-8">
          <h2 
            className="text-gray-900 font-semibold mb-4 uppercase tracking-widest border-b border-gray-300 pb-1 avoid-break"
            style={{ fontSize: `${1 * fontScale}rem` }}
          >
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experienceSection.blocks.map((block, index) => (
              <div key={block.id} className={index === 0 ? 'avoid-break' : ''}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 
                      className="font-semibold text-gray-900"
                      style={{ fontSize: `${1 * fontScale}rem` }}
                    >
                      {block.fields.role}
                    </h3>
                    <p 
                      className="text-gray-700 font-medium"
                      style={{ fontSize: `${0.875 * fontScale}rem` }}
                    >
                      {block.fields.company}
                      {block.fields.location && ` • ${block.fields.location}`}
                    </p>
                  </div>
                  <p 
                    className="text-gray-600 text-right ml-4 flex-shrink-0"
                    style={{ fontSize: `${0.875 * fontScale}rem` }}
                  >
                    {formatDateRange(block.fields.startDate, block.fields.endDate)}
                  </p>
                </div>
                {block.fields.highlights && block.fields.highlights.length > 0 && (
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {block.fields.highlights.map((highlight, idx) => (
                      <li 
                        key={idx}
                        style={{ fontSize: `${0.875 * fontScale}rem` }}
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsBlock && skillsBlock.fields.items && skillsBlock.fields.items.length > 0 && (
        <section className="mb-8 avoid-break">
          <h2 
            className="text-gray-900 font-semibold mb-3 uppercase tracking-widest border-b border-gray-300 pb-1"
            style={{ fontSize: `${1 * fontScale}rem` }}
          >
            Technical Skills
          </h2>
          <div className="space-y-2">
            {skillsBlock.fields.items.map((item, index) => (
              <div key={index}>
                <span 
                  className="font-medium text-gray-900 mr-2"
                  style={{ fontSize: `${0.875 * fontScale}rem` }}
                >
                  {item.category}:
                </span>
                <span 
                  className="text-gray-700"
                  style={{ fontSize: `${0.875 * fontScale}rem` }}
                >
                  {item.skills}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education (if exists) */}
      {(() => {
        const educationSection = getSection('education');
        if (!educationSection || educationSection.blocks.length === 0) return null;
        
        return (
          <section className="mb-8 avoid-break">
            <h2 
              className="text-gray-900 font-semibold mb-3 uppercase tracking-widest border-b border-gray-300 pb-1"
              style={{ fontSize: `${1 * fontScale}rem` }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {educationSection.blocks.map(block => (
                <div key={block.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 
                      className="font-semibold text-gray-900"
                      style={{ fontSize: `${0.875 * fontScale}rem` }}
                    >
                      {block.fields.degree}
                    </h3>
                    <p 
                      className="text-gray-700"
                      style={{ fontSize: `${0.875 * fontScale}rem` }}
                    >
                      {block.fields.school}
                    </p>
                  </div>
                  <p 
                    className="text-gray-600 text-right ml-4 flex-shrink-0"
                    style={{ fontSize: `${0.875 * fontScale}rem` }}
                  >
                    {formatDateRange(block.fields.startDate, block.fields.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
