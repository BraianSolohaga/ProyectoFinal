import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    Calendar,
    User,
    BookOpen,
    Edit3,
    Trash2,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useAuth } from "../../Hooks/UseAuth";
import { Api } from "../../service/Api";

export const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [book, setBook] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchBookDetails();
        }
    }, [id, user]);

    const fetchBookDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const bookResponse = await Api.getBookById(id);

            if (bookResponse?.data) {
                setBook(bookResponse.data);
            } else {
                throw new Error('No se encontraron datos del libro');
            }

            if (user && token) {
                try {
                    const favoritesResponse = await Api.getFavoritesByUserId(user.id);

                    if (favoritesResponse?.data && Array.isArray(favoritesResponse.data)) {
                        const isBookFavorite = favoritesResponse.data.some(
                            fav => fav.bookId === parseInt(id) || fav.id === parseInt(id)
                        );
                        setIsFavorite(isBookFavorite);
                    } else {
                        console.warn('Favorites response is not an array:', favoritesResponse);
                        setIsFavorite(false);
                    }
                } catch (favError) {
                    console.error("Error checking favorites:", favError);
                    setIsFavorite(false);
                }
            }
        } catch (error) {
            console.error("Error fetching book details:", error);
            setError(error.message || 'Error al cargar los detalles del libro');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!user || !token) {
            return navigate("/login");
        }

        try {
            setIsLoadingFavorite(true);

            if (isFavorite) {
                await Api.removeFavorite(user.id, id);
                setIsFavorite(false);
            } else {
                await Api.addFavorite(user.id, id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            alert("Error al actualizar favoritos. Por favor, intenta de nuevo.");
        } finally {
            setIsLoadingFavorite(false);
        }
    };

    const handleEdit = () => {
        navigate(`/books/edit/${id}`);
    };

    const handleDelete = async () => {
        if (!user || !token) {
            alert("Debes iniciar sesión para eliminar libros");
            return;
        }

        if (window.confirm("¿Estás seguro de que quieres eliminar este libro?")) {
            try {
                await Api.deleteBook(id);
                alert("Libro eliminado exitosamente");
                navigate("/books");
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Error al eliminar el libro");
            }
        }
    };
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando detalles del libro...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el libro</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate("/books")}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Volver a libros
                        </button>
                        <button
                            onClick={fetchBookDetails}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Libro no encontrado</h2>
                    <p className="text-gray-600 mb-6">El libro que buscas no existe o ha sido eliminado.</p>
                    <Link
                        to="/books"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a libros
                    </Link>
                </div>
            </div>
        );
    }
    const bookData = {
        title: book.titulo || book.title || 'Título no disponible',
        author: book.autor || book.author || 'Autor desconocido',
        genre: book.genero || book.genre,
        publishDate: book.fechaPublicacion || book.publishDate,
        description: book.descripcion || book.description,
        cover: book.portada || book.cover,
        pages: book.paginas || book.pages
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Link
                    to="/books"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a libros
                </Link>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex">

                        <div className="md:w-1/3">
                            <div className="aspect-[3/4] bg-gray-100">
                                {bookData.cover ? (
                                    <img
                                        src={bookData.cover}
                                        alt={bookData.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}

                                <div
                                    className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 ${bookData.cover ? 'hidden' : 'flex'}`}
                                >
                                    <BookOpen className="w-24 h-24 text-indigo-400" />
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {bookData.title}
                                    </h1>

                                    <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                                        <User className="w-5 h-5" />
                                        <span>{bookData.author}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    {user && (
                                        <>
                                            <button
                                                onClick={handleToggleFavorite}
                                                disabled={isLoadingFavorite}
                                                className={`p-3 rounded-full transition-all duration-200 ${isFavorite
                                                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                    } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                            >
                                                {isLoadingFavorite ? (
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                                )}
                                            </button>

                                            <button
                                                onClick={handleEdit}
                                                className="p-3 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Editar libro"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={handleDelete}
                                                className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Eliminar libro"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {bookData.genre && (
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                                            {bookData.genre}
                                        </span>
                                    </div>
                                )}

                                {bookData.publishDate && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Publicado en {bookData.publishDate}</span>
                                    </div>
                                )}

                                {bookData.pages && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{bookData.pages} páginas</span>
                                    </div>
                                )}
                            </div>

                            {bookData.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {bookData.description}
                                    </p>
                                </div>
                            )}
                            {!user && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-blue-800 text-sm">
                                        <Link to="/login" className="font-medium hover:underline">
                                            Inicia sesión
                                        </Link>
                                        {" "}para agregar este libro a tus favoritos y gestionar tu biblioteca personal.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};