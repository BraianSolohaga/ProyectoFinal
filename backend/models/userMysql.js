import { connection } from "../config/db.js";

export class UsersMysql {
    static async countUsers() {
        const query = `SELECT COUNT(*) AS total FROM users`;
        const [rows] = await connection.query(query);
        return rows[0].total;
    }

    static async getAll() {
        const query = `SELECT id, username, email, role, created_at FROM users`;
        const [rows] = await connection.query(query);
        return rows;
    }

    static async getById(id) {
        const query = `SELECT id, username, email, role, created_at FROM users WHERE id = ?`;
        const [rows] = await connection.query(query, [id]);
        return rows[0] || null;
    }

    static async getByEmail(email) {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await connection.query(query, [email]);
        return rows[0] || null;
    }

    static async create({ username, email, password, role = "user" }) {
        const query = `
            INSERT INTO users (username, email, password, role, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const [result] = await connection.query(query, [username, email, password, role]);
        return { id: result.insertId, username, email, role };
    }

    static async update(id, { username, email, role }) {
        const query = `
            UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?
        `;
        const [result] = await connection.query(query, [username, email, role, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = `DELETE FROM users WHERE id = ?`;
        const [result] = await connection.query(query, [id]);
        return result.affectedRows > 0;
    }
}
