import { Router, request, response } from 'express';
import CreateUserService from "../services/CreateUserService";
import { getCustomRepository } from 'typeorm';
import multer from 'multer'

import UserRepository from "../repositories/UsersRepository"
import ensureAuthenticated from "../middleware/ensureAuthenticated"

import uploadConfig from '../config/upload'

const usersRouter = Router();
const upload = multer(uploadConfig)

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password,
        })

        delete user.password

        return response.json(user)
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})

usersRouter.use(ensureAuthenticated)

usersRouter.get('/', async (request, response) => {
    try {
        const usersRepository = getCustomRepository(UserRepository)
        const users = await usersRepository.find()

        return response.json(users)
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})

usersRouter.patch('/avatar', upload.single('avatar'), async (request, response) => {
    return response.json({ ok: true })
})

export default usersRouter;
