import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, BookOpen, Edit3, Trash2, Calendar, User, Loader2 } from "lucide-react";
import { useAuth } from "../../Hooks/UseAuth";
import { Api } from "../../service/Api";

export const BookCard = ({
    book,
    showActions = true,
    onEdit = null,
    onDelete = null,
    className = "",
    compact = false
}) => {
    const { user, token } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const checkIfFavorite = useCallback(async () => {
        if (!user?.id || !token) return;

        try {
            const response = await Api.getFavoritesByUserId(user.id);
            if (response?.data) {
                const isBookFavorite = response.data.some(
                    fav => fav.bookId === book.id || fav.id === book.id
                );
                setIsFavorite(isBookFavorite);
            }
        } catch (error) {
            console.error("Error checking favorites:", error);
        }
    }, [user?.id, token, book.id]);

    useEffect(() => {
        if (user && token) {
            checkIfFavorite();
        } else {
            setIsFavorite(false);
        }
    }, [user, token, checkIfFavorite]);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user?.id || !token) {
            return;
        }

        const previousState = isFavorite;

        try {
            setIsLoading(true);

            setIsFavorite(!isFavorite);

            if (isFavorite) {
                await Api.removeFavorite(user.id, book.id);
            } else {
                await Api.addFavorite(user.id, book.id);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            setIsFavorite(previousState);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit?.(book);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
            onDelete?.(book.id);
        }
    };

    const handleImageError = (e) => {
        setImageError(true);
        e.target.style.display = 'none';
    };

    const bookData = {
        title: book.titulo || book.title || 'Título no disponible',
        author: book.autor || book.author || 'Autor desconocido',
        genre: book.genero || book.genre,
        publishDate: book.fechaPublicacion || book.publishDate,
        description: book.descripcion || book.description,
        cover: book.portada || book.cover
    };

    return (
        <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
            <Link to={`/books/${book.id}`} className="block">
                <div className={`bg-gray-100 overflow-hidden ${compact ? 'aspect-[2/3]' : 'aspect-[3/4]'}`}>
                    {bookData.cover && !imageError ? (
                        <img
                            src={bookData.cover}
                            alt={bookData.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                            <BookOpen className={`text-indigo-400 ${compact ? 'w-12 h-12' : 'w-16 h-16'}`} />
                        </div>
                    )}
                </div>

                <div className={compact ? "p-3" : "p-4"}>
                    <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
                        {bookData.title}
                    </h3>

                    <div className={`flex items-center gap-1 text-gray-600 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{bookData.author}</span>
                    </div>

                    {bookData.genre && (
                        <span className={`inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full mb-2 ${compact ? 'text-xs' : 'text-xs'}`}>
                            {bookData.genre}
                        </span>
                    )}

                    {bookData.publishDate && !compact && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>{bookData.publishDate}</span>
                        </div>
                    )}

                    {bookData.description && !compact && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {bookData.description}
                        </p>
                    )}
                </div>
            </Link>
            {showActions && (
                <div className={`px-4 pb-4 flex items-center justify-between ${compact ? 'pt-0' : 'pt-0'}`}>
                    <div className="flex items-center">
                        {user ? (
                            <button
                                onClick={handleToggleFavorite}
                                disabled={isLoading}
                                className={`p-2 rounded-full transition-all duration-200 ${isFavorite
                                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                )}
                            </button>
                        ) : (
                            <div className="p-2">
                                <Heart className="w-5 h-5 text-gray-300" />
                            </div>
                        )}
                    </div>
                    {user && (onEdit || onDelete) && (
                        <div className="flex gap-2">
                            {onEdit && (
                                <button
                                    onClick={handleEdit}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Editar libro"
                                    aria-label="Editar libro"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Eliminar libro"
                                    aria-label="Eliminar libro"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
            )}
        </div>
    );
};