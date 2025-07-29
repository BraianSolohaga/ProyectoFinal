import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, Loader2, BookOpen, ArrowRight } from "lucide-react";
import { useAuth } from "../../Hooks/UseAuth";

export const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Por favor, completa todos los campos");
            return;
        }

        if (!formData.email.includes("@")) {
            toast.error("Por favor, ingresa un email válido");
            return;
        }

        try {
            setIsLoading(true);

            const result = await login(formData.email, formData.password);

            if (result.success) {
                toast.success("¡Bienvenido de nuevo!");
                navigate("/books");
            } else {
                toast.error(result.error || "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Iniciar Sesión
                    </h2>
                    <p className="text-gray-600">
                        Accede a tu biblioteca personal
                    </p>
                </div>
                <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Recordarme
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    <>
                                        Iniciar Sesión
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Crear cuenta
                        </Link>
                    </p>

                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-700 transition-colors">
                            Inicio
                        </Link>
                        <span>•</span>
                        <Link to="/books" className="hover:text-gray-700 transition-colors">
                            Explorar Libros
                        </Link>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-700 transition-colors">
                            Ayuda
                        </a>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-900">
                                ¿Nuevo en nuestra biblioteca?
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>
                                    Únete a nuestra comunidad y descubre miles de libros.
                                    Crea listas de favoritos y comparte tus reseñas.
                                </p>
                            </div>
                            <div className="mt-3">
                                <Link
                                    to="/register"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Crear cuenta gratuita →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};