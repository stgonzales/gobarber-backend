import { Request, Response } from "express";
import { container } from 'tsyringe';

import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

interface IUser {
    name: string;
    email: string;
    password?: string;
}

export default class UserAvatarController {
    public async update(request: Request, response: Response): Promise<Response> {
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);

        const user: IUser = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        })

        delete user.password

        return response.json(user)
    }
}