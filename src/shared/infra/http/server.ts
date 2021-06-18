import 'reflect-metadata'

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'

import morgan from 'morgan';
import cors from 'cors';

import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import routes from './routes';

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/files', express.static(uploadConfig.tmpFolder))
app.use(routes)

app.get('/', (req, res) => {
    return res.json({ message: "🚀🎉🤘🏾 Heeeeyy!!" });
})

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message
        })
    }

    console.log(err);


    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
})
