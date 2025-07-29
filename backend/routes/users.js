import { Router } from "express";
import { UsersController } from "../controllers/users.js";

export const createUsersRoutes = (usersModel) => {
    const router = Router();
    const usersController = new UsersController(usersModel);

    router.get("/count", async (req, res) => {
        const response = await usersController.countUsers();
        res.status(response.code).json(response);
    });

    router.get("/", async (req, res) => {
        const response = await usersController.getAllUsers();
        res.status(response.code).json(response);
    });

    router.get("/:id", async (req, res) => {
        const response = await usersController.getUserById(req.params.id);
        res.status(response.code).json(response);
    });

    router.post("/", async (req, res) => {
        const response = await usersController.createUser(req.body);
        res.status(response.code).json(response);
    });

    router.put("/:id", async (req, res) => {
        const response = await usersController.updateUser(req.params.id, req.body);
        res.status(response.code).json(response);
    });

    router.delete("/:id", async (req, res) => {
        const response = await usersController.deleteUser(req.params.id);
        res.status(response.code).json(response);
    });

    return router;
};
