import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    Loader2
} from "lucide-react";
import { useAuth } from "../../Hooks/UseAuth";
import { Api } from "../../service/Api";

export const CreateBook = () => {
    const [bookData, setBookData] = useState({
        titulo: "",
        autor: "",
        descripcion: "",
        genero: "",
        fechaPublicacion: "",
        paginas: "",
        portada: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [genres, setGenres] = useState([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState(true);

    const fileInputRef = useRef(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadGenres();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !token) {
            toast.error("Debes iniciar sesión para crear libros");
            navigate("/login");
            return;
        }

        if (!validateForm()) return;

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

            const response = await Api.createBook(formData);

            if (response) {
                toast.success("¡Libro creado exitosamente!");
                navigate("/books");
            }
        } catch (error) {
            console.error("Error creating book:", error);
            toast.error(error.message || "Error al crear el libro. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Requerido</h2>
                    <p className="text-gray-600 mb-6">
                        Debes iniciar sesión para crear nuevos libros.
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <Link
                        to="/books"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a libros
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Agregar Nuevo Libro</h1>
                            <p className="text-gray-600">Comparte un nuevo libro con la comunidad</p>
                        </div>
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
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                            placeholder="Describe brevemente de qué trata el libro..."
                                            required
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {bookData.descripcion.length}/500 caracteres
                                    </p>
                                </div>
                                <div className="flex gap-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/books")}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Crear Libro
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
                                </div>
                            ) : (
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                        ? 'border-indigo-400 bg-indigo-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">
                                        Arrastra una imagen aquí o
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-indigo-600 hover:text-indigo-500 font-medium"
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

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">
                                    Consejos para la portada:
                                </h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Usa una imagen de alta calidad</li>
                                    <li>• Proporción recomendada: 3:4</li>
                                    <li>• Asegúrate de tener derechos de la imagen</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};