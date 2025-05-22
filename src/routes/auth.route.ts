import { Router } from 'express';
import { AuthController } from '@/controllers';
import { AuthService } from '@/services';

const AuthRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

AuthRouter.post('/login', authController.loginUser);
AuthRouter.post('/register', authController.registerUser);

export default AuthRouter;
