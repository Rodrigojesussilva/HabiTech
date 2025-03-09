import React, { useState } from 'react';
import { updateThemeColor, applyThemeColors } from '@/lib/theme-utils';
import themeConfig from '@/lib/theme-config.json';
import { Button } from '@/components/ui/button';

const ThemeEditor: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<'lightTheme' | 'redTheme'>('lightTheme');
  const [colorValues, setColorValues] = useState(themeConfig[selectedTheme]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = e.target.value as 'lightTheme' | 'redTheme';
    setSelectedTheme(theme);
    setColorValues(themeConfig[theme]);
    applyThemeColors(theme);

    // Add or remove dark class based on theme
    if (theme === 'redTheme') {
      document.documentElement.classList.add('red');
    } else {
      document.documentElement.classList.remove('red');
    }
  };

  const handleColorChange = (key: string, value: string) => {
    setColorValues({
      ...colorValues,
      [key]: value
    });

    updateThemeColor(
      selectedTheme,
      key as any,
      value
    );
  };

  return (
    <div className="p-8 border rounded-lg shadow-sm bg-background">
      <h2 className="text-xl font-bold mb-4">Theme Editor</h2>

      {/* Sample UI elements to preview theme changes */}
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
            <option value="lightTheme">Light Theme</option>
            <option value="redTheme">Red Theme</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 mb-4 p-8">
        {Object.entries(colorValues).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 items-center">
            <span className="text-sm font-medium text-left">{key}</span>
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className="p-2 border rounded-md text-right"
            />
          </div>
        ))}
      </div>


    </div>
  );
};

export default ThemeEditor; 