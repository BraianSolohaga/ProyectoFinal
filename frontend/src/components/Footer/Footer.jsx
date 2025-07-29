
import { Heart, BookOpen, Github, Mail } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-indigo-400" />
                            <h3 className="text-xl font-bold">Mi Biblioteca Digital</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Tu plataforma favorita para descubrir, organizar y gestionar
                            tu colección personal de libros.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-white">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/books" className="text-gray-300 hover:text-indigo-400 transition-colors">
                                    Explorar Libros
                                </a>
                            </li>
                            <li>
                                <a href="/favorites" className="text-gray-300 hover:text-indigo-400 transition-colors">
                                    Mis Favoritos
                                </a>
                            </li>
                            <li>
                                <a href="/create" className="text-gray-300 hover:text-indigo-400 transition-colors">
                                    Agregar Libro
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-white">Contacto</h4>
                        <div className="flex items-center gap-4">
                            <a
                                href="mailto:contacto@mibiblioteca.com"
                                className="text-gray-300 hover:text-indigo-400 transition-colors"
                                title="Enviar email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-indigo-400 transition-colors"
                                title="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-gray-300 text-sm">
                            ¿Tienes alguna sugerencia? ¡Nos encantaría escucharte!
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-300 text-sm">
                            © {currentYear} Mi Biblioteca Digital. Todos los derechos reservados.
                        </p>

                        <div className="flex items-center gap-1 text-sm text-gray-300">
                            <span>Hecho con</span>
                            <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                            <span>para los amantes de los libros</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};