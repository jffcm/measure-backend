import express from 'express';
import uploadRoutes from './uploadRoutes';
import listRoutes from './listRoutes';
import confirmRoutes from './confirmRoutes';

const router = (app: express.Router) => {
    app.use('/upload', uploadRoutes);
    app.use('/', listRoutes);
    app.use('/confirm', confirmRoutes);

}

export default router;

