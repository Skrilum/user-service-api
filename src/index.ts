import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import sequalize, { testConnection} from './config/database';
import authRoutes from './routers/auth.routes';
import usersRoutes from './routers/users.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(helmet()); // Безопасность
app.use(cors());
app.use(morgan('combined')); // Логи
app.use(express.json());

//Базовый route для проверки
app.get('/', (_req, res) => {
    res.json({ message: 'Сервер запущен!', timeStamp: new Date().toISOString() });
});

//Основыне routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

//Обработка ошибок
app.use(errorHandler);

//Запуск сервера
app.listen(PORT, async () => {
    console.log('Запуск сервера...');
    try {
        await testConnection();
        await sequalize.sync({ force: true }); //Для разработки
        console.log('Сервер и БД готовы!');
    } catch (error) {
        console.error('Ошибка инициализации базы данных: ', error);
        process.exit(1);
    }
});