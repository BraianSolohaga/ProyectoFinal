import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getAllGenres } from "../utils/genres.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, "..", "Json", "books.json");

export class BooksLocal {
    static books = [];
    static favorites = [];
    static loaded = false;

    static async load() {
        if (this.loaded) return;
        try {
            const data = JSON.parse(await readFile(filePath, "utf-8"));
            if (!data || !Array.isArray(data.libros)) {
                throw new Error("Formato del JSON inválido o propiedad 'libros' faltante.");
            }
            this.books = data.libros;
            this.favorites = data.favoritos || [];
            this.loaded = true;
            console.log("Datos cargados correctamente.");
        } catch (error) {
            this.books = [];
            this.favorites = [];
            this.loaded = false;
            console.error("Error cargando datos:", error.message);
        }
    }

    static async save() {
        try {
            await writeFile(filePath, JSON.stringify(
                { libros: this.books, favoritos: this.favorites }, null, 2
            ));
        } catch (error) {
            console.error("Error guardando datos:", error);
            throw error;
        }
    }

    // ===============================
    // Métodos de libros
    // ===============================

    static _filterByFields(books, filters) {
        return books.filter(book => {
            for (const [key, value] of Object.entries(filters)) {
                if (!value) continue;
                if (key === "generos") {
                    const genFilters = value.toLowerCase().split(",").map(g => g.trim());
                    if (!genFilters.some(gf => book.generos?.some(bg => bg.toLowerCase() === gf))) return false;
                } else if (typeof book[key] === "string") {
                    if (!book[key].toLowerCase().includes(value.toLowerCase())) return false;
                } else if (typeof book[key] === "number") {
                    if (book[key] !== Number(value)) return false;
                } else if (book[key] !== value) {
                    return false;
                }
            }
            return true;
        });
    }

    static async getAll(filters = {}) {
        await this.load();
        let result = this._filterByFields(this.books, filters);
        const page = Number(filters._page) || 1;
        const limit = Number(filters._limit) || 10;
        const offset = (page - 1) * limit;
        return { data: result.slice(offset, offset + limit), total: result.length };
    }

    static async getById(id) {
        await this.load();
        return this.books.find(b => b.id === Number(id)) || null;
    }

    static async create(data) {
        await this.load();
        const newId = this.books.length ? Math.max(...this.books.map(b => b.id)) + 1 : 1;
        const newBook = { id: newId, ...data };
        this.books.push(newBook);
        await this.save();
        return newBook;
    }

    static async update(id, data) {
        await this.load();
        const idx = this.books.findIndex(b => b.id === Number(id));
        if (idx === -1) return null;
        this.books[idx] = { id: Number(id), ...data };
        await this.save();
        return this.books[idx];
    }

    static async patch(id, data) {
        await this.load();
        const idx = this.books.findIndex(b => b.id === Number(id));
        if (idx === -1) return null;
        this.books[idx] = { ...this.books[idx], ...data };
        await this.save();
        return this.books[idx];
    }

    static async delete(id) {
        await this.load();
        const idx = this.books.findIndex(b => b.id === Number(id));
        if (idx === -1) return false;
        this.books.splice(idx, 1);
        this.favorites = this.favorites.filter(f => f.bookId !== Number(id));
        await this.save();
        return true;
    }
    static async getFavoritesByUserId(userId) {
        userId = Number(userId);
        if (!userId) throw new Error("userId debe ser un número válido");

        await this.load();
        const favorites = this.favorites
            .filter(f => f.userId === userId)
            .map(f => f.bookId);
        console.log(`[INFO] Favoritos obtenidos para usuario ${userId}:`, favorites);
        return favorites;
    }

    static async addFavorite(userId, bookId) {
        userId = Number(userId);
        bookId = Number(bookId);
        if (!userId || !bookId) throw new Error("userId y bookId deben ser números válidos");

        await this.load();
        const exists = this.favorites.find(f => f.userId === userId && f.bookId === bookId);
        if (exists) {
            console.log(`[INFO] Favorito ya existe: usuario ${userId}, libro ${bookId}`);
            return false;
        }
        this.favorites.push({ userId, bookId });
        await this.save();
        console.log(`[INFO] Favorito agregado: usuario ${userId}, libro ${bookId}`);
        return true;
    }

    static async removeFavorite(userId, bookId) {
        userId = Number(userId);
        bookId = Number(bookId);
        if (!userId || !bookId) throw new Error("userId y bookId deben ser números válidos");

        await this.load();
        const before = this.favorites.length;
        this.favorites = this.favorites.filter(f => !(f.userId === userId && f.bookId === bookId));
        if (this.favorites.length !== before) {
            await this.save();
            console.log(`[INFO] Favorito eliminado: usuario ${userId}, libro ${bookId}`);
            return true;
        }
        console.log(`[INFO] Favorito no encontrado para eliminar: usuario ${userId}, libro ${bookId}`);
        return false;
    }

    static async countFavorites() {
        await this.load();
        return this.favorites.length;
    }

    static async getUniqueGenres() {
        await this.load();

        const usedGenres = new Set();

        this.books.forEach(book => {
            if (book.generos && Array.isArray(book.generos)) {
                book.generos.forEach(g => usedGenres.add(g));
            }
        });

        return [...usedGenres].sort();
    }
}
