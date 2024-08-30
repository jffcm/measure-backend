import app from './app';
import 'reflect-metadata'
import './config/data-source';

const PORT = process.env['PORT'] || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

