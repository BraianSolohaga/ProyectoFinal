import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, ChevronLeft, ChevronRight, ChevronDown, X, BookOpen, Loader2 } from "lucide-react";
import { BookCard } from "../../components/BookCard/BookCard";
import { useAuth } from "../../Hooks/UseAuth";
import { Api } from "../../service/Api";

export const Books = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const { user, token } = useAuth();

    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            const params = {};
            if (search) params.search = search;
            if (filter) params.genre = filter;
            if (page) params.page = page;

            const response = await Api.getAllBooks(params);
            console.log("Respuesta de la API:", response);

            if (response?.data) {
                setBooks(response.data);
                // Si tu API devuelve información de paginación
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages || 1);
                }
            } else {
                setBooks([]);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await Api.getGenres();
            if (response?.data) {
                setGenres(response.data);
            }
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [search, filter, page]);

    useEffect(() => {
        fetchGenres();
    }, []);

    const toggleFavorite = async (bookId) => {
        if (!user) {
            alert("Debes iniciar sesión para agregar a favoritos.");
            return;
        }

        try {
            await Api.addFavorite(user.id, bookId);
            fetchBooks();
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const deleteBook = async (bookId) => {
        if (!user || !token) {
            alert("Debes iniciar sesión para eliminar libros.");
            return;
        }

        if (window.confirm("¿Estás seguro de que quieres eliminar este libro?")) {
            try {
                await Api.deleteBook(bookId);
                setBooks(books.filter(book => book.id !== bookId));
                alert("Libro eliminado exitosamente");
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Error al eliminar el libro");
            }
        }
    };

    const handleEditBook = (book) => {
        window.location.href = `/books/edit/${book.id}`;
    };

    const clearFilters = () => {
        setSearch("");
        setFilter("");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Libros</h1>
                        <p className="text-gray-600">
                            {books.length} {books.length === 1 ? 'libro encontrado' : 'libros encontrados'}
                        </p>
                    </div>

                    {user && (
                        <Link
                            to="/books/create"
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors mt-4 md:mt-0"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Libro
                        </Link>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título o autor..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="md:w-48">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                                >
                                    <option value="">Todos los géneros</option>
                                    {genres.map((genre) => (
                                        <option key={genre} value={genre}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>

                        {(search || filter) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-600">Cargando libros...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron libros</h3>
                        <p className="text-gray-600 mb-6">
                            {search || filter
                                ? "Intenta ajustar tus filtros de búsqueda"
                                : "Aún no hay libros en la biblioteca"
                            }
                        </p>
                        {user && (
                            <Link
                                to="/books/create"
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar primer libro
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                            {books.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onEdit={user ? handleEditBook : null}
                                    onDelete={user ? deleteBook : null}
                                    showActions={true}
                                />
                            ))}
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${page === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Anterior
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Página {page} de {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${page >= totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Siguiente
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};