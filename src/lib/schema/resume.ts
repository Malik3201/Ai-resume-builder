/**
 * Resume document schema and sample data
 * Defines the structure for resume documents with themes, sections, and blocks
 */

import { defaultTheme } from '../theme';

/**
 * @typedef {Object} Theme
 * @property {string} fontFamily - Font family for the resume
 * @property {number} fontScale - Scale factor for font sizes
 * @property {Object} colors - Color scheme
 * @property {string} colors.primary - Primary color
 * @property {string} colors.accent - Accent color
 * @property {string} colors.muted - Muted color
 * @property {Object} spacing - Spacing configuration
 * @property {number} spacing.sectionY - Vertical spacing between sections
 * @property {number} spacing.itemY - Vertical spacing between items
 * @property {Object} layout - Layout configuration
 * @property {'A4'|'Letter'} layout.paper - Paper size
 * @property {1|2} layout.columns - Number of columns
 * @property {number} layout.gutter - Gutter spacing
 * @property {boolean} layout.showIcons - Whether to show icons
 */

/**
 * @typedef {Object} Block
 * @property {string} id - Unique identifier
 * @property {string} type - Block type (header, summary, experience, etc.)
 * @property {Record<string, any>} fields - Block data fields
 */

/**
 * @typedef {Object} Section
 * @property {string} id - Unique identifier
 * @property {string} type - Section type
 * @property {string} title - Section display title
 * @property {Block[]} blocks - Array of blocks in this section
 * @property {boolean} [hidden] - Whether section is hidden
 */

/**
 * @typedef {Object} ResumeDoc
 * @property {string} id - Document unique identifier
 * @property {Object} meta - Document metadata
 * @property {string} meta.title - Document title
 * @property {number} meta.createdAt - Creation timestamp
 * @property {number} meta.updatedAt - Last update timestamp
 * @property {Theme} theme - Document theme configuration
 * @property {Section[]} sections - Array of resume sections
 */

/** @type {ResumeDoc} */
export const sampleResume = {
  id: 'sample_resume_001',
  meta: {
    title: 'John Anderson Resume',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  theme: defaultTheme,
  sections: [
    {
      id: 'header_section',
      type: 'header',
      title: 'Header',
      blocks: [
        {
          id: 'header_block_001',
          type: 'header',
          fields: {
            name: 'John Anderson',
            title: 'Senior Software Engineer',
            email: 'john.anderson@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'linkedin.com/in/johnanderson',
            website: '',
          },
        },
      ],
    },
    {
      id: 'summary_section',
      type: 'summary',
      title: 'Professional Summary',
      blocks: [
        {
          id: 'summary_block_001',
          type: 'summary',
          fields: {
            content: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions that drive business growth and improve user experience. Passionate about mentoring junior developers and implementing best practices in agile environments.',
          },
        },
      ],
    },
    {
      id: 'experience_section',
      type: 'experience',
      title: 'Professional Experience',
      blocks: [
        {
          id: 'experience_block_001',
          type: 'experience',
          fields: {
            role: 'Senior Software Engineer',
            company: 'TechCorp Solutions',
            location: 'San Francisco, CA',
            startDate: 'Jan 2020',
            endDate: 'Present',
            highlights: [
              'Led development of microservices architecture serving 1M+ daily active users',
              'Reduced system latency by 40% through optimization of database queries and caching strategies',
              'Mentored 5 junior developers and established code review best practices',
              'Architected and implemented CI/CD pipeline reducing deployment time by 60%',
            ],
          },
        },
      ],
    },
    {
      id: 'skills_section',
      type: 'skills',
      title: 'Technical Skills',
      blocks: [
        {
          id: 'skills_block_001',
          type: 'skills',
          fields: {
            items: [
              {
                category: 'Languages',
                skills: 'JavaScript, TypeScript, Python, Java, Go',
              },
              {
                category: 'Frameworks',
                skills: 'React, Node.js, Express, Django, Spring Boot',
              },
              {
                category: 'Databases',
                skills: 'PostgreSQL, MongoDB, Redis, Elasticsearch',
              },
              {
                category: 'Cloud & DevOps',
                skills: 'AWS, Docker, Kubernetes, Terraform, Jenkins',
              },
            ],
          },
        },
      ],
    },
  ],
};
