import { Router } from 'express';

import multer from 'multer'

import UsersController from "../controllers/UsersController";
import UserAvatarController from "../controllers/UserAvatarController"

import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated"

import uploadConfig from '@config/upload'

const usersRouter = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig)

usersRouter.use(ensureAuthenticated);

usersRouter.get('/', usersController.index)

usersRouter.post('/', usersController.create)

usersRouter.patch('/avatar', upload.single('avatar'), userAvatarController.update)

export default usersRouter;
