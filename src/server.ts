import 'reflect-metadata'

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import './database';

import routes from './routes';
import uploadConfig from './config/upload'

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)

app.get('/', (req, res) => {
    return res.json({ message: "🚀🎉🤘🏾 Heeeeyy!!" });
})

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
})
