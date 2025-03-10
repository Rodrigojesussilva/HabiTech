import themeConfig from './theme-config.json';

// Change from hard-coded to dynamically generated from theme config
type ThemeType = keyof typeof themeConfig;

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
}

/**
 * Applies theme colors from the configuration to CSS variables.
 * @param theme The theme to apply.
 */
export const applyThemeColors = (theme: ThemeType = 'lightTheme'): void => {
  const colors = themeConfig[theme] as ThemeColors;
  const root = document.documentElement;

  if (!colors) {
    console.warn(`Theme "${theme}" not found. Falling back to default theme.`);
    return;
  }

  // Apply CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value as string);
  });
};

/**
 * Updates a specific color in a theme.
 * @param theme The theme to update.
 * @param colorKey The color key to update.
 * @param colorValue The new color value.
 */
export const updateThemeColor = (
  theme: ThemeType,
  colorKey: keyof ThemeColors,
  colorValue: string
): void => {
  if (themeConfig[theme]) {
    // Update the color in the current document
    document.documentElement.style.setProperty(`--${colorKey}`, colorValue);
    
    // Apply the updated theme
    applyThemeColors(theme);
  }
};

/**
 * Initialize theme from config
 * Automatically selects the appropriate theme or uses default
 */
export const initializeTheme = (): void => {
  // Get available themes and use a default
  const availableThemes = Object.keys(themeConfig) as ThemeType[];
  const defaultTheme: ThemeType = 'lightTheme';
  
  // Apply the theme
  applyThemeColors(defaultTheme);
  
  // Remove all theme classes then add the active one
  document.documentElement.classList.remove(...availableThemes);
  document.documentElement.classList.add(defaultTheme);
}; 