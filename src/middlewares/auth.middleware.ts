import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { UserService } from "../services/user.service";

const JWT_SECRET = 'secretkeyone';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //Получаем токен из заголовка
        const authHeader = req.header('Authorization') || req.header('authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'Токен доступа отсутствует' });
        }
        
        const token = authHeader.replace(/^Bearer\s+/i, '');

        if (!token) {
            return res.status(401).json({ error: 'Неверный формат токена' });
        }
    
        //Проверяем и декодируем токен
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };

        const user = await UserService.findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        //Добавляем пользователя в запрос
        req.user = user;
        
        //Передаем управление следующему middleware
        next();
    } catch (error) {
        res.status(401).json({ error: 'Неверный токен' });
    }
};