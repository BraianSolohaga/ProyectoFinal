import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { createBooksRoutes } from "./routes/book.js";
import { createUsersRoutes } from "./routes/users.js";
import { createAuthRoutes } from "./routes/auth.js";

import { BooksLocal } from "./models/bookLocal.js";
import { BooksMysql } from "./models/bookMysql.js";
import { UsersLocal } from "./models/userLocal.js";
import { UsersMysql } from "./models/userMysql.js";
import { AuthLocal } from "./models/authLocal.js";
import { AuthMysql } from "./models/authMysql.js";

import { AuthController } from "./controllers/auth.js";

dotenv.config();

const createApp = () => {
    const app = express();
    const PORT = process.env.PORT || 3004;
    const isLocal = process.env.MODE === "local";

    const booksModel = isLocal ? BooksLocal : BooksMysql;
    const usersModel = isLocal ? UsersLocal : UsersMysql;
    const authModel = isLocal ? AuthLocal : AuthMysql;

    const authController = new AuthController(authModel, isLocal);

    const corsOptions = {
        origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    };
    app.use(cors(corsOptions));

    app.use(express.json());
    app.disable("x-powered-by");

    app.get("/", (req, res) => {
        res.status(200).json({ message: "📚 Bienvenido a la API de Libros Favoritos" });
    });

    app.use("/api/auth", createAuthRoutes(authController));
    app.use("/api/books", createBooksRoutes(booksModel, isLocal));
    app.use("/api/users", createUsersRoutes(usersModel, isLocal));

    if (!isLocal && authModel === AuthMysql) {

        (async () => {
            try {
                const deletedTokens = await AuthMysql.cleanExpiredTokens();
                console.log(`[STARTUP] Limpieza inicial: eliminados ${deletedTokens} tokens expirados`);
            } catch (error) {
                console.error('[ERROR] Error en limpieza inicial:', error.message);
            }
        })();

        setInterval(async () => {
            try {
                const deletedTokens = await AuthMysql.cleanExpiredTokens();
                if (deletedTokens > 0) {
                    console.log(`[CLEANUP] Eliminados ${deletedTokens} tokens expirados`);
                }
            } catch (error) {
                console.error('[ERROR] Error limpiando tokens:', error.message);
            }
        }, 60 * 60 * 1000); 
        console.log(`📊 Limpieza automática de tokens activada (cada hora)`);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT} [MODE=${isLocal ? "local" : "mysql"}]`);
    });

    process.on('SIGINT', () => {
        console.log('\n🔄 Cerrando servidor...');
        process.exit(0);
    });

};

createApp();