import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "..", "Json", "users.json");

export class UsersLocal {
    static users = [];
    static loaded = false;

    static async load() {
        if (this.loaded) return;
        try {
            const data = JSON.parse(await readFile(filePath, "utf-8"));
            if (!data || !Array.isArray(data.users)) {
                throw new Error("Formato JSON inválido o faltan usuarios.");
            }
            this.users = data.users;
            this.loaded = true;
            console.log("[UsersLocal] Usuarios cargados correctamente.");
        } catch (error) {
            this.users = [];
            this.loaded = false;
            console.error("[UsersLocal] Error cargando usuarios:", error.message);
        }
    }

    static async save() {
        try {
            await writeFile(filePath, JSON.stringify({ usuarios: this.users }, null, 2));
        } catch (error) {
            console.error("[UsersLocal] Error guardando usuarios:", error);
            throw error;
        }
    }

    static async countUsers() {
        await this.load();
        return this.users.length;
    }

    static async getAll() {
        await this.load();
        return this.users;
    }

    static async getByEmail(email) {
        await this.load();
        return this.users.find(u => u.email === email) || null;
    }
    static async getById(id) {
        await this.load();
        return this.users.find(u => u.id === Number(id)) || null;
    }

    static async create({ username, email, password, role = "user" }) {
        await this.load();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        const newUser = {
            id: newId,
            username,
            email,
            password: hashedPassword,
            role,
            created_at: new Date().toISOString()
        };
        this.users.push(newUser);
        await this.save();
        return newUser;
    }
}
