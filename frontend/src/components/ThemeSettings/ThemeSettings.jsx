import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../Hooks/UseTheme';

export const ThemeSettings = () => {
    const { theme, setThemeMode, getSystemTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const themeOptions = [
        {
            value: 'light',
            label: 'Claro',
            icon: <Sun className="w-4 h-4" />,
            description: 'Tema claro'
        },
        {
            value: 'dark',
            label: 'Oscuro',
            icon: <Moon className="w-4 h-4" />,
            description: 'Tema oscuro'
        },
        {
            value: 'system',
            label: 'Sistema',
            icon: <Monitor className="w-4 h-4" />,
            description: `Automático (${getSystemTheme()})`
        }
    ];


    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) return 'system';
        return savedTheme;
    };

    const currentThemeValue = getCurrentTheme();
    const currentOption = themeOptions.find(option => option.value === currentThemeValue) || themeOptions[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (newTheme) => {
        if (newTheme === 'system') {
            localStorage.removeItem('theme');
            const systemTheme = getSystemTheme();
            setThemeMode(systemTheme);
        } else {
            setThemeMode(newTheme);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 group"
                title="Cambiar tema"
            >
                <span className="group-hover:scale-110 transition-transform duration-200">
                    {currentOption.icon}
                </span>
                <span className="hidden sm:block text-sm font-medium">
                    {currentOption.label}
                </span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Apariencia
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Personaliza cómo se ve la aplicación
                        </p>
                    </div>

                    {themeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleThemeChange(option.value)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentThemeValue === option.value
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span className={`${currentThemeValue === option.value
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {option.icon}
                            </span>

                            <div className="flex-1">
                                <div className="text-sm font-medium">
                                    {option.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {option.description}
                                </div>
                            </div>

                            {currentThemeValue === option.value && (
                                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            )}
                        </button>
                    ))}

                    <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            El tema se aplicará a toda la aplicación y se recordará tu preferencia.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const SimpleThemeToggle = () => {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-white hover:text-blue-100 dark:hover:text-gray-300 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 group"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            <span className="group-hover:scale-110 transition-transform duration-200">
                {isDark ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5" />
                )}
            </span>
        </button>
    );
};