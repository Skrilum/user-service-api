import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/role.middleware";

const router = Router();

//Аутентификация для всех routes
router.use(authMiddleware);

//GET /api/users/:id
router.get('/:id', UserController.getUserById);

//GET /api/users (только для админов)
router.get('/', adminOnly, UserController.getAllUsers);

//PATCH /api/users/:id/block
router.patch('/:id/block', UserController.toggleUserBlock);


export default router;