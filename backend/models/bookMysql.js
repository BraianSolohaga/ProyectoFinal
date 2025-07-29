import { connection } from "../config/db.js";

export class BooksMysql {
    static async getAll(filters = {}) {
        try {
            let { _page = 1, _limit = 10, title, author, genreIds } = filters;
            _page = Number(_page);
            _limit = Number(_limit);

            console.log("[INFO] getAll() - Filtros recibidos:", filters);

            let baseQuery = `
                SELECT 
                    b.id, b.title, b.author, b.year, b.publisher, b.cover, b.description, b.created_at,
                    GROUP_CONCAT(g.name) AS generos
                FROM books b
                LEFT JOIN book_genres bg ON b.id = bg.book_id
                LEFT JOIN genres g ON bg.genre_id = g.id
            `;

            const conditions = [];
            const params = [];

            if (title) {
                conditions.push("b.title LIKE ?");
                params.push(`%${title}%`);
            }

            if (author) {
                conditions.push("b.author LIKE ?");
                params.push(`%${author}%`);
            }

            if (genreIds && Array.isArray(genreIds) && genreIds.length > 0) {
                genreIds = genreIds.map(Number).filter(Boolean);
                conditions.push(`bg.genre_id IN (${genreIds.map(() => "?").join(",")})`);
                params.push(...genreIds);
            }

            if (conditions.length > 0) {
                baseQuery += ` WHERE ` + conditions.join(" AND ");
            }

            baseQuery += ` GROUP BY b.id `;
            baseQuery += ` ORDER BY b.id DESC LIMIT ? OFFSET ?`;
            params.push(_limit, (_page - 1) * _limit);

            const countQuery = `
                SELECT COUNT(DISTINCT b.id) as total
                FROM books b
                LEFT JOIN book_genres bg ON b.id = bg.book_id
                ${conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : ""}
            `;

            console.log("[INFO] getAll() - Query principal:", baseQuery);
            console.log("[INFO] getAll() - Params:", params);

            const [dataRows] = await connection.query(baseQuery, params);
            console.log("[INFO] getAll() - Filas devueltas:", dataRows);

            const countParams = params.slice(0, params.length - 2);
            console.log("[INFO] getAll() - Query count:", countQuery);
            console.log("[INFO] getAll() - Params count:", countParams);

            const [countRows] = await connection.query(countQuery, countParams);

            const data = dataRows.map(row => ({
                ...row,
                generos: row.generos ? row.generos.split(",") : []
            }));

            console.log("[INFO] getAll() - Resultado final:", data);
            console.log("[INFO] getAll() - Total registros:", countRows[0]?.total);

            return { data, total: countRows[0].total };
        } catch (error) {
            console.error("[ERROR] getAll():", error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            console.log("[INFO] getById() - ID recibido:", id);

            const query = `
                SELECT 
                    b.id, b.title, b.author, b.year, b.publisher, b.cover, b.description, b.created_at,
                    GROUP_CONCAT(g.name) AS generos
                FROM books b
                LEFT JOIN book_genres bg ON b.id = bg.book_id
                LEFT JOIN genres g ON bg.genre_id = g.id
                WHERE b.id = ?
                GROUP BY b.id
            `;
            const [rows] = await connection.query(query, [id]);
            console.log("[INFO] getById() - Filas devueltas:", rows);

            if (rows.length === 0) return null;

            const book = rows[0];
            return {
                ...book,
                generos: book.generos ? book.generos.split(",") : []
            };
        } catch (error) {
            console.error("[ERROR] getById():", error);
            throw error;
        }
    }

    static async create(bookData) {
        try {
            console.log("[INFO] create() - Datos recibidos:", bookData);

            const { title, author, year, publisher, cover, description, genreIds = [] } = bookData;
            const query = `
                INSERT INTO books (title, author, year, publisher, cover, description, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;
            const [result] = await connection.query(query, [title, author, year, publisher, cover, description]);
            const bookId = result.insertId;

            console.log("[INFO] create() - Nuevo bookId:", bookId);

            if (genreIds.length > 0) {
                const values = genreIds.map(genreId => [bookId, genreId]);
                await connection.query(`INSERT INTO book_genres (book_id, genre_id) VALUES ?`, [values]);
                console.log("[INFO] create() - Géneros asociados:", genreIds);
            }

            return bookId;
        } catch (error) {
            console.error("[ERROR] create():", error);
            throw error;
        }
    }

    static async update(id, bookData) {
        try {
            console.log("[INFO] update() - ID:", id, "Datos:", bookData);

            const { title, author, year, publisher, cover, description, genreIds = [] } = bookData;

            const query = `
                UPDATE books SET title=?, author=?, year=?, publisher=?, cover=?, description=? WHERE id=?
            `;
            const [result] = await connection.query(query, [title, author, year, publisher, cover, description, id]);
            console.log("[INFO] update() - Filas afectadas:", result.affectedRows);

            if (result.affectedRows === 0) return null;

            await connection.query(`DELETE FROM book_genres WHERE book_id = ?`, [id]);
            console.log("[INFO] update() - Géneros antiguos eliminados");

            if (genreIds.length > 0) {
                const values = genreIds.map(genreId => [id, genreId]);
                await connection.query(`INSERT INTO book_genres (book_id, genre_id) VALUES ?`, [values]);
                console.log("[INFO] update() - Nuevos géneros asociados:", genreIds);
            }

            return true;
        } catch (error) {
            console.error("[ERROR] update():", error);
            throw error;
        }
    }

    static async patch(id, data) {
        try {
            console.log("[INFO] patch() - ID:", id, "Datos:", data);

            const allowedFields = ["title", "author", "year", "publisher", "cover", "description"];
            const fields = [];
            const params = [];

            for (const field of allowedFields) {
                if (field in data) {
                    fields.push(`${field} = ?`);
                    params.push(data[field]);
                }
            }

            if (fields.length === 0) return null;

            params.push(id);

            const query = `UPDATE books SET ${fields.join(", ")} WHERE id = ?`;
            const [result] = await connection.query(query, params);
            console.log("[INFO] patch() - Filas afectadas:", result.affectedRows);

            return result.affectedRows > 0;
        } catch (error) {
            console.error("[ERROR] patch():", error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            console.log("[INFO] delete() - ID:", id);

            await connection.query(`DELETE FROM book_genres WHERE book_id = ?`, [id]);
            console.log("[INFO] delete() - Géneros eliminados");

            const [result] = await connection.query(`DELETE FROM books WHERE id = ?`, [id]);
            console.log("[INFO] delete() - Filas afectadas:", result.affectedRows);

            return result.affectedRows > 0;
        } catch (error) {
            console.error("[ERROR] delete():", error);
            throw error;
        }
    }

    // Otros métodos no han cambiado, por lo que no es necesario incluirlos aquí.
    static async getFavoritesByUserId(userId) {
        try {
            console.log("[INFO] getFavoritesByUserId() - userId:", userId);

            userId = Number(userId);
            if (!userId) throw new Error("userId debe ser un número válido");

            const query = `
                SELECT b.*
                FROM books b
                JOIN favoritos f ON b.id = f.book_id
                WHERE f.user_id = ?
            `;
            const [rows] = await connection.query(query, [userId]);
            console.log("[INFO] getFavoritesByUserId() - Favoritos:", rows);

            return rows;
        } catch (error) {
            console.error("[ERROR] getFavoritesByUserId():", error);
            throw error;
        }
    }

    static async addFavorite(userId, bookId) {
        try {
            console.log("[INFO] addFavorite() - userId:", userId, "bookId:", bookId);

            userId = Number(userId);
            bookId = Number(bookId);
            if (!userId || !bookId) throw new Error("userId y bookId deben ser números válidos");

            const existsQuery = `SELECT 1 FROM favoritos WHERE user_id = ? AND book_id = ? LIMIT 1`;
            const [existsRows] = await connection.query(existsQuery, [userId, bookId]);
            if (existsRows.length > 0) {
                console.log("[INFO] addFavorite() - Ya existe favorito");
                return false;
            }

            await connection.query(`INSERT INTO favoritos (user_id, book_id) VALUES (?, ?)`, [userId, bookId]);
            console.log("[INFO] addFavorite() - Favorito agregado");
            return true;
        } catch (error) {
            console.error("[ERROR] addFavorite():", error);
            throw error;
        }
    }

    static async removeFavorite(userId, bookId) {
        try {
            console.log("[INFO] removeFavorite() - userId:", userId, "bookId:", bookId);

            userId = Number(userId);
            bookId = Number(bookId);
            if (!userId || !bookId) throw new Error("userId y bookId deben ser números válidos");

            const [result] = await connection.query(`DELETE FROM favoritos WHERE user_id = ? AND book_id = ?`, [userId, bookId]);
            console.log("[INFO] removeFavorite() - Filas afectadas:", result.affectedRows);

            return result.affectedRows > 0;
        } catch (error) {
            console.error("[ERROR] removeFavorite():", error);
            throw error;
        }
    }

    static async countFavorites() {
        try {
            console.log("[INFO] countFavorites()");

            const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM favoritos`);
            console.log("[INFO] countFavorites() - Total:", rows[0].total);

            return rows[0].total;
        } catch (error) {
            console.error("[ERROR] countFavorites():", error);
            throw error;
        }
    }

    static async getUniqueGenres() {
        try {
            console.log("[INFO] getUniqueGenres()");

            const [rows] = await connection.query(`
                SELECT DISTINCT g.name
                FROM genres g
                INNER JOIN book_genres bg ON g.id = bg.genre_id
                ORDER BY g.name ASC
            `);
            console.log("[INFO] getUniqueGenres() - Géneros únicos:", rows.map(r => r.name));

            return rows.map(row => row.name);
        } catch (error) {
            console.error("[ERROR] getUniqueGenres():", error);
            throw error;
        }
    }
}
