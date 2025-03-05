import express from 'express';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import middleware from './middleware/authMiddleware.js'
const app = express()
const PORT = process.env.PORT || 5000
import dotenv from 'dotenv';
dotenv.config();


app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use('/auth', authRoutes)
app.use('/todos',middleware,todoRoutes)
app.listen(PORT, () => {
    console.log(`Server has started ${PORT}`)
})

export default app;

