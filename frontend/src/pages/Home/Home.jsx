import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BiBook, BiHeart, BiUser, BiUserPlus, BiSearch } from 'react-icons/bi';

export const Home = () => {
    const features = [
        {
            icon: <BiBook className="w-8 h-8" />,
            title: "Explora Libros",
            description: "Descubre una amplia colección de libros",
            link: "/books",
            color: "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
        },
        {
            icon: <BiHeart className="w-8 h-8" />,
            title: "Tus Favoritos",
            description: "Guarda y organiza tus libros preferidos",
            link: "/favorites",
            color: "bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/30"
        },
        {
            icon: <BiUser className="w-8 h-8" />,
            title: "Iniciar Sesión",
            description: "Accede a tu cuenta personal",
            link: "/login",
            color: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
        },
        {
            icon: <BiUserPlus className="w-8 h-8" />,
            title: "Únete",
            description: "Crea tu cuenta y comienza",
            link: "/register",
            color: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30"
        }
    ];

    const stats = [
        { number: "1000+", label: "Libros disponibles" },
        { number: "500+", label: "Usuarios activos" },
        { number: "50+", label: "Géneros diferentes" }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <motion.section
                className="px-6 py-20 max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="text-center mb-16">
                    <motion.h1
                        className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-6 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        My Book App
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Descubre, organiza y gestiona tu biblioteca personal.
                        Una experiencia minimalista para los amantes de los libros.
                    </motion.p>
                </div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-light text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + (index * 0.1), duration: 0.6 }}
                            whileHover={{ y: -4 }}
                        >
                            <Link
                                to={feature.link}
                                className={`block p-6 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 ${feature.color} group`}
                            >
                                <div className="text-gray-700 dark:text-gray-300 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-200">
                                    {feature.description}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            <motion.section
                className="px-6 py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-6 transition-colors duration-200">
                        Comienza tu viaje literario
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto transition-colors duration-200">
                        Únete a nuestra comunidad de lectores y descubre tu próxima gran lectura.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/books"
                            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
                        >
                            <BiSearch className="w-5 h-5" />
                            Explorar Libros
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                            <BiUserPlus className="w-5 h-5" />
                            Crear Cuenta
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}