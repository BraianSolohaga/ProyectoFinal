import { Link, useLocation } from "react-router-dom";
import { Plus, User, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../Hooks/UseAuth";
import { useTheme } from "../../hooks/useTheme";

export const Navbar = () => {
    const { user, logout, isLoading } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: "/books", label: "Libros" },
        { path: "/favorites", label: "Favoritos" }
    ];

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-gray-800 dark:to-gray-900 shadow-lg px-4 py-4 transition-colors duration-200">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold text-white hover:text-blue-100 dark:hover:text-gray-300 transition-colors"
                >
                    Mi Biblioteca
                </Link>
                <div className="hidden md:flex items-center space-x-6">

                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-white hover:text-blue-100 dark:hover:text-gray-300 font-medium transition-colors ${isActive(link.path) ? 'text-blue-100 dark:text-gray-300 underline' : ''
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

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

                    {user ? (
                        <div className="flex items-center space-x-4">

                            <Link
                                to="/books/create"
                                className="flex items-center gap-2 bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Crear Libro
                            </Link>

                            <div className="flex items-center gap-2 text-blue-100 dark:text-gray-300">
                                <User className="w-4 h-4" />
                                <span className="font-medium">
                                    {user.name || user.email}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                disabled={isLoading}
                                className={`flex items-center gap-2 bg-red-500 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <LogOut className="w-4 h-4" />
                                {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="text-white hover:text-blue-100 dark:hover:text-gray-300 font-medium transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Registrar
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white border-opacity-20 dark:border-gray-600 pt-4 mt-4">
                    <div className="space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors ${isActive(link.path) ? 'bg-white bg-opacity-20' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                            {isDark ? (
                                <>
                                    <Sun className="w-4 h-4" />
                                    Modo claro
                                </>
                            ) : (
                                <>
                                    <Moon className="w-4 h-4" />
                                    Modo oscuro
                                </>
                            )}
                        </button>

                        {user ? (
                            <div className="pt-2 border-t border-white border-opacity-20 dark:border-gray-600 mt-4">
                                <Link
                                    to="/books/create"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-white bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors mb-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Crear Libro
                                </Link>
                                <div className="flex items-center gap-2 px-4 py-2 text-blue-100 dark:text-gray-300">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">
                                        {user.name || user.email}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                    className={`flex items-center gap-3 px-4 py-3 w-full text-left text-white bg-red-500 bg-opacity-80 rounded-lg hover:bg-opacity-100 transition-colors mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <LogOut className="w-4 h-4" />
                                    {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
                                </button>
                            </div>
                        ) : (
                            <div className="pt-2 border-t border-white border-opacity-20 dark:border-gray-600 mt-4 space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 bg-white text-blue-600 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors font-medium"
                                >
                                    Registrar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};