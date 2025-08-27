import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

// Определяем атрибуты, которые необходимы для создания пользователя
interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    isActive: boolean;
    birthDate: Date;
}

// "Optional" говорит, что id, role, isActive не обязателен, так как он создается автоматически
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'isActive'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: 'admin' | 'user';
    declare isActive: boolean;
    declare birthDate: Date;

    public async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        birthDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
        sequelize,
        modelName: 'User',
        hooks: {
            beforeSave: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(12);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    }
);

export default User;