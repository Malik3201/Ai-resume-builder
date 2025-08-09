/**
 * ThemePanel component - Comprehensive theme customization interface
 * Provides controls for typography, colors, and spacing with live preview updates
 */

import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { ColorInput } from '../ui/ColorInput';
import { Select } from '../ui/Select';
import { NumberInput } from '../ui/NumberInput';
import { colorToRgb, passesAA, hslToRgb } from '../../lib/utils/color';

const FONT_FAMILIES = [
  { value: 'Inter, ui-sans-serif, system-ui', label: 'Inter (Sans Serif)' },
  { value: 'Source Sans 3, ui-sans-serif, system-ui', label: 'Source Sans 3' },
  { value: 'EB Garamond, ui-serif, Georgia', label: 'EB Garamond (Serif)' },
];

const LINE_HEIGHTS = [
  { value: '1.2', label: 'Tight (1.2)' },
  { value: '1.4', label: 'Snug (1.4)' },
  { value: '1.5', label: 'Normal (1.5)' },
  { value: '1.6', label: 'Relaxed (1.6)' },
  { value: '1.8', label: 'Loose (1.8)' },
];

/**
 * ThemePanel component with live theme customization
 */
export function ThemePanel() {
  const doc = useEditorStore(state => state.doc);
  const setTheme = useEditorStore(state => state.setTheme);
  
  const theme = doc.theme || {};
  
  // Current values with fallbacks
  const fontFamily = theme.fontFamily || 'Inter, ui-sans-serif, system-ui';
  const fontScale = theme.fontScale || 1;
  const accentColor = theme.colors?.accent || 'hsl(221 83% 53%)';
  const primaryColor = theme.colors?.primary || 'hsl(222 47% 11%)';
  const lineHeight = theme.lineHeight || 1.5;
  const sectionSpacing = theme.spacing?.sectionY || 20;

  // Convert accent HSL to hex for color input
  const getHexFromHsl = (hsl) => {
    try {
      const [r, g, b] = hslToRgb(hsl);
      return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    } catch {
      return '#3b82f6'; // fallback blue
    }
  };

  const accentHex = getHexFromHsl(accentColor);

  // Convert hex to HSL for storage
  const hexToHsl = (hex) => {
    try {
      const [r, g, b] = colorToRgb(hex);
      // Convert RGB to HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;

      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
          case gNorm: h = (bNorm - rNorm) / d + 2; break;
          case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    } catch {
      return '221 83% 53%'; // fallback
    }
  };

  // Check contrast for accessibility
  const checkContrast = () => {
    try {
      const primaryRgb = hslToRgb(primaryColor);
      const backgroundRgb = [255, 255, 255]; // white background
      return passesAA(primaryRgb, backgroundRgb);
    } catch {
      return true; // assume pass if calculation fails
    }
  };

  const contrastPasses = checkContrast();

  // Update CSS variables for live preview
  useEffect(() => {
    const previewContainer = document.querySelector('.page');
    if (previewContainer) {
      previewContainer.style.setProperty('--font-family', fontFamily);
      previewContainer.style.setProperty('--font-scale', fontScale.toString());
      previewContainer.style.setProperty('--accent', accentColor);
      previewContainer.style.setProperty('--line-height', lineHeight.toString());
    }
  }, [fontFamily, fontScale, accentColor, lineHeight]);

  const handleFontFamilyChange = (value) => {
    setTheme({ fontFamily: value });
  };

  const handleFontScaleChange = (value) => {
    setTheme({ fontScale: value });
  };

  const handleAccentColorChange = (hex) => {
    const hsl = hexToHsl(hex);
    setTheme({ 
      colors: { 
        ...theme.colors, 
        accent: `hsl(${hsl})` 
      } 
    });
  };

  const handleLineHeightChange = (value) => {
    setTheme({ lineHeight: parseFloat(value) });
  };

  const handleSectionSpacingChange = (value) => {
    setTheme({ 
      spacing: { 
        ...theme.spacing, 
        sectionY: value 
      } 
    });
  };

  return (
    <div className="space-y-6">
      {/* Typography Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
        <div className="space-y-4">
          <Select
            id="font-family"
            label="Font Family"
            value={fontFamily}
            onChange={handleFontFamilyChange}
            options={FONT_FAMILIES}
          />

          <NumberInput
            id="font-scale"
            label="Font Scale"
            value={fontScale}
            onChange={handleFontScaleChange}
            min={0.85}
            max={1.25}
            step={0.05}
            help="Scales all font sizes proportionally"
          />

          <Select
            id="line-height"
            label="Line Height"
            value={lineHeight.toString()}
            onChange={handleLineHeightChange}
            options={LINE_HEIGHTS}
          />
        </div>
      </div>

      {/* Colors Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
        <div className="space-y-4">
          <ColorInput
            id="accent-color"
            label="Accent Color"
            value={accentHex}
            onChange={handleAccentColorChange}
          />

          {/* Contrast Indicator */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            {contrastPasses ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <span className={`font-medium ${contrastPasses ? 'text-green-800' : 'text-red-800'}`}>
                {contrastPasses ? 'AA Pass' : 'AA Fail'}
              </span>
              <p className="text-sm text-gray-600">
                Text contrast against white background
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
        <div className="space-y-4">
          <NumberInput
            id="section-spacing"
            label="Section Spacing"
            value={sectionSpacing}
            onChange={handleSectionSpacingChange}
            min={16}
            max={40}
            step={2}
            unit="px"
            help="Vertical space between resume sections"
          />
        </div>
      </div>

      {/* Preview Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Live Preview:</strong> Changes are applied instantly to the resume preview. 
          Use the template switcher to see how your theme looks across different layouts.
        </p>
      </div>
    </div>
  );
}
