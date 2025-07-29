import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    BookOpen,
    User,
    FileText,
    Upload,
    X,
    Image as ImageIcon,
    Save,
    ArrowLeft,
    Calendar,
    Tag,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useAuth } from "../../Hooks/UseAuth";
import { Api } from "../../service/Api";

export const EditBook = () => {
    const { id } = useParams();
    const [bookData, setBookData] = useState({
        titulo: "",
        autor: "",
        descripcion: "",
        genero: "",
        fechaPublicacion: "",
        paginas: "",
        portada: null
    });
    const [originalData, setOriginalData] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState(true);

    const fileInputRef = useRef(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadBookData();
            loadGenres();
        }
    }, [id]);

    const loadGenres = async () => {
        try {
            setIsLoadingGenres(true);
            const response = await Api.getGenres();
            if (response?.data && Array.isArray(response.data)) {
                setGenres(response.data);
            } else {
                setGenres([
                    "Ficción", "No ficción", "Ciencia ficción", "Fantasía", "Romance",
                    "Misterio", "Thriller", "Horror", "Historia", "Biografía",
                    "Autobiografía", "Ensayo", "Poesía", "Drama", "Aventura",
                    "Clásico", "Contemporáneo", "Juvenil", "Infantil", "Educativo"
                ]);
            }
        } catch (error) {
            console.error("Error loading genres:", error);
            setGenres([
                "Ficción", "No ficción", "Ciencia ficción", "Fantasía", "Romance",
                "Misterio", "Thriller", "Horror", "Historia", "Biografía"
            ]);
        } finally {
            setIsLoadingGenres(false);
        }
    };

    const loadBookData = async () => {
        try {
            setIsLoadingBook(true);
            setError(null);

            const response = await Api.getBookById(id);

            if (response?.data) {
                const book = response.data;
                const bookInfo = {
                    titulo: book.titulo || book.title || "",
                    autor: book.autor || book.author || "",
                    descripcion: book.descripcion || book.description || "",
                    genero: book.genero || book.genre || "",
                    fechaPublicacion: book.fechaPublicacion || book.publishDate || "",
                    paginas: book.paginas || book.pages || "",
                    portada: null
                };

                setBookData(bookInfo);
                setOriginalData(bookInfo);

                if (book.portada || book.cover) {
                    setImagePreview(book.portada || book.cover);
                }
            } else {
                throw new Error('Libro no encontrado');
            }
        } catch (error) {
            console.error("Error loading book:", error);
            setError("Error al cargar el libro. Puede que no exista o no tengas permisos para editarlo.");
        } finally {
            setIsLoadingBook(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files[0]) {
            const file = files[0];

            if (!file.type.startsWith('image/')) {
                toast.error("Por favor, selecciona un archivo de imagen válido");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen debe ser menor a 5MB");
                return;
            }

            setBookData({ ...bookData, portada: file });

            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setBookData({ ...bookData, [name]: value });
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleChange({ target: { name: 'portada', type: 'file', files: [file] } });
        }
    };

    const removeImage = () => {
        setBookData({ ...bookData, portada: null });
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        if (!bookData.titulo.trim()) {
            toast.error("El título es requerido");
            return false;
        }

        if (!bookData.autor.trim()) {
            toast.error("El autor es requerido");
            return false;
        }

        if (!bookData.descripcion.trim()) {
            toast.error("La descripción es requerida");
            return false;
        }

        if (bookData.paginas && (isNaN(bookData.paginas) || parseInt(bookData.paginas) <= 0)) {
            toast.error("El número de páginas debe ser un número válido");
            return false;
        }

        return true;
    };

    const hasChanges = () => {
        if (!originalData) return false;

        return Object.keys(bookData).some(key => {
            if (key === 'portada') {
                return bookData.portada !== null;
            }
            return bookData[key] !== originalData[key];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !token) {
            toast.error("Debes iniciar sesión para editar libros");
            navigate("/login");
            return;
        }

        if (!validateForm()) return;

        if (!hasChanges()) {
            toast.error("No se han detectado cambios");
            return;
        }

        try {
            setIsLoading(true);

            const formData = {
                titulo: bookData.titulo.trim(),
                autor: bookData.autor.trim(),
                descripcion: bookData.descripcion.trim(),
                genero: bookData.genero || null,
                fechaPublicacion: bookData.fechaPublicacion || null,
                paginas: bookData.paginas ? parseInt(bookData.paginas) : null,
                portada: bookData.portada
            };

            const response = await Api.updateBook(id, formData);

            if (response) {
                toast.success("¡Libro actualizado exitosamente!");
                navigate(`/books/${id}`);
            }
        } catch (error) {
            console.error("Error updating book:", error);
            toast.error(error.message || "Error al actualizar el libro. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este libro? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            await Api.deleteBook(id);
            toast.success("Libro eliminado exitosamente");
            navigate("/books");
        } catch (error) {
            console.error("Error deleting book:", error);
            toast.error("Error al eliminar el libro");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Requerido</h2>
                    <p className="text-gray-600 mb-6">
                        Debes iniciar sesión para editar libros.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoadingBook) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando datos del libro...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/books"
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Volver a libros
                        </Link>
                        <button
                            onClick={loadBookData}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <Link
                        to={`/books/${id}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a detalles
                    </Link>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Editar Libro</h1>
                                <p className="text-gray-600">Modifica la información del libro</p>
                            </div>
                        </div>

                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Eliminar Libro
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                                            Título del Libro *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <BookOpen className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="titulo"
                                                name="titulo"
                                                value={bookData.titulo}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Ej: Cien años de soledad"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-2">
                                            Autor *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="autor"
                                                name="autor"
                                                value={bookData.autor}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Ej: Gabriel García Márquez"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-2">
                                            Género
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Tag className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <select
                                                id="genero"
                                                name="genero"
                                                value={bookData.genero}
                                                onChange={handleChange}
                                                disabled={isLoadingGenres}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">
                                                    {isLoadingGenres ? "Cargando géneros..." : "Seleccionar género"}
                                                </option>
                                                {genres.map(genre => (
                                                    <option key={genre} value={genre}>{genre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="fechaPublicacion" className="block text-sm font-medium text-gray-700 mb-2">
                                            Año de Publicación
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                id="fechaPublicacion"
                                                name="fechaPublicacion"
                                                value={bookData.fechaPublicacion}
                                                onChange={handleChange}
                                                min="1000"
                                                max={new Date().getFullYear()}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Ej: 1967"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="paginas" className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de Páginas
                                        </label>
                                        <input
                                            type="number"
                                            id="paginas"
                                            name="paginas"
                                            value={bookData.paginas}
                                            onChange={handleChange}
                                            min="1"
                                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ej: 471"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            rows={4}
                                            value={bookData.descripcion}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Describe brevemente de qué trata el libro..."
                                            required
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {bookData.descripcion.length}/500 caracteres
                                    </p>
                                </div>
                                {hasChanges() && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-blue-800 text-sm">
                                            ✨ Se han detectado cambios en el formulario
                                        </p>
                                    </div>
                                )}
                                <div className="flex gap-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/books/${id}`)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !hasChanges()}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${isLoading || !hasChanges()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portada del Libro</h3>
                            {imagePreview ? (
                                <div className="relative mb-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                                        {bookData.portada ? 'Nueva imagen' : 'Imagen actual'}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                        ? 'border-blue-400 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">
                                        Arrastra una nueva imagen aquí o
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        selecciona un archivo
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                        name="portada"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        PNG, JPG hasta 5MB
                                    </p>
                                </div>
                            )}
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                                <h4 className="text-sm font-medium text-yellow-900 mb-2">
                                    Nota sobre la imagen:
                                </h4>
                                <ul className="text-xs text-yellow-700 space-y-1">
                                    <li>• Solo sube una nueva imagen si quieres cambiarla</li>
                                    <li>• La imagen actual se mantendrá si no seleccionas una nueva</li>
                                    <li>• Asegúrate de tener derechos de la nueva imagen</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};