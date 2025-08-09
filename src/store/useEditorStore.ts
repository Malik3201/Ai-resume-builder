/**
 * Zustand store for resume editor state management
 * Handles document state, theme management, and autosave functionality
 */

import { create } from 'zustand';
import { sampleResume } from '../lib/schema/resume';
import { uid } from '../lib/utils/ids';
import { deepSet } from '../lib/utils/deepSet';

const STORAGE_KEY = 'resume_doc_v1';
const AUTOSAVE_DELAY = 500;

/**
 * @typedef {import('../lib/schema/resume').ResumeDoc} ResumeDoc
 * @typedef {import('../lib/schema/resume').Theme} Theme
 * @typedef {import('../lib/schema/resume').Block} Block
 */

/**
 * @typedef {Object} EditorState
 * @property {ResumeDoc} doc - Current resume document
 * @property {'classic'|'modern'} template - Current template style
 * @property {function(ResumeDoc|function): void} setDoc - Update document
 * @property {function(string, string, string, any): void} updateField - Update block field
 * @property {function(string, Block): void} addBlock - Add block to section
 * @property {function(string, string): void} removeBlock - Remove block from section
 * @property {function(string[]): void} reorderSections - Reorder sections
 * @property {function(Partial<Theme>): void} setTheme - Update theme
 * @property {function('classic'|'modern'): void} setTemplate - Set template
 * @property {function(): void} resetToSample - Reset to sample data
 */

/**
 * Load document from localStorage with fallback to sample
 * @returns {ResumeDoc}
 */
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate basic structure
      if (parsed && parsed.id && parsed.sections && Array.isArray(parsed.sections)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load resume from localStorage:', error);
  }
  return sampleResume;
}

/**
 * Save document to localStorage with debouncing
 */
let saveTimeout;
function saveToStorage(doc) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    } catch (error) {
      console.error('Failed to save resume to localStorage:', error);
    }
  }, AUTOSAVE_DELAY);
}

/**
 * Create the editor store
 */
export const useEditorStore = create((set, get) => ({
  doc: loadFromStorage(),
  template: 'classic',

  /**
   * Set document with updater function or direct value
   * @param {ResumeDoc|function} updater - New document or updater function
   */
  setDoc: (updater) => {
    set((state) => {
      const newDoc = typeof updater === 'function' ? updater(state.doc) : updater;
      const updatedDoc = {
        ...newDoc,
        meta: {
          ...newDoc.meta,
          updatedAt: Date.now(),
        },
      };
      saveToStorage(updatedDoc);
      return { doc: updatedDoc };
    });
  },

  /**
   * Update a specific field in a block
   * @param {string} sectionId - Section ID
   * @param {string} blockId - Block ID
   * @param {string} path - Dot-separated field path
   * @param {any} value - New value
   */
  updateField: (sectionId, blockId, path, value) => {
    const { setDoc } = get();
    setDoc((doc) => {
      const newDoc = JSON.parse(JSON.stringify(doc)); // Deep clone
      const section = newDoc.sections.find(s => s.id === sectionId);
      if (!section) {
        console.warn(`Section ${sectionId} not found`);
        return doc;
      }

      const block = section.blocks.find(b => b.id === blockId);
      if (!block) {
        console.warn(`Block ${blockId} not found in section ${sectionId}`);
        return doc;
      }

      deepSet(block.fields, path, value);
      return newDoc;
    });
  },

  /**
   * Add a new block to a section
   * @param {string} sectionId - Section ID
   * @param {Block} blockTemplate - Block template to add
   */
  addBlock: (sectionId, blockTemplate) => {
    const { setDoc } = get();
    setDoc((doc) => {
      const newDoc = JSON.parse(JSON.stringify(doc)); // Deep clone
      const section = newDoc.sections.find(s => s.id === sectionId);
      if (!section) {
        console.warn(`Section ${sectionId} not found`);
        return doc;
      }

      const newBlock = {
        ...blockTemplate,
        id: uid(blockTemplate.type),
      };
      section.blocks.push(newBlock);
      return newDoc;
    });
  },

  /**
   * Remove a block from a section
   * @param {string} sectionId - Section ID
   * @param {string} blockId - Block ID to remove
   */
  removeBlock: (sectionId, blockId) => {
    const { setDoc } = get();
    setDoc((doc) => {
      const newDoc = JSON.parse(JSON.stringify(doc)); // Deep clone
      const section = newDoc.sections.find(s => s.id === sectionId);
      if (!section) {
        console.warn(`Section ${sectionId} not found`);
        return doc;
      }

      section.blocks = section.blocks.filter(b => b.id !== blockId);
      return newDoc;
    });
  },

  /**
   * Reorder sections by ID array
   * @param {string[]} newOrderIds - Array of section IDs in new order
   */
  reorderSections: (newOrderIds) => {
    const { setDoc } = get();
    setDoc((doc) => {
      const newDoc = JSON.parse(JSON.stringify(doc)); // Deep clone
      const sectionMap = new Map(newDoc.sections.map(s => [s.id, s]));
      
      newDoc.sections = newOrderIds
        .map(id => sectionMap.get(id))
        .filter(Boolean); // Remove any missing sections

      return newDoc;
    });
  },

  /**
   * Update theme configuration
   * @param {Partial<Theme>} partialTheme - Theme updates
   */
  setTheme: (partialTheme) => {
    const { setDoc } = get();
    setDoc((doc) => ({
      ...doc,
      theme: {
        ...doc.theme,
        ...partialTheme,
        // Deep merge nested objects
        colors: {
          ...doc.theme?.colors,
          ...partialTheme.colors,
        },
        spacing: {
          ...doc.theme?.spacing,
          ...partialTheme.spacing,
        },
        layout: {
          ...doc.theme?.layout,
          ...partialTheme.layout,
        },
      },
    }));
  },

  /**
   * Set template style
   * @param {'classic'|'modern'} template - Template name
   */
  setTemplate: (template) => {
    set({ template });
  },

  /**
   * Reset to sample data and clear localStorage
   */
  resetToSample: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      doc: {
        ...sampleResume,
        id: uid('resume'),
        meta: {
          ...sampleResume.meta,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      template: 'classic',
    });
  },
}));
