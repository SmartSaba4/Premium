import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth/route';
import api from './routes/api/route';
import { openDb } from './connections/database';
import authenticateJWT from './middlewares/auth';


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/api', api);

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.redirect('/api');
});

// 404 handler
app.use(authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Hello Dev ! Route 404 ');
});

app.listen(port, async () => {
    const db = await openDb();
    await db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
    console.log(`Server is running at http://localhost:${port}`);
});