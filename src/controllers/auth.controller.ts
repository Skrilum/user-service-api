import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserService } from "../services/user.service";


const JWT_SECRET = 'secretkeyone';

export class AuthController {
    //Регистрация нового пользователя
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, birthDate, role } = req.body;

            //Валидация обязательных полей
            if (!name || !email || !password || !birthDate) {
                res.status(400).json({ error: 'Все поля обязательны для заполнения' });
                return;
            }

            //Проверяем, не существует ли уже пользователь
            const existingUser = await UserService.findUserByEmail(email);
            if (existingUser) {
                res.status(409).json({ error: 'Пользователь с таким email уже существует' });
                return;
            }

            //Создаем пользователя
            const user = await UserService.createUser({
                name,
                email,
                password,
                birthDate: new Date(birthDate),
                role
            });

            //Генерируем JWT токен
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            //Возвращаем ответ без пароля
            res.status(201).json({ 
                message: 'Пользователь успешно создан',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    birthDate: user.birthDate
                }
            });

        } catch (error) {
            console.error('Ошибка регистрации: ', error);
            res.status(500).json({ error: 'Ошибка при создании пользователя' });
        }
    }

    //Авторизация пользователя
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email и пароль обязательны' });
                return;
            }

            //Ищем пользователя
            const user = await UserService.findUserByEmail(email);
            if (!user) {
                res.status(401).json({ error: 'Неверные учетные данные' });
                return;
            }

            //Проверяем активность аккаунта
            if (!user.isActive) {
                res.status(403).json({ error: 'Аккаунт заблокирован' });
                return;
            }

            //Проверяем пароль
            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                res.status(401).json({ error: 'Неверные учетные данные' });
                return;
            }

            //Генерируем токен
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            //Возвращаем ответ
            res.json({
                message: 'Вход выполнен успешно',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    birthDate: user.birthDate
                }
            });

        } catch (error) {
            console.error('Ошибка входа: ', error);
            res.status(500).json({ error: 'Ошибка при входе' });
        }
    }
}