import { Router, Request, Response } from 'express';
import authenticateJWT from '../../middlewares/auth/index';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    try {
        res.redirect("/api/v1");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/v1', authenticateJWT, (req: Request, res: Response) => {
    try {
        res.send('This is a v1 API route!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

export default router;