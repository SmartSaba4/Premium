import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { openDb } from '../../connections/database';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const db = await openDb();

        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            return res.status(401).send("User not found !");
        }

        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            return res.json({ accessToken });
        } else {
            return res.status(401).send('Username or password incorrect');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

router.post('/register', async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const db = await openDb();
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        return res.send('User registered successfully');

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

// router.get('/', (req: Request, res: Response) => {
//     try {
//         res.send('This is an auth route!');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

export default router;