import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "..", "Json", "users.json");

export class AuthLocal {
    static users = [];
    static loaded = false;

    static async load() {
        if (this.loaded) return;
        try {
            const data = JSON.parse(await readFile(filePath, "utf-8"));
            this.users = data?.users || [];
            this.loaded = true;
            console.log("[AuthLocal] Usuarios cargados correctamente.");
        } catch (error) {
            this.users = [];
            this.loaded = false;
            console.error("[AuthLocal] Error cargando usuarios:", error.message);
        }
    }

    static async save() {
        try {
            await writeFile(filePath, JSON.stringify({ users: this.users }, null, 2));
        } catch (error) {
            console.error("[AuthLocal] Error guardando usuarios:", error);
            throw error;
        }
    }

    static async getByEmail(email) {
        await this.load();
        return this.users.find(u => u.email === email) || null;
    }

    static async create({ username, email, password, role = "user" }) {
        await this.load();
        const newUser = {
            id: this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
            username,
            email,
            password,
            role,
            created_at: new Date().toISOString()
        };
        this.users.push(newUser);
        await this.save();
        return newUser;
    }
}
