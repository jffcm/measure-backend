import express from 'express'
import cors from 'cors';
import router from './routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
router(app);

export default app;