import { validateUserToCreate, validateUserToUpdate } from "../schemas/user.js";

export class UsersController {
    constructor(usersModel) {
        this.usersModel = usersModel;
    }

    countUsers = async () => {
        try {
            const total = await this.usersModel.countUsers();
            console.log("[INFO] Total usuarios:", total);
            return { status: "success", code: 200, total };
        } catch (error) {
            console.error("[ERROR] Error al contar usuarios:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    getAllUsers = async () => {
        try {
            const users = await this.usersModel.getAll();
            return { status: "success", code: 200, data: users };
        } catch (error) {
            console.error("[ERROR] Error al obtener usuarios:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    getUserById = async (id) => {
        try {
            const user = await this.usersModel.getById(Number(id));
            if (!user) {
                return { status: "error", code: 404, error: [{ message: "Usuario no encontrado" }] };
            }
            return { status: "success", code: 200, data: user };
        } catch (error) {
            console.error("[ERROR] Error al buscar usuario:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    createUser = async (body) => {
        const validation = validateUserToCreate.safeParse(body);
        if (!validation.success) {
            console.error("[ERROR] Validación fallida:", validation.error.issues);
            return { status: "error", code: 400, error: validation.error.issues };
        }
        try {
            const newUser = await this.usersModel.create(validation.data);
            return { status: "success", code: 201, data: newUser };
        } catch (error) {
            console.error("[ERROR] Error al crear usuario:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    updateUser = async (id, body) => {
        const validation = validateUserToUpdate.safeParse(body);
        if (!validation.success) {
            console.error("[ERROR] Validación fallida:", validation.error.issues);
            return { status: "error", code: 400, error: validation.error.issues };
        }
        try {
            const updated = await this.usersModel.update(Number(id), validation.data);
            if (!updated) {
                return { status: "error", code: 404, error: [{ message: "Usuario no encontrado" }] };
            }
            return { status: "success", code: 200, message: "Usuario actualizado", data: updated };
        } catch (error) {
            console.error("[ERROR] Error al actualizar usuario:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };

    deleteUser = async (id) => {
        try {
            const deleted = await this.usersModel.delete(Number(id));
            if (!deleted) {
                return { status: "error", code: 404, error: [{ message: "Usuario no encontrado" }] };
            }
            return { status: "success", code: 200, message: "Usuario eliminado" };
        } catch (error) {
            console.error("[ERROR] Error al eliminar usuario:", error.message);
            return { status: "error", code: 500, error: [{ message: error.message }] };
        }
    };
}
