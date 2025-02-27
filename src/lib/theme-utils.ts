import themeConfig from './theme-config.json';

type ThemeType = 'lightTheme' | 'darkTheme';

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
 * Applies theme colors from the configuration to CSS variables
 * @param theme The theme to apply ('lightTheme' or 'darkTheme')
 */
export const applyThemeColors = (theme: ThemeType = 'lightTheme'): void => {
  const colors = themeConfig[theme] as ThemeColors;
  const root = document.documentElement;

  // Apply main colors
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-foreground', colors.primaryForeground);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--secondary-foreground', colors.secondaryForeground);

  // Apply sidebar colors
  root.style.setProperty('--sidebar', colors.sidebar);
  root.style.setProperty('--sidebar-foreground', colors.sidebarForeground);
  root.style.setProperty('--sidebar-primary', colors.sidebarPrimary);
  root.style.setProperty('--sidebar-primary-foreground', colors.sidebarPrimaryForeground);
};

/**
 * Updates specific theme color in the configuration
 * @param theme The theme to update ('lightTheme' or 'darkTheme')
 * @param colorKey The color key to update
 * @param colorValue The new color value
 */
export const updateThemeColor = (
  theme: ThemeType,
  colorKey: keyof ThemeColors,
  colorValue: string
): void => {
  if (themeConfig[theme] && colorKey in themeConfig[theme]) {
    // This is just for runtime updates - would need to be persisted separately
    (themeConfig[theme] as ThemeColors)[colorKey] = colorValue;
    
    // Apply the updated theme
    applyThemeColors(theme);
  }
};

/**
 * Initialize theme from config
 * Automatically detects dark mode preference
 */
export const initializeTheme = (): void => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme: ThemeType = prefersDark ? 'darkTheme' : 'lightTheme';
  
  applyThemeColors(theme);
  
  // Add dark class to body if using dark theme
  if (theme === 'darkTheme') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}; 