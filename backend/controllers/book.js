import { validateBookToCreate, validateBookFromDB, validateBookPatch } from "../schemas/book.js";
import { s3 } from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";
import { mapGenreIdsToNames } from "../utils/genres.js";
import { BooksLocal } from "../models/bookLocal.js";

export class BooksController {
    constructor(booksModel, isLocal = false) {
        this.booksModel = booksModel;
        this.isLocal = isLocal;
    }

    getAllBooks = async (query) => {
        try {
            if (query.genreIds && typeof query.genreIds === "string") {
                query.genreIds = query.genreIds.split(",").map(Number);
            }
            const { data, total } = await this.booksModel.getAll(query);
            return { status: "success", code: 200, data, total };
        } catch (error) {
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    getBookById = async (id) => {
        try {
            const book = await this.booksModel.getById(id);
            if (!book) {
                return { status: "error", code: 404, error: [{ message: "Libro no encontrado" }] };
            }

            const validation = validateBookFromDB.safeParse(book);
            if (!validation.success) {
                return { status: "error", code: 500, error: validation.error.issues };
            }
            return { status: "success", code: 200, data: validation.data };
        } catch (error) {
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    createBook = async (body, file) => {
        if (!file) {
            return { status: "error", code: 400, error: [{ message: "Imagen requerida" }] };
        }

        if (body.genreIds && typeof body.genreIds === "string") {
            body.genreIds = body.genreIds.split(",").map(Number);
        }

        if (this.isLocal && body.genreIds) {
            body.generos = await mapGenreIdsToNames(body.genreIds);
            delete body.genreIds;
        }

        const validation = validateBookToCreate.safeParse(body);
        if (!validation.success) {
            return { status: "error", code: 400, error: validation.error.issues };
        }

        try {
            const fileName = `${uuidv4()}-${file.originalname}`;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const s3Result = await s3.upload(params).promise();
            const imageUrl = s3Result.Location;

            const bookData = { ...validation.data, portada: imageUrl };

            const newId = await this.booksModel.create(bookData);

            return {
                status: "success",
                code: 201,
                message: "Libro creado correctamente",
                data: { id: newId, ...bookData },
            };
        } catch (error) {
            return { status: "error", code: 500, error: [{ message: "Error al subir imagen o guardar libro" }] };
        }
    };

    updateBook = async (id, body, file) => {
        const existing = await this.booksModel.getById(id);
        if (!existing) {
            return { status: "error", code: 404, error: [{ message: "Libro no encontrado" }] };
        }

        if (body.genreIds && typeof body.genreIds === "string") {
            body.genreIds = body.genreIds.split(",").map(Number);
        }

        if (this.isLocal && body.genreIds) {
            body.generos = await mapGenreIdsToNames(body.genreIds);
            delete body.genreIds;
        }

        const validation = validateBookToCreate.safeParse(body);
        if (!validation.success) {
            return { status: "error", code: 400, error: validation.error.issues };
        }

        let updatedBook = { ...validation.data, portada: existing.portada };

        if (file) {
            try {
                const fileName = `${uuidv4()}-${file.originalname}`;
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                const s3Result = await s3.upload(params).promise();
                updatedBook.portada = s3Result.Location;
            } catch (error) {
                return { status: "error", code: 500, error: [{ message: "Error al subir nueva imagen" }] };
            }
        }

        const success = await this.booksModel.update(id, updatedBook);
        if (!success) {
            return { status: "error", code: 500, error: [{ message: "No se pudo actualizar el libro" }] };
        }

        return {
            status: "success",
            code: 200,
            message: "Libro actualizado correctamente",
            data: { id: Number(id), ...updatedBook },
        };
    };

    patchBook = async (id, body) => {
        const validation = validateBookPatch.safeParse(body);
        if (!validation.success) {
            return { status: "error", code: 400, error: validation.error.issues };
        }

        try {
            const success = await this.booksModel.patch(id, validation.data);
            if (!success) {
                return { status: "error", code: 404, error: [{ message: "Libro no encontrado para actualizar" }] };
            }
            return {
                status: "success",
                code: 200,
                message: "Libro actualizado parcialmente",
                data: { id: Number(id), ...validation.data },
            };
        } catch (error) {
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    deleteBook = async (id) => {
        try {
            const existing = await this.booksModel.getById(id);
            if (!existing) {
                return { status: "error", code: 404, error: [{ message: "Libro no encontrado" }] };
            }

            const success = await this.booksModel.delete(id);
            if (!success) {
                return { status: "error", code: 500, error: [{ message: "No se pudo eliminar el libro" }] };
            }

            return { status: "success", code: 200, message: "Libro eliminado correctamente" };
        } catch (error) {
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    addFavorite = async (userId, bookId) => {
        try {
            userId = Number(userId);
            bookId = Number(bookId);
            if (!userId || !bookId) {
                return { status: "error", code: 400, error: [{ message: "userId y bookId deben ser números válidos" }] };
            }

            const added = await this.booksModel.addFavorite(userId, bookId);
            if (added) {
                console.log(`[INFO] Se agregó el libro ${bookId} a favoritos del usuario ${userId}.`);
                return { status: "success", code: 200, message: "Favorito agregado correctamente" };
            } else {
                console.log(`[INFO] El libro ${bookId} ya estaba en favoritos del usuario ${userId}.`);
                return { status: "error", code: 400, error: [{ message: "El libro ya estaba en favoritos" }] };
            }
        } catch (error) {
            console.error("[ERROR] Error al agregar favorito:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    removeFavorite = async (userId, bookId) => {
        try {
            userId = Number(userId);
            bookId = Number(bookId);
            if (!userId || !bookId) {
                return { status: "error", code: 400, error: [{ message: "userId y bookId deben ser números válidos" }] };
            }

            const removed = await this.booksModel.removeFavorite(userId, bookId);
            if (removed) {
                console.log(`[INFO] Se quitó el libro ${bookId} de favoritos del usuario ${userId}.`);
                return { status: "success", code: 200, message: "Favorito eliminado correctamente" };
            } else {
                console.log(`[INFO] El libro ${bookId} no estaba en favoritos del usuario ${userId}.`);
                return { status: "error", code: 404, error: [{ message: "El libro no estaba en favoritos" }] };
            }
        } catch (error) {
            console.error("[ERROR] Error al quitar favorito:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    getFavoritesByUserId = async (userId) => {
        try {
            userId = Number(userId);
            if (!userId) {
                return { status: "error", code: 400, error: [{ message: "userId debe ser un número válido" }] };
            }

            const favorites = await this.booksModel.getFavoritesByUserId(userId);
            console.log(`[INFO] Favoritos del usuario ${userId}:`, favorites);
            return { status: "success", code: 200, data: favorites };
        } catch (error) {
            console.error("[ERROR] Error al obtener favoritos:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    countFavorites = async () => {
        try {
            const total = await this.booksModel.countFavorites();
            console.log("[INFO] Total favoritos:", total);
            return { status: "success", code: 200, total };
        } catch (error) {
            console.error("[ERROR] Error al contar favoritos:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    async getGenres() {
        try {
            if (this.isLocal) {
                const generos = await BooksLocal.getUniqueGenres();
                console.log("[INFO] Géneros únicos:", generos);
                if (generos.length === 0) {
                    return { status: "error", code: 404, error: [{ message: "No se encontraron géneros" }] };
                }
                return { status: "success", code: 200, data: generos };
            } else {
                const generos = await this.booksModel.getUniqueGenres();
                console.log("[INFO] Géneros únicos:", generos);
                if (generos.length === 0) {
                    return { status: "error", code: 404, error: [{ message: "No se encontraron géneros" }] };
                }
                return { status: "success", code: 200, data: generos };
            }
        } catch (error) {
            console.error("[ERROR] Error al obtener géneros:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    }


}

