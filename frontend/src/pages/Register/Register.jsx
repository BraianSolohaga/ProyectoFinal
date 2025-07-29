import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, Loader2, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../../Hooks/UseAuth";

export const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;

        if (password.length >= 8) strength += 1;
        if (/\d/.test(password)) strength += 1;

        if (/[a-z]/.test(password)) strength += 1;

        if (/[A-Z]/.test(password)) strength += 1;

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        if (passwordStrength <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Débil';
        if (passwordStrength <= 3) return 'Regular';
        if (passwordStrength <= 4) return 'Buena';
        return 'Muy fuerte';
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("El nombre es requerido");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("El email es requerido");
            return false;
        }

        if (!formData.email.includes("@")) {
            toast.error("Por favor, ingresa un email válido");
            return false;
        }

        if (!formData.password) {
            toast.error("La contraseña es requerida");
            return false;
        }

        if (formData.password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsLoading(true);

            const userData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };

            const result = await register(userData);

            if (result.success) {
                toast.success("¡Te has registrado con éxito!");

                if (result.requiresLogin) {
                    navigate("/login");
                } else {
                    navigate("/books");
                }
            } else {
                toast.error(result.error || "Error al registrarse");
            }
        } catch (error) {
            console.error("Register error:", error);
            toast.error("Error al crear la cuenta. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-emerald-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Crear Cuenta
                    </h2>
                    <p className="text-gray-600">
                        Únete a nuestra biblioteca digital
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400"
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                        </div>

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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400"
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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400"
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
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-600">
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && (
                                <div className="mt-2 flex items-center space-x-2">
                                    {formData.password === formData.confirmPassword ? (
                                        <div className="flex items-center text-emerald-600 text-sm">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Las contraseñas coinciden
                                        </div>
                                    ) : (
                                        <div className="text-red-600 text-sm">
                                            Las contraseñas no coinciden
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                Acepto los{" "}
                                <a href="#" className="text-emerald-600 hover:text-emerald-500">
                                    términos y condiciones
                                </a>
                            </label>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    <>
                                        Crear Cuenta
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-emerald-600 hover:text-emerald-500"
                        >
                            Iniciar sesión
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
                <div className="mt-8 bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-emerald-900">
                                Beneficios de crear una cuenta
                            </h3>
                            <div className="mt-2 text-sm text-emerald-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Guarda tus libros favoritos</li>
                                    <li>Crea y gestiona tu biblioteca personal</li>
                                    <li>Agrega nuevos libros a la colección</li>
                                    <li>Acceso completo a todas las funciones</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};