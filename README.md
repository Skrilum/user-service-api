# User Service API

REST API сервис для управления пользователями с аутентификацией и авторизацией.

## 🚀 Возможности

- Регистрация и авторизация пользователей (JWT)
- CRUD операции для пользователей
- Ролевая модель доступа (admin/user)
- Блокировка/разблокировка пользователей
- Валидация данных и обработка ошибок

## 🛠️ Технологии

- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite + Sequelize ORM  
- **Authentication:** JWT + bcrypt
- **Security:** Helmet, CORS, input validation

## 📦 Установка

```bash
# Клонирование репозитория
git clone https://github.com/YOUR_USERNAME/user-service-api.git
cd user-service-api

# Установка зависимостей
npm install

# Запуск в development режиме
npm run dev

# Сборка production версии
npm run build
npm start
```

## API Endpoints

### Аутентификация
| Метод |         URL           |           Описание              | Доступ |
|-------|-----------------------|---------------------------------|--------|
| POST  | `/api/auth/register`  | Регистрация нового пользователя | Public |
| POST  | `/api/auth/login`     | Авторизация пользователя        | Public |

### Пользователи
| Метод |          URL           |          Описание           |        Доступ         |
|-------|------------------------|-----------------------------|-----------------------|
| GET   | `/api/users/:id`       | Получить пользователя по ID | User (себя) или Admin |
| GET   | `/api/users`           | Получить всех пользователей | Admin only            |
| PATCH | `/api/users/:id/block` | Блокировка/разблокировка    | User (себя) или Admin |

## 🔐 Примеры запросов

### Регистрация пользователя
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "email": "ivan@mail.ru",
    "password": "password123",
    "birthDate": "1990-01-01",
    "role": "user"
  }'
```

### Авторизация
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@mail.ru",
    "password": "password123"
  }'
```

### Получение пользователя (с токеном) 
```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Блокировка пользователя (только для admin)
```bash
curl -X PATCH http://localhost:3000/api/users/2/block \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isBlocked": true
  }'
```

```markdown
## 🎯 Особенности реализации

### 🏗️ Архитектура
- **Clean Architecture** - разделение на слои (модели, сервисы, контроллеры)
- **Middleware pattern** - для аутентификации и обработки ошибок
- **Dependency Injection** - через статические методы сервисов

### 🔐 Безопасность
- **JWT authentication** - с expiresIn 24 часа
- **Password hashing** - bcrypt с солью (12 раундов)
- **Role-based access control** - admin vs user права
- **Input validation** - проверка всех входящих данных

### 📦 Code Quality
- **TypeScript** - полная типобезопасность
- **Error handling** - централизованная обработка ошибок
- **Environment configuration** - разделение dev/prod настроек
- **Git hooks** - pre-commit проверки (если добавите)
