import React, { useState, useEffect } from 'react';
import { updateThemeColor, applyThemeColors } from '@/lib/theme-utils';
import themeConfig from '@/lib/theme-config.json';
import { Button } from '@/components/ui/button';

const ThemeEditor: React.FC = () => {
  // Get theme names dynamically from the config
  const themeNames = Object.keys(themeConfig) as Array<keyof typeof themeConfig>;
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themeConfig>(
    'lightTheme' // Default theme
  );
  const [colorValues, setColorValues] = useState(themeConfig[selectedTheme]);

  // Apply theme when component mounts
  useEffect(() => {
    applyThemeColors(selectedTheme);
  }, []);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = e.target.value as keyof typeof themeConfig;
    setSelectedTheme(theme);
    setColorValues(themeConfig[theme]);
    applyThemeColors(theme);

    // Update document class for styling
    document.documentElement.classList.remove(...themeNames);
    document.documentElement.classList.add(theme);
  };

  const handleColorChange = (key: string, value: string) => {
    // Update local state
    setColorValues({
      ...colorValues,
      [key]: value
    });

    // Update the theme color in the DOM
    updateThemeColor(selectedTheme, key as keyof typeof colorValues, value);
    
    // Also apply CSS variable directly for immediate feedback
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  // Format a color key to a display name (camelCase to Title Case with spaces)
  const formatColorName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="p-8 border rounded-lg shadow-sm bg-background">
      <h2 className="text-xl font-bold mb-4">Theme Editor</h2>

      {/* Preview UI elements */}
      <div className="p-4 border rounded-lg mb-4">
        <h3 className="text-lg font-medium mb-2">Preview</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
        <div className="w-full h-16 bg-sidebar flex items-center justify-center text-sidebar-foreground">
          Sidebar Background
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Select Theme
          <select
            value={selectedTheme}
            onChange={handleThemeChange}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            {/* Dynamically generate options from theme config */}
            {themeNames.map(themeName => (
              <option key={themeName} value={themeName}>
                {/* Format theme name for display (e.g., "lightTheme" -> "Light Theme") */}
                {themeName.replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .replace(/Theme$/, ' Theme')}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 mb-4 p-4">
        {Object.entries(colorValues).map(([key, value]) => (
          <div key={key} className="grid grid-cols-[1fr,150px,80px] gap-4 items-center">
            <span className="text-sm font-medium">{formatColorName(key)}</span>
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className="p-2 border rounded-md text-right"
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value as string}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="w-8 h-8 border cursor-pointer"
              />
              <div
                className="w-8 h-8 border"
                style={{ backgroundColor: value as string }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeEditor; 