import { connection } from "../config/db.js";

export class AuthMysql {
    static async getByEmail(email) {
        const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0] || null;
    }

    static async create({ username, email, password, role = "user" }) {
        const query = `
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, ?)
        `;
        const [result] = await connection.query(query, [username, email, password, role]);
        return result.insertId;
    }

    static async addTokenToBlacklist(token) {
        const query = `
        INSERT INTO blacklisted_tokens (token, created_at)
        VALUES (?, NOW())
        `;
        const [result] = await connection.query(query, [token]);
        return result.insertId;
    }

    static async isTokenBlacklisted(token) {
        const [rows] = await connection.query("SELECT id FROM blacklisted_tokens WHERE token = ?", [token]);
        return rows.length > 0;
    }

    static async cleanExpiredTokens() {s
        const query = `
        DELETE FROM blacklisted_tokens 
        WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 HOUR)
        `;
        const [result] = await connection.query(query);
        return result.affectedRows;
    }
}