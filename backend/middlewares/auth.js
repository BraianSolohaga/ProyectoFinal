import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ status: "error", message: "Token requerido" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ status: "error", message: "Formato de token inválido" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token inválido:", error);
        return res.status(401).json({ status: "error", message: "Token inválido o expirado" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ status: "error", message: "Acceso denegado: solo administradores" });
    }
    next();
};
