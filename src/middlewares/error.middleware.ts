import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error: ', error.message);
    
    console.log(`Произошла ошибка в: ${req.method} ${req.url}`);

    if (res.headersSent) {
        return next(error);
    }
    
    res.status(500).json({ error: 'Внутрення ошибка сервера'});
};
