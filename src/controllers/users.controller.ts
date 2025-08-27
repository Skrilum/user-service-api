import { Request, Response } from "express";
import { UserService } from '../services/user.service';

export class UserController {

    //Получение пользователя по ID
    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id!);
            const requestingUser = req.user; //Из authmiddleware
            
            //Проверяем права
            if (requestingUser.id !== userId && requestingUser.role !== 'admin') {
                res.status(403).json({ error: 'Недостаточно прав' });
                return;
            }

            const user = await UserService.findUserById(userId);
            if (!user) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }

            //Возвращаем безопасные данные
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                birthDate: user.birthDate
            });

        } catch (error) {
            console.error('Ошибка получения пользователя: ', error);
            res.status(500).json({ error: 'Ошибка при получении пользователя' });
        }
    }

    //Получение всех пользователей (только для админа)
    //_req - значт что req не используется, но он необходим для работы с Express
    static async getAllUsers(_req: Request, res: Response): Promise<void> {
        try {
            const users = await UserService.getAllUsers();

            //Преобразуем каждого пользователя в безопасный формат
            const safeUsers = users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                birthDate: user.birthDate
            }));

            res.json(safeUsers);

        } catch (error) {
            console.error('Ошибка получения пользователей: ', error);
            res.status(500).json({ error: 'Ошибка при получении пользователей' });
        }
    }

    //Блокировка/разблокировка пользователя
    static async toggleUserBlock(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id!);
            const requestingUser = req.user;

            //Проверяем права
            if (requestingUser.id !== userId && requestingUser.role !== 'admin') {
                res.status(403).json({ error: 'Недостаточно прав' });
                return;
            }

            const user = await UserService.findUserById(userId);
            if (!user) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }

            //Меняем статус активности
            const updatedUser = await UserService.updateUser(userId, {
                isActive: !user.isActive
            });

            res.json({
                message: `Пользователь ${updatedUser?.isActive ? 'разблокирован' : 'заблокирован'}`,
                user: {
                    id: updatedUser?.id,
                    name: updatedUser?.name,
                    email: updatedUser?.email,
                    role: updatedUser?.role,
                    isActive: updatedUser?.isActive
                }
            });

        } catch (error) {
            console.error('Ошибка блокировки пользователя: ', error);
            res.status(500).json({ error: 'Ошибка при изменении статуса пользователя' });
        }
    }
}