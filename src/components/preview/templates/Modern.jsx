/**
 * Modern resume template - Two-column layout with accent colors
 * Left sidebar with contact/skills, right column with experience
 */

import { formatDateRange, formatContactLine } from '../../../lib/utils/format';

/**
 * Modern template component
 * @param {Object} props
 * @param {import('../../../lib/schema/resume').ResumeDoc} props.doc - Resume document
 */
export function Modern({ doc }) {
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
  const accentColor = theme.colors?.accent || 'hsl(221 83% 53%)';

  return (
    <div className="text-gray-900 leading-relaxed" style={{ fontFamily: theme.fontFamily }}>
      {/* Header */}
      {headerBlock && (
        <header className="mb-6 avoid-break">
          <h1 
            className="font-bold text-gray-900 mb-2"
            style={{ fontSize: `${2.5 * fontScale}rem` }}
          >
            {headerBlock.fields.name}
          </h1>
          {headerBlock.fields.title && (
            <p 
              className="font-medium mb-3"
              style={{ 
                fontSize: `${1.25 * fontScale}rem`,
                color: accentColor
              }}
            >
              {headerBlock.fields.title}
            </p>
          )}
          <p 
            className="text-gray-600"
            style={{ fontSize: `${0.875 * fontScale}rem` }}
          >
            {formatContactLine(headerBlock.fields)}
          </p>
        </header>
      )}

      {/* Two-column layout on large screens, single column on small */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
        {/* Left Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary */}
          {summaryBlock && summaryBlock.fields.content && (
            <section className="avoid-break">
              <h2 
                className="font-semibold mb-3 pb-2 border-b-2"
                style={{ 
                  fontSize: `${1.125 * fontScale}rem`,
                  borderColor: accentColor
                }}
              >
                Summary
              </h2>
              <p 
                className="text-gray-700 leading-relaxed"
                style={{ fontSize: `${0.875 * fontScale}rem` }}
              >
                {summaryBlock.fields.content}
              </p>
            </section>
          )}

          {/* Skills */}
          {skillsBlock && skillsBlock.fields.items && skillsBlock.fields.items.length > 0 && (
            <section className="avoid-break">
              <h2 
                className="font-semibold mb-3 pb-2 border-b-2"
                style={{ 
                  fontSize: `${1.125 * fontScale}rem`,
                  borderColor: accentColor
                }}
              >
                Skills
              </h2>
              <div className="space-y-3">
                {skillsBlock.fields.items.map((item, index) => (
                  <div key={index}>
                    <h3 
                      className="font-medium text-gray-900 mb-1"
                      style={{ fontSize: `${0.875 * fontScale}rem` }}
                    >
                      {item.category}
                    </h3>
                    <p 
                      className="text-gray-700 text-sm leading-relaxed"
                      style={{ fontSize: `${0.8 * fontScale}rem` }}
                    >
                      {item.skills}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Links (if available) */}
          {headerBlock && (headerBlock.fields.linkedin || headerBlock.fields.website) && (
            <section className="avoid-break">
              <h2 
                className="font-semibold mb-3 pb-2 border-b-2"
                style={{ 
                  fontSize: `${1.125 * fontScale}rem`,
                  borderColor: accentColor
                }}
              >
                Links
              </h2>
              <div className="space-y-2">
                {headerBlock.fields.linkedin && (
                  <div>
                    <p 
                      className="text-gray-700"
                      style={{ fontSize: `${0.875 * fontScale}rem` }}
                    >
                      LinkedIn: {headerBlock.fields.linkedin}
                    </p>
                  </div>
                )}
                {headerBlock.fields.website && (
                  <div>
                    <p 
                      className="text-gray-700"
                      style={{ fontSize: `${0.875 * fontScale}rem` }}
                    >
                      Website: {headerBlock.fields.website}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience */}
          {experienceSection && experienceSection.blocks.length > 0 && (
            <section>
              <h2 
                className="font-semibold mb-4 pb-2 border-b-2 avoid-break"
                style={{ 
                  fontSize: `${1.25 * fontScale}rem`,
                  borderColor: accentColor
                }}
              >
                Experience
              </h2>
              <div className="space-y-6">
                {experienceSection.blocks.map((block, index) => (
                  <div key={block.id} className={index === 0 ? 'avoid-break' : ''}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-gray-900"
                          style={{ fontSize: `${1.125 * fontScale}rem` }}
                        >
                          {block.fields.role}
                        </h3>
                        <p 
                          className="font-medium"
                          style={{ 
                            fontSize: `${1 * fontScale}rem`,
                            color: accentColor
                          }}
                        >
                          {block.fields.company}
                        </p>
                        {block.fields.location && (
                          <p 
                            className="text-gray-600"
                            style={{ fontSize: `${0.875 * fontScale}rem` }}
                          >
                            {block.fields.location}
                          </p>
                        )}
                      </div>
                      <p 
                        className="text-gray-600 sm:text-right sm:ml-4 flex-shrink-0 mt-1 sm:mt-0"
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

          {/* Education (if exists) */}
          {(() => {
            const educationSection = getSection('education');
            if (!educationSection || educationSection.blocks.length === 0) return null;
            
            return (
              <section className="avoid-break">
                <h2 
                  className="font-semibold mb-4 pb-2 border-b-2"
                  style={{ 
                    fontSize: `${1.25 * fontScale}rem`,
                    borderColor: accentColor
                  }}
                >
                  Education
                </h2>
                <div className="space-y-4">
                  {educationSection.blocks.map(block => (
                    <div key={block.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-gray-900"
                          style={{ fontSize: `${1 * fontScale}rem` }}
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
                        className="text-gray-600 sm:text-right sm:ml-4 flex-shrink-0 mt-1 sm:mt-0"
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
      </div>
    </div>
  );
}
