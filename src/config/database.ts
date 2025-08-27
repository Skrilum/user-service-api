import { Sequelize } from "sequelize";

// Создаем экземпляр Sequelize и подключаемся к БД.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
});

// Функция для тестового подключения к БД
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение к базе данных установленно')
    } catch (error) {
        console.error('Ошибка соединения: ', error);
    }
};

export default sequelize;