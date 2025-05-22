import { Router } from 'express';
import { UserController } from '@/controllers';
import { UserService } from '@/services';
import { authMiddleware } from '@/middlewares/auth.middleware';

const UserRouter = Router();
const userService = new UserService();
const userController = new UserController(userService);

UserRouter.get('/', authMiddleware, userController.getAllUsers);
UserRouter.get('/:id', authMiddleware, userController.getUserByID);
UserRouter.put('/:id', authMiddleware, userController.updateUserByID);

export default UserRouter;
