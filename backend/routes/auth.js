import { Router } from "express";

export function createAuthRoutes(authController) {
    const router = Router();

    router.post("/register", async (req, res) => {
        const result = await authController.register(req.body);
        res.status(result.code).json(result);
    });

    router.post("/login", async (req, res) => {
        const result = await authController.login(req.body);
        res.status(result.code).json(result);
    });

    router.post("/logout", async (req, res) => {
        const result = await authController.logout(req.body);
        res.status(result.code).json(result);
    });

    return router;
}