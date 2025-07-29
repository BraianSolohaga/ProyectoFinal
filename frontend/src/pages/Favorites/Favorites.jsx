import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, BookOpen, Loader2, AlertCircle, LogIn } from "lucide-react";
import { BookCard } from "../../components/BookCard/BookCard";
import { useAuth } from "../../Hooks/UseAuth";
import { Api } from "../../service/Api";

export const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, token } = useAuth();

    useEffect(() => {
        if (user && token) {
            fetchFavorites();
        } else {
            setIsLoading(false);
        }
    }, [user, token]);

    const fetchFavorites = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await Api.getFavoritesByUserId(user.id);
            if (response?.data && Array.isArray(response.data)) {
                setFavorites(response.data);
            } else {
                console.warn('Favorites response is not an array:', response);
                setFavorites([]);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            setError("Error al cargar tus libros favoritos. Por favor, intenta de nuevo.");
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFromFavorites = async (bookId) => {
        try {
            await Api.removeFavorite(user.id, bookId);
            setFavorites(favorites.filter(book => book.id !== bookId && book.bookId !== bookId));
        } catch (error) {
            console.error("Error removing from favorites:", error);
            alert("Error al quitar el libro de favoritos. Por favor, intenta de nuevo.");
        }
    };

    const handleEditBook = (book) => {
        window.location.href = `/books/edit/${book.id || book.bookId}`;
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este libro?")) {
            try {
                await Api.deleteBook(bookId);
                setFavorites(favorites.filter(book => book.id !== bookId && book.bookId !== bookId));
                alert("Libro eliminado exitosamente");
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Error al eliminar el libro");
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Inicia sesión requerido</h2>
                    <p className="text-gray-600 mb-6">
                        Debes iniciar sesión para ver y gestionar tus libros favoritos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Crear Cuenta
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando tus libros favoritos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar favoritos</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchFavorites}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Heart className="w-4 h-4 text-red-600 fill-current" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Libros Favoritos</h1>
                    </div>
                    <p className="text-gray-600">
                        {favorites.length === 0
                            ? "Aún no tienes libros favoritos"
                            : `${favorites.length} ${favorites.length === 1 ? 'libro favorito' : 'libros favoritos'}`}
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes libros favoritos</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Explora nuestra biblioteca y marca los libros que más te gusten como favoritos.
                        </p>
                        <Link
                            to="/books"
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            Explorar Libros
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                            {favorites.map((book) => {
                                const bookData = book.book || book;
                                const bookId = book.id || book.bookId || bookData.id;
                                return (
                                    <BookCard
                                        key={bookId}
                                        book={bookData}
                                        onEdit={user ? handleEditBook : null}
                                        onDelete={user ? () => handleDeleteBook(bookId) : null}
                                        showActions={true}
                                        className="border-2 border-red-100"
                                    />
                                );
                            })}
                        </div>
                        <div className="text-center">
                            <Link
                                to="/books"
                                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <BookOpen className="w-4 h-4" />
                                Descubrir más libros
                            </Link>
                        </div>
                    </>
                )}

                <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre tus favoritos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">¿Cómo agregar favoritos?</h4>
                            <p>
                                Haz clic en el ícono de corazón ❤️ en cualquier libro para agregarlo a tus favoritos.
                                Puedes hacerlo desde la lista de libros o desde la página de detalles.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Gestionar tu biblioteca</h4>
                            <p>
                                Desde aquí puedes editar o eliminar libros que hayas agregado.
                                También puedes quitar libros de tus favoritos en cualquier momento.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
