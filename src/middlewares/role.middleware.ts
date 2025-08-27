import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (requireRole: 'admin' | 'user') => {
    return (req: Request, res: Response, next: NextFunction) =>{
        //Проверяем что пользователь аутентифицирован
        if (!req.user) {
            return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        }

        //Проверяем роль пользователя
        if (req.user.role !== requireRole && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Недостаточно прав' });
        }

        next();
    };
};

//shortcuts
export const adminOnly = roleMiddleware('admin');
export const userOnly = roleMiddleware('user');