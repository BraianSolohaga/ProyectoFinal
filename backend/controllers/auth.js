import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
    constructor(authModel, isLocal = false) {
        this.authModel = authModel;
        this.isLocal = isLocal;
        this.secret = process.env.JWT_SECRET || "secret";
    }

    register = async (body) => {
        try {
            const { username, email, password } = body;

            if (!username || !email || !password) {
                return { status: "error", code: 400, error: [{ message: "Faltan campos obligatorios" }] };
            }

            const hash = await bcrypt.hash(password, 10);

            const userId = await this.authModel.create({ username, email, password: hash, role: "user" });

            return {
                status: "success",
                code: 201,
                message: "Usuario creado correctamente",
                data: { id: userId.id || userId },
            };
        } catch (error) {
            console.error("[ERROR] Registro:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    login = async (body) => {
        try {
            const { email, password } = body;

            if (!email || !password) {
                return { status: "error", code: 400, error: [{ message: "Faltan email o contraseña" }] };
            }

            const user = await this.authModel.getByEmail(email);
            if (!user) {
                return { status: "error", code: 400, error: [{ message: "Usuario no encontrado" }] };
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return { status: "error", code: 401, error: [{ message: "Contraseña incorrecta" }] };
            }

            const token = jwt.sign({ id: user.id, role: user.role }, this.secret, { expiresIn: "2h" });

            return {
                status: "success",
                code: 200,
                message: "Login exitoso",
                data: { token, user: { id: user.id, username: user.username, role: user.role } },
            };
        } catch (error) {
            console.error("[ERROR] Login:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    logout = async (body) => {
        try {
            const { token } = body;

            if (!token) {
                return { status: "error", code: 400, error: [{ message: "Token requerido" }] };
            }

            try {
                jwt.verify(token, this.secret);
            } catch (error) {
                return { status: "error", code: 401, error: [{ message: "Token inválido" }] };
            }

            await this.authModel.addTokenToBlacklist(token);

            return {
                status: "success",
                code: 200,
                message: "Logout exitoso",
                data: { message: "Sesión cerrada correctamente" },
            };
        } catch (error) {
            console.error("[ERROR] Logout:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    isTokenBlacklisted = async (token) => {
        return await this.authModel.isTokenBlacklisted(token);
    };
}