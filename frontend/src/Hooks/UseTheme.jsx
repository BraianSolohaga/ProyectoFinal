import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeTheme = () => {
            try {
                const savedTheme = localStorage.getItem('theme');

                if (!savedTheme) {
                    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const initialTheme = systemPrefersDark ? 'dark' : 'light';
                    setTheme(initialTheme);
                    localStorage.setItem('theme', initialTheme);
                } else {
                    setTheme(savedTheme);
                }
            } catch (error) {
                console.error('Error initializing theme:', error);
                setTheme('light');
            } finally {
                setIsLoading(false);
            }
        };

        initializeTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e) => {
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
        }
    }, [theme, isLoading]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const setThemeMode = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setTheme(mode);
            localStorage.setItem('theme', mode);
        }
    };

    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const isSystemDark = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const value = {
        theme,
        toggleTheme,
        setThemeMode,
        getSystemTheme,
        isSystemDark,
        isLoading,
        isDark: theme === 'dark',
        isLight: theme === 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};