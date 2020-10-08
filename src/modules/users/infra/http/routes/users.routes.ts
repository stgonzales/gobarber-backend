import { Router, request, response } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer'

import CreateUserService from "@modules/users/services/CreateUserService";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";


import UserRepository from "@modules/users/repositories/UsersRepository"
import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated"

import uploadConfig from '@config/upload'

const usersRouter = Router();
const upload = multer(uploadConfig)

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password,
    })

    delete user.password

    return response.json(user)
})

usersRouter.use(ensureAuthenticated)

usersRouter.get('/', async (request, response) => {
    const usersRepository = getCustomRepository(UserRepository)
    const users = await usersRepository.find()

    return response.json(users)
})

usersRouter.patch('/avatar', upload.single('avatar'), async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService()

    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
    })

    delete user.password

    return response.json(user)


})

export default usersRouter;
