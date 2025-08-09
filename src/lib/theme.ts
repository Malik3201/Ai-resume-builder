/**
 * Theme configuration and default values for the AI Resume Builder
 * Provides centralized theme tokens and styling constants
 */

/**
 * @typedef {Object} ThemeColors
 * @property {string} primary - Primary brand color
 * @property {string} accent - Accent color for highlights
 * @property {string} muted - Muted color for secondary text
 */

/**
 * @typedef {Object} ThemeSpacing
 * @property {number} sectionY - Vertical spacing between sections (px)
 * @property {number} itemY - Vertical spacing between items (px)
 */

/**
 * @typedef {Object} ThemeLayout
 * @property {string} paper - Paper size format
 * @property {number} columns - Number of columns
 * @property {number} gutter - Gutter spacing (px)
 * @property {boolean} showIcons - Whether to show icons
 */

/**
 * @typedef {Object} Theme
 * @property {string} fontFamily - Default font family
 * @property {number} fontScale - Font scale multiplier
 * @property {ThemeColors} colors - Color tokens
 * @property {ThemeSpacing} spacing - Spacing tokens
 * @property {ThemeLayout} layout - Layout configuration
 */

/** @type {Theme} */
export const defaultTheme = {
  fontFamily: 'Inter, ui-sans-serif, system-ui',
  fontScale: 1,
  colors: {
    primary: 'hsl(var(--brand))',
    accent: 'hsl(var(--accent))',
    muted: 'hsl(var(--muted))',
  },
  spacing: {
    sectionY: 20,
    itemY: 8,
  },
  layout: {
    paper: 'A4',
    columns: 1,
    gutter: 24,
    showIcons: false,
  },
};

/**
 * Zoom levels for the preview canvas
 */
export const ZOOM_LEVELS = [0.75, 1, 1.25] as const;

/**
 * @typedef {typeof ZOOM_LEVELS[number]} ZoomLevel
 */

/**
 * Default zoom level index
 */
export const DEFAULT_ZOOM_INDEX = 1; // 100%
