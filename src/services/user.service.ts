import User from "../models/User";

export class UserService {
    static async createUser(userData: {
        name: string;
        email: string;
        password: string;
        birthDate: Date;
        role?: 'admin' | 'user';
        isActive?: boolean;
    }): Promise<User> {
        try {
            return await User.create(userData);
        } catch (error) {
            console.log('Ошибка создания пользователя: ', error);
            throw new Error('Не удалось создать пользователя');
        }
    }

    static async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await User.findOne({
                where: { email }
            });
        } catch (error) {
            console.log('Ошибка поиска пользователя по email: ', error);
            throw new Error('Не удалось найти пользователя');
        }
    }

    static async findUserById(id: number): Promise<User | null> {
        try {
            return await User.findByPk(id);
        } catch (error) {
            console.log('Ошибка поиска пользователя по ID: ', error);
            throw new Error('Не удалось найти пользователя');
        }
    }

    static async getAllUsers(): Promise<User[]> {
        try {
            return await User.findAll();
        } catch (error) {
            console.log('Ошибка получения пользователей: ', error);
            throw new Error('Не удалось найти пользователей');
        }
    }

    static async updateUser(id: number, newData: Partial<User>): Promise<User | null> {
        try {
            const user = await User.findByPk(id);

            if (!user) {
                return null
            }

            return await user.update(newData);  
        } catch (error) {
            console.log('Ошибка обновления пользователя: ', error);
            throw new Error('Не удалось обновить пользователя');
        }
    }
}